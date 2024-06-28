import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { FC } from "react";

import type { CharacterType, TodoType } from "@core/types/character";
import type { FriendType } from "@core/types/friend";

import RaidItem from "./RaidItem";

interface Props {
  id: number;
  todo: TodoType;
  character: CharacterType;
  friend?: FriendType;
}

const RaidSortableItem: FC<Props> = ({
  id,
  todo,
  character,
  friend,
  ...props
}) => {
  const {
    isDragging,
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({
    id,
  });

  const style: React.CSSProperties = {
    transition: transition || undefined,
    transform: CSS.Transform.toString(transform),
  };

  return (
    <RaidItem
      ref={setNodeRef}
      id={id.toString()}
      todo={todo}
      character={character}
      friend={friend}
      sortMode
      style={style}
      withOpacity={isDragging}
      {...props}
      {...attributes}
      {...listeners}
    />
  );
};

export default RaidSortableItem;
