import { useState } from "react";
import styled from "styled-components";

import {
  AdminPageTitle,
  AdminTable,
  AdminPagination,
  AdminBadge,
} from "@components/admin";
import Button from "@components/Button";
import Select from "@components/form/Select";
import type { AdminMember, MemberRole, AuthProvider } from "@core/types/admin";
import MemberDetailModal from "./components/MemberDetailModal";
import { useMembers } from "./hooks/useMembers";

const PAGE_SIZE = 25;

type SearchType = "username" | "mainCharacter";

const MemberManagement = () => {
  const [currentPage, setCurrentPage] = useState(0);
  const [searchType, setSearchType] = useState<SearchType>("username");
  const [searchTerm, setSearchTerm] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeSearchType, setActiveSearchType] = useState<SearchType>("username");
  const [selectedMemberId, setSelectedMemberId] = useState<number | null>(null);
  const [authProviderFilter, setAuthProviderFilter] = useState<AuthProvider | "">("");

  const { data, isLoading } = useMembers({
    username: activeSearchType === "username" ? searchQuery || undefined : undefined,
    mainCharacter: activeSearchType === "mainCharacter" ? searchQuery || undefined : undefined,
    authProvider: authProviderFilter || undefined,
    page: currentPage + 1,
    limit: PAGE_SIZE,
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchQuery(searchTerm);
    setActiveSearchType(searchType);
    setCurrentPage(0);
  };

  const handleReset = () => {
    setSearchTerm("");
    setSearchQuery("");
    setSearchType("username");
    setActiveSearchType("username");
    setAuthProviderFilter("");
    setCurrentPage(0);
  };

  const getRoleBadge = (role: MemberRole) => {
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
      width: "105px",
    },
    {
      key: "username",
      header: "아이디",
      width: "120px",
      render: (item: AdminMember) => (
        <UsernameCell>{item.username}</UsernameCell>
      ),
    },
    {
      key: "mainCharacter",
      header: "대표 캐릭터",
      width: "180px",
      render: (item: AdminMember) => <span>{item.mainCharacter || "-"}</span>,
    },
    {
      key: "authProvider",
      header: "가입 방식",
      width: "100px",
      render: (item: AdminMember) => (
        <AdminBadge variant={item.authProvider === "Google" ? "primary" : "gray"}>
          {item.authProvider === "Google" ? "Google" : "일반"}
        </AdminBadge>
      ),
    },
    {
      key: "apiKey",
      header: "API Key",
      width: "100px",
      render: (item: AdminMember) => (
        <AdminBadge variant={item.apiKey ? "success" : "gray"}>
          {item.apiKey ? "등록됨" : "미등록"}
        </AdminBadge>
      ),
    },
    {
      key: "createdDate",
      header: "가입일",
      width: "120px",
      render: (item: AdminMember) =>
        new Date(item.createdDate).toLocaleDateString("ko-KR"),
    },
    {
      key: "actions",
      header: "관리",
      width: "80px",
      render: (item: AdminMember) => (
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
        <Select
          value={searchType}
          onChange={(value) => setSearchType(value)}
          options={[
            { value: "username" as SearchType, label: "아이디" },
            { value: "mainCharacter" as SearchType, label: "대표 캐릭터" },
          ]}
        />
        <SearchInput
          type="text"
          placeholder={searchType === "username" ? "아이디로 검색..." : "대표 캐릭터로 검색..."}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <Select
          value={authProviderFilter}
          onChange={(value) => {
            setAuthProviderFilter(value as AuthProvider | "");
            setCurrentPage(0);
          }}
          options={[
            { value: "", label: "가입 방식 전체" },
            { value: "None", label: "일반" },
            { value: "Google", label: "Google" },
          ]}
        />
        <Button type="submit" variant="contained">
          검색
        </Button>
        {(searchQuery || authProviderFilter) && (
          <Button
            type="button"
            variant="outlined"
            onClick={handleReset}
          >
            초기화
          </Button>
        )}
      </SearchBar>

      <TableInfo>
        총 <strong>{(data?.totalElements ?? 0).toLocaleString()}</strong>명의 회원
      </TableInfo>

      <AdminTable
        columns={columns}
        data={data?.content ?? []}
        keyExtractor={(item) => item.memberId}
        emptyMessage="검색 결과가 없습니다."
        isLoading={isLoading}
      />

      <AdminPagination
        currentPage={currentPage}
        totalPages={data?.totalPages ?? 0}
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
  align-items: center;
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
