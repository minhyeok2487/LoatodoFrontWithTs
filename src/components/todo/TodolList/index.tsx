import styled from "@emotion/styled";
import { Grid } from "@mui/material";
import type { FC } from "react";

import { CharacterType } from "@core/types/Character.type";
import { FriendType } from "@core/types/Friend.type";

import CharacterInformation from "./CharacterInformation";
import DailyContents from "./DailyContents";
import TodoWeekRaid from "./TodoWeekRaid";
import WeeklyContents from "./WeeklyContents";

interface Props {
  characters: CharacterType[];
  friend?: FriendType;
}

const TodoContent: FC<Props> = ({ characters, friend }) => {
  return (
    <Wrapper>
      <Grid container spacing={1.5} overflow="hidden">
        {characters.map((character) => (
          <Item key={character.characterId} item>
            <CharacterInformation character={character} />

            {/* 일일 숙제 */}
            <DailyContents character={character} friend={friend} />

            {/* 주간 레이드 */}
            {/* <TodoWeekRaid character={character} friend={friend} /> */}

            {/* 주간 숙제(에포나, 큐브, 실마엘) */}
            <WeeklyContents character={character} friend={friend} />
          </Item>
        ))}
      </Grid>
    </Wrapper>
  );
};

export default TodoContent;

const Wrapper = styled.div`
  width: 100%;
`;

const Item = styled(Grid)`
  width: 212px;
`;
