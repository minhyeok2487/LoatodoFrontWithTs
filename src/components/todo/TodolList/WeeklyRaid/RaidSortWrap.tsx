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

import type { CharacterType, TodoType } from "@core/types/Character.type";

import RaidItem from "./RaidItem";
import RaidSortableItem from "./RaidSortableItem";

interface Props {
  setTodos: (newTodoList: TodoType[]) => void;
  character: CharacterType;
}

const RaidSortWrap: FC<Props> = ({ setTodos, character }) => {
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
          <RaidSortableItem id={todo.id} todo={todo} key={todo.id} />
        ))}
      </SortableContext>
      <DragOverlay adjustScale style={{ transformOrigin: "0 0 " }}>
        {activeId ? (
          <RaidItem
            id={activeId.toString()}
            todo={
              character.todoList.find((el) => el.id === activeId) as TodoType
            }
            isDragging
          />
        ) : null}
      </DragOverlay>
    </DndContext>
  );
};

export default RaidSortWrap;
