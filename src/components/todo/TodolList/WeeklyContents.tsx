import { useTheme } from "@emotion/react";
import styled from "@emotion/styled";
import { FiMinus } from "@react-icons/all-files/fi/FiMinus";
import { FiPlus } from "@react-icons/all-files/fi/FiPlus";
import { RiMoreFill } from "@react-icons/all-files/ri/RiMoreFill";
import { useQueryClient } from "@tanstack/react-query";
import { FC } from "react";
import { toast } from "react-toastify";
import { useSetRecoilState } from "recoil";

import * as characterApi from "@core/apis/character.api";
import * as friendApi from "@core/apis/friend.api";
import { loading } from "@core/atoms/loading.atom";
import queryKeys from "@core/constants/queryKeys";
import useModalState from "@core/hooks/useModalState";
import { CharacterType } from "@core/types/character";
import { FriendType } from "@core/types/friend";

import BoxTitle from "@components/BoxTitle";
import CubeRewardsModal from "@components/CubeRewardsModal";

import Check from "./button/Check";

interface Props {
  character: CharacterType;
  friend?: FriendType;
}

const WeeklyContents: FC<Props> = ({ character, friend }) => {
  const queryClient = useQueryClient();
  const theme = useTheme();

  const [modalState, setModalState] = useModalState();
  const setLoadingState = useSetRecoilState(loading);

  /* 주간 에포나 체크 */
  const weekEponaCheck = async () => {
    setLoadingState(true);
    if (friend) {
      if (!friend.fromFriendSettings.checkWeekTodo) {
        toast.warn("권한이 없습니다.");
      }
      try {
        await friendApi.weekEponaCheck(character);
        queryClient.invalidateQueries({
          queryKey: [queryKeys.GET_FRIENDS],
        });
      } catch (error) {
        console.error("Error weekEponaCheck:", error);
      }
    } else {
      try {
        await characterApi.weekEponaCheck(character);
        queryClient.invalidateQueries({
          queryKey: [queryKeys.GET_CHARACTERS],
        });
      } catch (error) {
        console.error("Error weekEponaCheck:", error);
      }
    }
    setLoadingState(false);
  };

  /* 주간 에포나 체크 All */
  const weekEponaCheckAll = async () => {
    setLoadingState(true);
    if (friend) {
      if (!friend.fromFriendSettings.checkWeekTodo) {
        toast.warn("권한이 없습니다.");
      }
      try {
        await friendApi.weekEponaCheckAll(character);
        queryClient.invalidateQueries({
          queryKey: [queryKeys.GET_FRIENDS],
        });
      } catch (error) {
        console.error("Error weekEponaCheck:", error);
      }
    } else {
      try {
        await characterApi.weekEponaCheckAll(character);
        queryClient.invalidateQueries({
          queryKey: [queryKeys.GET_CHARACTERS],
        });
      } catch (error) {
        console.error("Error weekEponaCheckAll:", error);
      }
    }
    setLoadingState(false);
  };

  /* 실마엘 체크 */
  const silmaelChange = async () => {
    setLoadingState(true);
    if (friend) {
      if (!friend.fromFriendSettings.checkWeekTodo) {
        toast.warn("권한이 없습니다.");
      }
      try {
        await friendApi.silmaelChange(character);
        queryClient.invalidateQueries({
          queryKey: [queryKeys.GET_FRIENDS],
        });
      } catch (error) {
        console.error("Error weekEponaCheck:", error);
      }
    } else {
      try {
        await characterApi.silmaelChange(character);
        queryClient.invalidateQueries({
          queryKey: [queryKeys.GET_CHARACTERS],
        });
      } catch (error) {
        console.error("Error weekEponaCheck:", error);
      }
    }
    setLoadingState(false);
  };

  /* 큐브 티켓 감소 */
  const substractCubeTicket = async () => {
    setLoadingState(true);
    if (friend) {
      if (!friend.fromFriendSettings.checkWeekTodo) {
        toast.warn("권한이 없습니다.");
      }
      try {
        await friendApi.substractCubeTicket(character);
        queryClient.invalidateQueries({
          queryKey: [queryKeys.GET_FRIENDS],
        });
      } catch (error) {
        console.error("Error weekEponaCheck:", error);
      }
    } else {
      try {
        await characterApi.substractCubeTicket(character);
        queryClient.invalidateQueries({
          queryKey: [queryKeys.GET_CHARACTERS],
        });
      } catch (error) {
        console.error("Error weekEponaCheck:", error);
      }
    }
    setLoadingState(false);
  };

  /* 큐브 티켓 추가 */
  const addCubeTicket = async () => {
    setLoadingState(true);
    if (friend) {
      if (!friend.fromFriendSettings.checkWeekTodo) {
        toast.warn("권한이 없습니다.");
      }
      try {
        await friendApi.addCubeTicket(character);
        queryClient.invalidateQueries({
          queryKey: [queryKeys.GET_FRIENDS],
        });
      } catch (error) {
        console.error("Error weekEponaCheck:", error);
      }
    } else {
      try {
        await characterApi.addCubeTicket(character);
        queryClient.invalidateQueries({
          queryKey: [queryKeys.GET_CHARACTERS],
        });
      } catch (error) {
        console.error("Error weekEponaCheck:", error);
      }
    }
    setLoadingState(false);
  };

  return (
    <>
      <Wrapper>
        {friend
          ? friend.fromFriendSettings.showWeekTodo
          : (character.settings.showWeekEpona ||
              character.settings.showSilmaelChange ||
              character.settings.showCubeTicket) && (
              <TitleRow>
                <BoxTitle>주간 숙제</BoxTitle>
              </TitleRow>
            )}

        {(friend === undefined || friend.fromFriendSettings?.showWeekTodo) &&
          character.settings.showWeekEpona && (
            <Check
              indicatorColor={theme.app.yellow}
              totalCount={3}
              currentCount={character.weekEpona}
              onClick={() => weekEponaCheck()}
              onRightClick={() => weekEponaCheckAll()}
            >
              주간에포나
            </Check>
          )}

        {(friend === undefined || friend.fromFriendSettings?.showWeekTodo) &&
          character.settings.showSilmaelChange && (
            <Check
              indicatorColor={theme.app.yellow}
              totalCount={1}
              currentCount={character.silmaelChange ? 1 : 0}
              onClick={() => silmaelChange()}
              onRightClick={() => silmaelChange()}
            >
              실마엘 혈석 교환
            </Check>
          )}

        {(friend === undefined || friend.fromFriendSettings?.showWeekTodo) &&
          character.settings.showCubeTicket && (
            <CubeCounterWrapper>
              <CubeCounter>
                <CubeActionButton onClick={substractCubeTicket}>
                  <FiMinus />
                </CubeActionButton>
                {character.cubeTicket} 장
                <CubeActionButton onClick={addCubeTicket}>
                  <FiPlus />
                </CubeActionButton>
                큐브 티켓
              </CubeCounter>

              <button type="button" onClick={() => setModalState(character)}>
                <RiMoreFill size="18" />
              </button>
            </CubeCounterWrapper>
          )}
      </Wrapper>

      <CubeRewardsModal
        character={character}
        isOpen={!!modalState}
        onClose={() => setModalState()}
      />
    </>
  );
};

export default WeeklyContents;

const Wrapper = styled.div`
  width: 100%;
  background: ${({ theme }) => theme.app.bg.light};

  & > button {
    border-top: 1px solid ${({ theme }) => theme.app.border};
  }
`;

const TitleRow = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  padding: 5px 10px;
  border-top: 1px solid ${({ theme }) => theme.app.border};
`;

const CubeCounterWrapper = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: 5px 10px;
  font-size: 14px;
  border-top: 1px solid ${({ theme }) => theme.app.border};
`;

const CubeCounter = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 5px;
`;

const CubeActionButton = styled.button`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 22px;
  height: 22px;
  border-radius: 4px;
  background: ${({ theme }) => theme.app.yellow};
  font-size: 16px;
  color: ${({ theme }) => theme.app.white};
`;
