import { MdClose } from "@react-icons/all-files/md/MdClose";
import { useQueryClient } from "@tanstack/react-query";
import { useFormik } from "formik";
import { useMemo, useState } from "react";
import styled from "styled-components";

import useRemoveCubeCharacter from "@core/hooks/mutations/cube/useRemoveCubeCharacter";
import useUpdateCubeCharacter from "@core/hooks/mutations/cube/useUpdateCubeCharacter";
import useCubeStatistics from "@core/hooks/queries/cube/useCubeStatistics";
import { CubeCharacter } from "@core/types/cube";
import queryKeyGenerator from "@core/utils/queryKeyGenerator";

import Button from "@components/Button";

import CardExpIcon from "@assets/images/ico_card_exp.png";
import GoldIcon from "@assets/images/ico_gold.png";
import LeapStoneIcon from "@assets/images/ico_leap_stone.png";
import SilverIcon from "@assets/images/ico_silver.png";
import T3Aux1Icon from "@assets/images/ico_t3_aux1.png";
import T3Aux2Icon from "@assets/images/ico_t3_aux2.png";
import T3Aux3Icon from "@assets/images/ico_t3_aux3.png";
import T3JewelIcon from "@assets/images/ico_t3_jewel.png";
import T4JewelIcon from "@assets/images/ico_t4_jewel.png";

interface Props {
  cubeCharacter: CubeCharacter;
  updateTotalGold: (cubeId: number, cubeGold: number) => void;
}

const ticketKeys = ["ban1", "ban2", "ban3", "ban4", "ban5", "unlock1"] as const;

const CubeCharacterModal = ({ cubeCharacter, updateTotalGold }: Props) => {
  const queryClient = useQueryClient();

  const getCubeStatistics = useCubeStatistics();

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      ban1: cubeCharacter.ban1 || 0,
      ban2: cubeCharacter.ban2 || 0,
      ban3: cubeCharacter.ban3 || 0,
      ban4: cubeCharacter.ban4 || 0,
      ban5: cubeCharacter.ban5 || 0,
      unlock1: cubeCharacter.unlock1 || 0,
    },
    onSubmit: () => {},
  });

  const [isEditing, setIsEditing] = useState(false);

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

      setIsEditing(false);
    },
  });

  const totalItems = useMemo(() => {
    return (
      ["ban1", "ban2", "ban3", "ban4", "ban5", "unlock1"] as const
    ).reduce(
      (acc, key) => {
        const targetStatistics = (getCubeStatistics.data || []).find(
          (item) => item.name === getTicketName(key)
        );
        const targetCubeQuantity = cubeCharacter[key];

        return {
          gold:
            acc.gold +
            targetCubeQuantity *
              (targetStatistics?.jewelry || 0) *
              (targetStatistics?.jewelryPrice || 0),
          silver:
            acc.silver + targetCubeQuantity * (targetStatistics?.shilling || 0),
          cardExp:
            acc.cardExp + targetCubeQuantity * (targetStatistics?.cardExp || 0),
          t3Jewel:
            acc.t3Jewel +
            targetCubeQuantity *
              (key.includes("ban") ? targetStatistics?.jewelry || 0 : 0),
          t3Aux1:
            acc.t3Aux1 +
            targetCubeQuantity * (targetStatistics?.solarGrace || 0),
          t3Aux2:
            acc.t3Aux2 +
            targetCubeQuantity * (targetStatistics?.solarBlessing || 0),
          t3Aux3:
            acc.t3Aux3 +
            targetCubeQuantity * (targetStatistics?.solarProtection || 0),
          t3LeapStone:
            acc.t3LeapStone +
            targetCubeQuantity *
              (key.includes("ban") ? targetStatistics?.leapStone || 0 : 0),
          t4Jewel:
            acc.t4Jewel +
            targetCubeQuantity *
              (key.includes("unlock") ? targetStatistics?.jewelry || 0 : 0),
          t4LeapStone:
            acc.t4LeapStone +
            targetCubeQuantity *
              (key.includes("unlock") ? targetStatistics?.leapStone || 0 : 0),
        };
      },
      {
        gold: 0,
        silver: 0,
        cardExp: 0,
        t3Jewel: 0,
        t3Aux1: 0,
        t3Aux2: 0,
        t3Aux3: 0,
        t3LeapStone: 0,
        t4Jewel: 0,
        t4LeapStone: 0,
      }
    );
  }, [cubeCharacter, getCubeStatistics.data]);

  /* const calculateTotalAndTradable = () => {
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
  }; */

  const formatNumber = (num: number) => num.toLocaleString();

  return (
    <Wrapper>
      <DeleteButton
        onClick={() => {
          removeCubeCharacter.mutate(cubeCharacter.characterId);
        }}
      >
        <MdClose size={14} />
      </DeleteButton>

      <Title>
        {cubeCharacter.characterName}{" "}
        <Level>Lv. {cubeCharacter.itemLevel}</Level>
      </Title>

      <CubeStages>
        {ticketKeys
          .map((key) => ({
            label: getTicketName(key),
            name: key,
          }))
          .map((item) => (
            <StageRow key={item.name}>
              <StageLabel>{item.label}</StageLabel>
              <StageInput
                type="number"
                disabled={!isEditing}
                {...formik.getFieldProps(item.name)}
              />
            </StageRow>
          ))}
      </CubeStages>

      <Button
        fullWidth
        variant="contained"
        size="large"
        onClick={() => {
          if (isEditing) {
            updateCubeCharacter.mutate({
              cubeId: cubeCharacter.cubeId,
              characterId: cubeCharacter.characterId,
              ...formik.values,
            });
          } else {
            setIsEditing(true);
          }
        }}
      >
        {isEditing ? "저장하고 계산하기" : "수정하기"}
      </Button>
      <TotalTicket>
        <span>총</span>
        <span>
          {ticketKeys.reduce((acc, key) => acc + cubeCharacter[key], 0)}장
        </span>
      </TotalTicket>
      <Caution>해당 데이터는 API로 계산된 평균 값입니다.</Caution>

      <SectionTitle>거래가능 재화</SectionTitle>
      <Items>
        {totalItems.t3Jewel > 0 && (
          <Item $icon={T3JewelIcon} aria-label="티어3 보석">
            {formatNumber(totalItems.t3Jewel)}개
          </Item>
        )}
        {totalItems.t4Jewel > 0 && (
          <Item $icon={T4JewelIcon} aria-label="티어4 보석">
            {formatNumber(totalItems.t4Jewel)}개
          </Item>
        )}
        <Item $icon={GoldIcon} aria-label="골드">
          {formatNumber(totalItems.gold)} G
        </Item>
      </Items>

      <SectionTitle>거래불가 재화</SectionTitle>
      <Items>
        {(
          [
            {
              label: "티어3 돌파석",
              value: totalItems.t3LeapStone,
              icon: LeapStoneIcon,
            },
            {
              label: "티어4 돌파석",
              value: totalItems.t4LeapStone,
              icon: LeapStoneIcon,
            },
            { label: "실링", value: totalItems.silver, icon: SilverIcon },
            {
              label: "카드경험치",
              value: totalItems.cardExp,
              icon: CardExpIcon,
            },
            {
              label: "은총",
              value: totalItems.t3Aux1,
              icon: T3Aux1Icon,
            },
            {
              label: "축복",
              value: totalItems.t3Aux2,
              icon: T3Aux2Icon,
            },
            {
              label: "가호",
              value: totalItems.t3Aux3,
              icon: T3Aux3Icon,
            },
          ] as const
        ).map((item) => (
          <Item key={item.label} $icon={item.icon} aria-label={item.label}>
            {formatNumber(item.value)}
            {!["실링", "카드경험치"].includes(item.label) && "개"}
          </Item>
        ))}
      </Items>
    </Wrapper>
  );
};

export default CubeCharacterModal;

const getTicketName = (key: string) => {
  switch (key) {
    case "ban1":
      return "1금제";
    case "ban2":
      return "2금제";
    case "ban3":
      return "3금제";
    case "ban4":
      return "4금제";
    case "ban5":
      return "5금제";
    case "unlock1":
      return "1해금";
    default:
      return "";
  }
};

const Wrapper = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: stretch;
  border-radius: 16px;
  padding: 18px;
  color: ${({ theme }) => theme.app.text.dark1};
  border: 1px solid ${({ theme }) => theme.app.border};
  background-color: ${({ theme }) => theme.app.bg.white};
`;

const DeleteButton = styled.button`
  position: absolute;
  top: -7px;
  right: -9px;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 24px;
  height: 24px;
  background: ${({ theme }) => theme.app.text.dark1};
  color: ${({ theme }) => theme.app.text.reverse};
  border-radius: 50%;
  opacity: 0.7;
  transition: opacity 0.3s;

  &:hover {
    opacity: 1;
  }
`;

const Title = styled.p`
  text-align: left;
  margin-bottom: 16px;
  font-size: 18px;
  font-weight: 700;
  color: ${({ theme }) => theme.app.text.dark1};
`;

const Level = styled.span`
  margin-left: 4px;
  font-size: 15px;
  font-weight: 500;
  color: ${({ theme }) => theme.app.text.light2};
`;

const CubeStages = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 15px;
`;

const StageRow = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
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

const TotalTicket = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  margin: 24px -18px 0;
  padding: 16px 30px 16px;
  border-top: 1px solid ${({ theme }) => theme.app.border};
  font-size: 15px;
`;

const Caution = styled.p`
  padding-top: 16px;
  text-align: center;
  font-size: 13px;
  color: ${({ theme }) => theme.app.text.light2};
  border-top: 1px dashed ${({ theme }) => theme.app.border};
`;

const SectionTitle = styled.h3`
  margin: 16px 0 6px;
  font-size: 16px;
  font-weight: 600;
`;

const Items = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  flex-wrap: wrap;
  gap: 4px;
`;

const Item = styled.span<{ $icon: string }>`
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 12px;
  border: 1px solid ${({ theme }) => theme.app.border};
  background: url(${({ $icon }) => $icon}) no-repeat top 11px center / auto 16px;
  padding: 34px 0 6px 0;
  font-size: 15px;
`;
