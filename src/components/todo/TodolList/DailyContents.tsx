import { RiMoreFill } from "@react-icons/all-files/ri/RiMoreFill";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import styled, { useTheme } from "styled-components";

import useUpdateDailyTodo from "@core/hooks/mutations/character/useUpdateDailyTodo";
import useUpdateRestGauge from "@core/hooks/mutations/character/useUpdateRestGauge";
import useUpdateFriendDailyTodo from "@core/hooks/mutations/friend/useUpdateFriendDailyTodo";
import useUpdateFriendRestGauge from "@core/hooks/mutations/friend/useUpdateFriendRestGauge";
import useModalState from "@core/hooks/useModalState";
import type { UpdateDailyTodoCategory } from "@core/types/api";
import { Character } from "@core/types/character";
import { Friend } from "@core/types/friend";
import queryKeyGenerator from "@core/utils/queryKeyGenerator";

import BoxTitle from "@components/BoxTitle";
import Modal from "@components/Modal";

import Check, * as CheckStyledComponents from "./button/Check";
import RestGauge, * as RestGaugeStyledComponents from "./button/RestGauge";
import GoldText from "./text/GoldText";

interface Props {
  character: Character;
  friend?: Friend;
}

const DayilyContents = ({ character, friend }: Props) => {
  const queryClient = useQueryClient();

  const theme = useTheme();
  const [modalState, setModalState] = useModalState<string>();

  const updateDailyTodo = useUpdateDailyTodo({
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeyGenerator.getCharacters(),
      });
    },
  });
  const updateFriendDailyTodo = useUpdateFriendDailyTodo({
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeyGenerator.getFriends(),
      });
    },
  });
  const updateRestGauge = useUpdateRestGauge({
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeyGenerator.getCharacters(),
      });
    },
  });
  const updateFriendRestGauge = useUpdateFriendRestGauge({
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeyGenerator.getFriends(),
      });
    },
  });

  const handleUpdateDailyTodo = (
    category: UpdateDailyTodoCategory,
    allCheck: boolean
  ) => {
    if (friend) {
      if (!friend.fromFriendSettings.checkDayTodo) {
        toast.warn("권한이 없습니다.");
        return;
      }

      updateFriendDailyTodo.mutate({
        params: {
          characterId: character.characterId,
          characterName: character.characterName,
          category,
        },
        allCheck,
      });
    } else {
      updateDailyTodo.mutate({
        params: {
          characterId: character.characterId,
          characterName: character.characterName,
          category,
        },
        allCheck,
      });
    }
  };

  const requestNumber = (): number | null => {
    const input = window.prompt(`휴식게이지 수정`);
    if (input !== null) {
      const newNumber = Number(input);
      if (!Number.isNaN(newNumber)) {
        if (newNumber >= 0 && newNumber <= 100) {
          if (newNumber % 10 === 0) {
            return Number(input);
          }

          toast.error("10 단위의 숫자만 입력이 가능합니다.");
          return null;
        }

        toast.error("0에서 100까지의 숫자만 입력이 가능합니다.");
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
    if (friend) {
      if (!friend.fromFriendSettings.checkDayTodo) {
        toast.warn("권한이 없습니다.");
        return;
      }

      const newNumber = requestNumber();
      if (newNumber !== null) {
        updateFriendRestGauge.mutate({
          characterId: character.characterId,
          characterName: character.characterName,
          eponaGauge:
            gaugeType === "eponaGauge" ? newNumber : character.eponaGauge,
          chaosGauge:
            gaugeType === "chaosGauge" ? newNumber : character.chaosGauge,
          guardianGauge:
            gaugeType === "guardianGauge" ? newNumber : character.guardianGauge,
        });
      }
    } else {
      const newNumber = requestNumber();
      if (newNumber !== null) {
        updateRestGauge.mutate({
          characterId: character.characterId,
          characterName: character.characterName,
          eponaGauge:
            gaugeType === "eponaGauge" ? newNumber : character.eponaGauge,
          chaosGauge:
            gaugeType === "chaosGauge" ? newNumber : character.chaosGauge,
          guardianGauge:
            gaugeType === "guardianGauge" ? newNumber : character.guardianGauge,
        });
      }
    }
  };

  // 깐부의 캐릭터라면 나에게 설정한 값도 체크해야 함
  const accessible = friend ? friend.fromFriendSettings.showDayTodo : true;

  return (
    <>
      <Wrapper>
        <TitleRow>
          <BoxTitle>일일 숙제</BoxTitle>
        </TitleRow>

        {accessible && character.settings.showEpona && (
          <>
            <Check
              indicatorColor={theme.app.blue1}
              totalCount={3}
              currentCount={character.eponaCheck}
              onClick={() => handleUpdateDailyTodo("epona", false)}
              onRightClick={() => handleUpdateDailyTodo("epona", true)}
            >
              에포나의뢰
            </Check>
            <RestGauge
              currentValue={character.eponaGauge}
              onClick={() => handleUpdateRestGauge("eponaGauge")}
            />
          </>
        )}

        {accessible && character.settings.showChaos && (
          <>
            <Check
              indicatorColor={theme.app.blue1}
              totalCount={2}
              currentCount={character.chaosCheck}
              onClick={() => handleUpdateDailyTodo("chaos", false)}
              onRightClick={() => handleUpdateDailyTodo("chaos", true)}
              rightButtons={[
                {
                  onClick: () => setModalState("카오스던전"),
                  icon: <RiMoreFill />,
                },
              ]}
            >
              <ContentNameWithGold>
                카오스던전
                <GoldText>{character.chaosGold}</GoldText>
              </ContentNameWithGold>
            </Check>
            <RestGauge
              currentValue={character.chaosGauge}
              onClick={() => handleUpdateRestGauge("chaosGauge")}
            />
          </>
        )}

        {accessible && character.settings.showGuardian && (
          <>
            <Check
              indicatorColor={theme.app.blue1}
              totalCount={1}
              currentCount={character.guardianCheck}
              onClick={() => handleUpdateDailyTodo("guardian", false)}
              onRightClick={() => handleUpdateDailyTodo("guardian", true)}
              rightButtons={[
                {
                  onClick: () => setModalState("가디언토벌"),
                  icon: <RiMoreFill />,
                },
              ]}
            >
              <ContentNameWithGold>
                가디언토벌
                <GoldText>{character.guardianGold}</GoldText>
              </ContentNameWithGold>
            </Check>
            <RestGauge
              currentValue={character.guardianGauge}
              onClick={() => handleUpdateRestGauge("guardianGauge")}
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
