import {
  DndContext,
  type DragEndEvent,
  DragOverlay,
  type DragStartEvent,
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

import type { Character, TodoRaid } from "@core/types/character";
import type { Friend } from "@core/types/friend";

import RaidItem from "./RaidItem";
import RaidSortableItem from "./RaidSortableItem";

interface Props {
  setTodos: (newTodoList: TodoRaid[]) => void;
  todoList: TodoRaid[];
  character: Character;
  friend?: Friend;
}

const RaidSortWrap: FC<Props> = ({ setTodos, todoList, character, friend }) => {
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
      const oldIndex = todoList.findIndex((el) => el.id === active.id);
      const newIndex = todoList.findIndex((el) => el.id === over.id);

      const updatedTodoList = arrayMove(todoList, oldIndex, newIndex);
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
        items={todoList.map((todo) => todo.id)}
        strategy={rectSortingStrategy}
      >
        {todoList.map((todo) => (
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
            todo={todoList.find((el) => el.id === activeId) as TodoRaid}
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
