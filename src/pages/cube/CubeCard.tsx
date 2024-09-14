import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { CubeResponse } from '@core/types/cube';
import { deleteCube, updateCube } from '@core/apis/cube.api';
import type { CubeReward } from "@core/types/character";

interface CubeCardProps {
  cube: CubeResponse;
  onDelete: () => void;
  cubeStatistics: CubeReward[];
  updateTotalGold: (cubeId: number, cubeGold: number) => void;
}

const CubeCard: React.FC<CubeCardProps> = ({ cube: initialCube, onDelete, cubeStatistics, updateTotalGold }) => {
  const [cube, setCube] = useState(initialCube);
  const [isEditing, setIsEditing] = useState(false);
  const [totalCount, setTotalCount] = useState(0);
  const [tradableInfo, setTradableInfo] = useState({ jewelry3: 0, jewelry4: 0, gold: 0 });
  const [nonTradableInfo, setNonTradableInfo] = useState({
    leapStone: 0, shilling: 0, solarGrace: 0, solarBlessing: 0, solarProtection: 0, cardExp: 0
  });

  useEffect(() => {
    calculateTotalAndTradable();
  }, [cube, cubeStatistics]);

  const calculateTotalAndTradable = () => {
    const total = cube.ban1 + cube.ban2 + cube.ban3 + cube.ban4 + cube.ban5 + cube.unlock1;
    setTotalCount(total);

    let jewelry3 = 0;
    let jewelry4 = 0;
    let totalGold = 0;
    let leapStone = 0;
    let shilling = 0;
    let solarGrace = 0;
    let solarBlessing = 0;
    let solarProtection = 0;
    let cardExp = 0;

    cubeStatistics.forEach(stat => {
      let cubeValue: number;
      switch (stat.name) {
        case '1금제': cubeValue = cube.ban1; break;
        case '2금제': cubeValue = cube.ban2; break;
        case '3금제': cubeValue = cube.ban3; break;
        case '4금제': cubeValue = cube.ban4; break;
        case '5금제': cubeValue = cube.ban5; break;
        case '1해금': cubeValue = cube.unlock1; break;
        default: cubeValue = 0;
      }
      
      if (stat.name === '1해금') {
        jewelry4 += cubeValue * stat.jewelry;
      } else {
        jewelry3 += cubeValue * stat.jewelry;
      }
      totalGold += cubeValue * stat.jewelry * stat.jewelryPrice;
      leapStone += cubeValue * stat.leapStone;
      shilling += cubeValue * stat.shilling;
      solarGrace += cubeValue * stat.solarGrace;
      solarBlessing += cubeValue * stat.solarBlessing;
      solarProtection += cubeValue * stat.solarProtection;
      cardExp += cubeValue * stat.cardExp;
    });

    setTradableInfo({ jewelry3, jewelry4, gold: totalGold });
    setNonTradableInfo({ leapStone, shilling, solarGrace, solarBlessing, solarProtection, cardExp });
    updateTotalGold(cube.cubeId, totalGold);
  };

  const toggleEditing = async () => {
    if (isEditing) {
      try {
        setCube(await updateCube(cube.cubeId, cube.characterId, cube.ban1, cube.ban2, cube.ban3, cube.ban4, cube.ban5, cube.unlock1));
        calculateTotalAndTradable();
      } catch (error) {
        console.error('Error updating cube:', error);
        // You might want to add some error feedback here
      }
    }
    setIsEditing(!isEditing);
  };

  const handleDelete = async () => {
    try {
      await deleteCube(cube.characterId);
      onDelete();
    } catch (error) {
      console.error('Error deleting cube:', error);
    }
  };

  const handleInputChange = (label: string, value: string) => {
    const numValue = parseInt(value, 10) || 0;
    const updatedCube = { ...cube };
    switch (label) {
      case '1금제': updatedCube.ban1 = numValue; break;
      case '2금제': updatedCube.ban2 = numValue; break;
      case '3금제': updatedCube.ban3 = numValue; break;
      case '4금제': updatedCube.ban4 = numValue; break;
      case '5금제': updatedCube.ban5 = numValue; break;
      case '1해금': updatedCube.unlock1 = numValue; break;
      default: break; // Add this line
    }
    setCube(updatedCube);
    
    const total = updatedCube.ban1 + updatedCube.ban2 + updatedCube.ban3 + 
                  updatedCube.ban4 + updatedCube.ban5 + updatedCube.unlock1;
    setTotalCount(total);
  };

  const formatNumber = (num: number) => num.toLocaleString();

  const ItemTable = styled.table`
    width: 100%;
    border-collapse: collapse;
    font-size: 14px;
  `;

  const ItemRow = styled.tr`
    background-color: ${({ theme }) => theme.app.bg.white};
    border: 1px solid ${({ theme }) => theme.app.border};
  `;

  const ItemCell = styled.td`
    padding: 6px;
    border: 1px solid #eee;
  `;

  const ItemLabel = styled(ItemCell)`
    font-weight: bold;
    width: 60%;
  `;

  const ItemValue = styled(ItemCell)`
    text-align: right;
  `;

  const SectionTitle = styled.h3`
    margin-top: 15px;
    margin-bottom: 5px;
    font-size: 16px;
  `;

  return (
    <Card>
      <DeleteButton onClick={handleDelete}>X</DeleteButton>
      <CardTitle>{cube.characterName} [Lv {cube.itemLevel}]</CardTitle>
      <CubeStages>
        {[
          { label: '1금제', value: cube.ban1 },
          { label: '2금제', value: cube.ban2 },
          { label: '3금제', value: cube.ban3 },
          { label: '4금제', value: cube.ban4 },
          { label: '5금제', value: cube.ban5 },
          { label: '1해금', value: cube.unlock1 },
        ].map((stage, idx) => (
          <StageRow key={idx}>
            <StageLabel>{stage.label}</StageLabel>
            <StageInput 
              type="number" 
              value={stage.value} 
              disabled={!isEditing}
              onChange={(e) => handleInputChange(stage.label, e.target.value)}
            />
          </StageRow>
        ))}
      </CubeStages>
      <SubmitButton onClick={toggleEditing}>
        {isEditing ? '저장하고 계산하기' : '수정하기'}
      </SubmitButton>
      <ResultRow>
        <ResultLabel>총</ResultLabel>
        <ResultValue>{totalCount} 장</ResultValue>
      </ResultRow>
      <SmallText>해당 데이터는 API로 계산된 평균 값입니다.</SmallText>
      <>
        <SectionTitle>거래 가능 아이템</SectionTitle>
        <ItemTable>
          {tradableInfo.jewelry3 > 0 && (
            <ItemRow>
              <ItemLabel>3티어 1레벨 보석</ItemLabel>
              <ItemValue>{formatNumber(tradableInfo.jewelry3)}개</ItemValue>
            </ItemRow>
          )}
          {tradableInfo.jewelry4 > 0 && (
            <ItemRow>
              <ItemLabel>4티어 1레벨 보석</ItemLabel>
              <ItemValue>{formatNumber(tradableInfo.jewelry4)}개</ItemValue>
            </ItemRow>
          )}
          <ItemRow>
            <ItemLabel>총 골드</ItemLabel>
            <ItemValue>{formatNumber(tradableInfo.gold)} G</ItemValue>
          </ItemRow>
        </ItemTable>

        <SectionTitle>거래 불가 아이템</SectionTitle>
        <ItemTable>
          {[
            { label: '돌파석', value: nonTradableInfo.leapStone },
            { label: '실링', value: nonTradableInfo.shilling },
            { label: '은총', value: nonTradableInfo.solarGrace },
            { label: '축복', value: nonTradableInfo.solarBlessing },
            { label: '가호', value: nonTradableInfo.solarProtection },
            { label: '카드경험치', value: nonTradableInfo.cardExp }
          ].map(item => item.value > 0 && (
            <ItemRow key={item.label}>
              <ItemLabel>{item.label}</ItemLabel>
              <ItemValue>{formatNumber(item.value)}{item.label !== '실링' && item.label !== '카드경험치' ? '개' : ''}</ItemValue>
            </ItemRow>
          ))}
        </ItemTable>
      </>
    </Card>
  );
};

export default CubeCard;

const Card = styled.div`
  position: relative;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  color: ${({ theme }) => theme.app.text.dark1};
  border: 1px solid ${({ theme }) => theme.app.border};
  background-color: ${({ theme }) => theme.app.bg.white};
`;

const DeleteButton = styled.button`
  position: absolute;
  top: 20px;
  right: 20px;
  background-color: #e74c3c;
  color: white;
  border: none;
  border-radius: 50%;
  width: 24px;
  height: 24px;
  font-size: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  opacity: 0.7;
  transition: opacity 0.3s;

  &:hover {
    opacity: 1;
  }
`;

const CardTitle = styled.h2`
  font-size: 18px;
  margin-bottom: 15px;
  font-weight: bold;
`;

const CubeStages = styled.div`
  margin-bottom: 15px;
`;

const StageRow = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
`;

const StageLabel = styled.span`
  font-size: 14px;
`;

const StageInput = styled.input<{ disabled: boolean }>`
  width: 50px;
  height: 30px;
  padding: 0 5px;
  border: 1px solid #ccc;
  border-radius: 4px;
  text-align: center;
  font-weight: 600;
  font-size: 14px;
  color: ${({theme}) => theme.app.text.dark1};
  background-color: ${props => props.disabled ? '' : props.theme.app.bg.white};
  &::-webkit-inner-spin-button,
  &::-webkit-outer-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }
  -moz-appearance: textfield;
`;

const SubmitButton = styled.button`
  width: 100%;
  padding: 10px;
  background-color: #333;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  margin-bottom: 15px;
`;

const ResultRow = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 5px;
`;

const ResultLabel = styled.span`
  font-size: 14px;
`;

const ResultValue = styled.span`
  font-size: 14px;
  font-weight: bold;
`;

const SmallText = styled.p`
  font-size: 12px;
  color: ${({ theme }) => theme.app.text.dark2};
  margin-bottom: 15px;
`;

