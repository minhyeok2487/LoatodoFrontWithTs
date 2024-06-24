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
import styled from "@emotion/styled";
import { MdSave } from "@react-icons/all-files/md/MdSave";
import { FC, useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import { useSetRecoilState } from "recoil";

import { useCharacters } from "@core/apis/Character.api";
import * as CharacterApi from "@core/apis/Character.api";
import * as FriendApi from "@core/apis/Friend.api";
import { useFriends } from "@core/apis/Friend.api";
import { sortForm } from "@core/atoms/sortForm.atom";
import { CharacterType } from "@core/types/Character.type";
import { FriendType } from "@core/types/Friend.type";

import BoxTitle from "@components/BoxTitle";

import Item from "./Item";
import SortableItem from "./SortableItem";

interface Props {
  characters: CharacterType[];
  friend?: FriendType;
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

const SortCharacters: FC<Props> = ({ characters, friend }) => {
  const { refetch: refetchCharacters } = useCharacters();
  const { refetch: refetchFriends } = useFriends();

  const beforeCharacters = useRef<CharacterType[]>();
  const [savable, setSavable] = useState(false);
  const [itemsPerRow, setItemsPerRow] = useState(calculateItemsPerRow());
  const [sortCharacters, setSortCharacters] = useState(characters);
  const setSortForm = useSetRecoilState(sortForm);

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
    setSavable(
      sortCharacters.some(
        (char, index) =>
          char.characterId !== beforeCharacters?.current?.[index].characterId
      )
    );
  }, [sortCharacters]);

  const saveSort = async () => {
    if (friend) {
      if (friend.fromFriendSettings.setting) {
        try {
          await FriendApi.saveSort(friend, sortCharacters);
          toast("순서 업데이트가 완료되었습니다.");
          refetchFriends();
          setSortForm(false);
        } catch (error) {
          console.error("Error updating updateChallenge:", error);
        }
      } else {
        toast("권한이 없습니다.");
        setSortForm(false);
      }
    } else {
      try {
        await CharacterApi.saveSort(sortCharacters);
        toast("순서 업데이트가 완료되었습니다.");
        refetchCharacters();
        setSortForm(false);
      } catch (error) {
        console.error("Error saveSort:", error);
      }
    }
  };

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
        {savable && (
          <SaveButton type="button" onClick={() => saveSort()}>
            <MdSave size="24" />
          </SaveButton>
        )}
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
          <GridBox itemsPerRow={itemsPerRow}>
            {sortCharacters.map((character) => (
              <SortableItem id={character.characterId} character={character} />
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
  background: ${({ theme }) => theme.app.bg.light};
  border: ${({ theme }) => theme.app.border};
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

const SaveButton = styled.button`
  width: 24px;
  height: 24px;
  color: ${({ theme }) => theme.palette.primary.main};
`;

const GridBox = styled.div<{ itemsPerRow: number }>`
  display: grid;
  grid-template-columns: repeat(${({ itemsPerRow }) => itemsPerRow}, 1fr);
  grid-gap: 10px;
`;
