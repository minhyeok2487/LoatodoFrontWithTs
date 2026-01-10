import { useState } from "react";
import styled from "styled-components";
import { MdDelete } from "@react-icons/all-files/md/MdDelete";

import {
  AdminPageTitle,
  AdminTable,
  AdminPagination,
  AdminBadge,
} from "@components/admin";
import Button from "@components/Button";

// 목업 데이터
const MOCK_COMMENTS = Array.from({ length: 68 }, (_, i) => ({
  commentId: i + 1,
  parentId: i % 5 === 0 ? null : Math.max(1, i - Math.floor(Math.random() * 3)),
  memberId: Math.floor(Math.random() * 50) + 1,
  memberUsername: `user${String(Math.floor(Math.random() * 50) + 1).padStart(4, "0")}`,
  body: [
    "좋은 정보 감사합니다!",
    "이번 업데이트 내용이 좋네요",
    "골드 시세가 많이 올랐네요",
    "도움이 많이 됐어요 ㅎㅎ",
    "깐부 추가 부탁드려요~",
    "오늘도 숙제 완료!",
    "레이드 골드 정보 감사합니다",
    "다음 업데이트는 언제인가요?",
  ][i % 8],
  isHidden: i % 15 === 0,
  isReported: i % 12 === 0,
  reportCount: i % 12 === 0 ? Math.floor(Math.random() * 5) + 1 : 0,
  createdDate: new Date(
    Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000
  ).toISOString(),
}));

const PAGE_SIZE = 15;

const CommentManagement = () => {
  const [currentPage, setCurrentPage] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [showReported, setShowReported] = useState(false);
  const [showHidden, setShowHidden] = useState(false);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);

  const filteredComments = MOCK_COMMENTS.filter((comment) => {
    const matchesSearch =
      comment.memberUsername.toLowerCase().includes(searchTerm.toLowerCase()) ||
      comment.body.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesReported = !showReported || comment.isReported;
    const matchesHidden = showHidden || !comment.isHidden;
    return matchesSearch && matchesReported && matchesHidden;
  });

  const totalPages = Math.ceil(filteredComments.length / PAGE_SIZE);
  const paginatedComments = filteredComments.slice(
    currentPage * PAGE_SIZE,
    (currentPage + 1) * PAGE_SIZE
  );

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
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
    if (selectedIds.length === paginatedComments.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(paginatedComments.map((c) => c.commentId));
    }
  };

  const handleBulkDelete = () => {
    if (selectedIds.length === 0) {
      alert("삭제할 댓글을 선택해주세요.");
      return;
    }
    if (window.confirm(`선택된 ${selectedIds.length}개의 댓글을 삭제하시겠습니까?`)) {
      alert(`${selectedIds.length}개 댓글 삭제 (목업)`);
      setSelectedIds([]);
    }
  };

  const handleBulkHide = () => {
    if (selectedIds.length === 0) {
      alert("숨길 댓글을 선택해주세요.");
      return;
    }
    if (window.confirm(`선택된 ${selectedIds.length}개의 댓글을 숨기시겠습니까?`)) {
      alert(`${selectedIds.length}개 댓글 숨김 처리 (목업)`);
      setSelectedIds([]);
    }
  };

  const handleDelete = (commentId: number) => {
    if (window.confirm("이 댓글을 삭제하시겠습니까?")) {
      alert(`댓글 ${commentId} 삭제 (목업)`);
    }
  };

  const handleToggleHide = (commentId: number, isHidden: boolean) => {
    const action = isHidden ? "표시" : "숨김";
    if (window.confirm(`이 댓글을 ${action} 처리하시겠습니까?`)) {
      alert(`댓글 ${commentId} ${action} 처리 (목업)`);
    }
  };

  const columns = [
    {
      key: "select",
      header: (
        <Checkbox
          type="checkbox"
          checked={
            paginatedComments.length > 0 &&
            selectedIds.length === paginatedComments.length
          }
          onChange={handleSelectAll}
        />
      ),
      width: "40px",
      render: (item: typeof MOCK_COMMENTS[0]) => (
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
      width: "60px",
    },
    {
      key: "memberUsername",
      header: "작성자",
      width: "120px",
      render: (item: typeof MOCK_COMMENTS[0]) => (
        <UsernameCell>{item.memberUsername}</UsernameCell>
      ),
    },
    {
      key: "body",
      header: "내용",
      render: (item: typeof MOCK_COMMENTS[0]) => (
        <CommentCell>
          {item.parentId && <ReplyIndicator>↳</ReplyIndicator>}
          <CommentBody $hidden={item.isHidden}>{item.body}</CommentBody>
          {item.isHidden && <AdminBadge variant="gray">숨김</AdminBadge>}
          {item.isReported && (
            <AdminBadge variant="error">신고 {item.reportCount}</AdminBadge>
          )}
        </CommentCell>
      ),
    },
    {
      key: "createdDate",
      header: "작성일",
      width: "150px",
      render: (item: typeof MOCK_COMMENTS[0]) =>
        new Date(item.createdDate).toLocaleString("ko-KR"),
    },
    {
      key: "actions",
      header: "관리",
      width: "140px",
      render: (item: typeof MOCK_COMMENTS[0]) => (
        <ActionButtons>
          <Button
            variant="outlined"
            size="small"
            onClick={() => handleToggleHide(item.commentId, item.isHidden)}
          >
            {item.isHidden ? "표시" : "숨김"}
          </Button>
          <Button
            variant="outlined"
            size="small"
            color="error"
            onClick={() => handleDelete(item.commentId)}
          >
            삭제
          </Button>
        </ActionButtons>
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
            placeholder="작성자 또는 내용으로 검색..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Button type="submit" variant="contained">
            검색
          </Button>
        </SearchBar>

        <CheckboxLabel>
          <input
            type="checkbox"
            checked={showReported}
            onChange={(e) => {
              setShowReported(e.target.checked);
              setCurrentPage(0);
            }}
          />
          신고된 댓글만
        </CheckboxLabel>

        <CheckboxLabel>
          <input
            type="checkbox"
            checked={showHidden}
            onChange={(e) => {
              setShowHidden(e.target.checked);
              setCurrentPage(0);
            }}
          />
          숨긴 댓글 포함
        </CheckboxLabel>
      </FilterSection>

      {selectedIds.length > 0 && (
        <BulkActions>
          <span>{selectedIds.length}개 선택됨</span>
          <Button variant="outlined" size="small" onClick={handleBulkHide}>
            선택 숨김
          </Button>
          <Button variant="outlined" size="small" color="error" onClick={handleBulkDelete}>
            <MdDelete size={16} />
            선택 삭제
          </Button>
        </BulkActions>
      )}

      <TableInfo>
        총 <strong>{filteredComments.length}</strong>개의 댓글
      </TableInfo>

      <AdminTable
        columns={columns}
        data={paginatedComments}
        keyExtractor={(item) => item.commentId}
        emptyMessage="댓글이 없습니다."
      />

      <AdminPagination
        currentPage={currentPage}
        totalPages={totalPages}
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

const CheckboxLabel = styled.label`
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 14px;
  color: ${({ theme }) => theme.app.text.main};
  cursor: pointer;

  input {
    width: 16px;
    height: 16px;
    cursor: pointer;
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

const CommentBody = styled.span<{ $hidden: boolean }>`
  color: ${({ theme, $hidden }) =>
    $hidden ? theme.app.text.light2 : theme.app.text.main};
  text-decoration: ${({ $hidden }) => ($hidden ? "line-through" : "none")};
  max-width: 300px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 6px;
`;
