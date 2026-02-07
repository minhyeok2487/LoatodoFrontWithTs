import { useState, useMemo } from "react";
import styled from "styled-components";
import { MdAdd } from "@react-icons/all-files/md/MdAdd";
import { toast } from "react-toastify";

import {
  AdminPageTitle,
  AdminTable,
  AdminPagination,
  AdminBadge,
} from "@components/admin";
import Button from "@components/Button";
import Select from "@components/form/Select";
import type {
  AdminContent,
  ContentCategory,
  DayContentCategory,
  WeekContentCategory,
} from "@core/types/admin";
import ContentFormModal from "./components/ContentFormModal";
import { useContents, useDeleteContent } from "./hooks/useContents";

const PAGE_SIZE = 20;

const DAY_CATEGORIES: DayContentCategory[] = ["카오스던전", "가디언토벌", "일일에포나"];
const WEEK_CATEGORIES: WeekContentCategory[] = ["군단장레이드", "어비스던전", "어비스레이드"];

const CATEGORIES: ContentCategory[] = [
  "카오스던전",
  "가디언토벌",
  "일일에포나",
  "군단장레이드",
  "어비스던전",
  "어비스레이드",
  "에브니큐브",
];

const getContentType = (category: ContentCategory): "day" | "week" | "cube" => {
  if (DAY_CATEGORIES.includes(category as DayContentCategory)) return "day";
  if (WEEK_CATEGORIES.includes(category as WeekContentCategory)) return "week";
  return "cube";
};

const ContentManagement = () => {
  const [currentPage, setCurrentPage] = useState(0);
  const [categoryFilter, setCategoryFilter] = useState<ContentCategory | "전체">("전체");
  const [modalMode, setModalMode] = useState<"create" | "edit" | null>(null);
  const [selectedContent, setSelectedContent] = useState<AdminContent | null>(null);

  const { data, isLoading } = useContents(
    categoryFilter !== "전체" ? categoryFilter : undefined
  );

  const deleteContent = useDeleteContent();

  // 클라이언트 측 페이지네이션
  const paginatedData = useMemo(() => {
    if (!data) return [];
    const start = currentPage * PAGE_SIZE;
    return data.slice(start, start + PAGE_SIZE);
  }, [data, currentPage]);

  const totalPages = Math.ceil((data?.length ?? 0) / PAGE_SIZE);

  const handleEdit = (content: AdminContent) => {
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

  const handleDelete = async (contentId: number) => {
    if (window.confirm("이 콘텐츠를 삭제하시겠습니까?")) {
      try {
        await deleteContent.mutateAsync(contentId);
        toast.success("삭제되었습니다.");
      } catch {
        // 에러는 axios interceptor에서 처리됨
      }
    }
  };

  const handleReset = () => {
    setCategoryFilter("전체");
    setCurrentPage(0);
  };

  const getContentTypeLabel = (category: ContentCategory) => {
    const type = getContentType(category);
    switch (type) {
      case "day":
        return "일일";
      case "week":
        return "주간";
      case "cube":
        return "큐브";
      default:
        return "알수없음";
    }
  };

  const getContentTypeColor = (category: ContentCategory) => {
    const type = getContentType(category);
    switch (type) {
      case "day":
        return "primary";
      case "week":
        return "error";
      case "cube":
        return "warning";
      default:
        return "gray";
    }
  };

  const getCategoryColor = (category: ContentCategory) => {
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
      case "일일에포나":
        return "gray";
      case "에브니큐브":
        return "success";
      default:
        return "gray";
    }
  };

  const columns = [
    {
      key: "id",
      header: "ID",
      width: "60px",
    },
    {
      key: "contentType",
      header: "타입",
      width: "80px",
      render: (item: AdminContent) => (
        <AdminBadge variant={getContentTypeColor(item.category)}>
          {getContentTypeLabel(item.category)}
        </AdminBadge>
      ),
    },
    {
      key: "category",
      header: "카테고리",
      width: "120px",
      render: (item: AdminContent) => (
        <AdminBadge variant={getCategoryColor(item.category)}>
          {item.category}
        </AdminBadge>
      ),
    },
    {
      key: "name",
      header: "콘텐츠명",
      render: (item: AdminContent) => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const weekCategory = (item as any).weekContentCategory;
        return (
          <ContentNameCell>
            <span>{item.name}</span>
            {getContentType(item.category) === "week" && "weekContentCategory" in item && (
              <AdminBadge variant="gray">{weekCategory}</AdminBadge>
            )}
          </ContentNameCell>
        );
      },
    },
    {
      key: "level",
      header: "최소 레벨",
      width: "100px",
      render: (item: AdminContent) =>
        item.level > 0 ? item.level : "-",
    },
    {
      key: "gold",
      header: "골드",
      width: "100px",
      render: (item: AdminContent) => {
        if (getContentType(item.category) === "week" && "gold" in item) {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const { gold } = item as any;
          return <GoldCell>{gold > 0 ? gold.toLocaleString() : "-"}</GoldCell>;
        }
        return "-";
      },
    },
    {
      key: "gate",
      header: "관문",
      width: "70px",
      render: (item: AdminContent) => {
        if (getContentType(item.category) === "week" && "gate" in item) {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          return (item as any).gate;
        }
        return "-";
      },
    },
    {
      key: "actions",
      header: "관리",
      width: "140px",
      render: (item: AdminContent) => (
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
            onClick={() => handleDelete(item.id)}
            disabled={deleteContent.isPending}
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
          <Select
            value={categoryFilter}
            onChange={(value) => {
              setCategoryFilter(value as ContentCategory | "전체");
              setCurrentPage(0); // 필터 변경 시 첫 페이지로
            }}
            options={[
              { value: "전체", label: "전체" },
              ...CATEGORIES.map((cat) => ({ value: cat, label: cat })),
            ]}
          />
        </FilterGroup>

        {categoryFilter !== "전체" && (
          <Button variant="outlined" onClick={handleReset}>
            초기화
          </Button>
        )}
      </FilterSection>

      <TableInfo>
        총 <strong>{(data?.length ?? 0).toLocaleString()}</strong>개의 콘텐츠
      </TableInfo>

      <AdminTable
        columns={columns}
        data={paginatedData}
        keyExtractor={(item) => item.id}
        emptyMessage="등록된 콘텐츠가 없습니다."
        isLoading={isLoading}
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
