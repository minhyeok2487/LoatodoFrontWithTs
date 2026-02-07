import { MdClose } from "@react-icons/all-files/md/MdClose";
import { useQueryClient } from "@tanstack/react-query";
import { useAtom } from "jotai";
import { useMemo, useState } from "react";
import { toast } from "react-toastify";
import styled from "styled-components";

import WideDefaultLayout from "@layouts/WideDefaultLayout";

import SelectCharacterModal from "@pages/cube/components/SelectCharacterModal";

import { showWideAtom } from "@core/atoms/todo.atom";
import useRemoveCubeCharacter from "@core/hooks/mutations/cube/useRemoveCubeCharacter";
import useCubeCharacters from "@core/hooks/queries/cube/useCubeCharacters";
import useCubeRewards from "@core/hooks/queries/cube/useCubeRewards";
import { calculateCubeReward, getJewerlyResult } from "@core/utils";
import queryKeyGenerator from "@core/utils/queryKeyGenerator";

import Button from "@components/Button";
import CubeCharacterManager from "@components/CubeCharacterManager";
import CubeDashboardModal from "@components/CubeDashboardModal";

import CardExpIcon from "@assets/images/ico_card_exp.png";
import GoldIcon from "@assets/images/ico_gold.png";
import SilverIcon from "@assets/images/ico_silver.png";
import T3JewelIcon from "@assets/images/ico_t3_jewel.png";
import T4JewelIcon from "@assets/images/ico_t4_jewel.png";

const CubeIndex = () => {
  const queryClient = useQueryClient();
  const removeCubeCharacter = useRemoveCubeCharacter({
    onSuccess: () => {
      toast.success("큐브 계산기에서 캐릭터를 삭제했습니다.");

      queryClient.invalidateQueries({
        queryKey: queryKeyGenerator.getCubeCharacters(),
      });
    },
  });
  const getCubeRewards = useCubeRewards();
  const getCubeCharacters = useCubeCharacters();

  const [cubeDashboardModal, setCubeDashboardModal] = useState(false);
  const [addCharacterModal, setAddCharacterModal] = useState(false);
  const [showWide] = useAtom(showWideAtom);

  const totalItems = useMemo(() => {
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

  const totalJewerly = useMemo(() => {
    return {
      t3: getJewerlyResult(totalItems.t3Jewel),
      t4: getJewerlyResult(totalItems.t4Jewel),
    };
  }, [totalItems]);
  const visibleT3Jewel = Object.values(totalJewerly.t3).some(
    (value) => value > 0
  );
  const visibleT4Jewel = Object.values(totalJewerly.t4).some(
    (value) => value > 0
  );

  const existingCharacterIds = (getCubeCharacters.data || []).map(
    (cube) => cube.characterId
  );

  if (!getCubeCharacters.data || !getCubeRewards.data) {
    return null;
  }

  return (
    <WideDefaultLayout
      pageTitle="큐브 계산기"
      description="큐브 수익을 확인할 수 있으며 숙제 페이지와 연동 가능합니다."
    >
      <Wrapper>
        <TotalRow>
          <TotalCard $flex={1}>
            <dt>보석 결과</dt>
            {visibleT3Jewel || visibleT4Jewel ? (
              <dd>
                <ul>
                  <li>
                    <WithIcon $icon={GoldIcon}>
                      {totalItems.gold.toLocaleString()}
                    </WithIcon>
                  </li>
                  {visibleT3Jewel && (
                    <li>
                      <WithJewerly $icon={T3JewelIcon}>
                        {Object.keys(totalJewerly.t3).map((key) => {
                          const number =
                            totalJewerly.t3[
                              key as unknown as keyof (typeof totalJewerly)["t3"]
                            ];

                          if (number > 0) {
                            return (
                              <dl key={key}>
                                <dt>{key}레벨</dt> <dd>{number}개</dd>
                              </dl>
                            );
                          }

                          return null;
                        })}
                      </WithJewerly>
                    </li>
                  )}

                  {visibleT4Jewel && (
                    <li>
                      <WithJewerly $icon={T4JewelIcon}>
                        {Object.keys(totalJewerly.t4).map((key) => {
                          const number =
                            totalJewerly.t4[
                              key as unknown as keyof (typeof totalJewerly)["t4"]
                            ];

                          if (number > 0) {
                            return (
                              <dl key={key}>
                                <dt>{key}레벨</dt> <dd>{number}개</dd>
                              </dl>
                            );
                          }

                          return null;
                        })}
                      </WithJewerly>
                    </li>
                  )}
                </ul>
              </dd>
            ) : (
              <dd>-</dd>
            )}
          </TotalCard>

          <TotalCard>
            <dt>재화 총합</dt>
            <dd>
              <ul>
                <li>
                  <WithIcon $icon={SilverIcon}>
                    {totalItems.silver.toLocaleString()}
                  </WithIcon>
                </li>
                <li>
                  <WithIcon $icon={CardExpIcon}>
                    {totalItems.cardExp.toLocaleString()}
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
            onClick={() => setCubeDashboardModal(true)}
          >
            큐브 보상
          </Button>

          <Button
            variant="contained"
            size="large"
            onClick={() => setAddCharacterModal(true)}
          >
            캐릭터 추가
          </Button>
        </Buttons>

        <Characters $showWide={showWide}>
          {getCubeCharacters.data.map((item) => (
            <CubeCharacterItem key={item.characterId}>
              <RemoveButton
                onClick={() => {
                  if (
                    window.confirm(
                      `큐브 계산기에서 "${item.characterName}" 캐릭터를 삭제하시겠어요?`
                    )
                  ) {
                    removeCubeCharacter.mutate(item.characterId);
                  }
                }}
              >
                <MdClose size={14} />
              </RemoveButton>

              <CubeCharacterManager characterId={item.characterId} />
            </CubeCharacterItem>
          ))}
        </Characters>
      </Wrapper>

      <CubeDashboardModal
        isOpen={cubeDashboardModal}
        onClose={() => setCubeDashboardModal(false)}
      />
      <SelectCharacterModal
        isOpen={addCharacterModal}
        onClose={() => setAddCharacterModal(false)}
        existingCharacterIds={existingCharacterIds}
      />
    </WideDefaultLayout>
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

  ${({ theme }) => theme.medias.max900} {
    flex-direction: column;
    align-items: stretch;
  }
`;

const TotalCard = styled.dl<{ $flex?: number }>`
  flex: ${({ $flex }) => $flex || "unset"};
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  border-radius: 12px;
  color: ${({ theme }) => theme.app.text.dark2};
  background: ${({ theme }) => theme.app.bg.white};
  border: 1px solid ${({ theme }) => theme.app.border};
  overflow-x: auto;

  & > dt {
    margin-right: 20px;
    font-size: 16px;

    ${({ theme }) => theme.medias.max900} {
      font-size: 14px;
    }
  }

  & > dd {
    display: flex;
    justify-content: flex-end;
    font-size: 18px;
    overflow: hidden;

    ${({ theme }) => theme.medias.max900} {
      font-size: 14px;
    }

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
  background: ${({ theme }) => theme.app.bg.white};

  ${({ theme }) => theme.medias.max600} {
    padding: 12px;
  }
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

const WithJewerly = styled(WithIcon)`
  display: flex;
  flex-direction: row;
  padding-left: 36px;
  background-size: auto 16px;
  font-size: 16px;

  & > dl {
    display: flex;
    font-size: 16px;

    ${({ theme }) => theme.medias.max900} {
      font-size: 14px;
    }

    dt {
      margin-right: 4px;
      color: ${({ theme }) => theme.app.text.light2};
    }
    dd {
      color: ${({ theme }) => theme.app.text.dark1};
      font-weight: 700;
    }
  }

  & > dl:not(:last-of-type):after {
    content: ",";
    margin-right: 4px;
  }
`;

const Buttons = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  gap: 5px;
`;

const Characters = styled.div<{ $showWide: boolean }>`
  display: grid;
  grid-template-columns: ${({ $showWide }) =>
    $showWide ? "repeat(6, 1fr)" : "repeat(4, 1fr)"};
  gap: 20px;

  ${({ theme, $showWide }) => $showWide && theme.medias.max1520} {
    grid-template-columns: 1fr 1fr 1fr 1fr 1fr;
  }

  ${({ theme, $showWide }) => $showWide && theme.medias.max1280} {
    grid-template-columns: 1fr 1fr 1fr 1fr;
  }

  ${({ theme }) => theme.medias.max1000} {
    grid-template-columns: 1fr 1fr 1fr;
  }

  ${({ theme }) => theme.medias.max700} {
    grid-template-columns: 1fr 1fr;
  }

  ${({ theme }) => theme.medias.max500} {
    grid-template-columns: 1fr;
  }
`;
