import { useEffect, useState } from "react";
import styled from "styled-components";

import DefaultLayout from "@layouts/DefaultLayout";

import CharacterSelectionModal from "@pages/cube/CharacterSelectionModal";
import CubeCard from "@pages/cube/CubeCard";
import CubeStatistics from "@pages/cube/CubeStatistics";

import useCubeCharacters from "@core/hooks/queries/cube/useCubeCharacters";
import useCubeStatistics from "@core/hooks/queries/cube/useCubeStatistics";
import type { CubeCharacter } from "@core/types/cube";

import Button from "@components/Button";

import CardExpIcon from "@assets/images/ico_card_exp.png";
import GoldIcon from "@assets/images/ico_gold.png";
import LeapStoneIcon from "@assets/images/ico_leap_stone.png";
import SilverIcon from "@assets/images/ico_silver.png";
import T3Aux1Icon from "@assets/images/ico_t3_aux1.png";
import T3Aux2Icon from "@assets/images/ico_t3_aux2.png";
import T3Aux3Icon from "@assets/images/ico_t3_aux3.png";

interface ExtendedCubeResponse extends CubeCharacter {
  gold?: number;
}

const CubeIndex = () => {
  const [cubes, setCubes] = useState<ExtendedCubeResponse[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [totalGold, setTotalGold] = useState<number>(0);

  const getCubeStatistics = useCubeStatistics();
  const getCubeCharacters = useCubeCharacters();

  const updateTotalGold = (cubeId: number, cubeGold: number) => {
    setCubes((prevCubes) =>
      prevCubes.map((cube) =>
        cube.cubeId === cubeId ? { ...cube, gold: cubeGold } : cube
      )
    );
  };

  useEffect(() => {
    const newTotalGold = cubes.reduce((sum, cube) => sum + (cube.gold || 0), 0);
    setTotalGold(newTotalGold);
  }, [cubes]);

  const existingCharacterIds = cubes.map((cube) => cube.characterId);

  if (!getCubeCharacters.data || !getCubeStatistics.data) {
    return null;
  }

  return (
    <DefaultLayout pageTitle="큐브 계산기">
      <Container>
        <Header>
          <Description>
            숙제 탭의 큐브와 분리되어있으며 전체 캐릭의 큐브 수익을 확인할 수
            있습니다.
          </Description>
          <TotalCard>
            <TotalGoldCard>
              <TotalGoldLabel>총 보석골드</TotalGoldLabel>
              <TotalGoldValue>{totalGold.toLocaleString()}</TotalGoldValue>
            </TotalGoldCard>
            <TotalGoodsCard>
              <TotalGoldLabel>총 재화수익</TotalGoldLabel>
              <TotalValueWrap>
                <TotalDolValue>9,999</TotalDolValue>
                <TotalShillingValue>99,999,999</TotalShillingValue>
                <TotalProd01Value>9,999</TotalProd01Value>
                <TotalProd02Value>9,999</TotalProd02Value>
                <TotalProd03Value>9,999</TotalProd03Value>
                <TotalCardValue>9,999</TotalCardValue>
              </TotalValueWrap>
            </TotalGoodsCard>
          </TotalCard>
        </Header>
        <ControlsContainer>
          <CubeStatistics />
          <Button
            variant="contained"
            size="large"
            onClick={() => setIsModalOpen(true)}
          >
            새 캐릭터 추가
          </Button>
        </ControlsContainer>
        <GridContainer>
          {getCubeCharacters.data.map((cube) => (
            <CubeCard
              key={cube.cubeId}
              cube={cube}
              cubeStatistics={getCubeStatistics.data}
              updateTotalGold={updateTotalGold}
            />
          ))}
        </GridContainer>
      </Container>
      <CharacterSelectionModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        existingCharacterIds={existingCharacterIds}
      />
    </DefaultLayout>
  );
};

export default CubeIndex;

const Container = styled.div`
  width: 100%;
  margin: 0 auto;
`;

const Header = styled.header`
  position: relative;
  margin-bottom: 16px;
`;

const Description = styled.p`
  position: absolute;
  top: -48px;
  left: 110px;
  padding: 5px 10px;
  background: ${({ theme }) => theme.app.bg.reverse};
  color: ${({ theme }) => theme.app.text.reverse};
  border-radius: 4px;
  font-size: 14px;
  line-height: 1.4;
`;

const TotalCard = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
`;

const TotalGoldCard = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: calc(30% - 6px);
  padding: 16px 20px;
  border-radius: 12px;
  background-color: ${({ theme }) => theme.app.bg.white};
  border: 1px solid ${({ theme }) => theme.app.border};
`;

const TotalValueWrap = styled.div`
  display: flex;
  gap: 20px;
`;

const TotalGoodsCard = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: calc(70% - 6px);
  padding: 16px;
  border-radius: 12px;
  background-color: ${({ theme }) => theme.app.bg.white};
  border: 1px solid ${({ theme }) => theme.app.border};
`;

const TotalGoldLabel = styled.div`
  font-size: 16px;
  color: ${({ theme }) => theme.app.text.dark2};
`;

const TotalGoldValue = styled.div`
  padding-left: 23px;
  font-size: 18px;
  font-weight: 700;
  background: url(${GoldIcon}) no-repeat left center / 16px;
`;

const TotalShillingValue = styled.div`
  position: relative;
  padding-left: 23px;
  font-size: 18px;
  font-weight: 700;
  background: url(${SilverIcon}) no-repeat left center / 16px;
  &:after {
    content: "";
    width: 1px;
    height: 14px;
    position: absolute;
    right: -10px;
    top: 6px;
    background: ${({ theme }) => theme.app.border};
  }
`;

const TotalProd01Value = styled.div`
  position: relative;
  padding-left: 23px;
  font-size: 18px;
  font-weight: 700;
  background: url(${T3Aux1Icon}) no-repeat left center / 16px;
  &:after {
    content: "";
    width: 1px;
    height: 14px;
    position: absolute;
    right: -10px;
    top: 6px;
    background: ${({ theme }) => theme.app.border};
  }
`;

const TotalProd02Value = styled.div`
  position: relative;
  padding-left: 23px;
  font-size: 18px;
  font-weight: 700;
  background: url(${T3Aux2Icon}) no-repeat left center / 16px;
  &:after {
    content: "";
    width: 1px;
    height: 14px;
    position: absolute;
    right: -10px;
    top: 6px;
    background: ${({ theme }) => theme.app.border};
  }
`;

const TotalProd03Value = styled.div`
  position: relative;
  padding-left: 23px;
  font-size: 18px;
  font-weight: 700;
  background: url(${T3Aux3Icon}) no-repeat left center / 16px;
  &:after {
    content: "";
    width: 1px;
    height: 14px;
    position: absolute;
    right: -10px;
    top: 6px;
    background: ${({ theme }) => theme.app.border};
  }
`;

const TotalCardValue = styled.div`
  padding-left: 23px;
  font-size: 18px;
  font-weight: 700;
  background: url(${CardExpIcon}) no-repeat left center / 16px;
`;

const TotalDolValue = styled.div`
  position: relative;
  padding-left: 23px;
  font-size: 18px;
  font-weight: 700;
  background: url(${LeapStoneIcon}) no-repeat left center / 16px;
  &:after {
    content: "";
    width: 1px;
    height: 14px;
    position: absolute;
    right: -10px;
    top: 6px;
    background: ${({ theme }) => theme.app.border};
  }
`;

const ControlsContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 10px;
`;

const GridContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 20px;
`;
