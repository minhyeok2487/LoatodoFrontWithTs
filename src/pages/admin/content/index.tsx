import { useState } from "react";
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
import type { AdminContent, ContentType, ContentCategory } from "@core/types/admin";
import ContentFormModal from "./components/ContentFormModal";
import { useContents, useDeleteContent } from "./hooks/useContents";

const PAGE_SIZE = 20;

const CONTENT_TYPES: { value: ContentType | "전체"; label: string }[] = [
  { value: "전체", label: "전체" },
  { value: "day", label: "일일" },
  { value: "week", label: "주간" },
  { value: "cube", label: "큐브" },
];

const CATEGORIES: ContentCategory[] = [
  "카오스던전",
  "가디언토벌",
  "일일에포나",
  "군단장레이드",
  "어비스던전",
  "어비스레이드",
  "에브니큐브",
];

const ContentManagement = () => {
  const [currentPage, setCurrentPage] = useState(0);
  const [contentTypeFilter, setContentTypeFilter] = useState<ContentType | "전체">("전체");
  const [categoryFilter, setCategoryFilter] = useState<ContentCategory | "전체">("전체");
  const [modalMode, setModalMode] = useState<"create" | "edit" | null>(null);
  const [selectedContent, setSelectedContent] = useState<AdminContent | null>(null);

  const { data, isLoading } = useContents({
    contentType: contentTypeFilter !== "전체" ? contentTypeFilter : undefined,
    category: categoryFilter !== "전체" ? categoryFilter : undefined,
    page: currentPage + 1,
    limit: PAGE_SIZE,
  });

  const deleteContent = useDeleteContent();

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
    setContentTypeFilter("전체");
    setCategoryFilter("전체");
    setCurrentPage(0);
  };

  const getContentTypeLabel = (contentType: ContentType) => {
    switch (contentType) {
      case "day":
        return "일일";
      case "week":
        return "주간";
      case "cube":
        return "큐브";
      default:
        return contentType;
    }
  };

  const getContentTypeColor = (contentType: ContentType) => {
    switch (contentType) {
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
        <AdminBadge variant={getContentTypeColor(item.contentType)}>
          {getContentTypeLabel(item.contentType)}
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
      render: (item: AdminContent) => (
        <ContentNameCell>
          <span>{item.name}</span>
          {item.contentType === "week" && "weekContentCategory" in item && (
            <AdminBadge variant="gray">{item.weekContentCategory}</AdminBadge>
          )}
        </ContentNameCell>
      ),
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
        if (item.contentType === "week" && "gold" in item) {
          return <GoldCell>{(item.gold ?? 0) > 0 ? item.gold?.toLocaleString() : "-"}</GoldCell>;
        }
        return "-";
      },
    },
    {
      key: "gate",
      header: "관문",
      width: "70px",
      render: (item: AdminContent) => {
        if (item.contentType === "week" && "gate" in item) {
          return item.gate;
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
          <FilterLabel>타입</FilterLabel>
          <FilterSelect
            value={contentTypeFilter}
            onChange={(e) => {
              setContentTypeFilter(e.target.value as ContentType | "전체");
              setCurrentPage(0);
            }}
          >
            {CONTENT_TYPES.map((type) => (
              <option key={type.value} value={type.value}>
                {type.label}
              </option>
            ))}
          </FilterSelect>
        </FilterGroup>

        <FilterGroup>
          <FilterLabel>카테고리</FilterLabel>
          <FilterSelect
            value={categoryFilter}
            onChange={(e) => {
              setCategoryFilter(e.target.value as ContentCategory | "전체");
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

        {(contentTypeFilter !== "전체" || categoryFilter !== "전체") && (
          <Button variant="outlined" onClick={handleReset}>
            초기화
          </Button>
        )}
      </FilterSection>

      <TableInfo>
        총 <strong>{(data?.totalElements ?? 0).toLocaleString()}</strong>개의 콘텐츠
      </TableInfo>

      <AdminTable
        columns={columns}
        data={data?.content ?? []}
        keyExtractor={(item) => item.id}
        emptyMessage="등록된 콘텐츠가 없습니다."
        isLoading={isLoading}
      />

      <AdminPagination
        currentPage={currentPage}
        totalPages={data?.totalPages ?? 0}
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
