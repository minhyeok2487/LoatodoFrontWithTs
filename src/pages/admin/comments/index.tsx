import { useState } from "react";
import styled from "styled-components";
import { MdDelete } from "@react-icons/all-files/md/MdDelete";
import { toast } from "react-toastify";

import {
  AdminPageTitle,
  AdminTable,
  AdminPagination,
} from "@components/admin";
import Button from "@components/Button";
import type { AdminComment } from "@core/types/admin";
import { useComments, useDeleteComment } from "./hooks/useComments";

const PAGE_SIZE = 20;

const CommentManagement = () => {
  const [currentPage, setCurrentPage] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedIds, setSelectedIds] = useState<number[]>([]);

  const { data, isLoading } = useComments({
    body: searchQuery || undefined,
    page: currentPage + 1,
    limit: PAGE_SIZE,
  });

  const deleteComment = useDeleteComment();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchQuery(searchTerm);
    setCurrentPage(0);
  };

  const handleReset = () => {
    setSearchTerm("");
    setSearchQuery("");
    setCurrentPage(0);
  };

  const handleToggleSelect = (commentId: number) => {
    setSelectedIds((prev) =>
      prev.includes(commentId)
        ? prev.filter((id) => id !== commentId)
        : [...prev, commentId]
    );
  };

  const handleSelectAll = () => {
    const currentPageIds = data?.content.map((c) => c.commentId) ?? [];
    if (currentPageIds.length > 0 && selectedIds.length === currentPageIds.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(currentPageIds);
    }
  };

  const handleBulkDelete = async () => {
    if (selectedIds.length === 0) {
      toast.warning("삭제할 댓글을 선택해주세요.");
      return;
    }
    if (window.confirm(`선택된 ${selectedIds.length}개의 댓글을 삭제하시겠습니까?`)) {
      try {
        await Promise.all(selectedIds.map((id) => deleteComment.mutateAsync(id)));
        toast.success(`${selectedIds.length}개 댓글이 삭제되었습니다.`);
        setSelectedIds([]);
      } catch {
        // 에러는 axios interceptor에서 처리됨
      }
    }
  };

  const handleDelete = async (commentId: number) => {
    if (window.confirm("이 댓글을 삭제하시겠습니까?")) {
      try {
        await deleteComment.mutateAsync(commentId);
        toast.success("댓글이 삭제되었습니다.");
        setSelectedIds((prev) => prev.filter((id) => id !== commentId));
      } catch {
        // 에러는 axios interceptor에서 처리됨
      }
    }
  };

  const columns = [
    {
      key: "select",
      header: (
        <Checkbox
          type="checkbox"
          checked={
            (data?.content.length ?? 0) > 0 &&
            selectedIds.length === (data?.content.length ?? 0)
          }
          onChange={handleSelectAll}
        />
      ),
      width: "40px",
      render: (item: AdminComment) => (
        <Checkbox
          type="checkbox"
          checked={selectedIds.includes(item.commentId)}
          onChange={() => handleToggleSelect(item.commentId)}
        />
      ),
    },
    {
      key: "commentId",
      header: "ID",
      width: "70px",
    },
    {
      key: "memberUsername",
      header: "작성자",
      width: "150px",
      render: (item: AdminComment) => (
        <UsernameCell>{item.memberUsername}</UsernameCell>
      ),
    },
    {
      key: "body",
      header: "내용",
      render: (item: AdminComment) => (
        <CommentCell>
          {item.parentId && <ReplyIndicator>↳</ReplyIndicator>}
          <CommentBody>{item.body}</CommentBody>
        </CommentCell>
      ),
    },
    {
      key: "createdDate",
      header: "작성일",
      width: "170px",
      render: (item: AdminComment) =>
        new Date(item.createdDate).toLocaleString("ko-KR"),
    },
    {
      key: "actions",
      header: "관리",
      width: "80px",
      render: (item: AdminComment) => (
        <Button
          variant="outlined"
          size="small"
          color="error"
          onClick={() => handleDelete(item.commentId)}
          disabled={deleteComment.isPending}
        >
          삭제
        </Button>
      ),
    },
  ];

  return (
    <div>
      <AdminPageTitle
        title="댓글 관리"
        description="방명록 및 커뮤니티 댓글을 관리합니다"
      />

      <FilterSection>
        <SearchBar onSubmit={handleSearch}>
          <SearchInput
            type="text"
            placeholder="내용으로 검색..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Button type="submit" variant="contained">
            검색
          </Button>
        </SearchBar>

        {searchQuery && (
          <Button variant="outlined" onClick={handleReset}>
            초기화
          </Button>
        )}
      </FilterSection>

      {selectedIds.length > 0 && (
        <BulkActions>
          <span>{selectedIds.length}개 선택됨</span>
          <Button
            variant="outlined"
            size="small"
            color="error"
            onClick={handleBulkDelete}
            disabled={deleteComment.isPending}
          >
            <MdDelete size={16} />
            선택 삭제
          </Button>
        </BulkActions>
      )}

      <TableInfo>
        총 <strong>{(data?.totalElements ?? 0).toLocaleString()}</strong>개의 댓글
      </TableInfo>

      <AdminTable
        columns={columns}
        data={data?.content ?? []}
        keyExtractor={(item) => item.commentId}
        emptyMessage="댓글이 없습니다."
        isLoading={isLoading}
      />

      <AdminPagination
        currentPage={currentPage}
        totalPages={data?.totalPages ?? 0}
        onPageChange={setCurrentPage}
      />
    </div>
  );
};

export default CommentManagement;

const FilterSection = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 16px;
  margin-bottom: 20px;
`;

const SearchBar = styled.form`
  display: flex;
  gap: 12px;
`;

const SearchInput = styled.input`
  width: 280px;
  padding: 10px 16px;
  border: 1px solid ${({ theme }) => theme.app.border};
  border-radius: 10px;
  font-size: 14px;
  background: ${({ theme }) => theme.app.bg.white};
  color: ${({ theme }) => theme.app.text.main};
  transition: all 0.2s;

  &:focus {
    outline: none;
    border-color: #667eea;
    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
  }

  &::placeholder {
    color: ${({ theme }) => theme.app.text.light2};
  }
`;

const BulkActions = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  background: ${({ theme }) => theme.app.bg.gray1};
  border-radius: 10px;
  margin-bottom: 16px;

  span {
    font-size: 14px;
    font-weight: 500;
    color: ${({ theme }) => theme.app.text.main};
  }

  button {
    display: flex;
    align-items: center;
    gap: 4px;
  }
`;

const TableInfo = styled.p`
  font-size: 14px;
  color: ${({ theme }) => theme.app.text.light1};
  margin: 0 0 16px 0;

  strong {
    color: ${({ theme }) => theme.app.text.main};
  }
`;

const Checkbox = styled.input`
  width: 16px;
  height: 16px;
  cursor: pointer;
`;

const UsernameCell = styled.span`
  font-weight: 500;
  color: ${({ theme }) => theme.app.text.dark1};
`;

const CommentCell = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const ReplyIndicator = styled.span`
  color: ${({ theme }) => theme.app.text.light2};
  font-size: 14px;
`;

const CommentBody = styled.span`
  color: ${({ theme }) => theme.app.text.main};
  max-width: 400px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;
