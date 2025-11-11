import { useEffect, useMemo, useRef, useState } from "react";
import { toast } from "react-toastify";
import styled from "styled-components";

import { useCreateGeneralTodoCategory } from "@core/hooks/mutations/generalTodo";
import type { FolderWithCategories, ViewMode } from "@core/types/generalTodo";

import Button from "@components/Button";
import Modal from "@components/Modal";

interface CategoryFormModalProps {
  folder: FolderWithCategories | null;
  isOpen: boolean;
  onClose: () => void;
  onCreated: () => void;
}

const DEFAULT_COLOR = "#6366F1";

const CategoryFormModal = ({
  folder,
  isOpen,
  onClose,
  onCreated,
}: CategoryFormModalProps) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const createCategory = useCreateGeneralTodoCategory();
  const [name, setName] = useState("");
  const [color, setColor] = useState(DEFAULT_COLOR);
  const [viewMode, setViewMode] = useState<ViewMode>("LIST");

  useEffect(() => {
    if (!isOpen || !folder) {
      setName("");
      setColor(DEFAULT_COLOR);
      setViewMode("LIST");
      return undefined;
    }

    setName("");
    setColor(folder.categories[0]?.color ?? DEFAULT_COLOR);
    setViewMode("LIST");

    const timer = window.setTimeout(() => {
      inputRef.current?.focus();
    }, 80);

    return () => window.clearTimeout(timer);
  }, [folder, isOpen]);

  const trimmedName = useMemo(() => name.trim(), [name]);
  const isSubmitDisabled =
    !folder || !trimmedName || createCategory.isPending || !viewMode;

  const handleClose = () => {
    if (createCategory.isPending) {
      return;
    }
    onClose();
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!folder || !trimmedName) {
      toast.warn("카테고리 이름을 입력해 주세요.");
      return;
    }

    createCategory.mutate(
      {
        folderId: folder.id,
        name: trimmedName,
        color: color || null,
        viewMode,
        sortOrder: folder.categories.length,
      },
      {
        onSuccess: () => {
          toast.success("카테고리를 생성했어요.");
          onCreated();
          onClose();
        },
        onError: () => {
          toast.error(
            "카테고리를 생성하지 못했어요. 잠시 후 다시 시도해 주세요."
          );
        },
      }
    );
  };

  if (!folder) {
    return null;
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title={`"${folder.name}" 폴더에 카테고리 추가`}
    >
      <Form onSubmit={handleSubmit}>
        <Field>
          <FieldLabel id="general-category-name-label">
            카테고리 이름
          </FieldLabel>
          <TextInput
            id="general-category-name"
            ref={inputRef}
            placeholder="예: 이번 주 우선 작업"
            maxLength={60}
            value={name}
            onChange={(event) => setName(event.target.value)}
            disabled={createCategory.isPending}
            aria-labelledby="general-category-name-label"
          />
        </Field>

        <Field>
          <FieldLabel>표시 색상</FieldLabel>
          <ColorPickerRow>
            <ColorInput
              type="color"
              value={color}
              onChange={(event) => setColor(event.target.value)}
              disabled={createCategory.isPending}
              aria-label="카테고리 색상 선택"
            />
            <ColorHexInput
              value={color}
              onChange={(event) => setColor(event.target.value)}
              disabled={createCategory.isPending}
              maxLength={7}
            />
          </ColorPickerRow>
        </Field>

        <Field>
          <FieldLabel>보기 방식</FieldLabel>
          <ViewModeGroup>
            <label htmlFor="category-view-list">
              <input
                id="category-view-list"
                type="radio"
                name="category-view-mode"
                value="LIST"
                checked={viewMode === "LIST"}
                onChange={() => setViewMode("LIST")}
                disabled={createCategory.isPending}
              />
              리스트
            </label>
            <label htmlFor="category-view-kanban">
              <input
                id="category-view-kanban"
                type="radio"
                name="category-view-mode"
                value="KANBAN"
                checked={viewMode === "KANBAN"}
                onChange={() => setViewMode("KANBAN")}
                disabled={createCategory.isPending}
              />
              칸반
            </label>
          </ViewModeGroup>
        </Field>

        <ActionRow>
          <Button
            type="button"
            variant="outlined"
            size="large"
            onClick={handleClose}
            disabled={createCategory.isPending}
          >
            취소
          </Button>
          <Button type="submit" size="large" disabled={isSubmitDisabled}>
            카테고리 생성
          </Button>
        </ActionRow>
      </Form>
    </Modal>
  );
};

export default CategoryFormModal;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 18px;
`;

const Field = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const FieldLabel = styled.span`
  font-size: 14px;
  font-weight: 600;
  color: ${({ theme }) => theme.app.text.dark1};
`;

const TextInput = styled.input`
  border: 1px solid ${({ theme }) => theme.app.border};
  border-radius: 10px;
  padding: 12px;
  font-size: 14px;
  color: ${({ theme }) => theme.app.text.dark1};
  background: ${({ theme }) => theme.app.bg.white};

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const ColorPickerRow = styled.div`
  display: flex;
  gap: 12px;
  align-items: center;
`;

const ColorInput = styled.input`
  width: 44px;
  height: 44px;
  border: none;
  padding: 0;
  background: transparent;
  cursor: pointer;
`;

const ColorHexInput = styled.input`
  flex: 1;
  border: 1px solid ${({ theme }) => theme.app.border};
  border-radius: 10px;
  padding: 10px 12px;
  font-size: 14px;
  color: ${({ theme }) => theme.app.text.dark1};
  background: ${({ theme }) => theme.app.bg.white};
`;

const ViewModeGroup = styled.div`
  display: flex;
  gap: 12px;

  label {
    display: flex;
    gap: 6px;
    align-items: center;
    font-size: 13px;
    color: ${({ theme }) => theme.app.text.dark1};
  }
`;

const ActionRow = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 12px;
`;
