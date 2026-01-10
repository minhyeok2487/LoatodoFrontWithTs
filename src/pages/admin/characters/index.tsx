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
import type { AdminCharacter } from "@core/types/admin";
import CharacterDetailModal from "./components/CharacterDetailModal";
import { useCharacters } from "./hooks/useCharacters";

const PAGE_SIZE = 25;
const SERVERS = ["전체", "루페온", "실리안", "아만", "카마인", "카제로스", "아브렐슈드", "카단", "니나브"];

const CharacterManagement = () => {
  const [currentPage, setCurrentPage] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [serverFilter, setServerFilter] = useState("전체");
  const [showDeleted, setShowDeleted] = useState(false);
  const [selectedCharacterId, setSelectedCharacterId] = useState<number | null>(null);

  const { data, isLoading } = useCharacters({
    characterName: searchQuery || undefined,
    serverName: serverFilter !== "전체" ? serverFilter : undefined,
    isDeleted: showDeleted ? undefined : false,
    page: currentPage + 1,
    limit: PAGE_SIZE,
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchQuery(searchTerm);
    setCurrentPage(0);
  };

  const handleReset = () => {
    setSearchTerm("");
    setSearchQuery("");
    setServerFilter("전체");
    setShowDeleted(false);
    setCurrentPage(0);
  };

  const columns = [
    {
      key: "characterId",
      header: "ID",
      width: "70px",
    },
    {
      key: "characterName",
      header: "캐릭터명",
      render: (item: AdminCharacter) => (
        <CharacterNameCell>
          <span>{item.characterName}</span>
          {item.isDeleted && <AdminBadge variant="error">삭제됨</AdminBadge>}
        </CharacterNameCell>
      ),
    },
    {
      key: "memberUsername",
      header: "소유자",
      render: (item: AdminCharacter) => (
        <OwnerCell>{item.memberUsername}</OwnerCell>
      ),
    },
    {
      key: "serverName",
      header: "서버",
      width: "100px",
    },
    {
      key: "characterClassName",
      header: "클래스",
      width: "110px",
    },
    {
      key: "itemLevel",
      header: "아이템 레벨",
      width: "120px",
      render: (item: AdminCharacter) => (
        <ItemLevelCell>{item.itemLevel.toFixed(2)}</ItemLevelCell>
      ),
    },
    {
      key: "goldCharacter",
      header: "골드획득",
      width: "90px",
      render: (item: AdminCharacter) => (
        <AdminBadge variant={item.goldCharacter ? "warning" : "gray"}>
          {item.goldCharacter ? "지정" : "-"}
        </AdminBadge>
      ),
    },
    {
      key: "createdDate",
      header: "등록일",
      width: "110px",
      render: (item: AdminCharacter) =>
        new Date(item.createdDate).toLocaleDateString("ko-KR"),
    },
    {
      key: "actions",
      header: "관리",
      width: "80px",
      render: (item: AdminCharacter) => (
        <Button
          variant="outlined"
          size="small"
          onClick={() => setSelectedCharacterId(item.characterId)}
        >
          상세
        </Button>
      ),
    },
  ];

  return (
    <div>
      <AdminPageTitle
        title="캐릭터 관리"
        description="전체 캐릭터 목록을 조회하고 관리합니다"
      />

      <FilterSection>
        <SearchBar onSubmit={handleSearch}>
          <SearchInput
            type="text"
            placeholder="캐릭터명으로 검색..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Button type="submit" variant="contained">
            검색
          </Button>
        </SearchBar>

        <FilterGroup>
          <FilterLabel>서버</FilterLabel>
          <Select
            value={serverFilter}
            onChange={(value) => {
              setServerFilter(value);
              setCurrentPage(0);
            }}
            options={SERVERS.map((server) => ({
              value: server,
              label: server,
            }))}
          />
        </FilterGroup>

        <CheckboxLabel>
          <input
            type="checkbox"
            checked={showDeleted}
            onChange={(e) => {
              setShowDeleted(e.target.checked);
              setCurrentPage(0);
            }}
          />
          삭제된 캐릭터 포함
        </CheckboxLabel>

        {(searchQuery || serverFilter !== "전체" || showDeleted) && (
          <Button type="button" variant="outlined" onClick={handleReset}>
            초기화
          </Button>
        )}
      </FilterSection>

      <TableInfo>
        총 <strong>{(data?.totalElements ?? 0).toLocaleString()}</strong>개의 캐릭터
      </TableInfo>

      <AdminTable
        columns={columns}
        data={data?.content ?? []}
        keyExtractor={(item) => item.characterId}
        emptyMessage="검색 결과가 없습니다."
        isLoading={isLoading}
      />

      <AdminPagination
        currentPage={currentPage}
        totalPages={data?.totalPages ?? 0}
        onPageChange={setCurrentPage}
      />

      {selectedCharacterId && (
        <CharacterDetailModal
          characterId={selectedCharacterId}
          onClose={() => setSelectedCharacterId(null)}
        />
      )}
    </div>
  );
};

export default CharacterManagement;

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

const FilterGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const FilterLabel = styled.span`
  font-size: 14px;
  color: ${({ theme }) => theme.app.text.light1};
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

const TableInfo = styled.p`
  font-size: 14px;
  color: ${({ theme }) => theme.app.text.light1};
  margin: 0 0 16px 0;

  strong {
    color: ${({ theme }) => theme.app.text.main};
  }
`;

const CharacterNameCell = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;

  span {
    font-weight: 500;
    color: ${({ theme }) => theme.app.text.dark1};
  }
`;

const OwnerCell = styled.span`
  color: ${({ theme }) => theme.app.text.light1};
  font-size: 13px;
`;

const ItemLevelCell = styled.span`
  font-weight: 600;
  color: ${({ theme }) => theme.app.text.main};
`;
