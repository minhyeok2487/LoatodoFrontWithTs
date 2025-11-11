import { useEffect, useMemo, useRef, useState } from "react";
import { toast } from "react-toastify";
import styled from "styled-components";

import { useCreateGeneralTodoFolder } from "@core/hooks/mutations/generalTodo";

import Button from "@components/Button";
import Modal from "@components/Modal";

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

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="폴더 생성">
      <Form onSubmit={handleSubmit}>
        <Field>
          <FieldLabel htmlFor="general-folder-name">폴더 이름</FieldLabel>
          <Input
            id="general-folder-name"
            ref={inputRef}
            maxLength={MAX_FOLDER_NAME_LENGTH}
            placeholder="예: 일일 숙제"
            value={name}
            onChange={(event) => setName(event.target.value)}
            disabled={createFolder.isPending}
          />
          <FieldMeta>
            <span>최대 100자까지 입력할 수 있어요.</span>
            <span>
              {name.length} / {MAX_FOLDER_NAME_LENGTH}
            </span>
          </FieldMeta>
        </Field>

        <OrderHint>
          새 폴더는 정렬 순서 {nextSortOrder + 1}번째 위치에 추가돼요.
        </OrderHint>

        <ActionRow>
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
        </ActionRow>
      </Form>
    </Modal>
  );
};

export default FolderFormModal;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const FieldLabel = styled.label`
  font-size: 14px;
  font-weight: 600;
  color: ${({ theme }) => theme.app.text.dark1};
`;

const Field = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;

  label {
    font-size: 14px;
    font-weight: 600;
    color: ${({ theme }) => theme.app.text.dark1};
  }
`;

const Input = styled.input`
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

const FieldMeta = styled.div`
  display: flex;
  justify-content: space-between;
  font-size: 12px;
  color: ${({ theme }) => theme.app.text.light1};
`;

const OrderHint = styled.p`
  margin: 0;
  font-size: 13px;
  color: ${({ theme }) => theme.app.text.light1};
  background: ${({ theme }) => theme.app.bg.gray1};
  border: 1px dashed ${({ theme }) => theme.app.border};
  border-radius: 10px;
  padding: 10px 12px;
`;

const ActionRow = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 12px;
`;
