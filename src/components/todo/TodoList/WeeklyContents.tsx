import { useQueryClient } from "@tanstack/react-query";
import { useCallback, useState } from "react";
import { toast } from "react-toastify";
import styled, { css, useTheme } from "styled-components";

import useCheckWeeklyTodo from "@core/hooks/mutations/todo/useCheckWeeklyTodo";
import type { UpdateWeeklyTodoAction } from "@core/types/api";
import type { Character } from "@core/types/character";
import type { Friend } from "@core/types/friend";
import queryKeyGenerator from "@core/utils/queryKeyGenerator";

import BoxTitle from "@components/BoxTitle";
import Button from "@components/Button";

import EditIcon from "@assets/svg/EditIcon";

import Check, * as CheckStyledComponents from "./element/Check";
import CubeTicketManager from "./element/CubeTicketManager";
import CustomContents from "./element/CustomContents";

interface Props {
  character: Character;
  friend?: Friend;
}

const WeeklyContents = ({ character, friend }: Props) => {
  const queryClient = useQueryClient();
  const theme = useTheme();
  const [addCustomTodoMode, setAddCustomTodoMode] = useState(false);

  const checkWeeklyTodo = useCheckWeeklyTodo({
    onSuccess: (character, { isFriend }) => {
      if (isFriend) {
        queryClient.invalidateQueries({
          queryKey: queryKeyGenerator.getFriends(),
        });
      } else {
        queryClient.invalidateQueries({
          queryKey: queryKeyGenerator.getCharacters(),
        });
      }
    },
  });

  const handleCheckTodo = useCallback(
    (action: UpdateWeeklyTodoAction) => {
      if (checkWeeklyTodo.isPending) {
        return;
      }

      if (friend && !friend.fromFriendSettings.checkWeekTodo) {
        toast.warn("권한이 없습니다.");
        return;
      }
      checkWeeklyTodo.mutate({
        isFriend: !!friend,
        characterId: character.characterId,
        characterName: character.characterName,
        action,
      });
    },
    [checkWeeklyTodo, friend, character]
  );

  // 깐부의 캐릭터라면 나에게 설정한 값도 체크해야 함
  const accessible = friend ? friend.fromFriendSettings.showWeekTodo : true;

  return (
    <Wrapper>
      <TitleRow>
        <BoxTitle>주간 숙제</BoxTitle>

        <Button
          css={addCustomTodoButtonCss}
          variant="icon"
          size={18}
          onClick={() => setAddCustomTodoMode(true)}
        >
          <EditIcon />
        </Button>
      </TitleRow>

      {accessible && character.settings.showWeekEpona && (
        <Check
          indicatorColor={theme.app.palette.yellow[300]}
          totalCount={3}
          currentCount={character.weekEpona}
          onClick={() => handleCheckTodo("UPDATE_WEEKLY_EPONA")}
          onRightClick={() => handleCheckTodo("UPDATE_WEEKLY_EPONA_ALL")}
        >
          주간에포나
        </Check>
      )}

      {accessible && character.settings.showSilmaelChange && (
        <Check
          indicatorColor={theme.app.palette.yellow[300]}
          totalCount={1}
          currentCount={character.silmaelChange ? 1 : 0}
          onClick={() => {
            handleCheckTodo("TOGGLE_SILMAEL_EXCHANGE");
          }}
          onRightClick={() => {
            handleCheckTodo("TOGGLE_SILMAEL_EXCHANGE");
          }}
        >
          실마엘 혈석 교환
        </Check>
      )}

      {accessible && character.settings.showCubeTicket && (
        <CubeTicketManager character={character} friend={friend} />
      )}

      {accessible && (
        <CustomContents
          setAddMode={setAddCustomTodoMode}
          addMode={addCustomTodoMode}
          character={character}
          friend={friend}
          frequency="WEEKLY"
        />
      )}
    </Wrapper>
  );
};

export default WeeklyContents;

const AddCustomTodoWrapper = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 10px;
  padding: 5px;
`;

export const Wrapper = styled.div`
  width: 100%;
  background: ${({ theme }) => theme.app.bg.white};

  ${CheckStyledComponents.Wrapper}, ${AddCustomTodoWrapper} {
    border-top: 1px solid ${({ theme }) => theme.app.border};
  }
`;

const TitleRow = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: 0 0 0 10px;
`;

const addCustomTodoButtonCss = css`
  padding: 8px 6px;
  border-radius: 0;
`;
