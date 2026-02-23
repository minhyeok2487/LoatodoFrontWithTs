import { useEffect, useMemo, useRef, useState } from "react";
import { toast } from "react-toastify";

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
      <FormLayout onSubmit={handleSubmit}>
        <FormField>
          <FormFieldLabel id="general-folder-rename-label">
            새로운 폴더 이름
          </FormFieldLabel>
          <FormTextInput
            id="general-folder-rename"
            ref={inputRef}
            maxLength={MAX_FOLDER_NAME_LENGTH}
            placeholder="새로운 폴더 이름을 입력해 주세요."
            value={name}
            onChange={(event) => setName(event.target.value)}
            disabled={updateFolder.isPending}
            aria-labelledby="general-folder-rename-label"
          />
          <FormFieldMeta>
            <span>최대 100자까지 입력할 수 있어요.</span>
            <span>
              {name.length} / {MAX_FOLDER_NAME_LENGTH}
            </span>
          </FormFieldMeta>
        </FormField>

        <FormActionRow>
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
        </FormActionRow>
      </FormLayout>
    </Modal>
  );
};

export default FolderRenameModal;
