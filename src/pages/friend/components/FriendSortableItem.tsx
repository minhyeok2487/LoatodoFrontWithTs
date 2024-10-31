import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { FC } from "react";
import type { Friend } from "@core/types/friend";
import FriendItem from "./FriendItem";

interface Props {
  friend: Friend;
}

const FriendSortableItem: FC<Props> = ({ friend }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({
    id: friend.friendId,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <FriendItem
      ref={setNodeRef}
      friend={friend}
      style={style}
      {...attributes}
      {...listeners}
    />
  );
};

export default FriendSortableItem;