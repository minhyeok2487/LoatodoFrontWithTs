import React, { useState, useEffect } from "react";
import styled from "styled-components";
import DefaultLayout from "@layouts/DefaultLayout";
import { getCubes, createCube, updateCubes, deleteCube, getCubeStatistics } from "@core/apis/cube.api";
import { CubeResponse } from "@core/types/cube";
import Modal from "@components/Modal";
import useCharacters from "@core/hooks/queries/character/useCharacters";
import CubeStatistics from "@pages/cube/CubeStatistics";  
import type { CubeReward } from "@core/types/character";

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
      console.error("Failed to load cube statistics:", error);
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
        console.log("Failed to update cube:", error);
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
        <h1>큐브 티켓 관리</h1>
        <ButtonContainer>
          <CubeStatistics cubeStatistics={cubeStatistics} />
          <Button onClick={() => setIsModalOpen(true)}>캐릭터 추가</Button>
        </ButtonContainer>
        <TotalGoldDisplay>총 수익: {totalGold.toLocaleString()} G</TotalGoldDisplay>
        <TableWrapper>
          <Table>
            <thead>
              <tr>
                <th>번호</th>
                <th>캐릭터 름</th>
                <th>아이템레벨</th>
                <th>금제1</th>
                <th>금제2</th>
                <th>금제3</th>
                <th>금제4</th>
                <th>금제5</th>
                <th>해금1</th>
                <th>총 갯수</th>
                <th>총 수익</th>
                <th>작업</th>
              </tr>
            </thead>
            <tbody>
              {cubes.map((item, index) => {
                const isEditing = editingCube?.characterId === item.characterId;
                const total = [item.ban1, item.ban2, item.ban3, item.ban4, item.ban5, item.unlock1]
                  .reduce((sum, value) => sum + (value || 0), 0);
                const characterGold = calculateCharacterGold(item);
                return (
                  <tr key={item.characterId}>
                    <td>{index + 1}</td>
                    <td>{item.characterName}</td>
                    <td>{item.itemLevel.toFixed(2)}</td>
                    {['ban1', 'ban2', 'ban3', 'ban4', 'ban5', 'unlock1'].map((field) => (
                      <td key={field}>
                        {isEditing ? (
                          <Input
                            type="number"
                            value={editingCube[field as keyof CubeResponse]}
                            onChange={(e) => handleInputChange(field as keyof CubeResponse, e.target.value)}
                          />
                        ) : (
                          item[field as keyof CubeResponse]
                        )}
                      </td>
                    ))}
                    <td>{total}</td>
                    <td>{characterGold.toLocaleString()} G</td>
                    <td>
                      {isEditing ? (
                        <Button onClick={handleSaveEdit}>저장</Button>
                      ) : (
                        <Button onClick={() => handleEditCube(item)}>수정</Button>
                      )}
                      <Button onClick={() => handleDeleteCube(item.characterId, item.characterName)}>삭제</Button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </Table>
        </TableWrapper>
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
                    disabled={isExisting}
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

const TableWrapper = styled.div`
  overflow-x: auto;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  th, td {
    border: 1px solid #ddd;
    padding: 8px;
    text-align: left;
  }
  th {
    background-color: #f2f2f2;
  }
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-bottom: 10px;
`;

const Button = styled.button`
  padding: 5px 10px;
  margin-left: 10px;
  background-color: #4CAF50;
  color: white;
  border: none;
  cursor: pointer;
  &:hover {
    background-color: #45a049;
  }
`;

const ModalContent = styled.div`
  padding: 20px;
`;

const CharacterList = styled.ul`
  list-style-type: none;
  padding: 0;
`;

const CharacterItem = styled.li<{ disabled?: boolean }>`
  padding: 10px;
  border-bottom: 1px solid #eee;
  cursor: ${props => props.disabled ? 'not-allowed' : 'pointer'};
  opacity: ${props => props.disabled ? 0.5 : 1};
  &:hover {
    background-color: ${props => props.disabled ? 'inherit' : '#f5f5f5'};
  }
`;

const Input = styled.input`
  width: 50px;
`;

const TotalGoldDisplay = styled.div`
  font-size: 1.2rem;
  font-weight: bold;
  margin-bottom: 1rem;
  color: #4CAF50;
`;

export default CubeIndex;
