import type { FC } from "react";
import { useCallback } from "react";
import { toast } from "react-toastify";
import styled from "styled-components";

import {
  useRemoveLifeEnergy,
  useUsePotion,
} from "@core/hooks/mutations/lifeEnergy.mutations";
import useMyInformation from "@core/hooks/queries/member/useMyInformation";
import useModalState from "@core/hooks/useModalState";
import queryClient from "@core/lib/queryClient";
import queryKeyGenerator from "@core/utils/queryKeyGenerator";
import type { LifePotionType } from "@core/types/member";

import Button from "@components/Button";
import LifeEnergyAddCharacter from "@components/LifeEnergyAddCharacter";
import Modal from "@components/Modal";
import SpendLifeEnergyModal from "@components/todo/SpendLifeEnergyModal";

import BoxTitle from "./BoxTitle";
import BoxWrapper from "./BoxWrapper";

const POTION_CONFIG = [
  { type: "LEAP" as LifePotionType, label: "도약", field: "potionLeap" as const },
  { type: "SMALL" as LifePotionType, label: "소", field: "potionSmall" as const },
  { type: "MEDIUM" as LifePotionType, label: "중", field: "potionMedium" as const },
  { type: "LARGE" as LifePotionType, label: "대", field: "potionLarge" as const },
];

const invalidateMyInfo = () => {
  queryClient.invalidateQueries({
    queryKey: queryKeyGenerator.getMyInformation(),
  });
};

const MainProfit: FC = () => {
  const { data: member } = useMyInformation();
  const [modalState, setModalState] = useModalState<string>();
  const [spendModalState, setSpendModalState] = useModalState<{
    lifeEnergyId: number;
    characterName: string;
    currentEnergy: number;
  }>();

  const usePotionMutation = useUsePotion({
    onSuccess: invalidateMyInfo,
    onError: (error: any) => {
      const message = error?.response?.data?.message || "물약 사용에 실패했습니다.";
      toast.error(message);
    },
  });

  const handleUsePotion = useCallback(
    (lifeEnergyId: number, type: LifePotionType) => {
      usePotionMutation.mutate({ lifeEnergyId, type });
    },
    [usePotionMutation]
  );

  const removeLifeEnergyMutation = useRemoveLifeEnergy({
    onSuccess: () => {
      invalidateMyInfo();
      toast.success("생활의 기운이 성공적으로 삭제되었습니다.");
    },
    onError: () => {
      toast.error("생활의 기운 삭제에 실패했습니다.");
    },
  });

  if (!member) {
    return null;
  }

  const hasLifeEnergyData =
    Array.isArray(member.lifeEnergyResponses) &&
    member.lifeEnergyResponses.length > 0;

  return (
    <BoxWrapper $flex={2}>
      <HeaderContainer>
        <BoxTitle>생활의 기운</BoxTitle>
        <InfoText style={{ textAlign: "center" }}>
          베아트리스 체크시 30분당 99, 미체크시 30분당 90 증가합니다.
        </InfoText>
        <Button variant="outlined" onClick={() => setModalState("캐릭터 관리")}>
          캐릭터 관리
        </Button>
      </HeaderContainer>

      {hasLifeEnergyData ? (
        member.lifeEnergyResponses.map((lifeEnergy) => {
          const availablePotions = POTION_CONFIG.filter(
            ({ field }) => lifeEnergy[field] > 0
          );

          return (
            <CharacterSection key={lifeEnergy.lifeEnergyId}>
              <GagueTitle>
                <strong>{lifeEnergy.characterName}</strong>
                <ButtonContainer>
                  <SpendButton
                    onClick={() =>
                      setSpendModalState({
                        lifeEnergyId: lifeEnergy.lifeEnergyId,
                        characterName: lifeEnergy.characterName,
                        currentEnergy: lifeEnergy.energy,
                      })
                    }
                  >
                    소모
                  </SpendButton>
                  <DeleteButton
                    onClick={() =>
                      removeLifeEnergyMutation.mutate(lifeEnergy.characterName)
                    }
                  >
                    삭제
                  </DeleteButton>
                </ButtonContainer>
              </GagueTitle>
              <Gauge
                $process={Math.min(
                  (lifeEnergy.energy / lifeEnergy.maxEnergy) * 100,
                  100
                )}
                $overflow={lifeEnergy.energy > lifeEnergy.maxEnergy}
              >
                <span>
                  <em>
                    {lifeEnergy.energy} / {lifeEnergy.maxEnergy} (
                    {((lifeEnergy.energy / lifeEnergy.maxEnergy) * 100).toFixed(1)}
                    %)
                  </em>
                </span>
              </Gauge>
              {availablePotions.length > 0 && (
                <PotionChips>
                  {availablePotions.map(({ type, label, field }) => (
                    <PotionChip key={type}>
                      <span>{label} {lifeEnergy[field]}개</span>
                      <ChipUseButton
                        onClick={() =>
                          handleUsePotion(lifeEnergy.lifeEnergyId, type)
                        }
                      >
                        소모
                      </ChipUseButton>
                    </PotionChip>
                  ))}
                </PotionChips>
              )}
            </CharacterSection>
          );
        })
      ) : (
        <NoDataMessage>
          <p>데이터가 없습니다.</p>
        </NoDataMessage>
      )}

      {modalState && (
        <Modal title={`${modalState}`} isOpen onClose={() => setModalState()}>
          <LifeEnergyAddCharacter />
        </Modal>
      )}
      {spendModalState && (
        <SpendLifeEnergyModal
          isOpen={!!spendModalState}
          onClose={() => setSpendModalState(undefined)}
          lifeEnergyId={spendModalState.lifeEnergyId}
          characterName={spendModalState.characterName}
          currentEnergy={spendModalState.currentEnergy}
        />
      )}
    </BoxWrapper>
  );
};

export default MainProfit;

const ButtonContainer = styled.div`
  display: flex;
  gap: 8px;
  margin-left: auto;
`;

const SpendButton = styled.button`
  background-color: #4caf50;
  color: #ffffff;
  border: none;
  padding: 4px 8px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 12px;
  font-weight: bold;
  transition: background-color 0.2s ease-in-out;

  &:hover {
    background-color: #45a049;
  }
`;

const HeaderContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;

  ${({ theme }) => theme.medias.max768} {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }
`;

const CharacterSection = styled.div`
  display: flex;
  flex-direction: column;
  margin-top: 16px;
  width: 100%;

  & + & {
    margin-top: 20px;
    padding-top: 16px;
    border-top: 1px solid ${({ theme }) => theme.app.border};
  }
`;

const GagueTitle = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  color: ${({ theme }) => theme.app.text.light1};

  span {
    color: ${({ theme }) => theme.app.text.main};

    em {
      color: ${({ theme }) => theme.app.text.light2};
      font-weight: 400;
    }
  }
`;

const Gauge = styled.div<{ $process: number; $overflow: boolean }>`
  position: relative;
  display: flex;
  justify-content: flex-start;
  margin-top: 8px;
  height: 20px;
  border-radius: 10px;

  background: ${({ theme }) => theme.app.bg.main};

  span {
    width: ${({ $process }) => $process}%;
    height: 100%;
    background: ${({ $overflow, theme }) =>
      $overflow ? theme.app.gauge.red : theme.app.gauge.blue};
    border-radius: 10px;

    em {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      color: ${({ theme }) => theme.app.text.dark2};
      font-size: 14px;
      line-height: 1;
    }
  }
`;

const NoDataMessage = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 20px;
  color: ${({ theme }) => theme.app.text.light1};
  font-size: 16px;
  margin-top: 20px;
  text-align: center;

  p {
    margin-bottom: 10px;
  }
`;

const InfoText = styled.p`
  font-size: 13px;
  color: ${({ theme }) => theme.app.text.light2};
  line-height: 1.4;
`;

const PotionChips = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-top: 8px;
`;

const PotionChip = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 3px 8px;
  border-radius: 12px;
  background: ${({ theme }) => theme.app.bg.gray1};
  border: 1px solid ${({ theme }) => theme.app.border};
  font-size: 12px;
  color: ${({ theme }) => theme.app.text.light2};
`;

const ChipUseButton = styled.button`
  font-size: 11px;
  font-weight: bold;
  padding: 1px 6px;
  border-radius: 4px;
  border: none;
  background-color: #4caf50;
  color: #ffffff;
  cursor: pointer;

  &:hover {
    background-color: #45a049;
  }
`;

const DeleteButton = styled.button`
  background-color: #ff4d4d;
  color: #ffffff;
  border: none;
  padding: 4px 8px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 12px;
  font-weight: bold;
  transition: background-color 0.2s ease-in-out;

  &:hover {
    background-color: #cc0000;
  }
`;
