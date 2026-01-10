import { useState } from "react";
import styled from "styled-components";

import {
  AdminPageTitle,
  AdminTable,
  AdminPagination,
  AdminBadge,
} from "@components/admin";
import Button from "@components/Button";
import CharacterDetailModal from "./components/CharacterDetailModal";

// 목업 데이터
const MOCK_CHARACTERS = Array.from({ length: 87 }, (_, i) => ({
  characterId: i + 1,
  memberId: Math.floor(i / 3) + 1,
  memberUsername: `user${String(Math.floor(i / 3) + 1).padStart(4, "0")}`,
  serverName: ["루페온", "실리안", "아만", "카제로스", "니나브"][i % 5],
  characterName: `캐릭터${i + 1}`,
  characterClassName: [
    "버서커",
    "디스트로이어",
    "워로드",
    "홀리나이트",
    "슬레이어",
    "아르카나",
    "서머너",
    "바드",
    "소서리스",
    "도화가",
  ][i % 10],
  characterImage: "",
  itemLevel: Math.floor(Math.random() * 300) + 1500,
  goldCharacter: i % 4 === 0,
  isDeleted: i % 20 === 0,
  createdDate: new Date(
    Date.now() - Math.random() * 180 * 24 * 60 * 60 * 1000
  ).toISOString(),
}));

const PAGE_SIZE = 10;

const CharacterManagement = () => {
  const [currentPage, setCurrentPage] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [serverFilter, setServerFilter] = useState("전체");
  const [showDeleted, setShowDeleted] = useState(false);
  const [selectedCharacterId, setSelectedCharacterId] = useState<number | null>(
    null
  );

  const filteredCharacters = MOCK_CHARACTERS.filter((char) => {
    const matchesSearch =
      char.characterName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      char.memberUsername.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesServer =
      serverFilter === "전체" || char.serverName === serverFilter;
    const matchesDeleted = showDeleted || !char.isDeleted;
    return matchesSearch && matchesServer && matchesDeleted;
  });

  const totalPages = Math.ceil(filteredCharacters.length / PAGE_SIZE);
  const paginatedCharacters = filteredCharacters.slice(
    currentPage * PAGE_SIZE,
    (currentPage + 1) * PAGE_SIZE
  );

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(0);
  };

  const servers = ["전체", "루페온", "실리안", "아만", "카제로스", "니나브"];

  const columns = [
    {
      key: "characterId",
      header: "ID",
      width: "70px",
    },
    {
      key: "characterName",
      header: "캐릭터명",
      render: (item: (typeof MOCK_CHARACTERS)[0]) => (
        <CharacterNameCell>
          <span>{item.characterName}</span>
          {item.isDeleted && <AdminBadge variant="error">삭제됨</AdminBadge>}
        </CharacterNameCell>
      ),
    },
    {
      key: "memberUsername",
      header: "소유자",
      render: (item: (typeof MOCK_CHARACTERS)[0]) => (
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
      render: (item: (typeof MOCK_CHARACTERS)[0]) => (
        <ItemLevelCell>{item.itemLevel.toFixed(2)}</ItemLevelCell>
      ),
    },
    {
      key: "goldCharacter",
      header: "골드획득",
      width: "90px",
      render: (item: (typeof MOCK_CHARACTERS)[0]) => (
        <AdminBadge variant={item.goldCharacter ? "warning" : "gray"}>
          {item.goldCharacter ? "지정" : "-"}
        </AdminBadge>
      ),
    },
    {
      key: "createdDate",
      header: "등록일",
      width: "110px",
      render: (item: (typeof MOCK_CHARACTERS)[0]) =>
        new Date(item.createdDate).toLocaleDateString("ko-KR"),
    },
    {
      key: "actions",
      header: "관리",
      width: "80px",
      render: (item: (typeof MOCK_CHARACTERS)[0]) => (
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
            placeholder="캐릭터명 또는 소유자 아이디로 검색..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Button type="submit" variant="contained">
            검색
          </Button>
        </SearchBar>

        <FilterGroup>
          <FilterLabel>서버</FilterLabel>
          <FilterSelect
            value={serverFilter}
            onChange={(e) => {
              setServerFilter(e.target.value);
              setCurrentPage(0);
            }}
          >
            {servers.map((server) => (
              <option key={server} value={server}>
                {server}
              </option>
            ))}
          </FilterSelect>
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
      </FilterSection>

      <TableInfo>
        총 <strong>{filteredCharacters.length.toLocaleString()}</strong>개의
        캐릭터
      </TableInfo>

      <AdminTable
        columns={columns}
        data={paginatedCharacters}
        keyExtractor={(item) => item.characterId}
        emptyMessage="검색 결과가 없습니다."
      />

      <AdminPagination
        currentPage={currentPage}
        totalPages={totalPages}
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
