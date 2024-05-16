import { CharacterType } from "../../../core/types/Character.type";
import { FC } from "react";
import WeekEponaComponent from "./week_components/WeekEponaComponent";
import SilmaelChangeComponent from "./week_components/SilmaelChangeComponent";
import CubeComponent from "./week_components/CubeComponent";

interface Props {
  character: CharacterType;
}

const TodoWeekContent: FC<Props> = ({ character }) => {
  return (
    <>
      {(character.settings.showWeekEpona ||
        character.settings.showSilmaelChange ||
        character.settings.showCubeTicket) && (
        <div className="content title02" style={{ padding: 0 }}>
          <p className="title">주간 숙제</p>
        </div>
      )}
      <div className="character-todo">
        {character.settings.showWeekEpona && (
          <WeekEponaComponent character={character} />
        )}
        {character.settings.showSilmaelChange && (
          <SilmaelChangeComponent character={character} />
        )}
        {character.settings.showCubeTicket && (
          <CubeComponent character={character} />
        )}
      </div>
    </>
  );
};

export default TodoWeekContent;
