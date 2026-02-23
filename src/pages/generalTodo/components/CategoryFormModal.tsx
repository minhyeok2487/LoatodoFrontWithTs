import { useEffect, useMemo, useRef, useState } from "react";
import { toast } from "react-toastify";
import styled from "styled-components";

import { useCreateGeneralTodoCategory } from "@core/hooks/mutations/generalTodo";
import type { FolderWithCategories, ViewMode } from "@core/types/generalTodo";
import { normalizeColorInput } from "@core/utils/color";

import Button from "@components/Button";
import Modal from "@components/Modal";
import {
  FormLayout,
  FormField,
  FormFieldLabel,
  FormTextInput,
  FormActionRow,
} from "@components/form/FormPrimitives";
import ColorPickerField from "./ColorPickerField";

interface CategoryFormModalProps {
  folder: FolderWithCategories | null;
  isOpen: boolean;
  onClose: () => void;
  onCreated: () => void;
}

const CategoryFormModal = ({
  folder,
  isOpen,
  onClose,
  onCreated,
}: CategoryFormModalProps) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const createCategory = useCreateGeneralTodoCategory();
  const [name, setName] = useState("");
  const [color, setColor] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>("LIST");

  useEffect(() => {
    if (!isOpen || !folder) {
      setName("");
      setColor(null);
      setViewMode("LIST");
      return undefined;
    }

    setName("");
    setColor(null);
    setViewMode("LIST");

    const timer = window.setTimeout(() => {
      inputRef.current?.focus();
    }, 80);

    return () => window.clearTimeout(timer);
  }, [folder, isOpen]);

  const trimmedName = useMemo(() => name.trim(), [name]);
  const normalizedColor = useMemo(() => normalizeColorInput(color), [color]);
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
        color: normalizedColor || null,
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
      <FormLayout onSubmit={handleSubmit}>
        <FormField>
          <FormFieldLabel id="general-category-name-label">
            카테고리 이름
          </FormFieldLabel>
          <FormTextInput
            id="general-category-name"
            ref={inputRef}
            placeholder="예: 이번 주 우선 작업"
            maxLength={60}
            value={name}
            onChange={(event) => setName(event.target.value)}
            disabled={createCategory.isPending}
            aria-labelledby="general-category-name-label"
          />
        </FormField>

        <ColorPickerField
          normalizedColor={normalizedColor}
          rawColor={color}
          onColorChange={setColor}
          disabled={createCategory.isPending}
        />

        <FormField>
          <FormFieldLabel>보기 방식</FormFieldLabel>
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
            <label htmlFor="category-view-timeline">
              <input
                id="category-view-timeline"
                type="radio"
                name="category-view-mode"
                value="TIMELINE"
                checked={viewMode === "TIMELINE"}
                onChange={() => setViewMode("TIMELINE")}
                disabled={createCategory.isPending}
              />
              타임라인
            </label>
          </ViewModeGroup>
        </FormField>

        <FormActionRow>
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
        </FormActionRow>
      </FormLayout>
    </Modal>
  );
};

export default CategoryFormModal;

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
