import { useEffect, useMemo, useRef, useState } from "react";
import styled from "styled-components";
import { toast } from "react-toastify";

import Button from "@components/Button";
import Modal from "@components/Modal";
import { useUpdateGeneralTodoFolder } from "@core/hooks/mutations/generalTodo";
import type { GeneralTodoFolder } from "@core/types/generalTodo";

interface FolderRenameModalProps {
  folder: GeneralTodoFolder | null;
  isOpen: boolean;
  onClose: () => void;
  onUpdated: () => void;
}

const MAX_FOLDER_NAME_LENGTH = 100;

const FolderRenameModal = ({
  folder,
  isOpen,
  onClose,
  onUpdated,
}: FolderRenameModalProps) => {
  const [name, setName] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const updateFolder = useUpdateGeneralTodoFolder();

  useEffect(() => {
    if (!isOpen || !folder) {
      setName("");
      return undefined;
    }

    setName(folder.name);

    const timer = window.setTimeout(() => {
      inputRef.current?.select();
    }, 80);

    return () => window.clearTimeout(timer);
  }, [folder, isOpen]);

  const trimmedName = useMemo(() => name.trim(), [name]);
  const isSubmitDisabled =
    !folder ||
    !trimmedName ||
    trimmedName === folder.name.trim() ||
    updateFolder.isPending;

  if (!folder) {
    return null;
  }

  const handleClose = () => {
    if (updateFolder.isPending) {
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

    updateFolder.mutate(
      { folderId: folder.id, name: trimmedName },
      {
        onSuccess: () => {
          toast.success("폴더 이름을 변경했어요.");
          onUpdated();
          onClose();
        },
        onError: () => {
          toast.error("폴더 이름을 변경하지 못했어요. 잠시 후 다시 시도해 주세요.");
        },
      }
    );
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="폴더 이름 수정">
      <Form onSubmit={handleSubmit}>
        <Field>
          <FieldLabel id="general-folder-rename-label">
            새로운 폴더 이름
          </FieldLabel>
          <Input
            id="general-folder-rename"
            ref={inputRef}
            maxLength={MAX_FOLDER_NAME_LENGTH}
            placeholder="새로운 폴더 이름을 입력해 주세요."
            value={name}
            onChange={(event) => setName(event.target.value)}
            disabled={updateFolder.isPending}
            aria-labelledby="general-folder-rename-label"
          />
          <FieldMeta>
            <span>최대 100자까지 입력할 수 있어요.</span>
            <span>
              {name.length} / {MAX_FOLDER_NAME_LENGTH}
            </span>
          </FieldMeta>
        </Field>

        <ActionRow>
          <Button
            type="button"
            variant="outlined"
            size="large"
            onClick={handleClose}
            disabled={updateFolder.isPending}
          >
            취소
          </Button>
          <Button type="submit" size="large" disabled={isSubmitDisabled}>
            이름 변경
          </Button>
        </ActionRow>
      </Form>
    </Modal>
  );
};

export default FolderRenameModal;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 20px;
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

const ActionRow = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 12px;
`;
