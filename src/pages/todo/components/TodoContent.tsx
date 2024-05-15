import { Grid } from "@mui/material";
import TodoDayContent from "./TodoDayContent";
import { FC } from "react";
import { CharacterType } from "../../../core/types/Character.type";
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

            {/* 주간 숙제 */}
            <TodoWeekContent character={character} />
          </Grid>
        ))}
      </Grid>
    </div>
  );
};

export default TodoContent;
