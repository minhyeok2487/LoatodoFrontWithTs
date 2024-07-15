import { useEffect, useMemo, useRef, useState } from "react";
import type { Dispatch, SetStateAction } from "react";
import styled from "styled-components";

import useFriends from "@core/hooks/queries/friend/useFriends";
import useIsBelowWidth from "@core/hooks/useIsBelowWidth";
import useModalState from "@core/hooks/useModalState";
import type { Character } from "@core/types/character";
import type { Friend } from "@core/types/friend";

import Modal from "@components/Modal";
import Divider, * as DeviderStyledComponents from "@components/form/Divider";

import SelectorItem from "./SelectorItem";

interface OnSaveParams {
  addFriendCharacterIdList: number[];
  removeFriendCharacterIdList: number[];
}

interface Props {
  isEditMode?: boolean;
  onSave?: (params: OnSaveParams) => void;
  minimumItemLevel?: number;
  setValue: Dispatch<SetStateAction<number[]>>;
  value: number[];
}

interface SelectedCharacter extends Character {
  friendId: number;
}

const FriendCharacterSelector = ({
  isEditMode,
  onSave,
  minimumItemLevel,
  setValue,
  value,
}: Props) => {
  const originalValueUpdatable = useRef(false); // 원본 value 1회 업데이트 허용 플래그
  const [originalValue, setOriginalValue] = useState([...value]); // 수정모드일 때 비교를 위한 value의 원본
  const isBelowWidth500 = useIsBelowWidth(500);
  const [targetFriend, setTargetFriend] = useModalState<Friend>(); // 캐릭터 선택 모달 출력용
  const getFriends = useFriends();

  // 추가된 깐부의 캐릭터 렌더링용 내부 상태
  const [selectedCharacterList, setSelectedCharacterList] = useState<
    SelectedCharacter[]
  >([]);
  // 수정 모드일 때 변경된 친구 캐릭터 id 목록
  const addFriendCharacterIdList = useMemo(() => {
    if (isEditMode) {
      return value.filter((id) => !originalValue.includes(id));
    }

    return [];
  }, [isEditMode, value, originalValue]);
  const removeFriendCharacterIdList = useMemo(() => {
    if (isEditMode) {
      return originalValue.filter((id) => !value.includes(id));
    }

    return [];
  }, [isEditMode, value, originalValue]);

  // "깐부" 상태인 친구들 필터링
  const realFriends = useMemo(() => {
    if (getFriends.data) {
      return getFriends.data.filter((friend) => friend.areWeFriend === "깐부");
    }

    return [];
  }, [getFriends.data, value]);

  // 캐릭터가 선택되지 않은 깐부 목록
  const selectableFriends = useMemo(() => {
    return realFriends.filter(
      (friend) =>
        !selectedCharacterList.find(
          (character) => friend.friendId === character.friendId
        )
    );
  }, [realFriends, selectedCharacterList]);

  useEffect(() => {
    if (originalValueUpdatable.current) {
      // onSave를 통해 한번 업데이트가 된 경우 value를 다시 받으면서 원본 value에 재할당
      setOriginalValue(value);
      originalValueUpdatable.current = false;
    }
  }, [value]);

  useEffect(() => {
    // 렌더링 시 1회에 한해 value를 통해 친구목록에서 추출하여 내부 상태값 초기화
    if (realFriends) {
      // 깐부들의 캐릭터 목록을 1차원 배열로 변환 + 캐릭터 정보에 friendId값 추가
      const friendsCharacters = realFriends.flatMap((friend) =>
        friend.characterList.map((character) => ({
          ...character,
          friendId: friend.friendId,
        }))
      );

      setSelectedCharacterList(
        value.reduce<SelectedCharacter[]>((acc, characterId) => {
          const findCharacter = friendsCharacters.find(
            (character) => character.characterId === characterId
          );

          if (findCharacter) {
            return acc.concat(findCharacter);
          }

          // 깐부 삭제한 경우 캐릭터 목록에서 찾을 수 없으므로 필터링
          return acc;
        }, [])
      );
    }
  }, [realFriends]);

  return (
    <Wrapper>
      <Divider>추가된 깐부의 캐릭터</Divider>
      {selectedCharacterList.length > 0 ? (
        <List>
          {selectedCharacterList.map((character) => {
            const onClick = () => {
              setValue(
                value.filter(
                  (characterId) => characterId !== character.characterId
                )
              );
              setSelectedCharacterList(
                selectedCharacterList.filter(
                  (selectedCharacter) =>
                    selectedCharacter.friendId !== character.friendId
                )
              );
            };
            const targetFriend = realFriends.find(
              (friend) => character.friendId === friend.friendId
            ) as Friend;

            return (
              <SelectorItem
                key={character.characterId}
                onClick={onClick}
                character={character}
                friend={targetFriend}
                forMobile
              />
            );
          })}
        </List>
      ) : (
        <Message>깐부의 캐릭터를 추가해주세요.</Message>
      )}

      <Divider>깐부 캐릭터 추가하기</Divider>
      {selectableFriends.length > 0 ? (
        <List>
          {selectableFriends.map((friend) => (
            <SelectorItem
              key={friend.friendId}
              onClick={() => setTargetFriend(friend)}
              friend={friend}
              forMobile
              isAddButton
            />
          ))}
        </List>
      ) : (
        <Message>추가할 깐부가 없습니다.</Message>
      )}

      {isEditMode && (
        <SaveButton
          type="button"
          disabled={
            addFriendCharacterIdList.length === 0 &&
            removeFriendCharacterIdList.length === 0
          }
          onClick={() => {
            if (onSave) {
              onSave({
                addFriendCharacterIdList,
                removeFriendCharacterIdList,
              });
              originalValueUpdatable.current = true;
            }
          }}
        >
          저장
        </SaveButton>
      )}

      {targetFriend && (
        <Modal
          title={`${targetFriend.nickName}님의 캐릭터`}
          onClose={() => setTargetFriend()}
          isOpen={!!targetFriend}
        >
          <TargetFriendWrapper>
            {targetFriend.characterList
              .filter((character) =>
                minimumItemLevel !== undefined
                  ? character.itemLevel >= minimumItemLevel
                  : true
              )
              .map((character) => {
                const onClick = () => {
                  setValue(value.concat(character.characterId));
                  setSelectedCharacterList(
                    selectedCharacterList.concat({
                      ...character,
                      friendId: targetFriend.friendId,
                    })
                  );
                  setTargetFriend();
                };

                return (
                  <SelectorItem
                    key={character.characterId}
                    onClick={onClick}
                    character={character}
                    friend={targetFriend}
                    forMobile
                    isAddButton
                  />
                );
              })}
          </TargetFriendWrapper>
        </Modal>
      )}
    </Wrapper>
  );
};

export default FriendCharacterSelector;

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  width: 100%;

  ${DeviderStyledComponents.Wrapper} {
    padding: 0 10px;
  }
`;

const List = styled.ul`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
  gap: 10px;
  width: 100%;
`;

const Message = styled.p`
  color: ${({ theme }) => theme.app.text.light1};
  font-size: 14px;
`;

const TargetFriendWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
`;

const SaveButton = styled.button<{ disabled: boolean }>`
  margin: 8px auto 0;
  padding: 0 20px;
  line-height: 30px;
  border-radius: 6px;
  background: ${({ disabled, theme }) =>
    disabled ? theme.app.gray1 : theme.palette.success.main};
  color: ${({ theme }) => theme.app.white};
`;
