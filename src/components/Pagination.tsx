import styled from "@emotion/styled";
import React from "react";
import { useLocation, useNavigate } from "react-router-dom";

interface Props {
  totalPages: number;
}

const Pagination: React.FC<Props> = ({ totalPages }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(location.search);
  const page = parseInt(queryParams.get("page") || "1", 10);

  const handlePageClick = (page: number) => {
    queryParams.set("page", page.toString());
    navigate({ search: queryParams.toString() });
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
            isActive={page === i}
            onClick={() => handlePageClick(i)}
          >
            {i}
          </PageButton>
        );
      }
    } else if (page < 6) {
      for (let i = 1; i <= 10; i += 1) {
        pageNumbers.push(
          <PageButton
            key={i}
            type="button"
            role="link"
            isActive={page === i}
            onClick={() => handlePageClick(i)}
          >
            {i}
          </PageButton>
        );
      }
    } else {
      let lastPage = page + 4;
      if (lastPage > totalPages) {
        lastPage = totalPages;
      }
      for (let i = page - 5; i <= lastPage; i += 1) {
        pageNumbers.push(
          <PageButton
            key={i}
            isActive={page === i}
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
      {page > 1 && (
        <ActionButton type="button" onClick={() => handlePageClick(page - 1)}>
          이전
        </ActionButton>
      )}

      {renderPageButtons()}

      {page < totalPages && (
        <ActionButton type="button" onClick={() => handlePageClick(page + 1)}>
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
  margin: 20px 0 60px;
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
  background: ${({ theme }) => theme.app.bg.light};
  color: ${({ theme }) => theme.app.text.dark2};
  transition:
    background 0.3s,
    color 0.3s;

  &:hover {
    background: ${({ theme }) => theme.app.semiBlack1};
    color: ${({ theme }) => theme.app.white};
  }

  ${({ theme }) => theme.medias.max900} {
    height: 30px;
    padding: 3px 5px;
  }
`;

const ActionButton = styled(Button)<{ disabled?: boolean }>`
  border-radius: 10px;
`;

const PageButton = styled(Button)<{ isActive: boolean }>`
  padding: 0;
  width: 40px;
  border-radius: 50%;
  white-space: nowrap;

  ${({ theme, isActive }) =>
    isActive &&
    ` background: ${theme.app.semiBlack1};
      color: ${theme.app.white};
    `}

  ${({ theme }) => theme.medias.max900} {
    border-radius: 10px;
    width: unset;
    min-width: 30px;
  }
`;
