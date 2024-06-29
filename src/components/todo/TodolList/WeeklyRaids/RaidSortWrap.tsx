import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  MouseSensor,
  TouchSensor,
  closestCenter,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  rectSortingStrategy,
} from "@dnd-kit/sortable";
import { useState } from "react";
import type { FC } from "react";

import type { Character, Todo } from "@core/types/character";
import type { FriendType } from "@core/types/friend";

import RaidItem from "./RaidItem";
import RaidSortableItem from "./RaidSortableItem";

interface Props {
  setTodos: (newTodoList: Todo[]) => void;
  character: Character;
  friend?: FriendType;
}

const RaidSortWrap: FC<Props> = ({ setTodos, character, friend }) => {
  const [activeId, setActiveId] = useState<number | null>();
  const sensors = useSensors(useSensor(MouseSensor), useSensor(TouchSensor));

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;

    setActiveId(active.id as number);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    const overId = over?.id;

    if (!overId) return;

    if (active.id !== over.id) {
      const oldIndex = character.todoList.findIndex(
        (el) => el.id === active.id
      );
      const newIndex = character.todoList.findIndex((el) => el.id === over.id);

      const updatedTodoList = arrayMove(character.todoList, oldIndex, newIndex);
      setTodos(updatedTodoList);
    }

    setActiveId(undefined);
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={(e) => handleDragStart(e)}
      onDragEnd={(e) => handleDragEnd(e)}
    >
      <SortableContext
        items={character.todoList.map((todo) => todo.id)}
        strategy={rectSortingStrategy}
      >
        {character.todoList.map((todo) => (
          <RaidSortableItem
            key={todo.id}
            id={todo.id}
            todo={todo}
            character={character}
            friend={friend}
          />
        ))}
      </SortableContext>
      <DragOverlay adjustScale style={{ transformOrigin: "0 0" }}>
        {activeId ? (
          <RaidItem
            id={activeId.toString()}
            todo={character.todoList.find((el) => el.id === activeId) as Todo}
            character={character}
            friend={friend}
            sortMode
            isDragging
          />
        ) : null}
      </DragOverlay>
    </DndContext>
  );
};

export default RaidSortWrap;
