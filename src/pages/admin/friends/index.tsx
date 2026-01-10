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
const MOCK_FRIENDS = Array.from({ length: 72 }, (_, i) => ({
  friendId: i + 1,
  fromMemberId: Math.floor(Math.random() * 50) + 1,
  fromUsername: `user${String(Math.floor(Math.random() * 50) + 1).padStart(4, "0")}`,
  toMemberId: Math.floor(Math.random() * 50) + 51,
  toUsername: `user${String(Math.floor(Math.random() * 50) + 51).padStart(4, "0")}`,
  status: i % 8 === 0 ? "pending" : i % 10 === 0 ? "rejected" : "accepted",
  areWeBest: i % 4 === 0,
  createdDate: new Date(
    Date.now() - Math.random() * 60 * 24 * 60 * 60 * 1000
  ).toISOString(),
  acceptedDate:
    i % 8 !== 0
      ? new Date(
          Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000
        ).toISOString()
      : null,
}));

const PAGE_SIZE = 15;

const FriendManagement = () => {
  const [currentPage, setCurrentPage] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("전체");
  const [selectedIds, setSelectedIds] = useState<number[]>([]);

  const filteredFriends = MOCK_FRIENDS.filter((friend) => {
    const matchesSearch =
      friend.fromUsername.toLowerCase().includes(searchTerm.toLowerCase()) ||
      friend.toUsername.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === "전체" || friend.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const totalPages = Math.ceil(filteredFriends.length / PAGE_SIZE);
  const paginatedFriends = filteredFriends.slice(
    currentPage * PAGE_SIZE,
    (currentPage + 1) * PAGE_SIZE
  );

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(0);
  };

  const handleToggleSelect = (friendId: number) => {
    setSelectedIds((prev) =>
      prev.includes(friendId)
        ? prev.filter((id) => id !== friendId)
        : [...prev, friendId]
    );
  };

  const handleSelectAll = () => {
    if (selectedIds.length === paginatedFriends.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(paginatedFriends.map((f) => f.friendId));
    }
  };

  const handleBulkDelete = () => {
    if (selectedIds.length === 0) {
      alert("삭제할 깐부 관계를 선택해주세요.");
      return;
    }
    if (
      window.confirm(
        `선택된 ${selectedIds.length}개의 깐부 관계를 삭제하시겠습니까?`
      )
    ) {
      alert(`${selectedIds.length}개 깐부 관계 삭제 (목업)`);
      setSelectedIds([]);
    }
  };

  const handleDelete = (friendId: number) => {
    if (window.confirm("이 깐부 관계를 삭제하시겠습니까?")) {
      alert(`깐부 관계 ${friendId} 삭제 (목업)`);
    }
  };

  const handleForceAccept = (friendId: number) => {
    if (window.confirm("이 깐부 요청을 강제로 수락 처리하시겠습니까?")) {
      alert(`깐부 요청 ${friendId} 강제 수락 (목업)`);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "accepted":
        return <AdminBadge variant="success">수락됨</AdminBadge>;
      case "pending":
        return <AdminBadge variant="warning">대기중</AdminBadge>;
      case "rejected":
        return <AdminBadge variant="error">거절됨</AdminBadge>;
      default:
        return <AdminBadge variant="gray">{status}</AdminBadge>;
    }
  };

  // 통계
  const stats = {
    total: MOCK_FRIENDS.filter((f) => f.status === "accepted").length,
    pending: MOCK_FRIENDS.filter((f) => f.status === "pending").length,
    bestFriends: MOCK_FRIENDS.filter((f) => f.areWeBest).length,
  };

  const columns = [
    {
      key: "select",
      header: (
        <Checkbox
          type="checkbox"
          checked={
            paginatedFriends.length > 0 &&
            selectedIds.length === paginatedFriends.length
          }
          onChange={handleSelectAll}
        />
      ),
      width: "40px",
      render: (item: typeof MOCK_FRIENDS[0]) => (
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
      width: "60px",
    },
    {
      key: "from",
      header: "요청자",
      render: (item: typeof MOCK_FRIENDS[0]) => (
        <UserCell>
          <Username>{item.fromUsername}</Username>
          <UserId>ID: {item.fromMemberId}</UserId>
        </UserCell>
      ),
    },
    {
      key: "arrow",
      header: "",
      width: "40px",
      render: () => <Arrow>→</Arrow>,
    },
    {
      key: "to",
      header: "수신자",
      render: (item: typeof MOCK_FRIENDS[0]) => (
        <UserCell>
          <Username>{item.toUsername}</Username>
          <UserId>ID: {item.toMemberId}</UserId>
        </UserCell>
      ),
    },
    {
      key: "status",
      header: "상태",
      width: "90px",
      render: (item: typeof MOCK_FRIENDS[0]) => getStatusBadge(item.status),
    },
    {
      key: "best",
      header: "베프",
      width: "70px",
      render: (item: typeof MOCK_FRIENDS[0]) =>
        item.areWeBest ? (
          <AdminBadge variant="primary">베프</AdminBadge>
        ) : (
          "-"
        ),
    },
    {
      key: "createdDate",
      header: "요청일",
      width: "110px",
      render: (item: typeof MOCK_FRIENDS[0]) =>
        new Date(item.createdDate).toLocaleDateString("ko-KR"),
    },
    {
      key: "acceptedDate",
      header: "수락일",
      width: "110px",
      render: (item: typeof MOCK_FRIENDS[0]) =>
        item.acceptedDate
          ? new Date(item.acceptedDate).toLocaleDateString("ko-KR")
          : "-",
    },
    {
      key: "actions",
      header: "관리",
      width: "140px",
      render: (item: typeof MOCK_FRIENDS[0]) => (
        <ActionButtons>
          {item.status === "pending" && (
            <Button
              variant="outlined"
              size="small"
              onClick={() => handleForceAccept(item.friendId)}
            >
              수락
            </Button>
          )}
          <Button
            variant="outlined"
            size="small"
            color="error"
            onClick={() => handleDelete(item.friendId)}
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
        title="깐부 관리"
        description="사용자 간 깐부(친구) 관계를 관리합니다"
      />

      <StatsRow>
        <StatCard>
          <StatLabel>전체 깐부</StatLabel>
          <StatValue>{stats.total}쌍</StatValue>
        </StatCard>
        <StatCard>
          <StatLabel>대기중 요청</StatLabel>
          <StatValue $warning>{stats.pending}건</StatValue>
        </StatCard>
        <StatCard>
          <StatLabel>베스트 프렌드</StatLabel>
          <StatValue $highlight>{stats.bestFriends}쌍</StatValue>
        </StatCard>
      </StatsRow>

      <FilterSection>
        <SearchBar onSubmit={handleSearch}>
          <SearchInput
            type="text"
            placeholder="아이디로 검색..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Button type="submit" variant="contained">
            검색
          </Button>
        </SearchBar>

        <FilterGroup>
          <FilterLabel>상태</FilterLabel>
          <FilterSelect
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setCurrentPage(0);
            }}
          >
            <option value="전체">전체</option>
            <option value="accepted">수락됨</option>
            <option value="pending">대기중</option>
            <option value="rejected">거절됨</option>
          </FilterSelect>
        </FilterGroup>
      </FilterSection>

      {selectedIds.length > 0 && (
        <BulkActions>
          <span>{selectedIds.length}개 선택됨</span>
          <Button
            variant="outlined"
            size="small"
            color="error"
            onClick={handleBulkDelete}
          >
            <MdDelete size={16} />
            선택 삭제
          </Button>
        </BulkActions>
      )}

      <TableInfo>
        총 <strong>{filteredFriends.length}</strong>개의 깐부 관계
      </TableInfo>

      <AdminTable
        columns={columns}
        data={paginatedFriends}
        keyExtractor={(item) => item.friendId}
        emptyMessage="깐부 관계가 없습니다."
      />

      <AdminPagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />
    </div>
  );
};

export default FriendManagement;

const StatsRow = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
  margin-bottom: 24px;
`;

const StatCard = styled.div`
  background: ${({ theme }) => theme.app.bg.white};
  border: 1px solid ${({ theme }) => theme.app.border};
  border-radius: 12px;
  padding: 20px;
  text-align: center;
`;

const StatLabel = styled.p`
  font-size: 13px;
  color: ${({ theme }) => theme.app.text.light1};
  margin: 0 0 8px 0;
`;

const StatValue = styled.p<{ $highlight?: boolean; $warning?: boolean }>`
  font-size: 24px;
  font-weight: 700;
  color: ${({ theme, $highlight, $warning }) =>
    $highlight ? "#667eea" : $warning ? "#f59e0b" : theme.app.text.dark1};
  margin: 0;
`;

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
  width: 200px;
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

const FilterGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const FilterLabel = styled.span`
  font-size: 14px;
  color: ${({ theme }) => theme.app.text.light1};
`;

const FilterSelect = styled.select`
  padding: 10px 14px;
  border: 1px solid ${({ theme }) => theme.app.border};
  border-radius: 10px;
  font-size: 14px;
  background: ${({ theme }) => theme.app.bg.white};
  color: ${({ theme }) => theme.app.text.main};
  cursor: pointer;

  &:focus {
    outline: none;
    border-color: #667eea;
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

const ActionButtons = styled.div`
  display: flex;
  gap: 6px;
`;
