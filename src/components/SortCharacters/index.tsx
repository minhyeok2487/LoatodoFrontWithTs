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
import { useQueryClient } from "@tanstack/react-query";
import { useSetAtom } from "jotai";
import { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import styled, { css } from "styled-components";

import { showSortFormAtom } from "@core/atoms/todo.atom";
import { useUpdateCharacterSort } from "@core/hooks/mutations/todo";
import type { Character } from "@core/types/character";
import type { Friend } from "@core/types/friend";
import queryKeyGenerator from "@core/utils/queryKeyGenerator";

import BoxTitle from "@components/BoxTitle";
import Button from "@components/Button";

import SaveIcon from "@assets/svg/SaveIcon";

import Item from "./Item";
import SortableItem from "./SortableItem";

interface Props {
  characters: Character[];
  friend?: Friend;
}

const calculateItemsPerRow = () => {
  let screenWidth = window.innerWidth;
  if (screenWidth >= 1300) {
    screenWidth = 1300;
  }
  const width = 250;
  const row = 2;

  if (screenWidth > width * row) {
    return Math.ceil(screenWidth / width);
  }

  return row;
};

const SortCharacters = ({ characters, friend }: Props) => {
  const beforeCharacters = useRef<Character[]>();

  const queryClient = useQueryClient();

  const [availableSave, setAvailableSave] = useState(false);
  const [itemsPerRow, setItemsPerRow] = useState(calculateItemsPerRow());
  const [sortCharacters, setSortCharacters] = useState(characters);
  const setShowSortForm = useSetAtom(showSortFormAtom);

  const updateCharacterSort = useUpdateCharacterSort({
    onSuccess: (characters, { friendUsername }) => {
      if (friendUsername) {
        queryClient.invalidateQueries({
          queryKey: queryKeyGenerator.getFriends(),
        });
      } else {
        queryClient.invalidateQueries({
          queryKey: queryKeyGenerator.getCharacters(),
        });
      }

      toast.success("순서 업데이트가 완료되었습니다.");
      setShowSortForm(false);
    },
  });

  useEffect(() => {
    return () => {
      setShowSortForm(false);
    };
  }, [friend]);

  useEffect(() => {
    const handleResize = () => {
      setItemsPerRow(calculateItemsPerRow());
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    beforeCharacters.current = characters;
  }, [characters]);

  useEffect(() => {
    setAvailableSave(
      sortCharacters.some(
        (char, index) =>
          char.characterId !== beforeCharacters?.current?.[index].characterId
      )
    );
  }, [sortCharacters]);

  const [activeId, setActiveId] = useState<number | null>(null);
  const sensors = useSensors(useSensor(MouseSensor), useSensor(TouchSensor));

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    setActiveId(active.id as number);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (active.id !== over?.id) {
      setSortCharacters((characters) => {
        const oldIndex = characters.findIndex(
          (el) => el.characterId === active.id
        );
        const newIndex = characters.findIndex(
          (el) => el.characterId === over?.id
        );

        if (oldIndex !== -1 && newIndex !== -1) {
          const updatedCharacters = arrayMove(characters, oldIndex, newIndex);

          // Update sortNumber based on the new order
          const updatedCharactersWithSortNumber = updatedCharacters.map(
            (character, index) => ({
              ...character,
              sortNumber: index,
            })
          );

          return updatedCharactersWithSortNumber;
        }

        return characters;
      });
    }

    setActiveId(null);
  };

  return (
    <Wrapper>
      <TitleRow>
        <BoxTitle>캐릭터 순서 변경</BoxTitle>
        <Button
          disabled={!availableSave}
          css={css`
            padding: 5px;
            border-radius: 5px;
          `}
          variant="icon"
          size={18}
          onClick={() => {
            if (friend && !friend.fromFriendSettings.setting) {
              toast("권한이 없습니다.");
              setShowSortForm(false);
              return;
            }

            updateCharacterSort.mutate({
              friendUsername: friend?.friendUsername,
              sortCharacters: sortCharacters.map((item) => ({
                characterName: item.characterName,
                sortNumber: item.sortNumber,
              })),
            });
          }}
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
          items={sortCharacters.map((character) => character.characterId)}
          strategy={rectSortingStrategy}
        >
          <GridBox $itemsPerRow={itemsPerRow}>
            {sortCharacters.map((character) => (
              <SortableItem
                key={character.characterId}
                id={character.characterId}
                character={character}
              />
            ))}
          </GridBox>
        </SortableContext>
        <DragOverlay adjustScale style={{ transformOrigin: "0 0" }}>
          {activeId ? (
            <Item
              character={
                sortCharacters.find((el) => el.characterId === activeId)!
              }
              isDragging
            />
          ) : null}
        </DragOverlay>
      </DndContext>
    </Wrapper>
  );
};

export default SortCharacters;

const Wrapper = styled.div`
  padding: 8px;
  margin-bottom: 22px;
  width: 100%;
  background: ${({ theme }) => theme.app.bg.white};
  border: 1px solid ${({ theme }) => theme.app.border};
  border-radius: 10px;
`;

const TitleRow = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  gap: 5px;
  margin-bottom: 10px;
`;

const GridBox = styled.div<{ $itemsPerRow: number }>`
  display: grid;
  grid-template-columns: repeat(${({ $itemsPerRow }) => $itemsPerRow}, 1fr);
  grid-gap: 10px;
`;
