import { useState } from "react";
import styled from "styled-components";
import { MdAdd } from "@react-icons/all-files/md/MdAdd";

import {
  AdminPageTitle,
  AdminTable,
  AdminPagination,
  AdminBadge,
} from "@components/admin";
import Button from "@components/Button";
import ContentFormModal from "./components/ContentFormModal";

// 카테고리 타입
type Category =
  | "카오스던전"
  | "가디언토벌"
  | "군단장레이드"
  | "어비스던전"
  | "어비스레이드"
  | "에포나의뢰";

// 목업 데이터
const MOCK_CONTENTS = [
  // 카오스던전
  { contentId: 1, category: "카오스던전" as Category, name: "카오스던전 1640", minItemLevel: 1640, weekContent: "일일", gold: 0, sortNumber: 1, isActive: true },
  { contentId: 2, category: "카오스던전" as Category, name: "카오스던전 1610", minItemLevel: 1610, weekContent: "일일", gold: 0, sortNumber: 2, isActive: true },
  { contentId: 3, category: "카오스던전" as Category, name: "카오스던전 1580", minItemLevel: 1580, weekContent: "일일", gold: 0, sortNumber: 3, isActive: true },
  // 가디언토벌
  { contentId: 4, category: "가디언토벌" as Category, name: "칼엘리고스", minItemLevel: 1580, weekContent: "일일", gold: 0, sortNumber: 1, isActive: true },
  { contentId: 5, category: "가디언토벌" as Category, name: "하누마탄", minItemLevel: 1540, weekContent: "일일", gold: 0, sortNumber: 2, isActive: true },
  // 군단장레이드
  { contentId: 6, category: "군단장레이드" as Category, name: "에기르 노말", minItemLevel: 1660, weekContent: "주간", gold: 21000, sortNumber: 1, isActive: true },
  { contentId: 7, category: "군단장레이드" as Category, name: "에기르 하드", minItemLevel: 1680, weekContent: "주간", gold: 28500, sortNumber: 2, isActive: true },
  { contentId: 8, category: "군단장레이드" as Category, name: "베히모스", minItemLevel: 1640, weekContent: "주간", gold: 12500, sortNumber: 3, isActive: true },
  { contentId: 9, category: "군단장레이드" as Category, name: "카멘 노말", minItemLevel: 1610, weekContent: "주간", gold: 9500, sortNumber: 4, isActive: true },
  { contentId: 10, category: "군단장레이드" as Category, name: "카멘 하드", minItemLevel: 1630, weekContent: "주간", gold: 16500, sortNumber: 5, isActive: true },
  { contentId: 11, category: "군단장레이드" as Category, name: "상아탑 노말", minItemLevel: 1600, weekContent: "주간", gold: 6500, sortNumber: 6, isActive: true },
  { contentId: 12, category: "군단장레이드" as Category, name: "상아탑 하드", minItemLevel: 1620, weekContent: "주간", gold: 10500, sortNumber: 7, isActive: true },
  { contentId: 13, category: "군단장레이드" as Category, name: "일리아칸 노말", minItemLevel: 1580, weekContent: "주간", gold: 5500, sortNumber: 8, isActive: true },
  { contentId: 14, category: "군단장레이드" as Category, name: "일리아칸 하드", minItemLevel: 1600, weekContent: "주간", gold: 7500, sortNumber: 9, isActive: true },
  { contentId: 15, category: "군단장레이드" as Category, name: "카양겔 노말", minItemLevel: 1540, weekContent: "주간", gold: 4000, sortNumber: 10, isActive: false },
  // 어비스던전
  { contentId: 16, category: "어비스던전" as Category, name: "혼돈의 상아탑", minItemLevel: 1600, weekContent: "주간", gold: 2500, sortNumber: 1, isActive: true },
  // 에포나의뢰
  { contentId: 17, category: "에포나의뢰" as Category, name: "일일 에포나", minItemLevel: 0, weekContent: "일일", gold: 0, sortNumber: 1, isActive: true },
  { contentId: 18, category: "에포나의뢰" as Category, name: "주간 에포나", minItemLevel: 0, weekContent: "주간", gold: 0, sortNumber: 2, isActive: true },
];

const CATEGORIES: Category[] = [
  "카오스던전",
  "가디언토벌",
  "군단장레이드",
  "어비스던전",
  "어비스레이드",
  "에포나의뢰",
];

const PAGE_SIZE = 10;

const ContentManagement = () => {
  const [currentPage, setCurrentPage] = useState(0);
  const [categoryFilter, setCategoryFilter] = useState<Category | "전체">("전체");
  const [showInactive, setShowInactive] = useState(false);
  const [modalMode, setModalMode] = useState<"create" | "edit" | null>(null);
  const [selectedContent, setSelectedContent] = useState<typeof MOCK_CONTENTS[0] | null>(null);

  const filteredContents = MOCK_CONTENTS.filter((content) => {
    const matchesCategory =
      categoryFilter === "전체" || content.category === categoryFilter;
    const matchesActive = showInactive || content.isActive;
    return matchesCategory && matchesActive;
  });

  const totalPages = Math.ceil(filteredContents.length / PAGE_SIZE);
  const paginatedContents = filteredContents.slice(
    currentPage * PAGE_SIZE,
    (currentPage + 1) * PAGE_SIZE
  );

  const handleEdit = (content: typeof MOCK_CONTENTS[0]) => {
    setSelectedContent(content);
    setModalMode("edit");
  };

  const handleCreate = () => {
    setSelectedContent(null);
    setModalMode("create");
  };

  const handleCloseModal = () => {
    setModalMode(null);
    setSelectedContent(null);
  };

  const handleDelete = (contentId: number) => {
    if (window.confirm("이 콘텐츠를 삭제하시겠습니까?")) {
      alert(`콘텐츠 ${contentId} 삭제 (목업)`);
    }
  };

  const getCategoryColor = (category: Category) => {
    switch (category) {
      case "카오스던전":
        return "primary";
      case "가디언토벌":
        return "success";
      case "군단장레이드":
        return "error";
      case "어비스던전":
        return "warning";
      case "어비스레이드":
        return "warning";
      case "에포나의뢰":
        return "gray";
      default:
        return "gray";
    }
  };

  const columns = [
    {
      key: "contentId",
      header: "ID",
      width: "60px",
    },
    {
      key: "category",
      header: "카테고리",
      width: "120px",
      render: (item: typeof MOCK_CONTENTS[0]) => (
        <AdminBadge variant={getCategoryColor(item.category)}>
          {item.category}
        </AdminBadge>
      ),
    },
    {
      key: "name",
      header: "콘텐츠명",
      render: (item: typeof MOCK_CONTENTS[0]) => (
        <ContentNameCell>
          <span>{item.name}</span>
          {!item.isActive && <AdminBadge variant="gray">비활성</AdminBadge>}
        </ContentNameCell>
      ),
    },
    {
      key: "minItemLevel",
      header: "최소 레벨",
      width: "100px",
      render: (item: typeof MOCK_CONTENTS[0]) =>
        item.minItemLevel > 0 ? item.minItemLevel : "-",
    },
    {
      key: "weekContent",
      header: "주기",
      width: "80px",
      render: (item: typeof MOCK_CONTENTS[0]) => (
        <AdminBadge variant={item.weekContent === "주간" ? "primary" : "gray"}>
          {item.weekContent}
        </AdminBadge>
      ),
    },
    {
      key: "gold",
      header: "골드",
      width: "100px",
      render: (item: typeof MOCK_CONTENTS[0]) => (
        <GoldCell>{item.gold > 0 ? item.gold.toLocaleString() : "-"}</GoldCell>
      ),
    },
    {
      key: "sortNumber",
      header: "순서",
      width: "70px",
    },
    {
      key: "actions",
      header: "관리",
      width: "140px",
      render: (item: typeof MOCK_CONTENTS[0]) => (
        <ActionButtons>
          <Button
            variant="outlined"
            size="small"
            onClick={() => handleEdit(item)}
          >
            수정
          </Button>
          <Button
            variant="outlined"
            size="small"
            color="error"
            onClick={() => handleDelete(item.contentId)}
          >
            삭제
          </Button>
        </ActionButtons>
      ),
    },
  ];

  return (
    <div>
      <HeaderRow>
        <AdminPageTitle
          title="콘텐츠 관리"
          description="게임 콘텐츠(레이드, 던전 등)를 관리합니다"
        />
        <Button variant="contained" onClick={handleCreate}>
          <MdAdd size={18} />
          콘텐츠 추가
        </Button>
      </HeaderRow>

      <FilterSection>
        <FilterGroup>
          <FilterLabel>카테고리</FilterLabel>
          <FilterSelect
            value={categoryFilter}
            onChange={(e) => {
              setCategoryFilter(e.target.value as Category | "전체");
              setCurrentPage(0);
            }}
          >
            <option value="전체">전체</option>
            {CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </FilterSelect>
        </FilterGroup>

        <CheckboxLabel>
          <input
            type="checkbox"
            checked={showInactive}
            onChange={(e) => {
              setShowInactive(e.target.checked);
              setCurrentPage(0);
            }}
          />
          비활성 콘텐츠 포함
        </CheckboxLabel>
      </FilterSection>

      <TableInfo>
        총 <strong>{filteredContents.length}</strong>개의 콘텐츠
      </TableInfo>

      <AdminTable
        columns={columns}
        data={paginatedContents}
        keyExtractor={(item) => item.contentId}
        emptyMessage="등록된 콘텐츠가 없습니다."
      />

      <AdminPagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />

      {modalMode && (
        <ContentFormModal
          mode={modalMode}
          content={selectedContent}
          categories={CATEGORIES}
          onClose={handleCloseModal}
        />
      )}
    </div>
  );
};

export default ContentManagement;

const HeaderRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 24px;

  button {
    display: flex;
    align-items: center;
    gap: 6px;
  }
`;

const FilterSection = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 16px;
  margin-bottom: 20px;
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

const ContentNameCell = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;

  span {
    font-weight: 500;
    color: ${({ theme }) => theme.app.text.dark1};
  }
`;

const GoldCell = styled.span`
  font-weight: 600;
  color: #f59e0b;
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 6px;
`;
