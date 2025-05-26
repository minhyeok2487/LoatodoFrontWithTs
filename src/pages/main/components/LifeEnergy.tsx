import type { FC } from "react";
import styled from "styled-components";

import useMyInformation from "@core/hooks/queries/member/useMyInformation";
import useModalState from "@core/hooks/useModalState";

import LifeEnergyAddCharacter from "@components/LifeEnergyAddCharacter";
import Modal from "@components/Modal";

import BoxTitle from "./BoxTitle";
import BoxWrapper from "./BoxWrapper";

const MainProfit: FC = () => {
  const { data: member } = useMyInformation();
  const [modalState, setModalState] = useModalState<string>();

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
        <OpenModalButton onClick={() => setModalState("캐릭터 추가")}>
          캐릭터 추가
        </OpenModalButton>
      </HeaderContainer>

      {hasLifeEnergyData ? (
        member.lifeEnergyResponses.map((lifeEnergy) => (
          <GaugeBox key={lifeEnergy.lifeEnergyId}>
            <GagueTitle>
              <strong>{lifeEnergy.characterName}</strong> {lifeEnergy.energy} /{" "}
              {lifeEnergy.maxEnergy}
            </GagueTitle>
            <Gauge
              $process={(lifeEnergy.energy / lifeEnergy.maxEnergy) * 100}
              $type="daily"
            >
              <span>
                <em>
                  {((lifeEnergy.energy / lifeEnergy.maxEnergy) * 100).toFixed(
                    1
                  )}{" "}
                  %
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
    </BoxWrapper>
  );
};

export default MainProfit;

// 새로운 스타일 컴포넌트 추가: 제목과 버튼을 감싸는 컨테이너
const HeaderContainer = styled.div`
  display: flex;
  justify-content: space-between; /* 제목과 버튼을 양 끝으로 정렬 */
  align-items: center; /* 세로 중앙 정렬 */
  width: 100%;
`;

// 새로운 스타일 컴포넌트 추가: 모달 열기 버튼
const OpenModalButton = styled.button`
  background-color: ${({ theme }) => theme.app.bg.gray1};
  color: ${({ theme }) => theme.app.text.light1}; /* 텍스트 색상 변경 */
  border: none;
  padding: 8px 12px;
  border-radius: 8px;
  cursor: pointer;
  font-size: 14px;
  font-weight: bold;
  transition: background-color 0.2s ease-in-out;

  &:hover {
    background-color: ${({ theme }) => theme.app.bg.main};
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
  justify-content: space-between;
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
