import { Grid } from "@mui/material";
import TodoDayContent from "./TodoDayContent";
import { FC } from "react";
import { CharacterType } from "../../../core/types/Character.type";
import TodoWeekRaid from "./TodoWeekRaid";
import TodoWeekContent from "./TodoWeekContent";
import { FriendType } from "../../../core/types/Friend.type";

interface Props {
  characters: CharacterType[];
  friend?: FriendType;
}

const TodoContent: FC<Props> = ({ characters, friend }) => {
  return (
    <div className="todo-wrap">
      <Grid container spacing={1.5} overflow={"hidden"}>
        {characters.map((character) => (
          <Grid key={character.characterId} item>
            {/* 일일 숙제 */}
            <TodoDayContent character={character} friend={friend} />

            <div className="character-wrap">
              {/* 주간 레이드 */}
              <TodoWeekRaid character={character} />

              {/*주간 숙제(에포나, 큐브, 실마엘)*/}
              <TodoWeekContent character={character} />
            </div>
          </Grid>
        ))}
      </Grid>
    </div>
  );
};

export default TodoContent;
