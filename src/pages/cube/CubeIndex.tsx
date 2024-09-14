import React, { useState, useEffect } from 'react';
import DefaultLayout from "@layouts/DefaultLayout";
import styled from 'styled-components';
import { getCubes, createCube, getCubeStatistics } from '@core/apis/cube.api';
import { CubeResponse } from '@core/types/cube';
import type { CubeReward } from "@core/types/character";
import CubeCard from '@pages/cube/CubeCard';
import CubeStatistics from "@pages/cube/CubeStatistics";  
import CharacterSelectionModal from '@pages/cube/CharacterSelectionModal';

interface ExtendedCubeResponse extends CubeResponse {
  gold?: number;
}

const CubeIndex: React.FC = () => {
  const [cubes, setCubes] = useState<ExtendedCubeResponse[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [cubeStatistics, setCubeStatistics] = useState<CubeReward[]>([]);
  const [totalGold, setTotalGold] = useState<number>(0);

  const updateTotalGold = (cubeId: number, cubeGold: number) => {
    setCubes(prevCubes => prevCubes.map(cube => 
      cube.cubeId === cubeId ? { ...cube, gold: cubeGold } : cube
    ));
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

  const handleCreateCube = async (characterId: number, characterName: string) => {
    try {
      const newCube = await createCube(characterId, characterName);
      setCubes(prevCubes => [...prevCubes, newCube]);
      setIsModalOpen(false);
    } catch (error) {
      console.log("Failed to create cube:", error);
    }
  };

  const handleAddCharacter = () => {
    setIsModalOpen(true);
  };

  const existingCharacterIds = cubes.map(cube => cube.characterId);

  const handleDeleteCube = (deletedCubeId: number) => {
    setCubes(prevCubes => prevCubes.filter(cube => cube.cubeId !== deletedCubeId));
  };

  return (
    <DefaultLayout>
      <Container>
        <Header>
          <TitleSection>
            <Title>큐브 계산기</Title>
            <Description>숙제 탭의 큐브와는 분리되어있으며 전체 캐릭의 큐브 수익을 확인할 수 있습니다.</Description>
          </TitleSection>
          <TotalGoldCard>
            <TotalGoldLabel>총 골드</TotalGoldLabel>
            <TotalGoldValue>{totalGold.toLocaleString()}</TotalGoldValue>
          </TotalGoldCard>
        </Header>
        <ControlsContainer>
          <CubeStatistics cubeStatistics={cubeStatistics} />
          <AddButton onClick={handleAddCharacter}>
            <PlusIcon /> 캐릭터 추가
          </AddButton>
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
  max-width: 1200px;
  margin: 0 auto;
  padding: 10px 20px;
  color: ${({ theme }) => theme.app.text.dark2};
`;

const Header = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px; // 30px에서 10px로 줄임
  background-color: ${({ theme }) => theme.app.bg.white};
  border-radius: 12px;
  padding: 15px; // 20px에서 15px로 줄임
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  border: 1px solid ${({ theme }) => theme.app.border};
`;

const TitleSection = styled.div`
  flex: 1;
`;

const Title = styled.h1`
  font-size: 28px;
  font-weight: 700;
  color: ${({ theme }) => theme.app.text.dark1};
  margin-bottom: 5px;
`;

const Description = styled.p`
  font-size: 14px;
  line-height: 1.4;
  color: ${({ theme }) => theme.app.text.light1};
`;

const TotalGoldCard = styled.div`
  text-align: right;
`;

const TotalGoldLabel = styled.div`
  font-size: 16px;
  color: ${({ theme }) => theme.app.text.dark2};
  margin-bottom: 5px;
`;

const TotalGoldValue = styled.div`
  font-size: 24px;
  font-weight: 700;
  color: #7678ed
`;

const ControlsContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px; // 30px에서 10px로 줄임
`;

const AddButton = styled.button`
  display: flex;
  align-items: center;
  background-color: #3498db;
  color: white;
  border: none;
  padding: 7px 15px;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.3s;

  &:hover {
    background-color: #2980b9;
  }
`;

const PlusIcon = styled.span`
  margin-right: 8px;
  font-size: 20px;

  &::before {
    content: '+';
  }
`;

const GridContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
`;