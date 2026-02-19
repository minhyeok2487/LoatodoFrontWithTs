import { useState } from "react";
import styled, { css, useTheme } from "styled-components";

import {
  useCheckSilmaelExchange,
} from "@core/hooks/mutations/todo";
import { updateCharacterQueryData } from "@core/lib/queryClient";
import type { Character } from "@core/types/character";
import type { Friend } from "@core/types/friend";

import BoxTitle from "@components/BoxTitle";
import Button from "@components/Button";

import EditIcon from "@assets/svg/EditIcon";

import Elysian from "./Elysian";
import Check, * as CheckStyledComponents from "./element/Check";
import Cube from "./element/Cube";
import HellKey from "./element/HellKey";
import TrialSand from "./element/TrialSand";
import CustomContents from "./element/CustomContents";

interface Props {
  character: Character;
  friend?: Friend;
}

const WeeklyContents = ({ character, friend }: Props) => {
  const theme = useTheme();
  const [addCustomTodoMode, setAddCustomTodoMode] = useState(false);

  const checkSilmaelExchange = useCheckSilmaelExchange({
    onSuccess: (character, { friendUsername }) => {
      updateCharacterQueryData({
        character,
        friendUsername,
      });
    },
  });

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

      {accessible && character.settings.showSilmaelChange && (
        <TodoWrap
          $currentCount={character.silmaelChange === true ? 1 : 0}
          $totalCount={1}
        >
          <Check
            indicatorColor={theme.app.palette.yellow[300]}
            totalCount={1}
            currentCount={character.silmaelChange ? 1 : 0}
            onClick={() => {
              checkSilmaelExchange.mutate({
                friendUsername: friend?.friendUsername,
                characterId: character.characterId,
              });
            }}
            onRightClick={() => {
              checkSilmaelExchange.mutate({
                friendUsername: friend?.friendUsername,
                characterId: character.characterId,
              });
            }}
          >
            실마엘 혈석 교환
          </Check>
        </TodoWrap>
      )}

      {accessible && character.settings.showCubeTicket && (
        <Cube character={character} friend={friend} />
      )}

      {accessible && (
        <HellKey character={character} friend={friend} />
      )}

      {accessible && (
        <TrialSand character={character} friend={friend} />
      )}

      {accessible && character.settings.showElysian && (
        <Elysian character={character} friend={friend} />
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

const TodoWrap = styled.div<{
  $currentCount: number;
  $totalCount: number;
}>`
  opacity: ${(props) => (props.$currentCount === props.$totalCount ? 0.5 : 1)};
`;

const addCustomTodoButtonCss = css`
  padding: 8px 6px;
  border-radius: 0;
`;
