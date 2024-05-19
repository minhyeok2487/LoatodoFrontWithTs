import { FC, useEffect, useState } from "react";
import { CharacterType } from "../../core/types/Character.type";
import { toast } from "react-toastify";
import { useCharacters } from "../../core/apis/Character.api";
import SaveIcon from "@mui/icons-material/Save";
import "../../styles/components/CharacterSrot.css";
import { DndContext, DragEndEvent, DragOverlay, DragStartEvent, MouseSensor, TouchSensor, closestCenter, useSensor, useSensors } from "@dnd-kit/core";
import { SortableContext, arrayMove, rectSortingStrategy } from "@dnd-kit/sortable";
import { SortableItem } from "./SortableItem";
import { Item } from "./Item";
import * as CharacterApi from "../../core/apis/Character.api";
import { useSetRecoilState } from "recoil";
import { sortForm } from "../../core/atoms/SortForm.atom";

interface Props {
  characters: CharacterType[];
  friendSetting: boolean;
}

const CharacterSortForm: FC<Props> = ({ characters, friendSetting }) => {
  const [itemsSwapState, setItemsSwapState] = useState(false);
  const { refetch: refetchCharacters } = useCharacters();
  const [itemsPerRow, setItemsPerRow] = useState(calculateItemsPerRow());
  const [sortCharacters, setSortCharacters] = useState(characters);
  const setSortForm = useSetRecoilState(sortForm);

  // 페이지 로드시 호출
  useEffect(() => {
    function handleResize() {
      setItemsPerRow(calculateItemsPerRow());
    }

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  function calculateItemsPerRow() {
    var screenWidth = window.innerWidth;
    if (screenWidth >= 1300) {
      screenWidth = 1300;
    }
    const width = 250;
    const row = 2;
    if (screenWidth > width * row) {
      return Math.ceil(screenWidth / width);
    } else {
      return row;
    }
  }

  const saveSort = async () => {
    if (friendSetting) {
      //   if (friendSetting.setting) {
      //     try {
      //       setIsLoading(true);
      //       const response = await friend.saveSort(friendUsername, characters);
      //       showMessage("순서 업데이트가 완료되었습니다.");
      //     } catch (error) {
      //       console.error("Error updating updateChallenge:", error);
      //     } finally {
      //       setIsLoading(false);
      //     }
      //   } else {
      //     showMessage("권한이 없습니다.");
      //   }
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

  function handleDragStart(event: DragStartEvent) {
    const { active } = event;
    setActiveId(active.id as number);
    setItemsSwapState(true);
  }

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;

    if (active.id !== over?.id) {
      setSortCharacters((characters) => {
        const oldIndex = characters.findIndex((el) => el.characterId === active.id);
        const newIndex = characters.findIndex((el) => el.characterId === over?.id);

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
  }

  return (
    <div className="character-sort-wrap">
      <div style={{ display: "flex", flexDirection: "row" }}>
        <p>캐릭터 순서 변경</p>
        <SaveIcon
          onClick={() => saveSort()}
          sx={{
            display: itemsSwapState ? "flex" : "none",
            marginLeft: "5px",
            color: "blueviolet",
            cursor: "pointer",
          }}
        ></SaveIcon>
      </div>
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
          <div
            style={{
              display: "grid",
              gridTemplateColumns: `repeat(${itemsPerRow}, 1fr)`,
              gridGap: 10,
              padding: 5,
            }}
          >
            {sortCharacters.map((character) => (
              <SortableItem id={character.characterId} character={character} />
            ))}
          </div>
        </SortableContext>
        <DragOverlay adjustScale style={{ transformOrigin: "0 0 " }}>
          {activeId ? (
            <Item
              character={sortCharacters.find((el) => el.characterId === activeId)!}
              isDragging
            />
          ) : null}
        </DragOverlay>
      </DndContext>
    </div>
  );
};

export default CharacterSortForm;
