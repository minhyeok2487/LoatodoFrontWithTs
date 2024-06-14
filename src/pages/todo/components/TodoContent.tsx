import { Grid } from "@mui/material";
import { FC } from "react";

import { CharacterType } from "@core/types/Character.type";
import { FriendType } from "@core/types/Friend.type";

import TodoDayContent from "./TodoDayContent";
import TodoWeekContent from "./TodoWeekContent";
import TodoWeekRaid from "./TodoWeekRaid";

interface Props {
  characters: CharacterType[];
  friend?: FriendType;
}

const TodoContent: FC<Props> = ({ characters, friend }) => {
  return (
    <div className="todo-wrap">
      <Grid container spacing={1.5} overflow="hidden">
        {characters.map((character) => (
          <Grid key={character.characterId} item>
            {/* 일일 숙제 */}
            <TodoDayContent character={character} friend={friend} />

            <div className="character-wrap">
              {/* 주간 레이드 */}
              <TodoWeekRaid character={character} friend={friend} />

              {/* 주간 숙제(에포나, 큐브, 실마엘) */}
              <TodoWeekContent character={character} friend={friend} />
            </div>
          </Grid>
        ))}
      </Grid>
    </div>
  );
};

export default TodoContent;
