import React from "react";
import { useSearchParams } from "react-router-dom";
import styled from "styled-components";

interface Props {
  totalPages: number;
}

const Pagination: React.FC<Props> = ({ totalPages }) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const currentPage = parseInt(searchParams.get("page") || "1", 10);

  const handlePageClick = (page: number) => {
    searchParams.set("page", page.toString());
    setSearchParams(searchParams);
  };

  const renderPageButtons = () => {
    const pageNumbers: JSX.Element[] = [];

    if (totalPages <= 10) {
      for (let i = 1; i <= totalPages; i += 1) {
        pageNumbers.push(
          <PageButton
            key={i}
            type="button"
            role="link"
            $isActive={currentPage === i}
            onClick={() => handlePageClick(i)}
          >
            {i}
          </PageButton>
        );
      }
    } else if (currentPage < 6) {
      for (let i = 1; i <= 10; i += 1) {
        pageNumbers.push(
          <PageButton
            key={i}
            type="button"
            role="link"
            $isActive={currentPage === i}
            onClick={() => handlePageClick(i)}
          >
            {i}
          </PageButton>
        );
      }
    } else {
      let lastPage = currentPage + 4;
      if (lastPage > totalPages) {
        lastPage = totalPages;
      }
      for (let i = currentPage - 5; i <= lastPage; i += 1) {
        pageNumbers.push(
          <PageButton
            key={i}
            $isActive={currentPage === i}
            type="button"
            onClick={() => handlePageClick(i)}
            role="link"
          >
            {i}
          </PageButton>
        );
      }
    }

    return pageNumbers;
  };

  return (
    <Wrapper aria-label="페이지네이션">
      <ActionButton type="button" onClick={() => handlePageClick(1)}>
        처음
      </ActionButton>
      {currentPage > 1 && (
        <ActionButton
          type="button"
          onClick={() => handlePageClick(currentPage - 1)}
        >
          이전
        </ActionButton>
      )}

      {renderPageButtons()}

      {currentPage < totalPages && (
        <ActionButton
          type="button"
          onClick={() => handlePageClick(currentPage + 1)}
        >
          다음
        </ActionButton>
      )}

      <ActionButton type="button" onClick={() => handlePageClick(totalPages)}>
        마지막
      </ActionButton>
    </Wrapper>
  );
};

export default Pagination;

const Wrapper = styled.div`
  margin: 20px 0 20px;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  gap: 8px;

  ${({ theme }) => theme.medias.max900} {
    flex-wrap: wrap;
  }
`;

const Button = styled.button`
  padding: 8px 12px;
  height: 40px;
  font-size: 16px;
  border: 1px solid ${({ theme }) => theme.app.border};
  background: ${({ theme }) => theme.app.bg.white};
  color: ${({ theme }) => theme.app.text.dark2};
  transition:
    background 0.3s,
    color 0.3s;

  &:hover {
    background: ${({ theme }) => theme.app.palette.gray[800]};
    color: ${({ theme }) => theme.app.palette.gray[0]};
  }

  ${({ theme }) => theme.medias.max900} {
    height: 30px;
    padding: 3px 5px;
  }
`;

const ActionButton = styled(Button)`
  border-radius: 10px;
`;

const PageButton = styled(Button)<{ $isActive: boolean }>`
  padding: 0;
  width: 40px;
  border-radius: 50%;
  white-space: nowrap;

  ${({ theme, $isActive }) =>
    $isActive &&
    ` background: ${theme.app.palette.gray[800]};
      color: ${theme.app.palette.gray[0]};
    `}

  ${({ theme }) => theme.medias.max900} {
    border-radius: 10px;
    width: unset;
    min-width: 30px;
  }
`;
