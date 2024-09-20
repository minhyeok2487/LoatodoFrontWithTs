import { useQueryClient } from "@tanstack/react-query";
import React, { useEffect, useState } from "react";
import styled from "styled-components";

import useRemoveCubeCharacter from "@core/hooks/mutations/cube/useRemoveCubeCharacter";
import useUpdateCubeCharacter from "@core/hooks/mutations/cube/useUpdateCubeCharacter";
import { CubeCharacter, CubeReward } from "@core/types/cube";
import queryKeyGenerator from "@core/utils/queryKeyGenerator";

import Button from "@components/Button";

import GoldIcon from "@assets/images/ico_gold.png";
// import CardIcon from "@assets/images/ico_card.png";
// import DolIcon from "@assets/images/ico_dol.png";
import T3JewelIcon from "@assets/images/ico_t3_jewel.png";
import T4JewelIcon from "@assets/images/ico_t4_jewel.png";

// import Prod01Icon from "@assets/images/ico_prod01.png";
// import Prod02Icon from "@assets/images/ico_prod02.png";
// import Prod03Icon from "@assets/images/ico_prod03.png";
// import ShillingIcon from "@assets/images/ico_shilling.png";

interface CubeCardProps {
  cube: CubeCharacter;
  cubeStatistics: CubeReward[];
  updateTotalGold: (cubeId: number, cubeGold: number) => void;
}

const CubeCard: React.FC<CubeCardProps> = ({
  cube: initialCube,
  cubeStatistics,
  updateTotalGold,
}) => {
  const queryClient = useQueryClient();

  const [cube, setCube] = useState(initialCube);
  const [isEditing, setIsEditing] = useState(false);
  const [totalCount, setTotalCount] = useState(0);
  const [tradableInfo, setTradableInfo] = useState({
    jewelry3: 0,
    jewelry4: 0,
    gold: 0,
  });
  const [nonTradableInfo, setNonTradableInfo] = useState({
    leapStone: 0,
    shilling: 0,
    solarGrace: 0,
    solarBlessing: 0,
    solarProtection: 0,
    cardExp: 0,
  });

  const removeCubeCharacter = useRemoveCubeCharacter({
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeyGenerator.getCubeCharacters(),
      });
    },
  });
  const updateCubeCharacter = useUpdateCubeCharacter({
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeyGenerator.getCubeCharacters(),
      });

      calculateTotalAndTradable();
      setIsEditing(false);
    },
  });

  useEffect(() => {
    calculateTotalAndTradable();
  }, [cube, cubeStatistics]);

  const calculateTotalAndTradable = () => {
    const total =
      cube.ban1 + cube.ban2 + cube.ban3 + cube.ban4 + cube.ban5 + cube.unlock1;
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

    cubeStatistics.forEach((stat) => {
      let cubeValue: number;
      switch (stat.name) {
        case "1금제":
          cubeValue = cube.ban1;
          break;
        case "2금제":
          cubeValue = cube.ban2;
          break;
        case "3금제":
          cubeValue = cube.ban3;
          break;
        case "4금제":
          cubeValue = cube.ban4;
          break;
        case "5금제":
          cubeValue = cube.ban5;
          break;
        case "1해금":
          cubeValue = cube.unlock1;
          break;
        default:
          cubeValue = 0;
      }

      if (stat.name === "1해금") {
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
    setNonTradableInfo({
      leapStone,
      shilling,
      solarGrace,
      solarBlessing,
      solarProtection,
      cardExp,
    });
    updateTotalGold(cube.cubeId, totalGold);
  };

  const handleInputChange = (label: string, value: string) => {
    const numValue = parseInt(value, 10) || 0;
    const updatedCube = { ...cube };
    switch (label) {
      case "1금제":
        updatedCube.ban1 = numValue;
        break;
      case "2금제":
        updatedCube.ban2 = numValue;
        break;
      case "3금제":
        updatedCube.ban3 = numValue;
        break;
      case "4금제":
        updatedCube.ban4 = numValue;
        break;
      case "5금제":
        updatedCube.ban5 = numValue;
        break;
      case "1해금":
        updatedCube.unlock1 = numValue;
        break;
      default:
        break; // Add this line
    }
    setCube(updatedCube);

    const total =
      updatedCube.ban1 +
      updatedCube.ban2 +
      updatedCube.ban3 +
      updatedCube.ban4 +
      updatedCube.ban5 +
      updatedCube.unlock1;
    setTotalCount(total);
  };

  const formatNumber = (num: number) => num.toLocaleString();

  return (
    <Card>
      <DeleteButton
        onClick={() => {
          removeCubeCharacter.mutate(cube.characterId);
        }}
      >
        X
      </DeleteButton>
      <CardTitle>
        {cube.characterName} <CardLevel>Lv {cube.itemLevel}</CardLevel>
      </CardTitle>
      <CubeStages>
        {[
          { label: "1금제", value: cube.ban1 },
          { label: "2금제", value: cube.ban2 },
          { label: "3금제", value: cube.ban3 },
          { label: "4금제", value: cube.ban4 },
          { label: "5금제", value: cube.ban5 },
          { label: "1해금", value: cube.unlock1 },
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
      <Button
        variant="contained"
        size="large"
        onClick={() => {
          if (isEditing) {
            updateCubeCharacter.mutate({
              cubeId: cube.cubeId,
              characterId: cube.characterId,
              ban1: cube.ban1,
              ban2: cube.ban2,
              ban3: cube.ban3,
              ban4: cube.ban4,
              ban5: cube.ban5,
              unlock1: cube.unlock1,
            });
          } else {
            setIsEditing(true);
          }
        }}
      >
        {isEditing ? "저장하고 계산하기" : "수정하기"}
      </Button>
      <ResultRow>
        <ResultLabel>총</ResultLabel>
        <ResultValue>{totalCount}장</ResultValue>
      </ResultRow>
      <SmallText>해당 데이터는 API로 계산된 평균 값입니다.</SmallText>
      <>
        <SectionTitle>거래가능 재화</SectionTitle>
        <ItemTable>
          {tradableInfo.jewelry3 > 0 && (
            <ItemRow>
              <ItemValue>
                <ItemJewelry3>
                  {formatNumber(tradableInfo.jewelry3)}개
                </ItemJewelry3>
              </ItemValue>
            </ItemRow>
          )}
          {tradableInfo.jewelry4 > 0 && (
            <ItemRow>
              <ItemValue>
                <ItemJewelry4>
                  {formatNumber(tradableInfo.jewelry4)}개
                </ItemJewelry4>
              </ItemValue>
            </ItemRow>
          )}
          <ItemRow>
            <ItemValue>
              <ItemGold>{formatNumber(tradableInfo.gold)} G</ItemGold>
            </ItemValue>
          </ItemRow>
        </ItemTable>

        <SectionTitle>거래불가 재화</SectionTitle>
        <ItemTable>
          {[
            { label: "돌파석", value: nonTradableInfo.leapStone },
            { label: "실링", value: nonTradableInfo.shilling },
            { label: "은총", value: nonTradableInfo.solarGrace },
            { label: "축복", value: nonTradableInfo.solarBlessing },
            { label: "가호", value: nonTradableInfo.solarProtection },
            { label: "카드경험치", value: nonTradableInfo.cardExp },
          ].map(
            (item) =>
              item.value > 0 && (
                <ItemRow key={item.label}>
                  <ItemValue>
                    {formatNumber(item.value)}
                    {item.label !== "실링" && item.label !== "카드경험치"
                      ? "개"
                      : ""}
                  </ItemValue>
                </ItemRow>
              )
          )}
        </ItemTable>
      </>
    </Card>
  );
};

export default CubeCard;

const Card = styled.div`
  position: relative;
  border-radius: 16px;
  padding: 18px;
  color: ${({ theme }) => theme.app.text.dark1};
  border: 1px solid ${({ theme }) => theme.app.border};
  background-color: ${({ theme }) => theme.app.bg.white};

  button {
    width: 100%;
  }
`;

const DeleteButton = styled.button`
  position: absolute;
  top: -7px;
  right: -9px;
  background-color: ${({ theme }) => theme.app.text.dark1};
  color: ${({ theme }) => theme.app.text.reverse};
  border: none;
  border-radius: 50%;
  width: 24px !important;
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
  margin-bottom: 16px;
  font-weight: 700;
`;

const CardLevel = styled.span`
  margin-left: 4px;
  font-size: 15px;
  font-weight: 500;
  color: ${({ theme }) => theme.app.text.light2};
`;

const CubeStages = styled.div`
  margin-bottom: 15px;
`;

const StageRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
  padding: 0 4px;
`;

const StageLabel = styled.span`
  font-size: 16px;
`;

const StageInput = styled.input<{ disabled: boolean }>`
  width: 50px;
  height: 30px;
  padding: 0 5px;
  border: 1px solid ${({ theme }) => theme.app.border};
  border-radius: 8px;
  text-align: center;
  font-weight: 600;
  font-size: 14px;
  color: ${({ theme }) => theme.app.text.dark1};
  background-color: ${(props) =>
    props.disabled ? "" : props.theme.app.bg.white};
  &::-webkit-inner-spin-button,
  &::-webkit-outer-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }
  -moz-appearance: textfield;
`;

const ResultRow = styled.div`
  display: flex;
  justify-content: space-between;
  margin: 24px -18px 0 -18px;
  padding: 16px 30px 16px;
  border-top: 1px solid ${({ theme }) => theme.app.border};
`;

const ResultLabel = styled.span`
  font-size: 15px;
`;

const ResultValue = styled.span`
  font-size: 15px;
`;

const SmallText = styled.p`
  padding-top: 16px;
  text-align: center;
  font-size: 13px;
  color: ${({ theme }) => theme.app.text.light2};
  border-top: 1px dashed ${({ theme }) => theme.app.border};
`;

const ItemTable = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
`;

const ItemRow = styled.div`
  width: calc(33.33% - 3px);
  background-color: ${({ theme }) => theme.app.bg.white};
`;

const ItemCell = styled.span`
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 12px;
  border: 1px solid ${({ theme }) => theme.app.border};

  span {
    display: block;
    width: 100%;
    text-align: center;
    padding: 34px 0 6px 0;
    font-size: 15px;
  }
`;

const ItemValue = styled(ItemCell)`
  text-align: right;
`;

const ItemJewelry3 = styled.span`
  background: url(${T3JewelIcon}) no-repeat top 11px center / 34px auto;
`;

const ItemJewelry4 = styled.span`
  background: url(${T4JewelIcon}) no-repeat top 11px center / 34px auto;
`;

const ItemGold = styled.span`
  background: url(${GoldIcon}) no-repeat top 11px center / 16px auto;
`;

const SectionTitle = styled.h3`
  margin-top: 16px;
  margin-bottom: 6px;
  font-size: 16px;
  font-weight: 600;
`;
