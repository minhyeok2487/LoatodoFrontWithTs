import { FC, useState } from "react";
import { CharacterType } from "../../../../core/types/Character.type";
import {
  DndContext,
  DragEndEvent,
  DragOverEvent,
  DragOverlay,
  DragStartEvent,
  MouseSensor,
  TouchSensor,
  UniqueIdentifier,
  closestCenter,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  rectSortingStrategy,
} from "@dnd-kit/sortable";
import RaidItem from "./RaidItem";
import RaidSortableItem from "./RaidSortableItem";

interface Props {
  character: CharacterType;
}

const RaidSortWrap: FC<Props> = ({ character }) => {
  const [activeId, setActiveId] = useState<number | null>();
  const sensors = useSensors(useSensor(MouseSensor), useSensor(TouchSensor));

  function handleDragStart(event: DragStartEvent) {
    const { active } = event;

    setActiveId(active.id as number);
    console.log(active.id);
  }

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    const overId = over?.id;

    if (!overId) return;

    if (active.id !== over.id) {
      const oldIndex = character.todoList.findIndex(
        (el) => el.id === active.id
      );
      const newIndex = character.todoList.findIndex((el) => el.id === over.id);

      const updatedTodoList = arrayMove(character.todoList, oldIndex, newIndex);
      character.todoList = updatedTodoList;
    }

    setActiveId(undefined);
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <SortableContext
        items={character.todoList.map((todo) => todo.id)}
        strategy={rectSortingStrategy}
      >
        <div>
          {character.todoList.map((todo) => (
            <RaidSortableItem id={todo.id} todo={todo} key={todo.id} />
          ))}
        </div>
      </SortableContext>
      <DragOverlay adjustScale style={{ transformOrigin: "0 0 " }}>
        {activeId ? (
          <RaidItem
            id={activeId.toString()}
            todo={character.todoList.find((el) => el.id === activeId)!!}
            isDragging={true}
          />
        ) : null}
      </DragOverlay>
    </DndContext>
  );
};

export default RaidSortWrap;
