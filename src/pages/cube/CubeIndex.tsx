import { MdClose } from "@react-icons/all-files/md/MdClose";
import { useQueryClient } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import styled from "styled-components";

import DefaultLayout from "@layouts/DefaultLayout";

import SelectCharacterModal from "@pages/cube/components/SelectCharacterModal";

import useRemoveCubeCharacter from "@core/hooks/mutations/cube/useRemoveCubeCharacter";
import useCubeCharacters from "@core/hooks/queries/cube/useCubeCharacters";
import useCubeRewards from "@core/hooks/queries/cube/useCubeRewards";
import { calculateCubeReward } from "@core/utils";
import queryKeyGenerator from "@core/utils/queryKeyGenerator";

import Button from "@components/Button";
import CubeCharacterManager from "@components/CubeCharacterManager";
import CubeRewardsModal from "@components/CubeRewardsModal";

import CardExpIcon from "@assets/images/ico_card_exp.png";
import GoldIcon from "@assets/images/ico_gold.png";
import SilverIcon from "@assets/images/ico_silver.png";
import T3Aux1Icon from "@assets/images/ico_t3_aux1.png";
import T3Aux2Icon from "@assets/images/ico_t3_aux2.png";
import T3Aux3Icon from "@assets/images/ico_t3_aux3.png";
import T3LeapStoneIcon from "@assets/images/ico_t3_leap_stone.png";
import T4LeapStoneIcon from "@assets/images/ico_t4_leap_stone.png";

const CubeIndex = () => {
  const queryClient = useQueryClient();
  const removeCubeCharacter = useRemoveCubeCharacter({
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeyGenerator.getCubeCharacters(),
      });
    },
  });
  const getCubeRewards = useCubeRewards();
  const getCubeCharacters = useCubeCharacters();

  const [cubeRewardsModalOpen, setCubeRewardsModalOpen] = useState(false);
  const [addCharacterModalOpen, setAddCharacterModalOpen] = useState(false);

  const totalRewards = useMemo(() => {
    return (getCubeCharacters.data || [])
      .map((cubeCharacter) =>
        calculateCubeReward({
          currentCubeTickets: cubeCharacter,
          cubeRewards: getCubeRewards.data,
        })
      )
      .reduce(
        (acc, item) => {
          return {
            cardExp: acc.cardExp + item.cardExp,
            gold: acc.gold + item.gold,
            silver: acc.silver + item.silver,
            t3Aux1: acc.t3Aux1 + item.t3Aux1,
            t3Aux2: acc.t3Aux2 + item.t3Aux2,
            t3Aux3: acc.t3Aux3 + item.t3Aux3,
            t3Jewel: acc.t3Jewel + item.t3Jewel,
            t3LeapStone: acc.t3LeapStone + item.t3LeapStone,
            t4Jewel: acc.t4Jewel + item.t4Jewel,
            t4LeapStone: acc.t4LeapStone + item.t4LeapStone,
          };
        },
        {
          cardExp: 0,
          gold: 0,
          silver: 0,
          t3Aux1: 0,
          t3Aux2: 0,
          t3Aux3: 0,
          t3Jewel: 0,
          t3LeapStone: 0,
          t4Jewel: 0,
          t4LeapStone: 0,
        }
      );
  }, [getCubeCharacters, getCubeRewards]);

  const existingCharacterIds = (getCubeCharacters.data || []).map(
    (cube) => cube.characterId
  );

  if (!getCubeCharacters.data || !getCubeRewards.data) {
    return null;
  }

  return (
    <DefaultLayout
      pageTitle="큐브 계산기"
      description="숙제 탭의 큐브와 분리되어있으며 전체 캐릭의 큐브 수익을 확인할 수 있습니다."
    >
      <Wrapper>
        <TotalRow>
          <TotalCard $flex={1}>
            <dt>총 보석골드</dt>
            <dd>
              <WithIcon $icon={GoldIcon}>
                {totalRewards.gold.toLocaleString()}
              </WithIcon>
            </dd>
          </TotalCard>
          <TotalCard $flex={3}>
            <dt>총 재화수익</dt>
            <dd>
              <ul>
                <li>
                  <WithIcon $icon={T3LeapStoneIcon}>
                    {totalRewards.t3LeapStone.toLocaleString()}
                  </WithIcon>
                </li>
                <li>
                  <WithIcon $icon={T4LeapStoneIcon}>
                    {totalRewards.t4LeapStone.toLocaleString()}
                  </WithIcon>
                </li>
                <li>
                  <WithIcon $icon={SilverIcon}>
                    {totalRewards.silver.toLocaleString()}
                  </WithIcon>
                </li>
                <li>
                  <WithIcon $icon={T3Aux1Icon}>
                    {totalRewards.t3Aux1.toLocaleString()}
                  </WithIcon>
                </li>
                <li>
                  <WithIcon $icon={T3Aux2Icon}>
                    {totalRewards.t3Aux2.toLocaleString()}
                  </WithIcon>
                </li>
                <li>
                  <WithIcon $icon={T3Aux3Icon}>
                    {totalRewards.t3Aux3.toLocaleString()}
                  </WithIcon>
                </li>
                <li>
                  <WithIcon $icon={CardExpIcon}>
                    {totalRewards.cardExp.toLocaleString()}
                  </WithIcon>
                </li>
              </ul>
            </dd>
          </TotalCard>
        </TotalRow>

        <Buttons>
          <Button
            variant="contained"
            size="large"
            onClick={() => setCubeRewardsModalOpen(true)}
          >
            큐브 보상 보기
          </Button>

          <Button
            variant="contained"
            size="large"
            onClick={() => setAddCharacterModalOpen(true)}
          >
            새 캐릭터 추가
          </Button>
        </Buttons>

        <Characters>
          {getCubeCharacters.data.map((item) => (
            <CubeCharacterItem key={item.characterId}>
              <RemoveButton
                onClick={() => {
                  removeCubeCharacter.mutate(item.characterId);
                }}
              >
                <MdClose size={14} />
              </RemoveButton>

              <CubeCharacterManager characterId={item.characterId} />
            </CubeCharacterItem>
          ))}
        </Characters>
      </Wrapper>

      <CubeRewardsModal
        isOpen={cubeRewardsModalOpen}
        onClose={() => setCubeRewardsModalOpen(false)}
      />
      <SelectCharacterModal
        isOpen={addCharacterModalOpen}
        onClose={() => setAddCharacterModalOpen(false)}
        existingCharacterIds={existingCharacterIds}
      />
    </DefaultLayout>
  );
};

export default CubeIndex;

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  width: 100%;
`;

const TotalRow = styled.div`
  display: flex;
  flex-direction: row;
  gap: 12px;
  width: 100%;
`;

const TotalCard = styled.dl<{ $flex: number }>`
  flex: ${({ $flex }) => $flex};
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  border-radius: 12px;
  color: ${({ theme }) => theme.app.text.dark2};
  background: ${({ theme }) => theme.app.bg.white};
  border: 1px solid ${({ theme }) => theme.app.border};

  dt {
    font-size: 16px;
  }

  dd {
    font-size: 18px;

    ul {
      display: flex;
      flex-direction: row;
      align-items: center;

      li {
        display: flex;
        flex-direction: row;
        align-items: center;
        gap: 8px;

        &:not(:first-of-type):before {
          content: "";
          display: block;
          margin-left: 8px;
          width: 1px;
          height: 14px;
          background: ${({ theme }) => theme.app.border};
        }
      }
    }
  }
`;

const CubeCharacterItem = styled.div`
  position: relative;
  border-radius: 16px;
  padding: 18px;
  border: 1px solid ${({ theme }) => theme.app.border};
  background-color: ${({ theme }) => theme.app.bg.white};
`;

const RemoveButton = styled.button`
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

const WithIcon = styled.span<{ $icon: string }>`
  padding-left: 23px;
  background: url(${({ $icon }) => $icon}) no-repeat left center / 16px;
  font-weight: 700;
`;

const Buttons = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: flex-start;
`;

const Characters = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr;
  gap: 20px;
`;
