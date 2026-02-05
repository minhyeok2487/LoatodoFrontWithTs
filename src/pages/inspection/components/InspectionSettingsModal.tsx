import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import styled from "styled-components";

import useDeleteInspectionCharacter from "@core/hooks/mutations/inspection/useDeleteInspectionCharacter";
import useUpdateInspectionCharacter from "@core/hooks/mutations/inspection/useUpdateInspectionCharacter";
import type { InspectionCharacter } from "@core/types/inspection";
import queryKeyGenerator from "@core/utils/queryKeyGenerator";

import Button from "@components/Button";
import Modal from "@components/Modal";

interface Props {
  isOpen: boolean;
  character: InspectionCharacter;
  onClose: () => void;
  onSuccess: () => void;
}

const InspectionSettingsModal = ({
  isOpen,
  character,
  onClose,
  onSuccess,
}: Props) => {
  const queryClient = useQueryClient();
  const [noChangeThreshold, setNoChangeThreshold] = useState(
    character.noChangeThreshold
  );
  const [isActive, setIsActive] = useState(character.isActive);
  const [confirmDelete, setConfirmDelete] = useState(false);

  const updateCharacter = useUpdateInspectionCharacter({
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeyGenerator.getInspectionCharacters(),
      });
      toast.success("설정이 저장되었습니다.");
      onSuccess();
      onClose();
    },
  });

  const deleteCharacter = useDeleteInspectionCharacter({
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeyGenerator.getInspectionCharacters(),
      });
      toast.success("캐릭터가 삭제되었습니다.");
      onSuccess();
      onClose();
    },
  });

  const handleSave = () => {
    updateCharacter.mutate({
      inspectionCharacterId: character.id,
      request: { noChangeThreshold, isActive },
    });
  };

  const handleDelete = () => {
    if (!confirmDelete) {
      setConfirmDelete(true);
      return;
    }
    deleteCharacter.mutate(character.id);
  };

  return (
    <Modal
      title={`${character.characterName} 설정`}
      isOpen={isOpen}
      onClose={onClose}
    >
      <Form>
        <FieldGroup>
          <Label>무변동 알림 기준 (일)</Label>
          <Input
            type="number"
            min={1}
            max={30}
            value={noChangeThreshold}
            onChange={(e) => setNoChangeThreshold(Number(e.target.value))}
          />
        </FieldGroup>

        <FieldGroup>
          <Label>데이터 수집</Label>
          <ToggleRow>
            <span>{isActive ? "활성" : "비활성"}</span>
            <ToggleButton
              type="button"
              $isActive={isActive}
              onClick={() => setIsActive(!isActive)}
            >
              <ToggleThumb $isActive={isActive} />
            </ToggleButton>
          </ToggleRow>
        </FieldGroup>

        <ButtonGroup>
          <Button
            variant="contained"
            onClick={handleSave}
            disabled={updateCharacter.isPending}
          >
            저장
          </Button>
          <Button variant="outlined" onClick={onClose}>
            취소
          </Button>
        </ButtonGroup>

        <Divider />

        <DangerZone>
          <Button
            variant="outlined"
            color="#dc2626"
            onClick={handleDelete}
            disabled={deleteCharacter.isPending}
          >
            {confirmDelete ? "정말 삭제하시겠습니까?" : "캐릭터 삭제"}
          </Button>
        </DangerZone>
      </Form>
    </Modal>
  );
};

export default InspectionSettingsModal;

const Form = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  min-width: 300px;

  ${({ theme }) => theme.medias.max500} {
    min-width: unset;
  }
`;

const FieldGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

const Label = styled.label`
  font-size: 14px;
  font-weight: 600;
  color: ${({ theme }) => theme.app.text.dark2};
`;

const Input = styled.input`
  padding: 10px 14px;
  font-size: 14px;
  border: 1px solid ${({ theme }) => theme.app.border};
  border-radius: 8px;
  background: ${({ theme }) => theme.app.bg.white};
  color: ${({ theme }) => theme.app.text.main};

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.app.text.light1};
  }
`;

const ToggleRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 14px;
  color: ${({ theme }) => theme.app.text.main};
`;

const ToggleButton = styled.button<{ $isActive: boolean }>`
  position: relative;
  width: 44px;
  height: 24px;
  border-radius: 12px;
  background: ${({ $isActive }) => ($isActive ? "#16a34a" : "#d1d5db")};
  transition: background 0.2s;
`;

const ToggleThumb = styled.span<{ $isActive: boolean }>`
  position: absolute;
  top: 2px;
  left: ${({ $isActive }) => ($isActive ? "22px" : "2px")};
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: white;
  transition: left 0.2s;
`;

const ButtonGroup = styled.div`
  display: flex;
  justify-content: center;
  gap: 10px;
`;

const Divider = styled.hr`
  border: none;
  border-top: 1px solid ${({ theme }) => theme.app.border};
`;

const DangerZone = styled.div`
  display: flex;
  justify-content: center;
`;
