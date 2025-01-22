import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
<<<<<<< HEAD
import { FC } from "react";
import type { Friend } from "@core/types/friend";
=======
import type { FC } from "react";

import type { Friend } from "@core/types/friend";

>>>>>>> origin/main
import FriendItem from "./FriendItem";

interface Props {
  friend: Friend;
}

const FriendSortableItem: FC<Props> = ({ friend }) => {
<<<<<<< HEAD
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({
    id: friend.friendId,
  });
=======
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({
      id: friend.friendId,
    });
>>>>>>> origin/main

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

<<<<<<< HEAD
export default FriendSortableItem;
=======
export default FriendSortableItem;
>>>>>>> origin/main
