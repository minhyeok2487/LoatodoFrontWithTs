import styled from "styled-components";

import { PlaceholderMessage, SectionTitle } from "./styles";
import type { GeneralTodoFolder, GeneralTodoItem } from "./types";
import MarkdownEditor from "./MarkdownEditor";

interface Props {
  todo: GeneralTodoItem | null;
  folders: GeneralTodoFolder[];
  editTitle: string;
  editDescription: string;
  editDueDate: string;
  editDueTime: string;
  editCompleted: boolean;
  onTitleChange: (value: string) => void;
  onDescriptionChange: (value: string) => void;
  onDueDateChange: (value: string) => void;
  onDueTimeChange: (value: string) => void;
  onCompletedChange: (value: boolean) => void;
  onSave: () => void;
  isDirty: boolean;
  error: string | null;
}

const GeneralTodoDetail = ({
  todo,
  folders,
  editTitle,
  editDescription,
  editDueDate,
  editDueTime,
  editCompleted,
  onTitleChange,
  onDescriptionChange,
  onDueDateChange,
  onDueTimeChange,
  onCompletedChange,
  onSave,
  isDirty,
  error,
}: Props) => {
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

  const isSaveDisabled = !isDirty || editTitle.trim().length === 0;

  return (
    <DetailContainer>
      <SectionTitle>상세 내용</SectionTitle>
      <DetailCard>
        <InfoRow>
          <span>폴더: {folderName}</span>
          <span>카테고리: {categoryName}</span>
          <CompletedToggle htmlFor="detail-completed">
            <HiddenCheckbox
              id="detail-completed"
              type="checkbox"
              checked={editCompleted}
              onChange={(event) => onCompletedChange(event.target.checked)}
            />
            <CustomCheckbox $checked={editCompleted}>
              <Mark $checked={editCompleted}>✓</Mark>
              <span>완료</span>
            </CustomCheckbox>
          </CompletedToggle>
        </InfoRow>

        <FieldGroup>
          <Field>
            <FieldLabel htmlFor="detail-title">제목</FieldLabel>
            <FieldInput
              id="detail-title"
              value={editTitle}
              onChange={(event) => onTitleChange(event.target.value)}
              placeholder="할 일 제목을 입력하세요"
            />
          </Field>

          <Field>
            <FieldLabel htmlFor="detail-due-date">마감일 (선택)</FieldLabel>
            <FieldInput
              id="detail-due-date"
              type="date"
              value={editDueDate}
              onChange={(event) => onDueDateChange(event.target.value)}
            />
            {editDueDate && (
              <>
                <SubFieldLabel htmlFor="detail-due-time">
                  마감 시간 (선택)
                </SubFieldLabel>
                <FieldInput
                  id="detail-due-time"
                  type="time"
                  value={editDueTime}
                  onChange={(event) => onDueTimeChange(event.target.value)}
                />
              </>
            )}
          </Field>
        </FieldGroup>

        <Field>
          <FieldLabel htmlFor="detail-description">메모</FieldLabel>
          <EditorContainer id="detail-description">
            <MarkdownEditor
              value={editDescription}
              onChange={onDescriptionChange}
              height="320px"
              placeholder="할 일에 대한 메모를 Markdown으로 작성해보세요"
            />
          </EditorContainer>
        </Field>

        {error && <ErrorMessage>{error}</ErrorMessage>}

        <ButtonRow>
          <SaveButton
            type="button"
            disabled={isSaveDisabled}
            $isDisabled={isSaveDisabled}
            onClick={onSave}
          >
            저장
          </SaveButton>
        </ButtonRow>
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
  gap: 16px;
  padding: 16px;
  border-radius: 6px;
  border: 1px solid ${({ theme }) => theme.app.bg.gray2};
  background: ${({ theme }) => theme.app.bg.white};
  min-height: 300px;
`;

const InfoRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  font-size: 13px;
  color: ${({ theme }) => theme.app.text.light1};

  ${({ theme }) => theme.medias.max600} {
    flex-direction: column;
    align-items: flex-start;
  }
`;

const FieldGroup = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 12px;

  ${({ theme }) => theme.medias.max600} {
    grid-template-columns: 1fr;
  }
`;

const Field = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

const FieldLabel = styled.label`
  font-size: 13px;
  font-weight: 600;
  color: ${({ theme }) => theme.app.text.main};
`;

const SubFieldLabel = styled.label`
  font-size: 12px;
  font-weight: 500;
  color: ${({ theme }) => theme.app.text.light1};
`;

const FieldInput = styled.input`
  width: 100%;
  padding: 10px 12px;
  border-radius: 6px;
  border: 1px solid ${({ theme }) => theme.app.border};
  background: ${({ theme }) => theme.app.bg.white};
  color: ${({ theme }) => theme.app.text.main};
`;

const EditorContainer = styled.div`
  .tiptap-editor-root {
    border: 1px solid ${({ theme }) => theme.app.border};
    border-radius: 8px;
    background: ${({ theme }) => theme.app.bg.white};
  }
`;

const ButtonRow = styled.div`
  display: flex;
  justify-content: flex-end;
`;

const SaveButton = styled.button<{ $isDisabled: boolean }>`
  padding: 10px 18px;
  border-radius: 6px;
  border: none;
  background: ${({ theme, $isDisabled }) =>
    $isDisabled ? theme.app.bg.gray1 : theme.app.bg.gray2};
  color: ${({ theme }) => theme.app.text.main};
  font-weight: 600;
  cursor: ${({ $isDisabled }) => ($isDisabled ? "not-allowed" : "pointer")};
  transition: background 0.2s ease;

  &:hover {
    background: ${({ theme, $isDisabled }) =>
      $isDisabled ? theme.app.bg.gray1 : theme.app.bg.gray1};
  }
`;

const ErrorMessage = styled.p`
  margin: 0;
  font-size: 12px;
  color: ${({ theme }) => theme.app.text.red};
`;

const CompletedToggle = styled.label`
  position: relative;
  display: inline-flex;
  align-items: center;
`;

const HiddenCheckbox = styled.input`
  position: absolute;
  opacity: 0;
  pointer-events: none;
`;

const CustomCheckbox = styled.span<{ $checked: boolean }>`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  border-radius: 999px;
  border: 1px solid
    ${({ theme, $checked }) =>
      $checked ? theme.app.bg.gray2 : theme.app.border};
  background: ${({ theme, $checked }) =>
    $checked ? theme.app.bg.gray1 : theme.app.bg.white};
  color: ${({ theme }) => theme.app.text.main};
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s ease, border 0.2s ease, opacity 0.2s ease;
  user-select: none;
`;

const Mark = styled.span<{ $checked: boolean }>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 18px;
  height: 18px;
  border-radius: 4px;
  border: 1px solid
    ${({ theme, $checked }) =>
      $checked ? theme.app.bg.gray2 : theme.app.border};
  background: ${({ theme, $checked }) =>
    $checked ? theme.app.bg.gray2 : theme.app.bg.white};
  color: ${({ theme, $checked }) =>
    $checked ? theme.app.text.main : theme.app.text.light1};
  font-size: 12px;
  line-height: 1;
`;
