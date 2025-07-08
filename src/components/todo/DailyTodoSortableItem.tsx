import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

import DailyTodoSortItem from "./DailyTodoSortItem";

interface Props {
  id: string;
  name: string;
}

const DailyTodoSortableItem = ({ id, name }: Props) => {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <DailyTodoSortItem
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      name={name}
    />
  );
};

export default DailyTodoSortableItem;
