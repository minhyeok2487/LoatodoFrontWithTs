import type { FC } from "react";
import styled from "styled-components";

interface Props {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const AdminPagination: FC<Props> = ({
  currentPage,
  totalPages,
  onPageChange,
}) => {
  if (totalPages <= 1) return null;

  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const showPages = 5;
    const halfShow = Math.floor(showPages / 2);

    let startPage = Math.max(0, currentPage - halfShow);
    let endPage = Math.min(totalPages - 1, currentPage + halfShow);

    if (currentPage - halfShow < 0) {
      endPage = Math.min(totalPages - 1, showPages - 1);
    }
    if (currentPage + halfShow >= totalPages) {
      startPage = Math.max(0, totalPages - showPages);
    }

    if (startPage > 0) {
      pages.push(0);
      if (startPage > 1) pages.push("...");
    }

    for (let i = startPage; i <= endPage; i += 1) {
      pages.push(i);
    }

    if (endPage < totalPages - 1) {
      if (endPage < totalPages - 2) pages.push("...");
      pages.push(totalPages - 1);
    }

    return pages;
  };

  return (
    <Wrapper>
      <PageButton
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 0}
      >
        이전
      </PageButton>

      {getPageNumbers().map((page, index) =>
        typeof page === "number" ? (
          <PageButton
            key={page}
            onClick={() => onPageChange(page)}
            $active={page === currentPage}
          >
            {page + 1}
          </PageButton>
        ) : (
          <Ellipsis key={`ellipsis-${index}`}>...</Ellipsis>
        )
      )}

      <PageButton
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages - 1}
      >
        다음
      </PageButton>
    </Wrapper>
  );
};

export default AdminPagination;

const Wrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 6px;
  margin-top: 24px;
`;

const PageButton = styled.button<{ $active?: boolean }>`
  padding: 8px 14px;
  font-size: 13px;
  font-weight: 500;
  border: 1px solid
    ${({ theme, $active }) =>
      $active ? "transparent" : theme.app.border};
  border-radius: 8px;
  background: ${({ $active }) =>
    $active ? "linear-gradient(135deg, #667eea 0%, #764ba2 100%)" : "transparent"};
  color: ${({ theme, $active }) =>
    $active ? "#fff" : theme.app.text.main};
  cursor: pointer;
  transition: all 0.2s;

  &:hover:not(:disabled):not([class*="active"]) {
    background: ${({ theme }) => theme.app.bg.gray1};
    border-color: ${({ theme }) => theme.app.border};
  }

  &:disabled {
    opacity: 0.4;
    cursor: not-allowed;
  }
`;

const Ellipsis = styled.span`
  padding: 8px 4px;
  color: ${({ theme }) => theme.app.text.light2};
  font-size: 13px;
`;
