import { useState } from "react";
import styled from "styled-components";

import {
  AdminPageTitle,
  AdminTable,
  AdminPagination,
  AdminBadge,
} from "@components/admin";
import Button from "@components/Button";
import MemberDetailModal from "./components/MemberDetailModal";

// 목업 데이터
const MOCK_MEMBERS = Array.from({ length: 53 }, (_, i) => ({
  memberId: i + 1,
  username: `user${String(i + 1).padStart(4, "0")}`,
  mainCharacter: i % 3 === 0 ? null : `캐릭터${i + 1}`,
  characterCount: Math.floor(Math.random() * 12) + 1,
  authProvider: i % 4 === 0 ? "google" : "none",
  role: i === 0 ? "ADMIN" : i % 10 === 0 ? "PUBLISHER" : "USER",
  createdDate: new Date(Date.now() - Math.random() * 90 * 24 * 60 * 60 * 1000).toISOString(),
}));

const PAGE_SIZE = 10;

const MemberManagement = () => {
  const [currentPage, setCurrentPage] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedMemberId, setSelectedMemberId] = useState<number | null>(null);

  const filteredMembers = MOCK_MEMBERS.filter(
    (member) =>
      member.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.mainCharacter?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredMembers.length / PAGE_SIZE);
  const paginatedMembers = filteredMembers.slice(
    currentPage * PAGE_SIZE,
    (currentPage + 1) * PAGE_SIZE
  );

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(0);
  };

  const getRoleBadge = (role: string) => {
    switch (role) {
      case "ADMIN":
        return <AdminBadge variant="error">관리자</AdminBadge>;
      case "PUBLISHER":
        return <AdminBadge variant="primary">퍼블리셔</AdminBadge>;
      default:
        return <AdminBadge variant="gray">일반</AdminBadge>;
    }
  };

  const columns = [
    {
      key: "memberId",
      header: "ID",
      width: "70px",
    },
    {
      key: "username",
      header: "아이디",
      render: (item: typeof MOCK_MEMBERS[0]) => (
        <UsernameCell>{item.username}</UsernameCell>
      ),
    },
    {
      key: "mainCharacter",
      header: "대표 캐릭터",
      render: (item: typeof MOCK_MEMBERS[0]) => (
        <span>{item.mainCharacter || "-"}</span>
      ),
    },
    {
      key: "characterCount",
      header: "캐릭터 수",
      width: "100px",
      render: (item: typeof MOCK_MEMBERS[0]) => (
        <span>{item.characterCount}개</span>
      ),
    },
    {
      key: "authProvider",
      header: "가입 방식",
      width: "100px",
      render: (item: typeof MOCK_MEMBERS[0]) => (
        <AdminBadge variant={item.authProvider === "google" ? "primary" : "gray"}>
          {item.authProvider === "google" ? "Google" : "일반"}
        </AdminBadge>
      ),
    },
    {
      key: "role",
      header: "권한",
      width: "100px",
      render: (item: typeof MOCK_MEMBERS[0]) => getRoleBadge(item.role),
    },
    {
      key: "createdDate",
      header: "가입일",
      width: "120px",
      render: (item: typeof MOCK_MEMBERS[0]) =>
        new Date(item.createdDate).toLocaleDateString("ko-KR"),
    },
    {
      key: "actions",
      header: "관리",
      width: "80px",
      render: (item: typeof MOCK_MEMBERS[0]) => (
        <Button
          variant="outlined"
          size="small"
          onClick={() => setSelectedMemberId(item.memberId)}
        >
          상세
        </Button>
      ),
    },
  ];

  return (
    <div>
      <AdminPageTitle
        title="회원 관리"
        description="전체 회원 목록을 조회하고 관리합니다"
      />

      <SearchBar onSubmit={handleSearch}>
        <SearchInput
          type="text"
          placeholder="아이디 또는 캐릭터명으로 검색..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <Button type="submit" variant="contained">
          검색
        </Button>
      </SearchBar>

      <TableInfo>
        총 <strong>{filteredMembers.length.toLocaleString()}</strong>명의 회원
      </TableInfo>

      <AdminTable
        columns={columns}
        data={paginatedMembers}
        keyExtractor={(item) => item.memberId}
        emptyMessage="검색 결과가 없습니다."
      />

      <AdminPagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />

      {selectedMemberId && (
        <MemberDetailModal
          memberId={selectedMemberId}
          onClose={() => setSelectedMemberId(null)}
        />
      )}
    </div>
  );
};

export default MemberManagement;

const SearchBar = styled.form`
  display: flex;
  gap: 12px;
  margin-bottom: 20px;
`;

const SearchInput = styled.input`
  flex: 1;
  max-width: 320px;
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

const TableInfo = styled.p`
  font-size: 14px;
  color: ${({ theme }) => theme.app.text.light1};
  margin: 0 0 16px 0;

  strong {
    color: ${({ theme }) => theme.app.text.main};
  }
`;

const UsernameCell = styled.span`
  font-weight: 500;
  color: ${({ theme }) => theme.app.text.dark1};
`;
