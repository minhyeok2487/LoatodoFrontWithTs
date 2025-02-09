import { useState } from "react";
import { toast } from "react-toastify";
import styled, { useTheme } from "styled-components";

import {
  useCheckDailyTodo,
  useCheckDailyTodoAll,
  useUpdateRestGauge,
} from "@core/hooks/mutations/todo";
import useModalState from "@core/hooks/useModalState";
import { updateCharacterQueryData } from "@core/lib/queryClient";
import type { Character } from "@core/types/character";
import type { Friend } from "@core/types/friend";

import BoxTitle from "@components/BoxTitle";
import Modal from "@components/Modal";

import EditIcon from "@assets/svg/EditIcon";
import MoreDetailIcon from "@assets/svg/MoreDetailIcon";

import Check, * as CheckStyledComponents from "./element/Check";
import CustomContents from "./element/CustomContents";
import RestGauge, * as RestGaugeStyledComponents from "./element/RestGauge";
import GoldText from "./text/GoldText";

interface Props {
  character: Character;
  friend?: Friend;
}

const DailyContents = ({ character, friend }: Props) => {
  const theme = useTheme();
  const [modalState, setModalState] = useModalState<string>();
  const [addCustomTodoMode, setAddCustomTodoMode] = useState(false);

  const isKurzan = character.itemLevel >= 1640;

  const checkDailyTodo = useCheckDailyTodo({
    onSuccess: (character, { friendUsername }) => {
      updateCharacterQueryData({
        character,
        friendUsername,
      });
    },
  });

  const checkDailyTodoAll = useCheckDailyTodoAll({
    onSuccess: (character, { friendUsername }) => {
      updateCharacterQueryData({
        character,
        friendUsername,
      });
    },
  });

  const updateRestGauge = useUpdateRestGauge({
    onSuccess: (character, { friendUsername }) => {
      updateCharacterQueryData({
        character,
        friendUsername,
      });
    },
  });

  const requestRestGauge = (
    gaugeType: "eponaGauge" | "chaosGauge" | "guardianGauge"
  ): number | null => {
    const maxValue = gaugeType === "chaosGauge" ? 200 : 100;
    const input = window.prompt(`휴식게이지 수정`);
    if (input !== null) {
      const newNumber = Number(input);
      if (!Number.isNaN(newNumber)) {
        if (newNumber >= 0 && newNumber <= maxValue) {
          if (newNumber % 10 === 0) {
            return Number(input);
          }

          toast.error("10 단위의 숫자만 입력이 가능합니다.");
          return null;
        }

        toast.error(`0에서 ${maxValue}까지의 숫자만 입력이 가능합니다.`);
        return null;
      }

      toast.error("숫자만 입력해주세요.");
      return null;
    }

    toast.error("휴식게이지를 입력해주세요.");
    return null;
  };

  // 캐릭터 휴식게이지 업데이트
  const handleUpdateRestGauge = (
    gaugeType: "eponaGauge" | "chaosGauge" | "guardianGauge"
  ) => {
    const newNumber = requestRestGauge(gaugeType);
    if (newNumber !== null) {
      updateRestGauge.mutate({
        friendUsername: friend?.friendUsername,
        characterId: character.characterId,
        eponaGauge: character.eponaGauge,
        chaosGauge: character.chaosGauge,
        guardianGauge: character.guardianGauge,
        [gaugeType]: newNumber,
      });
    }
  };

  // 깐부의 캐릭터라면 나에게 설정한 값도 체크해야 함
  const accessible = friend ? friend.fromFriendSettings.showDayTodo : true;

  const getDailyTodoTotalCount = (character: Character) => {
    const { showEpona, showChaos, showGuardian } = character.settings;
    let count = 0;

    if (showEpona) count += 1;
    if (showChaos) count += 1;
    if (showGuardian) count += 1;

    return count;
  };

  const getDailyTodoCheck = (character: Character) => {
    const { showEpona, showChaos, showGuardian } = character.settings;

    let count = 0;

    if (showEpona && character.eponaCheck === 3) count += 1;
    if (showChaos && character.chaosCheck === 2) count += 1;
    if (showGuardian && character.guardianCheck === 1) count += 1;

    return count;
  };

  return (
    <>
      <Wrapper>
        <TitleRow>
          {accessible && (
            <Check
              totalCount={getDailyTodoTotalCount(character)}
              currentCount={getDailyTodoCheck(character)}
              onClick={() => {
                checkDailyTodoAll.mutate({
                  friendUsername: friend?.friendUsername,
                  characterId: character.characterId,
                });
              }}
              onRightClick={() => {
                checkDailyTodoAll.mutate({
                  friendUsername: friend?.friendUsername,
                  characterId: character.characterId,
                });
              }}
              rightButtons={[
                {
                  ariaLabel: "카오스던전 보상 확인하기",
                  onClick: () => setAddCustomTodoMode(true),
                  icon: <EditIcon />,
                },
              ]}
            >
              <BoxTitle>일일 숙제</BoxTitle>
            </Check>
          )}
        </TitleRow>

        {accessible &&
          character.settings.showEpona &&
          character.beforeEponaGauge >= character.settings.thresholdEpona && (
            <TodoWrap $currentCount={character.eponaCheck} $totalCount={3}>
              <Check
                indicatorColor={theme.app.palette.blue[350]}
                totalCount={3}
                currentCount={character.eponaCheck}
                onClick={() => {
                  checkDailyTodo.mutate({
                    friendUsername: friend?.friendUsername,
                    characterId: character.characterId,
                    category: "epona",
                    allCheck: false,
                  });
                }}
                onRightClick={() => {
                  checkDailyTodo.mutate({
                    friendUsername: friend?.friendUsername,
                    characterId: character.characterId,
                    category: "epona",
                    allCheck: true,
                  });
                }}
              >
                에포나의뢰
              </Check>
              <RestGauge
                totalValue={100}
                currentValue={character.eponaGauge}
                onClick={() => handleUpdateRestGauge("eponaGauge")}
              />
            </TodoWrap>
          )}

        {accessible &&
          character.settings.showChaos &&
          character.beforeChaosGauge >= character.settings.thresholdChaos && (
            <TodoWrap $currentCount={character.chaosCheck} $totalCount={2}>
              <Check
                indicatorColor={theme.app.palette.blue[350]}
                totalCount={2}
                currentCount={character.chaosCheck}
                onClick={() => {
                  if (isKurzan) {
                    checkDailyTodo.mutate({
                      friendUsername: friend?.friendUsername,
                      characterId: character.characterId,
                      category: "chaos",
                      allCheck: true,
                    });
                  } else {
                    checkDailyTodo.mutate({
                      friendUsername: friend?.friendUsername,
                      characterId: character.characterId,
                      category: "chaos",
                      allCheck: false,
                    });
                  }
                }}
                onRightClick={() => {
                  checkDailyTodo.mutate({
                    friendUsername: friend?.friendUsername,
                    characterId: character.characterId,
                    category: "chaos",
                    allCheck: true,
                  });
                }}
                rightButtons={[
                  {
                    ariaLabel: "카오스던전 보상 확인하기",
                    onClick: () => setModalState("카오스던전"),
                    icon: <MoreDetailIcon />,
                  },
                ]}
              >
                <ContentNameWithGold>
                  {isKurzan ? "쿠르잔 전선" : "카오스던전"}
                  <GoldText>{character.chaosGold.toFixed(2)}</GoldText>
                </ContentNameWithGold>
              </Check>
              <RestGauge
                totalValue={200}
                currentValue={character.chaosGauge}
                onClick={() => handleUpdateRestGauge("chaosGauge")}
              />
            </TodoWrap>
          )}

        {accessible &&
          character.settings.showGuardian &&
          character.beforeGuardianGauge >=
            character.settings.thresholdGuardian && (
            <TodoWrap $currentCount={character.guardianCheck} $totalCount={1}>
              <Check
                indicatorColor={theme.app.palette.blue[350]}
                totalCount={1}
                currentCount={character.guardianCheck}
                onClick={() => {
                  checkDailyTodo.mutate({
                    friendUsername: friend?.friendUsername,
                    characterId: character.characterId,
                    category: "guardian",
                    allCheck: false,
                  });
                }}
                onRightClick={() => {
                  checkDailyTodo.mutate({
                    friendUsername: friend?.friendUsername,
                    characterId: character.characterId,
                    category: "guardian",
                    allCheck: true,
                  });
                }}
                rightButtons={[
                  {
                    ariaLabel: "가디언토벌 보상 확인하기",
                    onClick: () => setModalState("가디언토벌"),
                    icon: <MoreDetailIcon />,
                  },
                ]}
              >
                <ContentNameWithGold>
                  가디언토벌
                  <GoldText>{character.guardianGold.toFixed(2)}</GoldText>
                </ContentNameWithGold>
              </Check>
              <RestGauge
                totalValue={100}
                currentValue={character.guardianGauge}
                onClick={() => handleUpdateRestGauge("guardianGauge")}
              />
            </TodoWrap>
          )}

        {accessible && (
          <CustomContents
            setAddMode={setAddCustomTodoMode}
            addMode={addCustomTodoMode}
            character={character}
            friend={friend}
            frequency="DAILY"
          />
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

export default DailyContents;

const Wrapper = styled.div`
  width: 100%;
  background: ${({ theme }) => theme.app.bg.white};

  ${CheckStyledComponents.Wrapper}, ${RestGaugeStyledComponents.Wrapper} {
    border-top: 1px solid ${({ theme }) => theme.app.border};
  }
`;

const TitleRow = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: 0px;
  color: ${({ theme }) => theme.app.text.black};
`;

const TodoWrap = styled.div<{
  $currentCount: number;
  $totalCount: number;
}>`
  opacity: ${(props) => (props.$currentCount === props.$totalCount ? 0.5 : 1)};
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
  color: ${({ theme }) => theme.app.palette.smokeBlue[500]};
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
