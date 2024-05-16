import { Grid } from "@mui/material";
import TodoDayContent from "./TodoDayContent";
import { FC } from "react";
import { CharacterType } from "../../../core/types/Character.type";
import TodoWeekRaid from "./TodoWeekRaid";
import TodoWeekContent from "./TodoWeekContent";

interface Props {
  characters: CharacterType[];
}

const TodoContent: FC<Props> = ({ characters }) => {
  return (
    <div className="todo-wrap">
      <Grid container spacing={1.5} overflow={"hidden"}>
        {characters.map((character) => (
          <Grid key={character.characterId} item>
            {/* 일일 숙제 */}
            <TodoDayContent character={character} />

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
