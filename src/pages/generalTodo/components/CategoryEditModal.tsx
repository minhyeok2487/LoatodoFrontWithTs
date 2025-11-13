import { useEffect, useMemo, useRef, useState } from "react";
import styled from "styled-components";
import { toast } from "react-toastify";

import Button from "@components/Button";
import Modal from "@components/Modal";
import {
  useCreateGeneralTodoStatus,
  useDeleteGeneralTodoCategory,
  useDeleteGeneralTodoStatus,
  useReorderGeneralTodoStatuses,
  useUpdateGeneralTodoCategory,
  useUpdateGeneralTodoStatus,
} from "@core/hooks/mutations/generalTodo";
import type {
  FolderWithCategories,
  GeneralTodoCategory,
  GeneralTodoStatus,
  ViewMode,
} from "@core/types/generalTodo";
import { normalizeColorInput } from "@core/utils/color";

const COLOR_PALETTE = [
  "#F87171",
  "#FB923C",
  "#FACC15",
  "#34D399",
  "#60A5FA",
  "#A78BFA",
  "#F472B6",
];
const DEFAULT_PICKER_COLOR = "#C5C6D0";

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
  const createStatus = useCreateGeneralTodoStatus();
  const updateStatus = useUpdateGeneralTodoStatus();
  const deleteStatus = useDeleteGeneralTodoStatus();
  const reorderStatuses = useReorderGeneralTodoStatuses();
  const [name, setName] = useState("");
  const [color, setColor] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>("LIST");
  const [statusList, setStatusList] = useState<GeneralTodoStatus[]>([]);
  const [statusDrafts, setStatusDrafts] = useState<Record<number, string>>({});
  const [newStatusName, setNewStatusName] = useState("");

  useEffect(() => {
    if (!isOpen || !category) {
      setName("");
      setColor(null);
      setViewMode("LIST");
      setStatusList([]);
      setStatusDrafts({});
      setNewStatusName("");
      return undefined;
    }

    setName(category.name);
    setColor(category.color ?? null);
    setViewMode(category.viewMode);
    const sortedStatuses = [...(category.statuses ?? [])].sort(
      (a, b) => a.sortOrder - b.sortOrder
    );
    setStatusList(sortedStatuses);
    setStatusDrafts(
      sortedStatuses.reduce<Record<number, string>>((acc, status) => {
        acc[status.id] = status.name;
        return acc;
      }, {})
    );
    setNewStatusName("");

    const timer = window.setTimeout(() => {
      inputRef.current?.select();
    }, 80);

    return () => window.clearTimeout(timer);
  }, [category, isOpen]);

  const trimmedName = useMemo(() => name.trim(), [name]);
  const normalizedColor = useMemo(
    () => normalizeColorInput(color),
    [color]
  );
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
    if (
      updateCategory.isPending ||
      deleteCategory.isPending ||
      createStatus.isPending ||
      updateStatus.isPending ||
      deleteStatus.isPending ||
      reorderStatuses.isPending
    ) {
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

    const apiColor = normalizedColor ?? "#FFFFFF";

    updateCategory.mutate(
      {
        categoryId: category.id,
        name: trimmedName,
        color: apiColor,
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

  const handleStatusNameChange = (statusId: number, nextName: string) => {
    setStatusDrafts((prev) => ({ ...prev, [statusId]: nextName }));
  };

  const handleStatusNameSave = (statusId: number) => {
    if (!category) {
      return;
    }
    const draftName = (statusDrafts[statusId] ?? "").trim();
    const originalName =
      statusList.find((status) => status.id === statusId)?.name ?? "";
    if (!draftName) {
      toast.warn("상태 이름을 입력해 주세요.");
      return;
    }
    if (draftName === originalName) {
      return;
    }
    updateStatus.mutate(
      { categoryId: category.id, statusId, name: draftName },
      {
        onSuccess: () => {
          toast.success("상태 이름을 수정했어요.");
          setStatusList((prev) =>
            prev.map((status) =>
              status.id === statusId ? { ...status, name: draftName } : status
            )
          );
          onUpdated();
        },
        onError: () => {
          toast.error(
            "상태 이름을 수정하지 못했어요. 잠시 후 다시 시도해 주세요."
          );
          setStatusDrafts((prev) => ({ ...prev, [statusId]: originalName }));
        },
      }
    );
  };

  const handleStatusAdd = () => {
    if (!category) {
      return;
    }
    const trimmed = newStatusName.trim();
    if (!trimmed) {
      toast.warn("추가할 상태 이름을 입력해 주세요.");
      return;
    }
    createStatus.mutate(
      {
        categoryId: category.id,
        name: trimmed,
        sortOrder: statusList.length,
      },
      {
        onSuccess: (created) => {
          toast.success("상태를 추가했어요.");
          setNewStatusName("");
          setStatusList((prev) => [...prev, created]);
          setStatusDrafts((prev) => ({ ...prev, [created.id]: created.name }));
          onUpdated();
        },
        onError: () => {
          toast.error(
            "상태를 추가하지 못했어요. 잠시 후 다시 시도해 주세요."
          );
        },
      }
    );
  };

  const handleStatusDelete = (statusId: number) => {
    if (!category) {
      return;
    }
    if (statusList.length <= 1) {
      toast.warn("최소 1개의 상태가 필요해요.");
      return;
    }
    if (!window.confirm("해당 상태를 삭제할까요? 포함된 할 일이 없어야 해요.")) {
      return;
    }
    deleteStatus.mutate(
      { categoryId: category.id, statusId },
      {
        onSuccess: () => {
          toast.success("상태를 삭제했어요.");
          setStatusList((prev) =>
            prev.filter((status) => status.id !== statusId)
          );
          setStatusDrafts((prev) => {
            const next = { ...prev };
            delete next[statusId];
            return next;
          });
          onUpdated();
        },
        onError: () => {
          toast.error(
            "상태를 삭제하지 못했어요. 잠시 후 다시 시도해 주세요."
          );
        },
      }
    );
  };

  const handleMoveStatus = (statusId: number, direction: "up" | "down") => {
    if (!category || statusList.length < 2) {
      return;
    }
    const currentIndex = statusList.findIndex(
      (status) => status.id === statusId
    );
    if (currentIndex < 0) {
      return;
    }
    const targetIndex =
      direction === "up" ? currentIndex - 1 : currentIndex + 1;
    if (targetIndex < 0 || targetIndex >= statusList.length) {
      return;
    }
    const previousOrder = statusList;
    const nextOrder = [...statusList];
    const [removed] = nextOrder.splice(currentIndex, 1);
    nextOrder.splice(targetIndex, 0, removed);
    setStatusList(nextOrder);
    reorderStatuses.mutate(
      {
        categoryId: category.id,
        statusIds: nextOrder.map((status) => status.id),
      },
      {
        onSuccess: () => {
          toast.success("상태 순서를 변경했어요.");
          onUpdated();
        },
        onError: () => {
          toast.error(
            "상태 순서를 변경하지 못했어요. 잠시 후 다시 시도해 주세요."
          );
          setStatusList(previousOrder);
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

  const isCategoryMutationPending =
    updateCategory.isPending || deleteCategory.isPending;
  const canDeleteStatus = statusList.length > 1;

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
          <ColorStatus>
            현재 선택: {normalizedColor ?? "없음"}
          </ColorStatus>
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
              value={normalizedColor ?? DEFAULT_PICKER_COLOR}
              onChange={(event) => setColor(event.target.value.toUpperCase())}
              disabled={updateCategory.isPending || deleteCategory.isPending}
              aria-label="카테고리 색상 선택"
              $isEmpty={!normalizedColor}
            />
            <ColorHexInput
              value={color ?? ""}
              onChange={(event) => {
                const raw = event.target.value.toUpperCase();
                const sanitized = raw.replace(/[^0-9A-F#]/g, "");
                if (!sanitized.replace("#", "")) {
                  setColor(null);
                  return;
                }
                const prefixed = sanitized.startsWith("#")
                  ? `#${sanitized.slice(1, 7)}`
                  : `#${sanitized.slice(0, 6)}`;
                setColor(prefixed);
              }}
              disabled={updateCategory.isPending || deleteCategory.isPending}
              maxLength={7}
              placeholder="#FFFFFF"
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

        <Field>
          <FieldLabel>칸반 상태</FieldLabel>
          <StatusHelper>
            최소 1개의 상태가 필요해요. 상태를 추가하면 칸반 보드의 컬럼으로
            표시돼요.
          </StatusHelper>
          <StatusList>
            {statusList.map((status, index) => {
              const draftName = statusDrafts[status.id] ?? status.name;
              const isNameChanged = draftName.trim() !== status.name;
              const isFirst = index === 0;
              const isLast = index === statusList.length - 1;
              return (
                <StatusRow key={status.id}>
                  <StatusOrder>{index + 1}</StatusOrder>
                  <StatusNameInput
                    value={draftName}
                    onChange={(event) =>
                      handleStatusNameChange(status.id, event.target.value)
                    }
                    disabled={isCategoryMutationPending || updateStatus.isPending}
                    placeholder="예: 진행 중"
                  />
                  <StatusActions>
                    <StatusActionButton
                      type="button"
                      onClick={() => handleMoveStatus(status.id, "up")}
                      disabled={
                        isCategoryMutationPending ||
                        reorderStatuses.isPending ||
                        isFirst
                      }
                      aria-label={`${status.name} 위로 이동`}
                    >
                      ↑
                    </StatusActionButton>
                    <StatusActionButton
                      type="button"
                      onClick={() => handleMoveStatus(status.id, "down")}
                      disabled={
                        isCategoryMutationPending ||
                        reorderStatuses.isPending ||
                        isLast
                      }
                      aria-label={`${status.name} 아래로 이동`}
                    >
                      ↓
                    </StatusActionButton>
                    <StatusActionButton
                      type="button"
                      onClick={() => handleStatusNameSave(status.id)}
                      disabled={
                        isCategoryMutationPending ||
                        updateStatus.isPending ||
                        !isNameChanged ||
                        !draftName.trim()
                      }
                    >
                      이름 저장
                    </StatusActionButton>
                    <StatusActionButton
                      type="button"
                      onClick={() => handleStatusDelete(status.id)}
                      disabled={
                        isCategoryMutationPending ||
                        deleteStatus.isPending ||
                        !canDeleteStatus
                      }
                      $variant="danger"
                    >
                      삭제
                    </StatusActionButton>
                  </StatusActions>
                </StatusRow>
              );
            })}
          </StatusList>
          {statusList.length === 0 && (
            <StatusHelper>등록된 상태가 없어요. 새 상태를 추가해 주세요.</StatusHelper>
          )}
          <StatusAddRow>
            <StatusNameInput
              value={newStatusName}
              onChange={(event) => setNewStatusName(event.target.value)}
              placeholder="예: 검토 중"
              disabled={isCategoryMutationPending || createStatus.isPending}
            />
            <StatusActionButton
              type="button"
              onClick={handleStatusAdd}
              disabled={
                isCategoryMutationPending ||
                createStatus.isPending ||
                !newStatusName.trim()
              }
            >
              상태 추가
            </StatusActionButton>
          </StatusAddRow>
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

const ColorInput = styled.input<{ $isEmpty: boolean }>`
  width: 44px;
  height: 44px;
  border: none;
  padding: 0;
  background: ${({ $isEmpty }) =>
    $isEmpty
      ? "repeating-linear-gradient(45deg, #d1d5db 0, #d1d5db 4px, transparent 4px, transparent 8px)"
      : "transparent"};
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

const ColorStatus = styled.p`
  margin: 4px 0;
  font-size: 12px;
  color: ${({ theme }) => theme.app.text.light1};
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

const StatusHelper = styled.p`
  font-size: 12px;
  color: ${({ theme }) => theme.app.text.light1};
  margin: 0;
`;

const StatusList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const StatusRow = styled.div`
  display: flex;
  gap: 8px;
  align-items: center;
  flex-wrap: wrap;
`;

const StatusOrder = styled.span`
  width: 28px;
  text-align: center;
  font-size: 12px;
  font-weight: 600;
  color: ${({ theme }) => theme.app.text.light1};
`;

const StatusNameInput = styled.input`
  flex: 1;
  min-width: 140px;
  border: 1px solid ${({ theme }) => theme.app.border};
  border-radius: 8px;
  padding: 8px 10px;
  font-size: 13px;
  color: ${({ theme }) => theme.app.text.dark1};
  background: ${({ theme }) => theme.app.bg.white};

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  &::placeholder {
    color: ${({ theme }) => theme.app.text.light1};
  }
`;

const StatusActions = styled.div`
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
`;

const StatusActionButton = styled.button<{ $variant?: "default" | "danger" }>`
  border: 1px solid
    ${({ theme, $variant }) =>
      $variant === "danger" ? theme.app.text.red : theme.app.border};
  border-radius: 6px;
  padding: 6px 10px;
  background: ${({ theme }) => theme.app.bg.white};
  color: ${({ theme, $variant }) =>
    $variant === "danger" ? theme.app.text.red : theme.app.text.dark1};
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const StatusAddRow = styled.div`
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  align-items: center;
`;
