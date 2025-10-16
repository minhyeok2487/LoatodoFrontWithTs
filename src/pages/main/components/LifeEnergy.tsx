import type { FC } from "react";
import { toast } from "react-toastify";
import styled from "styled-components";

import { useRemoveLifeEnergy } from "@core/hooks/mutations/lifeEnergy.mutations";
import useMyInformation from "@core/hooks/queries/member/useMyInformation";
import useModalState from "@core/hooks/useModalState";
import queryClient from "@core/lib/queryClient";
import queryKeyGenerator from "@core/utils/queryKeyGenerator";

import Button from "@components/Button";
import LifeEnergyAddCharacter from "@components/LifeEnergyAddCharacter";
import Modal from "@components/Modal";
import SpendLifeEnergyModal from "@components/todo/SpendLifeEnergyModal";

import BoxTitle from "./BoxTitle";
import BoxWrapper from "./BoxWrapper";

const MainProfit: FC = () => {
  const { data: member } = useMyInformation();
  const [modalState, setModalState] = useModalState<string>();
  const [spendModalState, setSpendModalState] = useModalState<{
    lifeEnergyId: number;
    characterName: string;
    currentEnergy: number;
  }>();

  const removeLifeEnergyMutation = useRemoveLifeEnergy({
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeyGenerator.getMyInformation(),
      });
      toast.success("생활의 기운이 성공적으로 삭제되었습니다.");
    },
    onError: (error) => {
      toast.error(`생활의 기운 삭제에 실패했습니다`);
      console.error("생활의 기운 삭제 오류:", error);
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
        member.lifeEnergyResponses.map((lifeEnergy) => (
          <GaugeBox key={lifeEnergy.lifeEnergyId}>
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
              $process={(lifeEnergy.energy / lifeEnergy.maxEnergy) * 100}
              $type="daily"
            >
              <span>
                <em>
                  {lifeEnergy.energy} / {lifeEnergy.maxEnergy} (
                  {((lifeEnergy.energy / lifeEnergy.maxEnergy) * 100).toFixed(
                    1
                  )}
                  %)
                </em>
              </span>
            </Gauge>
          </GaugeBox>
        ))
      ) : (
        <NoDataMessage>
          <p>데이터가 없습니다.</p>{" "}
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

  ${({ theme }) => theme.medias.max900} {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }
`;

const GaugeBox = styled.div`
  display: flex;
  flex-direction: column;
  margin-top: 16px;
  width: 100%;

  & + & {
    margin-top: 14px;
  }
`;

const GagueTitle = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  color: ${({ theme }) => theme.app.text.light1};

  strong {
  }

  span {
    color: ${({ theme }) => theme.app.text.main};

    em {
      color: ${({ theme }) => theme.app.text.light2};
      font-weight: 400;
    }
  }
`;

const Gauge = styled.div<{ $process: number; $type: "daily" | "weekly" }>`
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
    background: ${({ $type, theme }) => {
      switch ($type) {
        case "daily":
          return theme.app.gauge.blue;
        case "weekly":
          return theme.app.gauge.red;
        default:
          return theme.app.palette.gray[0];
      }
    }};
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

// 데이터가 없을 때 표시할 스타일 컴포넌트 추가
const NoDataMessage = styled.div`
  display: flex;
  flex-direction: column; /* 자식 요소를 세로로 정렬 */
  justify-content: center;
  align-items: center;
  padding: 20px;
  color: ${({ theme }) => theme.app.text.light1};
  font-size: 16px;
  margin-top: 20px;
  text-align: center; /* 내부 텍스트 중앙 정렬 */

  p {
    margin-bottom: 10px; /* "데이터가 없습니다."와 정보 텍스트 간 간격 */
  }
`;

// InfoText는 LifeEnergyAddCharacter 컴포넌트에서 정의된 것을 재사용하거나,
// 여기 MainProfit에서 사용할 새로운 InfoText를 정의할 수 있습니다.
// 여기서는 MainProfit에서 사용하기 위해 다시 정의합니다.
const InfoText = styled.p`
  font-size: 13px;
  color: ${({ theme }) => theme.app.text.light2};
  line-height: 1.4;
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
