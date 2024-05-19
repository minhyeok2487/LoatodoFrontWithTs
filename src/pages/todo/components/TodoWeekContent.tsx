import { CharacterType } from "../../../core/types/Character.type";
import { FC } from "react";
import WeekEponaComponent from "./week_components/WeekEponaComponent";
import SilmaelChangeComponent from "./week_components/SilmaelChangeComponent";
import CubeComponent from "./week_components/CubeComponent";
import { FriendType } from "../../../core/types/Friend.type";

interface Props {
  character: CharacterType;
  friend?: FriendType;
}

const TodoWeekContent: FC<Props> = ({ character, friend }) => {
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
        {(friend === undefined || friend.fromFriendSettings?.showWeekTodo) &&
          character.settings.showWeekEpona && (
            <WeekEponaComponent character={character} friend={friend} />
          )}
        {(friend === undefined || friend.fromFriendSettings?.showWeekTodo) &&
          character.settings.showSilmaelChange && (
            <SilmaelChangeComponent character={character} friend={friend} />
          )}
        {(friend === undefined || friend.fromFriendSettings?.showWeekTodo) &&
          character.settings.showCubeTicket && (
            <CubeComponent character={character} friend={friend} />
          )}
      </div>
    </>
  );
};

export default TodoWeekContent;
