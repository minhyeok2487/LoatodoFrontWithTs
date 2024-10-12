import { FiMinus } from "@react-icons/all-files/fi/FiMinus";
import { FiPlus } from "@react-icons/all-files/fi/FiPlus";
import { useQueryClient } from "@tanstack/react-query";
import { useFormik } from "formik";
import { useMemo, useState } from "react";
import styled, { css } from "styled-components";

import useUpdateCubeCharacter from "@core/hooks/mutations/cube/useUpdateCubeCharacter";
import useCubeCharacters from "@core/hooks/queries/cube/useCubeCharacters";
import useCubeRewards from "@core/hooks/queries/cube/useCubeRewards";
import { CubeCharacter, CurrentCubeTickets } from "@core/types/cube";
import {
  calculateCubeReward,
  getCubeTicketKeys,
  getCubeTicketNameByKey,
} from "@core/utils";
import queryKeyGenerator from "@core/utils/queryKeyGenerator";

import Button from "@components/Button";

import CardExpIcon from "@assets/images/ico_card_exp.png";
import GoldIcon from "@assets/images/ico_gold.png";
import SilverIcon from "@assets/images/ico_silver.png";
import T3Aux1Icon from "@assets/images/ico_t3_aux1.png";
import T3Aux2Icon from "@assets/images/ico_t3_aux2.png";
import T3Aux3Icon from "@assets/images/ico_t3_aux3.png";
import T3JewelIcon from "@assets/images/ico_t3_jewel.png";
import T3LeapStoneIcon from "@assets/images/ico_t3_leap_stone.png";
import T4JewelIcon from "@assets/images/ico_t4_jewel.png";
import T4LeapStoneIcon from "@assets/images/ico_t4_leap_stone.png";

interface Props {
  characterId: number;
}

const CubeCharacterManager = ({ characterId }: Props) => {
  const queryClient = useQueryClient();
  const getCubeCharacters = useCubeCharacters();

  const cubeCharacter = (getCubeCharacters?.data ?? []).find(
    (cubeCharacter) => cubeCharacter.characterId === characterId
  );
  const [isEditing, setIsEditing] = useState(false);
  const formik = useFormik({
    enableReinitialize: true,
    initialValues: cubeCharacter
      ? getCubeTicketKeys(cubeCharacter).reduce<CurrentCubeTickets>(
          (acc, key) => ({ ...acc, [key]: cubeCharacter[key] || 0 }),
          {}
        )
      : {},
    onSubmit: () => {},
  });

  const getCubeRewards = useCubeRewards();
  const updateCubeCharacter = useUpdateCubeCharacter({
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeyGenerator.getCubeCharacters(),
      });

      setIsEditing(false);
    },
  });

  const totalItems = useMemo(() => {
    if (cubeCharacter) {
      return calculateCubeReward({
        currentCubeTickets: cubeCharacter,
        cubeRewards: getCubeRewards.data,
      });
    }

    return null;
  }, [cubeCharacter, getCubeRewards.data]);

  if (!cubeCharacter || !totalItems) {
    return null;
  }

  const cubeTicketKeys = getCubeTicketKeys(cubeCharacter);

  return (
    <Wrapper>
      <Title>
        {cubeCharacter.characterName}{" "}
        <Level>Lv. {cubeCharacter.itemLevel}</Level>
      </Title>

      <List>
        {cubeTicketKeys
          .map((key) => ({
            label: getCubeTicketNameByKey(key),
            name: key,
          }))
          .map((item) => {
            const currentCount = cubeCharacter[item.name] as number;

            return (
              <li key={item.name}>
                <dl>
                  <dt>{item.label}</dt>
                </dl>
                <dd>
                  <Button
                    css={actionButtonCss}
                    variant="icon"
                    disabled={isEditing || currentCount <= 0}
                    onClick={() => {
                      updateCubeCharacter.mutate({
                        ...cubeCharacter,
                        cubeId: cubeCharacter.cubeId,
                        characterId: cubeCharacter.characterId,
                        [item.name]: currentCount - 1,
                      });
                    }}
                  >
                    <FiMinus />
                  </Button>
                  <input
                    type="number"
                    disabled={!isEditing}
                    {...formik.getFieldProps(item.name)}
                  />
                  <Button
                    css={actionButtonCss}
                    variant="icon"
                    disabled={isEditing}
                    onClick={() => {
                      updateCubeCharacter.mutate({
                        ...cubeCharacter,
                        cubeId: cubeCharacter.cubeId,
                        characterId: cubeCharacter.characterId,
                        [item.name]: currentCount + 1,
                      });
                    }}
                  >
                    <FiPlus />
                  </Button>
                </dd>
              </li>
            );
          })}
      </List>

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
      <TotalTickets>
        <span>총</span>
        <span>
          {cubeTicketKeys.reduce(
            (acc, key) =>
              acc + (cubeCharacter[key as keyof CubeCharacter] as number),
            0
          )}
          장
        </span>
      </TotalTickets>
      <Caution>해당 데이터는 API로 계산된 평균 값입니다.</Caution>

      <SectionTitle>거래가능 재화</SectionTitle>
      <Items>
        {totalItems.t3Jewel > 0 && (
          <Item $icon={T3JewelIcon} aria-label="티어3 보석">
            {totalItems.t3Jewel.toLocaleString()}개
          </Item>
        )}
        {totalItems.t4Jewel > 0 && (
          <Item $icon={T4JewelIcon} aria-label="티어4 보석">
            {totalItems.t4Jewel.toLocaleString()}개
          </Item>
        )}
        <Item $icon={GoldIcon} aria-label="골드">
          {totalItems.gold.toLocaleString()} G
        </Item>
      </Items>

      <SectionTitle>거래불가 재화</SectionTitle>
      <Items>
        {(
          [
            {
              label: "티어3 돌파석",
              value: totalItems.t3LeapStone,
              icon: T3LeapStoneIcon,
            },
            {
              label: "티어4 돌파석",
              value: totalItems.t4LeapStone,
              icon: T4LeapStoneIcon,
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
            {item.value.toLocaleString()}
            {!["실링", "카드경험치"].includes(item.label) && "개"}
          </Item>
        ))}
      </Items>
    </Wrapper>
  );
};

export default CubeCharacterManager;

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: stretch;
  color: ${({ theme }) => theme.app.text.dark1};
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

const List = styled.ul`
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 15px;

  li {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    padding: 0 4px;

    dl {
      dt {
        font-size: 16px;
      }
    }

    dd {
      display: flex;
      flex-direction: row;
      align-items: center;
      gap: 5px;

      input {
        width: 50px;
        height: 30px;
        text-align: center;
        font-weight: 600;
        font-size: 14px;
        border: 1px solid ${({ theme }) => theme.app.border};
        border-radius: 8px;
        color: ${({ theme }) => theme.app.text.dark1};
        appearance: textfield;
        background: transparent;

        &:disabled {
          color: ${({ theme }) => theme.app.text.light1};
        }
        &::-webkit-inner-spin-button,
        &::-webkit-outer-spin-button {
          -webkit-appearance: none;
          margin: 0;
        }
      }
    }
  }
`;

const TotalTickets = styled.div`
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

const actionButtonCss = css`
  padding: 5px;
  background: ${({ theme }) => theme.app.bg.white} !important;
`;
