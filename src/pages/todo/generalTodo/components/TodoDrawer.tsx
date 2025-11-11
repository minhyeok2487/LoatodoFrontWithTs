import { MdClose } from "@react-icons/all-files/md/MdClose";
import styled, { css, keyframes } from "styled-components";

import Button from "@components/Button";

import type {
  DraftTodo,
  FolderWithCategories,
  GeneralTodoCategory,
} from "@core/types/generalTodo";

interface TodoDrawerProps {
  open: boolean;
  selectedFolder: FolderWithCategories | null;
  draftCategory: GeneralTodoCategory | null;
  categories: GeneralTodoCategory[];
  draft: DraftTodo;
  onChangeDraft: (next: Partial<DraftTodo>) => void;
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
  onClose: () => void;
  isSubmitDisabled: boolean;
}

const TodoDrawer = ({
  open,
  selectedFolder,
  draftCategory,
  categories,
  draft,
  onChangeDraft,
  onSubmit,
  onClose,
  isSubmitDisabled,
}: TodoDrawerProps) => {
  if (!open) {
    return null;
  }

  return (
    <>
      <Overlay onClick={onClose} />
      <Panel role="dialog" aria-modal="true" aria-label="할 일 추가">
        <Header>
          <div>
            <Title>할 일 추가</Title>
            {selectedFolder && (
              <Subtitle>
                {selectedFolder.name}
                {draftCategory ? ` · ${draftCategory.name}` : ""}
              </Subtitle>
            )}
          </div>

          <CloseButton type="button" aria-label="닫기" onClick={onClose}>
            <MdClose />
          </CloseButton>
        </Header>

        <Form onSubmit={onSubmit}>
          <FieldGroup>
            <FieldLabel id="todo-title-label">제목</FieldLabel>
            <TextInput
              id="todo-title"
              aria-labelledby="todo-title-label"
              placeholder="예: 오늘 해야 할 일"
              value={draft.title}
              onChange={(event) =>
                onChangeDraft({ title: event.target.value })
              }
            />
          </FieldGroup>

          <FieldGroup>
            <FieldLabel id="todo-category-label">카테고리</FieldLabel>
            <Select
              id="todo-category"
              aria-labelledby="todo-category-label"
              value={draft.categoryId ?? ""}
              onChange={(event) =>
                onChangeDraft({ categoryId: Number(event.target.value) })
              }
              disabled={categories.length === 0}
            >
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </Select>
            {categories.length === 0 && (
              <FormNotice>
                이 폴더에는 카테고리가 없어요. 먼저 왼쪽에서 카테고리를
                만들어 주세요.
              </FormNotice>
            )}
          </FieldGroup>

          <FieldGroup>
            <FieldLabel id="todo-due-date-label">마감일</FieldLabel>
            <TextInput
              id="todo-due-date"
              type="datetime-local"
              aria-labelledby="todo-due-date-label"
              value={draft.dueDate}
              onChange={(event) =>
                onChangeDraft({ dueDate: event.target.value })
              }
            />
          </FieldGroup>

          <FieldGroup>
            <FieldLabel id="todo-description-label">세부 내용</FieldLabel>
            <Textarea
              id="todo-description"
              aria-labelledby="todo-description-label"
              rows={4}
              placeholder="세부 내용을 적어보세요."
              value={draft.description}
              onChange={(event) =>
                onChangeDraft({ description: event.target.value })
              }
            />
          </FieldGroup>

          <Footer>
            <Button variant="outlined" size="large" type="button" onClick={onClose}>
              취소
            </Button>
            <Button type="submit" size="large" disabled={isSubmitDisabled}>
              저장
            </Button>
          </Footer>
        </Form>
      </Panel>
    </>
  );
};

export default TodoDrawer;

const fadeIn = keyframes`
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
`;

const slideIn = keyframes`
  from {
    transform: translateX(100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
`;

const Overlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.4);
  z-index: 10;
  animation: ${fadeIn} 0.2s ease;
`;

const Panel = styled.div`
  position: fixed;
  top: 0;
  right: 0;
  width: min(420px, 90vw);
  height: 100vh;
  background: ${({ theme }) => theme.app.bg.white};
  border-left: 1px solid ${({ theme }) => theme.app.border};
  box-shadow: -10px 0 30px rgba(0, 0, 0, 0.15);
  z-index: 11;
  display: flex;
  flex-direction: column;
  padding: 32px;
  gap: 20px;
  animation: ${slideIn} 0.25s ease;

  ${({ theme }) => theme.medias.max600} {
    width: 100vw;
    padding: 24px 20px;
  }
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 16px;
`;

const Title = styled.h3`
  font-size: 18px;
  font-weight: 700;
  color: ${({ theme }) => theme.app.text.dark1};
`;

const Subtitle = styled.p`
  font-size: 13px;
  color: ${({ theme }) => theme.app.text.light1};
  margin-top: 4px;
`;

const CloseButton = styled.button`
  border: 1px solid ${({ theme }) => theme.app.border};
  border-radius: 50%;
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${({ theme }) => theme.app.bg.white};
`;

const Form = styled.form`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const Footer = styled.div`
  margin-top: auto;
  display: flex;
  justify-content: flex-end;
  gap: 12px;
`;

const FieldGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

const FieldLabel = styled.span`
  font-size: 13px;
  font-weight: 600;
  color: ${({ theme }) => theme.app.text.dark1};
`;

const FormNotice = styled.p`
  font-size: 12px;
  color: ${({ theme }) => theme.app.text.light1};
`;

const textFieldCss = css`
  width: 100%;
  border: 1px solid ${({ theme }) => theme.app.border};
  border-radius: 10px;
  background: ${({ theme }) => theme.app.bg.white};
  padding: 10px 12px;
  font-size: 14px;
  color: ${({ theme }) => theme.app.text.main};

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.app.palette.blue[350]};
    border-color: transparent;
  }

  &::placeholder {
    color: ${({ theme }) => theme.app.text.light1};
  }
`;

const TextInput = styled.input`
  ${textFieldCss};
`;

const Select = styled.select`
  ${textFieldCss};
  appearance: none;
`;

const Textarea = styled.textarea`
  ${textFieldCss};
  resize: vertical;
`;
