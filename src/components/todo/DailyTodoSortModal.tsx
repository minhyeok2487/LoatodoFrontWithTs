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
import { useAtom } from "jotai";
import { useEffect, useState } from "react";
import styled, { css } from "styled-components";

import { showDailyTodoSortFormAtom } from "@core/atoms/todo.atom";
import { LOCAL_STORAGE_KEYS, INITIAL_DAILY_TODO_ORDER } from "@core/constants";
import type { DailyTodoItem, DailyTodoType } from "@core/types/todo.d";
import { getLocalStorage, setLocalStorage } from "@core/utils/localStorage";

import BoxTitle from "@components/BoxTitle";
import Button from "@components/Button";
import Modal from "@components/Modal";

import SaveIcon from "@assets/svg/SaveIcon";

import Item from "./DailyTodoSortItem";
import SortableItem from "./DailyTodoSortableItem";

const DailyTodoSortModal = () => {
  const [showDailyTodoSortForm, setShowDailyTodoSortForm] = useAtom(
    showDailyTodoSortFormAtom
  );

  const [dailyTodoOrder, setDailyTodoOrder] = useState<DailyTodoItem[]>(() => {
    const storedOrder = getLocalStorage<DailyTodoItem[]>(LOCAL_STORAGE_KEYS.dailyTodoOrder);
    return storedOrder || [...INITIAL_DAILY_TODO_ORDER];
  });

  const [availableSave, setAvailableSave] = useState(false);

  useEffect(() => {
    const storedOrder = getLocalStorage<DailyTodoItem[]>(LOCAL_STORAGE_KEYS.dailyTodoOrder);
    if (JSON.stringify(storedOrder) !== JSON.stringify(dailyTodoOrder)) {
      setAvailableSave(true);
    } else {
      setAvailableSave(false);
    }
  }, [dailyTodoOrder]);

  const handleClose = () => {
    setShowDailyTodoSortForm(false);
  };

  const handleSave = () => {
    setLocalStorage(LOCAL_STORAGE_KEYS.dailyTodoOrder, dailyTodoOrder);
    setAvailableSave(false);
    handleClose();
  };

  const [activeId, setActiveId] = useState<DailyTodoType | null>(null);
  const sensors = useSensors(useSensor(MouseSensor), useSensor(TouchSensor));

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    setActiveId(active.id as DailyTodoType);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (active.id !== over?.id) {
      setDailyTodoOrder((items) => {
        const oldIndex = items.findIndex((el) => el.id === active.id);
        const newIndex = items.findIndex((el) => el.id === over?.id);

        if (oldIndex !== -1 && newIndex !== -1) {
          return arrayMove(items, oldIndex, newIndex);
        }

        return items;
      });
    }

    setActiveId(null);
  };

  return (
    <Modal
      title="일일 숙제 순서 변경"
      isOpen={showDailyTodoSortForm}
      onClose={handleClose}
    >
      <Wrapper>
        <TitleRow>
          <BoxTitle>일일 숙제 순서</BoxTitle>
          <Button
            disabled={!availableSave}
            css={css`
              padding: 5px;
              border-radius: 5px;
            `}
            variant="icon"
            size={18}
            onClick={handleSave}
          >
            <SaveIcon />
          </Button>
        </TitleRow>
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={dailyTodoOrder.map((item) => item.id)}
            strategy={rectSortingStrategy}
          >
            <GridBox>
              {dailyTodoOrder.map((item) => (
                <SortableItem key={item.id} id={item.id} name={item.name} />
              ))}
            </GridBox>
          </SortableContext>
          <DragOverlay adjustScale style={{ transformOrigin: "0 0" }}>
            {activeId ? (
              <Item
                name={dailyTodoOrder.find((el) => el.id === activeId)!.name}
                isDragging
              />
            ) : null}
          </DragOverlay>
        </DndContext>
      </Wrapper>
    </Modal>
  );
};

export default DailyTodoSortModal;

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const TitleRow = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  gap: 5px;
  margin-bottom: 10px;
`;

const GridBox = styled.div`
  display: grid;
  grid-template-columns: repeat(1, 1fr);
  grid-gap: 10px;
`;