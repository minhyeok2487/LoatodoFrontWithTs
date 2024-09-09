import React, { useState, useEffect } from "react";
import styled from "styled-components";
import DefaultLayout from "@layouts/DefaultLayout";
import { getCubes, createCube, updateCubes, deleteCube, getCubeStatistics } from "@core/apis/cube.api";
import { CubeResponse } from "@core/types/cube";
import Modal from "@components/Modal";
import useCharacters from "@core/hooks/queries/character/useCharacters";
import CubeStatistics from "@pages/cube/CubeStatistics";  
import type { CubeReward } from "@core/types/character";

const InfoText = styled.p`
  color: ${({ theme }) => theme.infoTextColor || '#666'};
  background-color: ${({ theme }) => theme.infoBackgroundColor || '#f5f5f5'};
  padding: 10px 15px;
  border-radius: 5px;
  font-size: 0.9rem;
  margin-bottom: 15px;
  border-left: 4px solid ${({ theme }) => theme.infoAccentColor || '#999'};
`;

const CubeIndex: React.FC = () => {
  const [cubes, setCubes] = useState<CubeResponse[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCube, setEditingCube] = useState<CubeResponse | null>(null);
  const [cubeStatistics, setCubeStatistics] = useState<CubeReward[]>([]);
  const [totalGold, setTotalGold] = useState<number>(0);
  const getCharacters = useCharacters();

  useEffect(() => {
    loadCubes();
    loadCubeStatistics();
  }, []);

  useEffect(() => {
    if (cubes.length > 0 && cubeStatistics.length > 0) {
      calculateTotalGold();
    }
  }, [cubes, cubeStatistics]);

  const loadCubes = async () => {
    const data = await getCubes();
    setCubes(data);
    const statistics = await getCubeStatistics();
    setCubeStatistics(statistics);
  };

  const loadCubeStatistics = async () => {
    try {
      const data = await getCubeStatistics();
      setCubeStatistics(data);
    } catch (error) {
      console.log("Failed to load cube statistics:", error);
    }
  };

  const calculateTotalGold = () => {
    const cubeTypes = ['1금제', '2금제', '3금제', '4금제', '5금제', '1해금'];
    const cubeKeys: (keyof CubeResponse)[] = ['ban1', 'ban2', 'ban3', 'ban4', 'ban5', 'unlock1'];
    
    const total = cubeTypes.reduce((sum, type, index) => {
      const key = cubeKeys[index];
      const count = cubes.reduce((acc, cube) => acc + Number(cube[key] || 0), 0);
      const statistic = cubeStatistics.find(stat => stat.name === type);
      if (statistic) {
        return sum + (count * statistic.jewelryPrice * statistic.jewelry);
      }
      return sum;
    }, 0);
    setTotalGold(total);
  };

  const calculateCharacterGold = (cube: CubeResponse): number => {
    const cubeTypes = ['1금제', '2금제', '3금제', '4금제', '5금제', '1해금'];
    const cubeKeys: (keyof CubeResponse)[] = ['ban1', 'ban2', 'ban3', 'ban4', 'ban5', 'unlock1'];
    
    return cubeTypes.reduce((sum, type, index) => {
      const key = cubeKeys[index];
      const count = Number(cube[key] || 0);
      const statistic = cubeStatistics.find(stat => stat.name === type);
      if (statistic) {
        const typeGold = count * statistic.jewelryPrice * statistic.jewelry;
        return sum + typeGold;      
      }
      return sum;
    }, 0);
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

  const handleDeleteCube = async (characterId: number, characterName: string) => {
    const isConfirmed = window.confirm(`정말로 "${characterName}" 캐릭터를 삭제하시겠습니까?`);
    if (isConfirmed) {
      try {
        await deleteCube(characterId);
        setCubes(prevCubes => prevCubes.filter(cube => cube.characterId !== characterId));
      } catch (error) {
        console.log("Failed to delete cube:", error);
      }
    }
  };

  const handleEditCube = (cube: CubeResponse) => {
    setEditingCube(cube);
  };

  const handleSaveEdit = async () => {
    if (editingCube) {
      try {
        const updatedCube = await updateCubes(
          editingCube.cubeId,
          editingCube.characterId,
          editingCube.ban1,
          editingCube.ban2,
          editingCube.ban3,
          editingCube.ban4,
          editingCube.ban5,
          editingCube.unlock1
        );
        setCubes(prevCubes => prevCubes.map(cube => 
          cube.characterId === updatedCube.characterId ? updatedCube : cube
        ));
        setEditingCube(null);
      } catch (error) {
        // Handle error
        console.error("Failed to update cube:", error);
      }
    }
  };

  const handleInputChange = (field: keyof CubeResponse, value: string) => {
    if (editingCube) {
      setEditingCube({ ...editingCube, [field]: parseInt(value, 10) || 0 });
    }
  };

  const existingCharacterIds = cubes.map(cube => cube.characterId);

  return (
    <DefaultLayout>
      <Container>
        <StyledTitle>큐브 계산기</StyledTitle>
        <InfoText>
          숙제 탭의 큐브와는 분리되어있으며 전체 캐릭의 큐브 수익을 확인할 수 있습니다.
        </InfoText>
        <ButtonContainer>
          <CubeStatistics cubeStatistics={cubeStatistics} />
          <AddButton onClick={() => setIsModalOpen(true)}>캐릭터 추가</AddButton>
        </ButtonContainer>
        <TotalGoldDisplay>총 수익: {totalGold.toLocaleString()} G</TotalGoldDisplay>
        <CubeGrid>
          {cubes.map((item) => {
            const isEditing = editingCube?.characterId === item.characterId;
            const total = [item.ban1, item.ban2, item.ban3, item.ban4, item.ban5, item.unlock1]
              .reduce((sum, value) => sum + (value || 0), 0);
            const characterGold = calculateCharacterGold(item);
            return (
              <CubeCard key={item.characterId}>
                <CardHeader>
                  <h3 style={{fontWeight: 'bold'}}>{item.characterName}</h3>
                  <p>아이템 레벨: {item.itemLevel.toFixed(2)}</p>
                </CardHeader>
                <CardBody>
                  {['ban1', 'ban2', 'ban3', 'ban4', 'ban5', 'unlock1'].map((field, index) => (
                    <CubeField key={field}>
                      <label htmlFor={`${field}-${item.characterId}`}>{`${index + 1}${index === 5 ? '해금' : '금제'}`}</label>
                      {isEditing ? (
                        <Input
                          id={`${field}-${item.characterId}`}
                          type="number"
                          value={editingCube[field as keyof CubeResponse]}
                          onChange={(e) => handleInputChange(field as keyof CubeResponse, e.target.value)}
                        />
                      ) : (
                        <span>{item[field as keyof CubeResponse]}</span>
                      )}
                    </CubeField>
                  ))}
                </CardBody>
                <CardFooter>
                  <p>총 개수: {total}</p>
                  <p>총 수익: {characterGold.toLocaleString()} G</p>
                  {isEditing ? (
                    <Button onClick={handleSaveEdit}>저장</Button>
                  ) : (
                    <EditButton onClick={() => handleEditCube(item)}>수정</EditButton>
                  )}
                  <DeleteButton onClick={() => handleDeleteCube(item.characterId, item.characterName)}>삭제</DeleteButton>
                </CardFooter>
              </CubeCard>
            );
          })}
        </CubeGrid>
        <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
          <ModalContent>
            <h2>캐릭터 선택</h2>
            <CharacterList>
              {getCharacters.data?.map((char) => {
                const isExisting = existingCharacterIds.includes(char.characterId);
                return (
                  <CharacterItem
                    key={char.characterId}
                    onClick={() => !isExisting && handleCreateCube(char.characterId, char.characterName)}
                    $isDisabled={isExisting}
                  >
                    {char.characterName} / {char.itemLevel} / {char.characterClassName}
                    {isExisting && " (이미 추가됨)"}
                  </CharacterItem>
                );
              })}
            </CharacterList>
          </ModalContent>
        </Modal>
      </Container>
    </DefaultLayout>
  );
};

const Container = styled.div`
  padding: 20px;
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-bottom: 20px;
`;

const Button = styled.button`
  padding: 8px 16px;
  margin-left: 10px;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s;
`;

const AddButton = styled(Button)`
  background-color: #2ecc71;
  &:hover {
    background-color: #27ae60;
  }
`;

const EditButton = styled(Button)`
  background-color: #3498db;
  &:hover {
    background-color: #2980b9;
  }
`;

const DeleteButton = styled(Button)`
  background-color: #e74c3c;
  &:hover {
    background-color: #c0392b;
  }
`;

const CubeGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
`;

const StyledTitle = styled.h1`
  font-size: 2.5rem;
  color: #4CAF50;
  text-align: center;
  margin-bottom: 1.5rem;
  padding: 0.5rem 0;
  border-bottom: 3px solid #4CAF50;
  text-shadow: 2px 2px 4px rgba(0,0,0,0.1);
  font-family: 'Arial', sans-serif;
  letter-spacing: 2px;
`;

const CubeCard = styled.div`
  background-color: #f9f9f9;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  overflow: hidden;
`;

const CardHeader = styled.div`
  background-color: #4CAF50;
  color: white;
  padding: 15px;
  h3 {
    margin: 0;
    font-size: 1.2rem;
  }
  p {
    margin: 5px 0 0;
    font-size: 0.9rem;
  }
`;

const CardBody = styled.div`
  padding: 15px;
`;

const CubeField = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
  label {
    font-weight: bold;
  }
`;

const CardFooter = styled.div`
  background-color: #f0f0f0;
  padding: 15px;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Input = styled.input`
  width: 60px;
  padding: 5px;
  border: 1px solid #ddd;
  border-radius: 4px;
`;

const TotalGoldDisplay = styled.div`
  font-size: 1.2rem;
  font-weight: bold;
  margin-bottom: 1rem;
  color: #f39c12;
`;

const CharacterItem = styled.li<{ $isDisabled: boolean }>`
  padding: 10px;
  border: 1px solid #eee;
  text-align: center;
  opacity: ${props => props.$isDisabled ? 0.5 : 1};
  pointer-events: ${props => props.$isDisabled ? 'none' : 'auto'};
  cursor: ${props => props.$isDisabled ? 'not-allowed' : 'pointer'};
`;

const ModalContent = styled.div`
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
`;

const CharacterList = styled.ul`
  list-style-type: none;
  padding: 0;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 10px;
`;

export default CubeIndex;
