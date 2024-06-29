import { useTheme } from "@emotion/react";
import styled from "@emotion/styled";
import { RiMoreFill } from "@react-icons/all-files/ri/RiMoreFill";
import { useQueryClient } from "@tanstack/react-query";
import type { FC } from "react";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useSetRecoilState } from "recoil";

import * as characterApi from "@core/apis/character.api";
import * as friendApi from "@core/apis/friend.api";
import { loading } from "@core/atoms/loading.atom";
import useModalState from "@core/hooks/useModalState";
import { CharacterType } from "@core/types/character";
import { FriendType } from "@core/types/friend";
import queryKeyGenerator from "@core/utils/queryKeyGenerator";

import BoxTitle from "@components/BoxTitle";
import Modal from "@components/Modal";

import Check, * as CheckStyledComponents from "./button/Check";
import RestGauge, * as RestGaugeStyledComponents from "./button/RestGauge";
import GoldText from "./text/GoldText";

interface Props {
  character: CharacterType;
  friend?: FriendType;
}

const DayilyContents: FC<Props> = ({ character, friend }) => {
  const queryClient = useQueryClient();

  const theme = useTheme();
  const [modalState, setModalState] = useModalState<string>();

  const [localCharacter, setLocalCharacter] =
    useState<CharacterType>(character);
  const setLoadingState = useSetRecoilState(loading);

  useEffect(() => {
    setLocalCharacter(character);
  }, [character]);

  // 일일 숙제 체크/해제
  const updateDayContent = async (
    character: CharacterType,
    category: string
  ) => {
    setLoadingState(true);
    if (friend) {
      if (!friend.fromFriendSettings.checkDayTodo) {
        toast.warn("권한이 없습니다.");
        setLoadingState(false);
        return;
      }
      try {
        await friendApi.updateDayContent(
          character.characterId,
          character.characterName,
          category
        );
        queryClient.invalidateQueries({
          queryKey: queryKeyGenerator.getFriends(),
        });
        setLocalCharacter(character);
      } catch (error) {
        console.error("Error updating day content:", error);
      } finally {
        setLoadingState(false);
      }
    } else {
      try {
        await characterApi.updateDayContent(
          character.characterId,
          character.characterName,
          category
        );
        queryClient.invalidateQueries({
          queryKey: queryKeyGenerator.getCharacters(),
        });
        setLocalCharacter(character);
      } catch (error) {
        console.error("Error updating day content:", error);
      } finally {
        setLoadingState(false);
      }
    }
  };

  // 일일 숙제 전체 체크/해제
  const updateDayContentAll = async (
    character: CharacterType,
    category: string
  ) => {
    setLoadingState(true);
    if (friend) {
      if (!friend.fromFriendSettings.checkDayTodo) {
        toast.warn("권한이 없습니다.");
        setLoadingState(false);
        return;
      }
      try {
        await friendApi.updateDayContentAll(
          character.characterId,
          character.characterName,
          category
        );
        queryClient.invalidateQueries({
          queryKey: queryKeyGenerator.getFriends(),
        });
        setLocalCharacter(character);
      } catch (error) {
        console.error("Error updating day content:", error);
      } finally {
        setLoadingState(false);
      }
    } else {
      try {
        await characterApi.updateDayContentAll(
          character.characterId,
          character.characterName,
          category
        );
        queryClient.invalidateQueries({
          queryKey: queryKeyGenerator.getCharacters(),
        });
        setLocalCharacter(character);
      } catch (error) {
        console.error("Error updating day content All:", error);
      } finally {
        setLoadingState(false);
      }
    }
  };

  // 캐릭터 휴식게이지 업데이트
  const updateDayContentGauge = async (
    updatedCharacter: CharacterType,
    gaugeType: string
  ) => {
    setLoadingState(true);

    if (friend) {
      if (!friend.fromFriendSettings.checkDayTodo) {
        toast.warn("권한이 없습니다.");
        setLoadingState(false);
        return;
      }
      const newGaugeValue = window.prompt(`휴식게이지 수정`);
      if (newGaugeValue !== null) {
        const parsedValue = Number(newGaugeValue);
        if (!Number.isNaN(parsedValue)) {
          try {
            // Update the localCharacter object immutably
            const updatedGaugeCharacter = { ...updatedCharacter };
            if (gaugeType === "chaos") {
              updatedGaugeCharacter.chaosGauge = parsedValue;
            } else if (gaugeType === "guardian") {
              updatedGaugeCharacter.guardianGauge = parsedValue;
            } else if (gaugeType === "epona") {
              updatedGaugeCharacter.eponaGauge = parsedValue;
            } else {
              return;
            }
            await friendApi.updateDayContentGauge(
              updatedGaugeCharacter.characterId,
              updatedGaugeCharacter.characterName,
              updatedGaugeCharacter.chaosGauge,
              updatedGaugeCharacter.guardianGauge,
              updatedGaugeCharacter.eponaGauge
            );
            queryClient.invalidateQueries({
              queryKey: queryKeyGenerator.getFriends(),
            });
            setLocalCharacter((prevCharacter) => ({
              ...prevCharacter,
              ...updatedGaugeCharacter,
            }));
          } catch (error) {
            console.error("Error updating day content gauge:", error);
          } finally {
            setLoadingState(false);
          }
        } else {
          setLoadingState(false);
        }
      }
    } else {
      const newGaugeValue = window.prompt(`휴식게이지 수정`);
      if (newGaugeValue !== null) {
        const parsedValue = Number(newGaugeValue);
        if (!Number.isNaN(parsedValue)) {
          try {
            // Update the localCharacter object immutably
            const updatedGaugeCharacter = { ...updatedCharacter };
            if (gaugeType === "chaos") {
              updatedGaugeCharacter.chaosGauge = parsedValue;
            } else if (gaugeType === "guardian") {
              updatedGaugeCharacter.guardianGauge = parsedValue;
            } else if (gaugeType === "epona") {
              updatedGaugeCharacter.eponaGauge = parsedValue;
            } else {
              return;
            }
            await characterApi.updateDayContentGauge(
              updatedGaugeCharacter.characterId,
              updatedGaugeCharacter.characterName,
              updatedGaugeCharacter.chaosGauge,
              updatedGaugeCharacter.guardianGauge,
              updatedGaugeCharacter.eponaGauge
            );
            queryClient.invalidateQueries({
              queryKey: queryKeyGenerator.getCharacters(),
            });
            setLocalCharacter((prevCharacter) => ({
              ...prevCharacter,
              ...updatedGaugeCharacter,
            }));
          } catch (error) {
            console.error("Error updating day content gauge:", error);
          } finally {
            setLoadingState(false);
          }
        }
      } else {
        setLoadingState(false);
      }
    }
  };

  return (
    <>
      <Wrapper>
        <TitleRow>
          <BoxTitle>일일 숙제</BoxTitle>
        </TitleRow>

        {(friend === undefined || friend.fromFriendSettings?.showDayTodo) &&
          localCharacter.settings.showEpona && (
            <>
              <Check
                indicatorColor={theme.app.blue1}
                totalCount={3}
                currentCount={localCharacter.eponaCheck}
                onClick={() => updateDayContent(localCharacter, "epona")}
                onRightClick={() =>
                  updateDayContentAll(localCharacter, "epona")
                }
              >
                에포나의뢰
              </Check>
              <RestGauge
                currentValue={localCharacter.eponaGauge}
                onClick={() => updateDayContentGauge(localCharacter, "epona")}
              />
            </>
          )}

        {(friend === undefined || friend.fromFriendSettings?.showDayTodo) &&
          localCharacter.settings.showChaos && (
            <>
              <Check
                indicatorColor={theme.app.blue1}
                totalCount={2}
                currentCount={localCharacter.chaosCheck}
                onClick={() => updateDayContent(localCharacter, "chaos")}
                onRightClick={() =>
                  updateDayContentAll(localCharacter, "chaos")
                }
                rightButtons={[
                  {
                    onClick: () => setModalState("카오스던전"),
                    icon: <RiMoreFill />,
                  },
                ]}
              >
                <ContentNameWithGold>
                  카오스던전
                  <GoldText>{localCharacter.chaosGold}</GoldText>
                </ContentNameWithGold>
              </Check>
              <RestGauge
                currentValue={localCharacter.chaosGauge}
                onClick={() => updateDayContentGauge(localCharacter, "chaos")}
              />
            </>
          )}

        {(friend === undefined || friend.fromFriendSettings?.showDayTodo) &&
          localCharacter.settings.showGuardian && (
            <>
              <Check
                indicatorColor={theme.app.blue1}
                totalCount={1}
                currentCount={localCharacter.guardianCheck}
                onClick={() => updateDayContent(localCharacter, "guardian")}
                onRightClick={() =>
                  updateDayContentAll(localCharacter, "guardian")
                }
                rightButtons={[
                  {
                    onClick: () => setModalState("가디언토벌"),
                    icon: <RiMoreFill />,
                  },
                ]}
              >
                <ContentNameWithGold>
                  가디언토벌
                  <GoldText>{localCharacter.guardianGold}</GoldText>
                </ContentNameWithGold>
              </Check>
              <RestGauge
                currentValue={localCharacter.guardianGauge}
                onClick={() =>
                  updateDayContentGauge(localCharacter, "guardian")
                }
              />
            </>
          )}
      </Wrapper>

      {modalState && (
        <Modal
          title={`${character.characterName} ${modalState} 평균 데이터`}
          isOpen
          onClose={() => setModalState()}
        >
          <ModalContentWrapper>
            <ModalSubTitle>
              API 최근 경매장 가격으로 평균 값을 가져옵니다.
            </ModalSubTitle>

            {modalState === "카오스던전" ? (
              <>
                <ContentName>컨텐츠 {character.chaos.name}</ContentName>

                <ProfitList>
                  <li>
                    <Profit>
                      <dt>거래 가능 재화</dt>
                      <dd>
                        파괴석
                        <strong>{character.chaos.destructionStone}개</strong>
                      </dd>
                      <dd>
                        수호석
                        <strong>{character.chaos.guardianStone}개</strong>
                      </dd>
                      <dd>
                        1레벨보석 <strong>{character.chaos.jewelry}개</strong>
                      </dd>
                    </Profit>
                  </li>
                  <li>
                    <Profit>
                      <dt>거래 불가 재화</dt>
                      <dd>
                        돌파석 <strong>{character.chaos.leapStone}개</strong>
                      </dd>
                      <dd>
                        실링 <strong>{character.chaos.shilling}개</strong>
                      </dd>
                      <dd>
                        파편 <strong>{character.chaos.honorShard}개</strong>
                      </dd>
                    </Profit>
                  </li>
                </ProfitList>
              </>
            ) : (
              <>
                <ContentName>컨텐츠 {character.guardian.name}</ContentName>

                <ProfitList>
                  <li>
                    <Profit>
                      <dt>거래 가능 재화</dt>
                      <dd>
                        파괴석{" "}
                        <strong>{character.guardian.destructionStone}개</strong>
                      </dd>
                      <dd>
                        수호석{" "}
                        <strong>{character.guardian.guardianStone}개</strong>
                      </dd>
                      <dd>
                        돌파석 <strong>{character.guardian.leapStone}개</strong>
                      </dd>
                    </Profit>
                  </li>
                </ProfitList>
              </>
            )}
          </ModalContentWrapper>
        </Modal>
      )}
    </>
  );
};

export default DayilyContents;

const Wrapper = styled.div`
  width: 100%;
  background: ${({ theme }) => theme.app.bg.light};

  ${CheckStyledComponents.Wrapper} , ${RestGaugeStyledComponents.Wrapper} {
    border-top: 1px solid ${({ theme }) => theme.app.border};
  }
`;

const TitleRow = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  padding: 5px 10px;
`;

const ContentNameWithGold = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  line-height: 1;
  gap: 2px;
`;

const ModalContentWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const ModalSubTitle = styled.p`
  margin-bottom: 10px;
  font-size: 14px;
  color: ${({ theme }) => theme.app.text.light2};
`;

const ContentName = styled.p`
  color: ${({ theme }) => theme.app.blue2};
  font-size: 16px;
`;

const ProfitList = styled.ul`
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  margin-top: 10px;

  ${({ theme }) => theme.medias.max500} {
    flex-direction: column;
  }

  li {
    width: 160px;

    &:not(:last-of-type) {
      padding-right: 20px;

      ${({ theme }) => theme.medias.max500} {
        padding-right: 0;
        padding-bottom: 20px;
      }
    }
  }

  li + li {
    padding-left: 20px;
    border-left: 1px solid ${({ theme }) => theme.app.border};

    ${({ theme }) => theme.medias.max500} {
      padding-left: 0;
      padding-top: 20px;
      border-left: none;
      border-top: 1px solid ${({ theme }) => theme.app.border};
    }
  }
`;

const Profit = styled.dl`
  dt {
    text-align: center;
  }

  dd {
    color: ${({ theme }) => theme.app.text.light1};

    strong {
      margin-left: 5px;
      color: ${({ theme }) => theme.app.text.black};
      font-weight: 700;
    }
  }
`;
