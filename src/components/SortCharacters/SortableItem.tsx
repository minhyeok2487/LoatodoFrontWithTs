import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

import type { Character } from "@core/types/character";

import Item from "./Item";

interface SortableItemProps {
  id: number;
  character: Character;
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
