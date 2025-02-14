import type { FC } from "react";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import styled from "styled-components";

import { useUpdateRaidTodoSort } from "@core/hooks/mutations/todo";
import { updateCharacterQueryData } from "@core/lib/queryClient";
import type { Character, TodoRaid } from "@core/types/character";
import type { Friend } from "@core/types/friend";

import BoxTitle from "@components/BoxTitle";
import Button from "@components/Button";

import CharacterRaidProfit from "./CharacterRaidProfit";
import EditModal from "./EditModal";
import RaidItem from "./RaidItem";
import RaidSortWrap from "./RaidSortWrap";

export interface Props {
  character: Character;
  friend?: Friend;
}

const TodoWeekRaid: FC<Props> = ({ character, friend }) => {
  const [editModal, setEditModal] = useState(false);
  const [sortMode, setSortMode] = useState(false);
  const [sortedWeeklyRaidTodoList, setSortedWeeklyRaidTodoList] =
    useState<TodoRaid[]>();

  const updateRaidTodoSort = useUpdateRaidTodoSort({
    onSuccess: (character, { friendUsername }) => {
      updateCharacterQueryData({
        character,
        friendUsername,
      });

      toast.success("레이드 순서 업데이트가 완료되었습니다.");
      setSortMode(false);
    },
  });

  useEffect(() => {
    setSortedWeeklyRaidTodoList([...character.todoList]);
  }, [sortMode]);

  return (
    <>
      <Wrapper>
        <TitleBox>
          <TitleRow>
            <BoxTitle>주간 레이드</BoxTitle>

            <ButtonsBox>
              {sortMode ? (
                sortedWeeklyRaidTodoList && (
                  <Button
                    size="small"
                    onClick={() =>
                      updateRaidTodoSort.mutate({
                        friendUsername: friend?.friendUsername,
                        characterId: character.characterId,
                        sorted: sortedWeeklyRaidTodoList,
                      })
                    }
                  >
                    저장
                  </Button>
                )
              ) : (
                <Button
                  variant="outlined"
                  size="small"
                  onClick={() => {
                    setSortMode(true);
                  }}
                >
                  정렬
                </Button>
              )}
              <Button
                variant="outlined"
                size="small"
                onClick={() => {
                  setEditModal(true);
                }}
              >
                편집
              </Button>
            </ButtonsBox>
          </TitleRow>

          {sortMode ? (
            <SubTitle>저장 버튼 클릭시 순서가 저장됩니다</SubTitle>
          ) : (
            <CharacterRaidProfit character={character} />
          )}
        </TitleBox>

        {sortMode
          ? sortedWeeklyRaidTodoList && (
              <RaidSortWrap
                character={character}
                friend={friend}
                todoList={sortedWeeklyRaidTodoList}
                setTodos={(newTodoList) => {
                  setSortedWeeklyRaidTodoList(newTodoList);
                }}
              />
            )
          : character.todoList.map((todo) => {
              return (
                <RaidItem
                  key={todo.id}
                  todo={todo}
                  character={character}
                  friend={friend}
                />
              );
            })}
      </Wrapper>

      <EditModal
        onClose={() => {
          setEditModal(false);
        }}
        isOpen={editModal}
        character={character}
        friend={friend}
      />
    </>
  );
};

export default TodoWeekRaid;

export const Wrapper = styled.div`
  width: 100%;
  background: ${({ theme }) => theme.app.bg.white};
`;

const TitleBox = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
  padding: 5px 10px;
`;

const TitleRow = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  width: 100%;

  ${({ theme }) => theme.medias.max900} {
    flex-direction: column;
    align-items: flex-start;
    gap: 3px;
  }
`;

const ButtonsBox = styled.div`
  display: flex;
  flex-direction: row;
  gap: 5px;
`;

const SubTitle = styled.p`
  color: ${({ theme }) => theme.app.text.dark2};
  font-size: 12px;
`;
