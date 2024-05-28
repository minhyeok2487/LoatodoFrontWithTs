import { FC } from "react";
import { TodoType } from "../../../../core/types/Character.type";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import RaidItem from "./RaidItem";

interface Props {
  id: number;
  todo: TodoType;
}

const RaidSortableItem: FC<Props> = ({ id, todo, ...props }) => {
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
      id={id.toString()}
      todo={todo}
      ref={setNodeRef}
      style={style}
      withOpacity={isDragging}
      {...props}
      {...attributes}
      {...listeners}
    />
  );
};

export default RaidSortableItem;
