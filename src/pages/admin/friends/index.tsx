import { useState } from "react";
import styled from "styled-components";
import { MdDelete } from "@react-icons/all-files/md/MdDelete";
import { toast } from "react-toastify";

import {
  AdminPageTitle,
  AdminTable,
  AdminPagination,
  AdminBadge,
} from "@components/admin";
import Button from "@components/Button";
import type { AdminFriend } from "@core/types/admin";
import { useFriends, useDeleteFriend } from "./hooks/useFriends";

const PAGE_SIZE = 20;

const FriendManagement = () => {
  const [currentPage, setCurrentPage] = useState(0);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);

  const { data, isLoading } = useFriends({
    page: currentPage + 1,
    limit: PAGE_SIZE,
  });

  const deleteFriend = useDeleteFriend();

  const handleToggleSelect = (friendId: number) => {
    setSelectedIds((prev) =>
      prev.includes(friendId)
        ? prev.filter((id) => id !== friendId)
        : [...prev, friendId]
    );
  };

  const handleSelectAll = () => {
    const currentPageIds = data?.content.map((f) => f.friendId) ?? [];
    if (currentPageIds.length > 0 && selectedIds.length === currentPageIds.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(currentPageIds);
    }
  };

  const handleBulkDelete = async () => {
    if (selectedIds.length === 0) {
      toast.warning("삭제할 깐부 관계를 선택해주세요.");
      return;
    }
    if (
      window.confirm(
        `선택된 ${selectedIds.length}개의 깐부 관계를 삭제하시겠습니까?`
      )
    ) {
      try {
        await Promise.all(selectedIds.map((id) => deleteFriend.mutateAsync(id)));
        toast.success(`${selectedIds.length}개 깐부 관계가 삭제되었습니다.`);
        setSelectedIds([]);
      } catch {
        // 에러는 axios interceptor에서 처리됨
      }
    }
  };

  const handleDelete = async (friendId: number) => {
    if (window.confirm("이 깐부 관계를 삭제하시겠습니까?")) {
      try {
        await deleteFriend.mutateAsync(friendId);
        toast.success("깐부 관계가 삭제되었습니다.");
        setSelectedIds((prev) => prev.filter((id) => id !== friendId));
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
      render: (item: AdminFriend) => (
        <Checkbox
          type="checkbox"
          checked={selectedIds.includes(item.friendId)}
          onChange={() => handleToggleSelect(item.friendId)}
        />
      ),
    },
    {
      key: "friendId",
      header: "ID",
      width: "70px",
    },
    {
      key: "member",
      header: "회원",
      render: (item: AdminFriend) => (
        <UserCell>
          <Username>{item.memberUsername}</Username>
          <UserId>ID: {item.memberId}</UserId>
        </UserCell>
      ),
    },
    {
      key: "arrow",
      header: "",
      width: "40px",
      render: () => <Arrow>↔</Arrow>,
    },
    {
      key: "friend",
      header: "깐부",
      render: (item: AdminFriend) => (
        <UserCell>
          <Username>{item.friendUsername}</Username>
        </UserCell>
      ),
    },
    {
      key: "status",
      header: "상태",
      width: "100px",
      render: (item: AdminFriend) =>
        item.areWeFriend ? (
          <AdminBadge variant="success">깐부</AdminBadge>
        ) : (
          <AdminBadge variant="warning">대기중</AdminBadge>
        ),
    },
    {
      key: "createdDate",
      header: "생성일",
      width: "170px",
      render: (item: AdminFriend) =>
        new Date(item.createdDate).toLocaleString("ko-KR"),
    },
    {
      key: "actions",
      header: "관리",
      width: "80px",
      render: (item: AdminFriend) => (
        <Button
          variant="outlined"
          size="small"
          color="error"
          onClick={() => handleDelete(item.friendId)}
          disabled={deleteFriend.isPending}
        >
          삭제
        </Button>
      ),
    },
  ];

  return (
    <div>
      <AdminPageTitle
        title="깐부 관리"
        description="사용자 간 깐부(친구) 관계를 관리합니다"
      />

      {selectedIds.length > 0 && (
        <BulkActions>
          <span>{selectedIds.length}개 선택됨</span>
          <Button
            variant="outlined"
            size="small"
            color="error"
            onClick={handleBulkDelete}
            disabled={deleteFriend.isPending}
          >
            <MdDelete size={16} />
            선택 삭제
          </Button>
        </BulkActions>
      )}

      <TableInfo>
        총 <strong>{(data?.totalElements ?? 0).toLocaleString()}</strong>개의 깐부 관계
      </TableInfo>

      <AdminTable
        columns={columns}
        data={data?.content ?? []}
        keyExtractor={(item) => item.friendId}
        emptyMessage="깐부 관계가 없습니다."
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

export default FriendManagement;

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

const UserCell = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
`;

const Username = styled.span`
  font-weight: 500;
  color: ${({ theme }) => theme.app.text.dark1};
`;

const UserId = styled.span`
  font-size: 12px;
  color: ${({ theme }) => theme.app.text.light2};
`;

const Arrow = styled.span`
  font-size: 16px;
  color: ${({ theme }) => theme.app.text.light2};
`;
