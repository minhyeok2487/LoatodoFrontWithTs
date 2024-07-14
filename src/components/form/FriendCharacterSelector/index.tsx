import { MdClose } from "@react-icons/all-files/md/MdClose";
import { RiHeartPulseFill } from "@react-icons/all-files/ri/RiHeartPulseFill";
import { useEffect, useMemo, useRef, useState } from "react";
import type { Dispatch, SetStateAction } from "react";
import styled, { css } from "styled-components";

import useFriends from "@core/hooks/queries/friend/useFriends";
import useIsBelowWidth from "@core/hooks/useIsBelowWidth";
import useModalState from "@core/hooks/useModalState";
import type { Character } from "@core/types/character";
import type { Friend } from "@core/types/friend";
import { getIsDealer } from "@core/utils/character.util";

import Modal from "@components/Modal";
import Divider, * as DeviderStyledComponents from "@components/form/Divider";

import PiSword from "@assets/svg/PiSword";

interface OnSaveParams {
  addFriendCharacterIdList: number[];
  removeFriendCharacterIdList: number[];
}

interface Props {
  isReadOnly?: boolean;
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
  isReadOnly,
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
  const friends = useMemo(() => {
    if (getFriends.data) {
      return getFriends.data.filter((friend) => friend.areWeFriend === "깐부");
    }

    return [];
  }, [getFriends.data, value]);

  // 캐릭터가 선택되지 않은 깐부 목록
  const selectableFriends = useMemo(() => {
    return friends.filter(
      (friend) =>
        !selectedCharacterList.find(
          (character) => friend.friendId === character.friendId
        )
    );
  }, [friends, selectedCharacterList]);

  useEffect(() => {
    if (originalValueUpdatable.current) {
      // onSave를 통해 한번 업데이트가 된 경우 value를 다시 받으면서 원본 value에 재할당
      setOriginalValue(value);
      originalValueUpdatable.current = false;
    }
  }, [value]);

  useEffect(() => {
    // 렌더링 시 1회에 한해 value를 통해 친구목록에서 추출하여 내부 상태값 초기화
    if (getFriends.data) {
      // 깐부들의 캐릭터 목록을 1차원 배열로 변환 + 캐릭터 정보에 friendId값 추가
      const friendsCharacters = getFriends.data.flatMap((friend) =>
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
  }, [getFriends.data]);

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
            const targetFriend = friends.find(
              (friend) => character.friendId === friend.friendId
            ) as Friend;

            return (
              <Item key={character.characterId} $forMobile>
                <button type="button" onClick={onClick} disabled={isReadOnly}>
                  <div>
                    {getIsDealer(character.characterClassName) ? (
                      <PiSword />
                    ) : (
                      <RiHeartPulseFill />
                    )}{" "}
                    <span>
                      {targetFriend.nickName} - [{character.itemLevel}{" "}
                      {character.characterClassName}]
                    </span>
                  </div>{" "}
                  <span>{character.characterName}</span>
                  <Icon>
                    <MdClose />
                  </Icon>
                </button>
                {isBelowWidth500 && !isReadOnly && (
                  <ForMobileButton onClick={onClick}>삭제하기</ForMobileButton>
                )}
              </Item>
            );
          })}
        </List>
      ) : (
        <Message>
          {isReadOnly
            ? "추가된 깐부가 없습니다."
            : "깐부의 캐릭터를 추가해주세요."}
        </Message>
      )}

      {!isReadOnly && (
        <>
          <Divider>깐부 캐릭터 추가하기</Divider>
          {selectableFriends.length > 0 ? (
            <List>
              {selectableFriends.map((friend) => (
                <Item key={friend.friendId} $isAddButton>
                  <button
                    type="button"
                    onClick={() => {
                      setTargetFriend(friend);
                    }}
                  >
                    <div>
                      <span>{friend.nickName}</span>
                      <Icon>
                        <MdClose />
                      </Icon>
                    </div>
                  </button>
                </Item>
              ))}
            </List>
          ) : (
            <Message>추가할 깐부가 없습니다.</Message>
          )}
        </>
      )}

      {!isReadOnly && isEditMode && (
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
                  <Item key={character.characterId} $forMobile $isAddButton>
                    <button type="button" onClick={onClick}>
                      <div>
                        {getIsDealer(character.characterClassName) ? (
                          <PiSword />
                        ) : (
                          <RiHeartPulseFill />
                        )}{" "}
                        <span>
                          [{character.itemLevel} {character.characterClassName}]
                        </span>
                      </div>{" "}
                      <span>{character.characterName}</span>
                      <Icon>
                        <MdClose />
                      </Icon>
                    </button>
                    {isBelowWidth500 && (
                      <ForMobileButton onClick={onClick}>
                        추가하기
                      </ForMobileButton>
                    )}
                  </Item>
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

const Icon = styled.i`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  font-size: 10px;
  background: ${({ theme }) => theme.app.bg.gray2};
  color: ${({ theme }) => theme.app.text.light2};
`;

const ForMobileButton = styled.button`
  z-index: 1;
  position: absolute;
  left: 0;
  bottom: 0;
  padding-top: 10px;
  width: 100%;
  height: 30px;
  background: ${({ theme }) => theme.app.bg.gray2};
  border-radius: 0 0 15px 15px;
  font-size: 12px;
  font-weight: 700;
  line-height: 20px;
  text-align: center;
`;

const Item = styled.li<{ $forMobile?: boolean; $isAddButton?: boolean }>`
  position: relative;
  ${({ theme }) => theme.medias.max500} {
    width: ${({ $forMobile }) => ($forMobile ? "100%" : "unset")};
  }

  button:not(${ForMobileButton}) {
    position: relative;
    z-index: 2;
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 6px;
    padding: 4px 12px;
    background: ${({ theme }) => theme.app.bg.gray1};
    border-radius: 15px;
    line-height: 1;

    ${({ theme }) => theme.medias.max500} {
      flex-direction: column;
      width: 100%;

      ${({ $forMobile }) => css`
        margin-bottom: 20px;
      `}

      ${Icon} {
        display: ${({ $forMobile }) => ($forMobile ? "none" : "flex")};
      }
    }

    div {
      display: flex;
      flex-direction: row;
      align-items: center;
      gap: 6px;
    }

    div > svg {
      width: 21px;
      height: 21px;
    }

    span {
      color: ${({ theme }) => theme.app.text.dark1};
      font-size: 15px;
    }

    ${Icon} {
      transform: rotate(${({ $isAddButton }) => ($isAddButton ? 45 : 0)}deg);
    }
  }
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
