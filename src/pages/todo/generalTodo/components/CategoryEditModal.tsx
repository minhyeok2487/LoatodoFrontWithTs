import { useEffect, useMemo, useRef, useState } from "react";
import styled from "styled-components";
import { toast } from "react-toastify";

import Button from "@components/Button";
import Modal from "@components/Modal";
import {
  useDeleteGeneralTodoCategory,
  useUpdateGeneralTodoCategory,
} from "@core/hooks/mutations/generalTodo";
import type {
  FolderWithCategories,
  GeneralTodoCategory,
  ViewMode,
} from "@core/types/generalTodo";

const COLOR_PALETTE = [
  "#F87171",
  "#FB923C",
  "#FACC15",
  "#34D399",
  "#60A5FA",
  "#A78BFA",
  "#F472B6",
];

interface CategoryEditModalProps {
  folder: FolderWithCategories | null;
  category: GeneralTodoCategory | null;
  isOpen: boolean;
  onClose: () => void;
  onUpdated: () => void;
}

const CategoryEditModal = ({
  folder,
  category,
  isOpen,
  onClose,
  onUpdated,
}: CategoryEditModalProps) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const updateCategory = useUpdateGeneralTodoCategory();
  const deleteCategory = useDeleteGeneralTodoCategory();
  const [name, setName] = useState("");
  const [color, setColor] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>("LIST");

  useEffect(() => {
    if (!isOpen || !category) {
      setName("");
      setColor(null);
      setViewMode("LIST");
      return undefined;
    }

    setName(category.name);
    setColor(category.color ?? null);
    setViewMode(category.viewMode);

    const timer = window.setTimeout(() => {
      inputRef.current?.select();
    }, 80);

    return () => window.clearTimeout(timer);
  }, [category, isOpen]);

  const trimmedName = useMemo(() => name.trim(), [name]);
  const normalizedColor =
    color && /^#[0-9a-fA-F]{3,6}$/.test(color)
      ? color.length === 4
        ? `#${[...color.slice(1)].map((char) => `${char}${char}`).join("")}`
        : color.toUpperCase()
      : color;
  const isUnchanged =
    category &&
    trimmedName === category.name &&
    (normalizedColor ?? null) === (category.color ?? null) &&
    viewMode === category.viewMode;
  const isSubmitDisabled =
    !category ||
    !trimmedName ||
    isUnchanged ||
    updateCategory.isPending ||
    deleteCategory.isPending;

  const handleClose = () => {
    if (updateCategory.isPending || deleteCategory.isPending) {
      return;
    }
    onClose();
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!category || !trimmedName) {
      toast.warn("카테고리 이름을 입력해 주세요.");
      return;
    }

    updateCategory.mutate(
      {
        categoryId: category.id,
        name: trimmedName,
        color: normalizedColor || null,
        viewMode,
      },
      {
        onSuccess: () => {
          toast.success("카테고리를 수정했어요.");
          onUpdated();
          onClose();
        },
        onError: () => {
          toast.error("카테고리를 수정하지 못했어요. 잠시 후 다시 시도해 주세요.");
        },
      }
    );
  };

  const handleDelete = () => {
    if (!category) {
      return;
    }

    if (
      window.confirm(
        `"${category.name}" 카테고리를 삭제하면 포함된 할 일도 함께 삭제돼요. 계속할까요?`
      )
    ) {
      deleteCategory.mutate(category.id, {
        onSuccess: () => {
          toast.success("카테고리를 삭제했어요.");
          onUpdated();
          onClose();
        },
        onError: () => {
          toast.error("카테고리를 삭제하지 못했어요. 잠시 후 다시 시도해 주세요.");
        },
      });
    }
  };

  if (!folder || !category) {
    return null;
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title={`"${folder.name}" 카테고리 수정`}
    >
      <Form onSubmit={handleSubmit}>
        <Field>
          <FieldLabel id="general-category-edit-name-label">
            카테고리 이름
          </FieldLabel>
          <TextInput
            id="general-category-edit-name"
            ref={inputRef}
            placeholder="카테고리 이름"
            maxLength={60}
            value={name}
            onChange={(event) => setName(event.target.value)}
            disabled={updateCategory.isPending || deleteCategory.isPending}
            aria-labelledby="general-category-edit-name-label"
          />
        </Field>

        <Field>
          <FieldLabel>표시 색상</FieldLabel>
          <ColorSwatches>
            {COLOR_PALETTE.map((swatch) => (
              <ColorSwatchButton
                key={swatch}
                type="button"
                $color={swatch}
                $active={normalizedColor === swatch}
                onClick={() => setColor(swatch)}
                disabled={updateCategory.isPending || deleteCategory.isPending}
                aria-label={`${swatch} 색상 선택`}
              />
            ))}
            <ClearColorButton
              type="button"
              onClick={() => setColor(null)}
              disabled={updateCategory.isPending || deleteCategory.isPending}
            >
              색상 없음
            </ClearColorButton>
          </ColorSwatches>
          <ColorPickerRow>
            <ColorInput
              type="color"
              value={normalizedColor ?? COLOR_PALETTE[0]}
              onChange={(event) => setColor(event.target.value)}
              disabled={updateCategory.isPending || deleteCategory.isPending}
              aria-label="카테고리 색상 선택"
            />
            <ColorHexInput
              value={color ?? ""}
              onChange={(event) => {
                const value = event.target.value.trim();
                if (!value) {
                  setColor(null);
                  return;
                }
                const next = value.startsWith("#") ? value : `#${value}`;
                setColor(next);
              }}
              disabled={updateCategory.isPending || deleteCategory.isPending}
              maxLength={7}
            />
          </ColorPickerRow>
        </Field>

        <Field>
          <FieldLabel>보기 방식</FieldLabel>
          <ViewModeGroup>
            <label htmlFor="edit-category-view-list">
              <input
                id="edit-category-view-list"
                type="radio"
                name="edit-category-view-mode"
                value="LIST"
                checked={viewMode === "LIST"}
                onChange={() => setViewMode("LIST")}
                disabled={updateCategory.isPending || deleteCategory.isPending}
              />
              리스트
            </label>
            <label htmlFor="edit-category-view-kanban">
              <input
                id="edit-category-view-kanban"
                type="radio"
                name="edit-category-view-mode"
                value="KANBAN"
                checked={viewMode === "KANBAN"}
                onChange={() => setViewMode("KANBAN")}
                disabled={updateCategory.isPending || deleteCategory.isPending}
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
            disabled={updateCategory.isPending || deleteCategory.isPending}
          >
            취소
          </Button>
          <Button
            type="button"
            variant="outlined"
            size="large"
            onClick={handleDelete}
            disabled={deleteCategory.isPending || updateCategory.isPending}
          >
            삭제
          </Button>
          <Button type="submit" size="large" disabled={isSubmitDisabled}>
            저장
          </Button>
        </ActionRow>
      </Form>
    </Modal>
  );
};

export default CategoryEditModal;

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

const ColorSwatches = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
`;

const ColorSwatchButton = styled.button<{ $color: string; $active: boolean }>`
  width: 28px;
  height: 28px;
  border-radius: 8px;
  border: 2px solid
    ${({ theme, $active }) =>
      $active ? theme.app.text.dark1 : theme.app.border};
  background: ${({ $color }) => $color};
  cursor: pointer;

  &:disabled {
    cursor: not-allowed;
    opacity: 0.5;
  }
`;

const ClearColorButton = styled.button`
  border: 1px solid ${({ theme }) => theme.app.border};
  border-radius: 6px;
  padding: 4px 8px;
  background: transparent;
  font-size: 12px;
  cursor: pointer;

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
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
