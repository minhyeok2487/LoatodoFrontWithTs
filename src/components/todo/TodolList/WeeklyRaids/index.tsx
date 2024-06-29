import styled from "@emotion/styled";
import { useQueryClient } from "@tanstack/react-query";
import type { FC } from "react";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useSetRecoilState } from "recoil";

import * as characterApi from "@core/apis/character.api";
import { loading } from "@core/atoms/loading.atom";
import useModalState from "@core/hooks/useModalState";
import type { Character } from "@core/types/character";
import type { Friend } from "@core/types/friend";
import queryKeyGenerator from "@core/utils/queryKeyGenerator";

import BoxTitle from "@components/BoxTitle";
import Button, * as ButtonStyledComponents from "@components/Button";

import EditModal from "./EditModal";
import RaidItem from "./RaidItem";
import RaidSortWrap from "./RaidSortWrap";

interface Props {
  character: Character;
  friend?: Friend;
}

const TodoWeekRaid: FC<Props> = ({ character, friend }) => {
  const queryClient = useQueryClient();
  const setLoadingState = useSetRecoilState(loading);
  const [modalState, setModalState] = useModalState<Friend | Character>();

  const [showSortRaid, setShowSortRaid] = useState(false);
  const [localCharacter, setLocalCharacter] = useState(character);

  useEffect(() => {
    setLocalCharacter(character);
  }, [character, showSortRaid]);

  const saveRaidSort = async () => {
    setLoadingState(true);
    try {
      await characterApi.saveRaidSort(localCharacter);

      toast("레이드 순서 업데이트가 완료되었습니다.");
      queryClient.invalidateQueries({
        queryKey: queryKeyGenerator.getCharacters(),
      });
      setShowSortRaid(false);
    } catch (error) {
      console.error("Error saveSort:", error);
    }
    setLoadingState(false);
  };

  if (!localCharacter.settings.showWeekTodo) {
    return null;
  }
  return (
    <>
      <Wrapper>
        <TitleBox>
          <TitleRow>
            <BoxTitle>주간 레이드</BoxTitle>

            <ButtonsBox>
              {showSortRaid ? (
                <Button onClick={() => saveRaidSort()}>저장</Button>
              ) : (
                <Button
                  onClick={() => {
                    if (friend) {
                      toast.warn("기능 준비 중입니다.");
                    } else {
                      setShowSortRaid(true);
                    }
                  }}
                >
                  정렬
                </Button>
              )}
              <Button
                onClick={() => {
                  if (friend) {
                    if (!friend.fromFriendSettings.setting) {
                      toast.warn("권한이 없습니다.");
                      return;
                    }
                    setModalState(friend);
                  } else {
                    setModalState(character);
                  }
                }}
              >
                편집
              </Button>
            </ButtonsBox>
          </TitleRow>

          {showSortRaid ? (
            <SubTitle>저장 버튼 클릭시 순서가 저장됩니다</SubTitle>
          ) : (
            <SubTitle>마우스 우클릭 시 한번에 체크됩니다</SubTitle>
          )}
        </TitleBox>

        {showSortRaid ? (
          <RaidSortWrap
            character={localCharacter}
            friend={friend}
            setTodos={(newTodoList) => {
              setLocalCharacter({
                ...localCharacter,
                todoList: newTodoList,
              });
            }}
          />
        ) : (
          localCharacter.todoList.map((todo) => {
            return (
              <RaidItem
                key={todo.id}
                todo={todo}
                character={localCharacter}
                friend={friend}
              />
            );
          })
        )}
      </Wrapper>

      <EditModal
        onClose={() => {
          setModalState();
        }}
        isOpen={!!modalState}
        character={character}
        friend={friend}
      />
    </>
  );
};

export default TodoWeekRaid;

const Wrapper = styled.div`
  width: 100%;
  background: ${({ theme }) => theme.app.bg.light};
`;

const TitleBox = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 5px;
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

  ${ButtonStyledComponents.Wrapper} {
    padding: 0 9px;
    font-size: 13px;
    line-height: 23px;
  }
`;

const SubTitle = styled.p`
  color: ${({ theme }) => theme.app.text.dark2};
  font-size: 12px;
`;
