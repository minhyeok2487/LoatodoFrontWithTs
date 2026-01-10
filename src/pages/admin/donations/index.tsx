import { useState } from "react";
import styled from "styled-components";

import {
  AdminPageTitle,
  AdminTable,
  AdminPagination,
  AdminBadge,
} from "@components/admin";
import Button from "@components/Button";

// 목업 데이터
const MOCK_DONATIONS = Array.from({ length: 45 }, (_, i) => ({
  donationId: i + 1,
  memberId: Math.floor(Math.random() * 50) + 1,
  memberUsername: `user${String(Math.floor(Math.random() * 50) + 1).padStart(4, "0")}`,
  amount: [1000, 3000, 5000, 10000, 30000, 50000][Math.floor(Math.random() * 6)],
  message: i % 3 === 0 ? "좋은 서비스 감사합니다!" : i % 3 === 1 ? "응원합니다~" : "",
  paymentMethod: ["카카오페이", "토스페이", "신용카드"][Math.floor(Math.random() * 3)],
  status: i % 10 === 0 ? "cancelled" : i % 8 === 0 ? "pending" : "completed",
  adsRemovalDays: [0, 7, 30, 90][Math.floor(Math.random() * 4)],
  createdDate: new Date(
    Date.now() - Math.random() * 90 * 24 * 60 * 60 * 1000
  ).toISOString(),
}));

const PAGE_SIZE = 10;

const DonationManagement = () => {
  const [currentPage, setCurrentPage] = useState(0);
  const [statusFilter, setStatusFilter] = useState("전체");
  const [searchTerm, setSearchTerm] = useState("");

  const filteredDonations = MOCK_DONATIONS.filter((donation) => {
    const matchesStatus =
      statusFilter === "전체" || donation.status === statusFilter;
    const matchesSearch =
      donation.memberUsername.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const totalPages = Math.ceil(filteredDonations.length / PAGE_SIZE);
  const paginatedDonations = filteredDonations.slice(
    currentPage * PAGE_SIZE,
    (currentPage + 1) * PAGE_SIZE
  );

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(0);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return <AdminBadge variant="success">완료</AdminBadge>;
      case "pending":
        return <AdminBadge variant="warning">대기중</AdminBadge>;
      case "cancelled":
        return <AdminBadge variant="error">취소됨</AdminBadge>;
      default:
        return <AdminBadge variant="gray">{status}</AdminBadge>;
    }
  };

  const totalAmount = filteredDonations
    .filter((d) => d.status === "completed")
    .reduce((sum, d) => sum + d.amount, 0);

  const handleRefund = (donationId: number) => {
    if (window.confirm("이 후원을 환불 처리하시겠습니까?")) {
      alert(`후원 ${donationId} 환불 처리 (목업)`);
    }
  };

  const handleExtendAds = (donationId: number) => {
    const days = prompt("광고 제거 연장 일수를 입력하세요:", "7");
    if (days) {
      alert(`후원 ${donationId}에 광고 제거 ${days}일 연장 (목업)`);
    }
  };

  const columns = [
    {
      key: "donationId",
      header: "ID",
      width: "60px",
    },
    {
      key: "memberUsername",
      header: "후원자",
      render: (item: typeof MOCK_DONATIONS[0]) => (
        <UserCell>
          <Username>{item.memberUsername}</Username>
          <UserId>ID: {item.memberId}</UserId>
        </UserCell>
      ),
    },
    {
      key: "amount",
      header: "금액",
      width: "110px",
      render: (item: typeof MOCK_DONATIONS[0]) => (
        <AmountCell>{item.amount.toLocaleString()}원</AmountCell>
      ),
    },
    {
      key: "paymentMethod",
      header: "결제수단",
      width: "100px",
    },
    {
      key: "adsRemovalDays",
      header: "광고제거",
      width: "90px",
      render: (item: typeof MOCK_DONATIONS[0]) =>
        item.adsRemovalDays > 0 ? `${item.adsRemovalDays}일` : "-",
    },
    {
      key: "status",
      header: "상태",
      width: "90px",
      render: (item: typeof MOCK_DONATIONS[0]) => getStatusBadge(item.status),
    },
    {
      key: "message",
      header: "메시지",
      render: (item: typeof MOCK_DONATIONS[0]) => (
        <MessageCell>{item.message || "-"}</MessageCell>
      ),
    },
    {
      key: "createdDate",
      header: "일시",
      width: "150px",
      render: (item: typeof MOCK_DONATIONS[0]) =>
        new Date(item.createdDate).toLocaleString("ko-KR"),
    },
    {
      key: "actions",
      header: "관리",
      width: "160px",
      render: (item: typeof MOCK_DONATIONS[0]) => (
        <ActionButtons>
          <Button
            variant="outlined"
            size="small"
            onClick={() => handleExtendAds(item.donationId)}
          >
            광고제거
          </Button>
          {item.status === "completed" && (
            <Button
              variant="outlined"
              size="small"
              color="error"
              onClick={() => handleRefund(item.donationId)}
            >
              환불
            </Button>
          )}
        </ActionButtons>
      ),
    },
  ];

  return (
    <div>
      <AdminPageTitle
        title="후원 관리"
        description="사용자 후원 내역을 조회하고 관리합니다"
      />

      <StatsRow>
        <StatCard>
          <StatLabel>총 후원 건수</StatLabel>
          <StatValue>
            {MOCK_DONATIONS.filter((d) => d.status === "completed").length}건
          </StatValue>
        </StatCard>
        <StatCard>
          <StatLabel>총 후원 금액</StatLabel>
          <StatValue $highlight>
            {MOCK_DONATIONS.filter((d) => d.status === "completed")
              .reduce((sum, d) => sum + d.amount, 0)
              .toLocaleString()}
            원
          </StatValue>
        </StatCard>
        <StatCard>
          <StatLabel>필터 결과 금액</StatLabel>
          <StatValue>{totalAmount.toLocaleString()}원</StatValue>
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
            <option value="completed">완료</option>
            <option value="pending">대기중</option>
            <option value="cancelled">취소됨</option>
          </FilterSelect>
        </FilterGroup>
      </FilterSection>

      <TableInfo>
        총 <strong>{filteredDonations.length}</strong>건의 후원
      </TableInfo>

      <AdminTable
        columns={columns}
        data={paginatedDonations}
        keyExtractor={(item) => item.donationId}
        emptyMessage="후원 내역이 없습니다."
      />

      <AdminPagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />
    </div>
  );
};

export default DonationManagement;

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

const StatValue = styled.p<{ $highlight?: boolean }>`
  font-size: 24px;
  font-weight: 700;
  color: ${({ theme, $highlight }) =>
    $highlight ? "#667eea" : theme.app.text.dark1};
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

const TableInfo = styled.p`
  font-size: 14px;
  color: ${({ theme }) => theme.app.text.light1};
  margin: 0 0 16px 0;

  strong {
    color: ${({ theme }) => theme.app.text.main};
  }
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

const AmountCell = styled.span`
  font-weight: 600;
  color: ${({ theme }) => theme.app.text.main};
`;

const MessageCell = styled.span`
  font-size: 13px;
  color: ${({ theme }) => theme.app.text.light1};
  max-width: 200px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 6px;
`;
