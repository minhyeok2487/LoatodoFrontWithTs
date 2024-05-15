import { FC } from "react";
import { TodoType } from "../../../../core/types/Character.type";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import RaidItem from "./RaidItem";

interface Props {
  id: string;
  todo: TodoType;
}

const RaidSortableItem: FC<Props> = ({ id, todo }) => {
  const {
    isDragging,
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({
    id: id,
  });

  const style = {
    transition: transition || undefined,
    transform: CSS.Transform.toString(transform),
  };

  return (
    <RaidItem
      id={todo.id.toString()}
      withOpacity={isDragging}
      style={style}
      todo={todo}
      ref={setNodeRef}
      {...attributes}
      {...listeners}
    />
  );
};

export default RaidSortableItem;
