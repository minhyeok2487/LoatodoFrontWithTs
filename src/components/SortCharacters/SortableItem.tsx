import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import React from "react";

import { CharacterType } from "@core/types/character";

import Item from "./Item";

interface SortableItemProps {
  id: number;
  character: CharacterType;
}

const SortableItem = ({ id, character, ...props }: SortableItemProps) => {
  const {
    isDragging,
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id });

  const style: React.CSSProperties = {
    transition: transition || undefined,
    transform: CSS.Transform.toString(transform),
  };

  return (
    <Item
      character={character}
      ref={setNodeRef}
      style={style}
      withOpacity={isDragging}
      {...props}
      {...attributes}
      {...listeners}
    />
  );
};

export default SortableItem;
