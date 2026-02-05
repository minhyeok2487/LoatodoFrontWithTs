import { useState } from "react";
import styled from "styled-components";

import useCreateInspectionCharacter from "@core/hooks/mutations/inspection/useCreateInspectionCharacter";

import Button from "@components/Button";
import Modal from "@components/Modal";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const AddCharacterModal = ({ isOpen, onClose, onSuccess }: Props) => {
  const [characterName, setCharacterName] = useState("");
  const [noChangeThreshold, setNoChangeThreshold] = useState(3);

  const createCharacter = useCreateInspectionCharacter({
    onSuccess: () => {
      setCharacterName("");
      setNoChangeThreshold(3);
      onSuccess();
      onClose();
    },
  });

  const handleSubmit = () => {
    const trimmedName = characterName.trim();
    if (!trimmedName) return;

    createCharacter.mutate({
      characterName: trimmedName,
      noChangeThreshold,
    });
  };

  return (
    <Modal title="캐릭터 등록" isOpen={isOpen} onClose={onClose}>
      <Form
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmit();
        }}
      >
        <FieldGroup>
          <Label>캐릭터 이름</Label>
          <Input
            type="text"
            placeholder="캐릭터 이름을 입력해주세요"
            value={characterName}
            onChange={(e) => setCharacterName(e.target.value)}
            autoFocus
          />
        </FieldGroup>

        <FieldGroup>
          <Label>무변동 알림 기준 (일)</Label>
          <Description>
            전투력이 설정한 기간 동안 변동이 없으면 알림을 보냅니다.
          </Description>
          <Input
            type="number"
            min={1}
            max={30}
            value={noChangeThreshold}
            onChange={(e) => setNoChangeThreshold(Number(e.target.value))}
          />
        </FieldGroup>

        <ButtonGroup>
          <Button
            variant="contained"
            onClick={handleSubmit}
            disabled={!characterName.trim() || createCharacter.isPending}
          >
            {createCharacter.isPending ? "등록 중..." : "등록"}
          </Button>
          <Button variant="outlined" onClick={onClose}>
            취소
          </Button>
        </ButtonGroup>
      </Form>
    </Modal>
  );
};

export default AddCharacterModal;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 20px;
  min-width: 320px;

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

const Description = styled.p`
  font-size: 12px;
  color: ${({ theme }) => theme.app.text.light2};
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

const ButtonGroup = styled.div`
  display: flex;
  justify-content: center;
  gap: 10px;
  margin-top: 4px;
`;
