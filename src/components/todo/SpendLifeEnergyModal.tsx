import type { FC } from "react";
import { useState } from "react";
import { toast } from "react-toastify";
import styled from "styled-components";

// Reusing styles
import { useSpendLifeEnergy } from "@core/hooks/mutations/lifeEnergy.mutations";
import queryClient from "@core/lib/queryClient";
import queryKeyGenerator from "@core/utils/queryKeyGenerator";

import Button from "@components/Button";
import {
  InputField,
  InputGroup,
  InputLabel,
} from "@components/LifeEnergyAddCharacter";
import Modal from "@components/Modal";

interface SpendLifeEnergyModalProps {
  isOpen: boolean;
  onClose: () => void;
  lifeEnergyId: number;
  characterName: string;
  currentEnergy: number;
}

const SpendLifeEnergyModal: FC<SpendLifeEnergyModalProps> = ({
  isOpen,
  onClose,
  lifeEnergyId,
  characterName,
  currentEnergy,
}) => {
  const [remainingEnergy, setRemainingEnergy] = useState<number | string>("");
  const [gold, setGold] = useState<number | string>("");

  const spendLifeEnergyMutation = useSpendLifeEnergy({
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeyGenerator.getMyInformation(),
      });
      queryClient.invalidateQueries({
        queryKey: queryKeyGenerator.getLogsProfit(),
      });
      toast.success("생활의 기운이 성공적으로 소모되었습니다.");
      onClose();
    },
    onError: (error) => {
      toast.error(`생활의 기운 소모에 실패했습니다`);
      // eslint-disable-next-line no-console
      console.error("생활의 기운 소모 오류:", error);
    },
  });

  const handleSubmit = () => {
    const parsedRemainingEnergy =
      typeof remainingEnergy === "string"
        ? parseInt(remainingEnergy, 10)
        : remainingEnergy;
    const parsedEnergy = currentEnergy - parsedRemainingEnergy;
    const parsedGold = typeof gold === "string" ? parseInt(gold, 10) : gold;

    if (
      Number.isNaN(parsedRemainingEnergy) ||
      Number.isNaN(parsedGold) ||
      parsedRemainingEnergy < 0
    ) {
      toast.error("유효한 기운과 골드 값을 입력해주세요.");
      return;
    }

    if (parsedRemainingEnergy > currentEnergy) {
      toast.error("남은 기운은 현재 기운보다 클 수 없습니다.");
      return;
    }

    spendLifeEnergyMutation.mutate({
      id: lifeEnergyId,
      energy: parsedEnergy,
      gold: parsedGold,
      characterName,
    });
  };

  return (
    <Modal title="생활의 기운 소모" isOpen={isOpen} onClose={onClose}>
      <FormContainer>
        <InputGroup>
          <InputLabel>캐릭터 이름</InputLabel>
          <InputField type="text" value={characterName} readOnly disabled />
        </InputGroup>
        <InputGroup>
          <InputLabel>현재 기운</InputLabel>
          <InputField type="text" value={currentEnergy} readOnly disabled />
        </InputGroup>
        <InputGroup>
          <InputLabel>남은 기운</InputLabel>
          <InputField
            type="number"
            value={remainingEnergy}
            onChange={(e) => setRemainingEnergy(e.target.value)}
            placeholder="남은 기운"
          />
        </InputGroup>
        <InputGroup>
          <InputLabel>획득 골드</InputLabel>
          <InputField
            type="number"
            value={gold}
            onChange={(e) => setGold(e.target.value)}
            placeholder="획득 골드"
          />
        </InputGroup>
        <SubmitButton onClick={handleSubmit}>소모하기</SubmitButton>
      </FormContainer>
    </Modal>
  );
};

export default SpendLifeEnergyModal;

const FormContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 15px;
  padding: 10px 0;
`;

const SubmitButton = styled(Button)`
  margin-top: 20px;
  width: 100%;
  background-color: #00ff99;
  color: ${({ theme }) => theme.app.text.dark2};

  &:hover {
    background-color: #00e68a;
  }
`;
