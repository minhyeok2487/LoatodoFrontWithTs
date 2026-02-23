import { useEffect, useMemo, useRef, useState } from "react";
import { toast } from "react-toastify";
import styled from "styled-components";

import { useCreateGeneralTodoFolder } from "@core/hooks/mutations/generalTodo";

import Button from "@components/Button";
import Modal from "@components/Modal";
import {
  FormLayout,
  FormField,
  FormFieldLabel,
  FormTextInput,
  FormFieldMeta,
  FormActionRow,
} from "@components/form/FormPrimitives";

interface FolderFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  nextSortOrder: number;
  onCreated: () => void;
}

const MAX_FOLDER_NAME_LENGTH = 100;

const FolderFormModal = ({
  isOpen,
  onClose,
  nextSortOrder,
  onCreated,
}: FolderFormModalProps) => {
  const [name, setName] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const createFolder = useCreateGeneralTodoFolder();

  useEffect(() => {
    if (!isOpen) {
      setName("");
      return undefined;
    }

    const timer = window.setTimeout(() => {
      inputRef.current?.focus();
    }, 80);

    return () => {
      window.clearTimeout(timer);
    };
  }, [isOpen]);

  const trimmedName = useMemo(() => name.trim(), [name]);
  const isSubmitDisabled = !trimmedName || createFolder.isPending;

  const handleClose = () => {
    if (createFolder.isPending) {
      return;
    }
    onClose();
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!trimmedName) {
      toast.warn("폴더 이름을 입력해 주세요.");
      return;
    }

    createFolder.mutate(
      {
        name: trimmedName,
        sortOrder: nextSortOrder,
      },
      {
        onSuccess: () => {
          toast.success("폴더를 생성했어요.");
          onCreated();
          onClose();
        },
      }
    );
  };

  const folderNameLabelId = "general-folder-name-label";

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="폴더 생성">
      <FormLayout onSubmit={handleSubmit}>
        <FormField>
          <FormFieldLabel id={folderNameLabelId}>폴더 이름</FormFieldLabel>
          <FormTextInput
            id="general-folder-name"
            ref={inputRef}
            maxLength={MAX_FOLDER_NAME_LENGTH}
            placeholder="예: 일일 숙제"
            value={name}
            onChange={(event) => setName(event.target.value)}
            disabled={createFolder.isPending}
            aria-labelledby={folderNameLabelId}
          />
          <FormFieldMeta>
            <span>최대 100자까지 입력할 수 있어요.</span>
            <span>
              {name.length} / {MAX_FOLDER_NAME_LENGTH}
            </span>
          </FormFieldMeta>
        </FormField>

        <OrderHint>
          새 폴더는 정렬 순서 {nextSortOrder + 1}번째 위치에 추가돼요.
        </OrderHint>

        <FormActionRow>
          <Button
            type="button"
            variant="outlined"
            size="large"
            onClick={handleClose}
            disabled={createFolder.isPending}
          >
            취소
          </Button>
          <Button
            type="submit"
            size="large"
            disabled={isSubmitDisabled}
            ariaLabel="폴더 생성"
          >
            {createFolder.isPending ? "생성 중..." : "폴더 생성"}
          </Button>
        </FormActionRow>
      </FormLayout>
    </Modal>
  );
};

export default FolderFormModal;

const OrderHint = styled.p`
  margin: 0;
  font-size: 13px;
  color: ${({ theme }) => theme.app.text.light1};
  background: ${({ theme }) => theme.app.bg.gray1};
  border: 1px dashed ${({ theme }) => theme.app.border};
  border-radius: 10px;
  padding: 10px 12px;
`;
