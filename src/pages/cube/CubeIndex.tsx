import React, { useEffect, useState } from "react";
import styled from "styled-components";

import DefaultLayout from "@layouts/DefaultLayout";

import CharacterSelectionModal from "@pages/cube/CharacterSelectionModal";
import CubeCard from "@pages/cube/CubeCard";
import CubeStatistics from "@pages/cube/CubeStatistics";

import { createCube, getCubeStatistics, getCubes } from "@core/apis/cube.api";
import type { CubeReward } from "@core/types/character";
import { CubeResponse } from "@core/types/cube";

import Button from "@components/Button";

import CardIcon from "@assets/images/ico_card.png";
import DolIcon from "@assets/images/ico_dol.png";
import GoldIcon from "@assets/images/ico_gold.png";
import Prod01Icon from "@assets/images/ico_prod01.png";
import Prod02Icon from "@assets/images/ico_prod02.png";
import Prod03Icon from "@assets/images/ico_prod03.png";
import ShillingIcon from "@assets/images/ico_shilling.png";

interface ExtendedCubeResponse extends CubeResponse {
  gold?: number;
}

const CubeIndex: React.FC = () => {
  const [cubes, setCubes] = useState<ExtendedCubeResponse[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [cubeStatistics, setCubeStatistics] = useState<CubeReward[]>([]);
  const [totalGold, setTotalGold] = useState<number>(0);

  const updateTotalGold = (cubeId: number, cubeGold: number) => {
    setCubes((prevCubes) =>
      prevCubes.map((cube) =>
        cube.cubeId === cubeId ? { ...cube, gold: cubeGold } : cube
      )
    );
  };

  useEffect(() => {
    loadCubes();
    loadCubeStatistics();
  }, []);

  useEffect(() => {
    const newTotalGold = cubes.reduce((sum, cube) => sum + (cube.gold || 0), 0);
    setTotalGold(newTotalGold);
  }, [cubes]);

  const loadCubes = async () => {
    const data = await getCubes();
    setCubes(data);
  };

  const loadCubeStatistics = async () => {
    try {
      const data = await getCubeStatistics();
      setCubeStatistics(data);
    } catch (error) {
      console.log("Failed to load cube statistics:", error);
    }
  };

  const handleCreateCube = async (
    characterId: number,
    characterName: string
  ) => {
    try {
      const newCube = await createCube(characterId, characterName);
      setCubes((prevCubes) => [...prevCubes, newCube]);
      setIsModalOpen(false);
    } catch (error) {
      console.log("Failed to create cube:", error);
    }
  };

  const handleAddCharacter = () => {
    setIsModalOpen(true);
  };

  const existingCharacterIds = cubes.map((cube) => cube.characterId);

  const handleDeleteCube = (deletedCubeId: number) => {
    setCubes((prevCubes) =>
      prevCubes.filter((cube) => cube.cubeId !== deletedCubeId)
    );
  };

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
          <CubeStatistics cubeStatistics={cubeStatistics} />
          <Button variant="contained" size="large" onClick={handleAddCharacter}>
            새 캐릭터 추가
          </Button>
        </ControlsContainer>
        <GridContainer>
          {cubes.map((cube) => (
            <CubeCard
              key={cube.cubeId}
              cube={cube}
              onDelete={() => handleDeleteCube(cube.cubeId)}
              cubeStatistics={cubeStatistics}
              updateTotalGold={updateTotalGold}
            />
          ))}
        </GridContainer>
      </Container>
      <CharacterSelectionModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onCreateCube={handleCreateCube}
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
  background: url(${ShillingIcon}) no-repeat left center / 16px;
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
  background: url(${Prod01Icon}) no-repeat left center / 16px;
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
  background: url(${Prod02Icon}) no-repeat left center / 16px;
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
  background: url(${Prod03Icon}) no-repeat left center / 16px;
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
  background: url(${CardIcon}) no-repeat left center / 16px;
`;

const TotalDolValue = styled.div`
  position: relative;
  padding-left: 23px;
  font-size: 18px;
  font-weight: 700;
  background: url(${DolIcon}) no-repeat left center / 16px;
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
