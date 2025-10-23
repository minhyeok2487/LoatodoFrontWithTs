import styled from "styled-components";

import { PlaceholderMessage, SectionTitle } from "./styles";
import type { GeneralTodoFolder, GeneralTodoItem } from "./types";

interface Props {
  todo: GeneralTodoItem | null;
  folders: GeneralTodoFolder[];
}

const GeneralTodoDetail = ({ todo, folders }: Props) => {
  if (!todo) {
    return (
      <DetailContainer>
        <SectionTitle>상세 내용</SectionTitle>
        <PlaceholderMessage>
          목록에서 할 일을 선택하면 상세 정보가 여기에 표시됩니다.
        </PlaceholderMessage>
      </DetailContainer>
    );
  }

  const folder = folders.find((folderItem) => folderItem.id === todo.folderId);
  const folderName = folder?.name ?? "미분류";
  const categoryName =
    folder?.categories.find((category) => category.id === todo.categoryId)
      ?.name ?? "미분류";
  const formattedDueDate = (() => {
    if (!todo.dueDate) {
      return null;
    }

    const parsed = new Date(todo.dueDate);
    return Number.isNaN(parsed.getTime())
      ? todo.dueDate
      : parsed.toLocaleDateString();
  })();

  return (
    <DetailContainer>
      <SectionTitle>상세 내용</SectionTitle>
      <DetailCard>
        <DetailTitle>{todo.title}</DetailTitle>
        <DetailMeta>
          폴더: {folderName} · 카테고리: {categoryName}
          {formattedDueDate ? ` · 마감일: ${formattedDueDate}` : ""}
        </DetailMeta>
        <DetailBody>{todo.description}</DetailBody>
      </DetailCard>
    </DetailContainer>
  );
};

export default GeneralTodoDetail;

const DetailContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const DetailCard = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 12px;
  border-radius: 6px;
  border: 1px solid ${({ theme }) => theme.app.bg.gray2};
  background: ${({ theme }) => theme.app.bg.gray1};
`;

const DetailTitle = styled.h4`
  margin: 0;
  font-size: 18px;
  font-weight: 700;
  color: ${({ theme }) => theme.app.text.main};
`;

const DetailMeta = styled.p`
  margin: 0;
  font-size: 13px;
  color: ${({ theme }) => theme.app.text.light1};
`;

const DetailBody = styled.p`
  margin: 0;
  font-size: 14px;
  line-height: 1.5;
  color: ${({ theme }) => theme.app.text.main};
`;
