import { MdClose } from "@react-icons/all-files/md/MdClose";
import { RiHeartPulseFill } from "@react-icons/all-files/ri/RiHeartPulseFill";
import { useEffect, useMemo, useState } from "react";
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

interface Props {
  setSelectedCharacterIdList: Dispatch<SetStateAction<number[]>>;
  selectedCharacterIdList: number[];
  minimumItemLevel?: number;
}

interface SelectedCharacter extends Character {
  friendId: number;
}

const FriendCharacterSelector = ({
  setSelectedCharacterIdList,
  selectedCharacterIdList,
  minimumItemLevel,
}: Props) => {
  const isBelowWidth500 = useIsBelowWidth(500);
  const [targetFriend, setTargetFriend] = useModalState<Friend>();
  const getFriends = useFriends();

  const [innerSelectedCharacter, setInnerSelectedCharacter] = useState<
    SelectedCharacter[]
  >([]);

  const friends = useMemo(() => {
    if (getFriends.data) {
      return getFriends.data.filter((friend) => friend.areWeFriend === "깐부");
    }

    return [];
  }, [getFriends.data, selectedCharacterIdList]);

  const selectableFriends = useMemo(() => {
    return friends.filter(
      (friend) =>
        !innerSelectedCharacter.find(
          (innerSelectedItem) => innerSelectedItem.friendId === friend.friendId
        )
    );
  }, [friends, innerSelectedCharacter]);

  useEffect(() => {
    if (getFriends.data) {
      const friendsCharacters = getFriends.data.flatMap((friend) =>
        friend.characterList.map((character) => ({
          ...character,
          friendId: friend.friendId,
        }))
      );

      setInnerSelectedCharacter(
        selectedCharacterIdList
          .filter(
            (selectCharacterId) =>
              // 깐부 삭제한 경우 캐릭터 목록에서 찾을 수 없으므로 필터링
              !!friendsCharacters.find(
                (character) => character.characterId === selectCharacterId
              )
          )
          .map(
            (selectCharacterId) =>
              friendsCharacters.find(
                (character) => character.characterId === selectCharacterId
              ) as SelectedCharacter
          )
      );
    }
  }, [getFriends.data]);

  return (
    <Wrapper>
      <Divider>추가된 깐부의 캐릭터</Divider>
      {innerSelectedCharacter.length > 0 ? (
        <List>
          {innerSelectedCharacter.map((innerSelectedItem) => {
            const onClick = () => {
              setSelectedCharacterIdList(
                selectedCharacterIdList.filter(
                  (selectedCharacterId) =>
                    selectedCharacterId !== innerSelectedItem.characterId
                )
              );
              setInnerSelectedCharacter(
                innerSelectedCharacter.filter(
                  (i) => i.friendId !== innerSelectedItem.friendId
                )
              );
            };
            const targetFriend = friends.find(
              (friend) => innerSelectedItem.friendId === friend.friendId
            ) as Friend;

            return (
              <Item key={innerSelectedItem.characterId} $forMobile>
                <button type="button" onClick={onClick}>
                  <div>
                    {getIsDealer(innerSelectedItem.characterClassName) ? (
                      <PiSword />
                    ) : (
                      <RiHeartPulseFill />
                    )}{" "}
                    <span>
                      {targetFriend.nickName} - [{innerSelectedItem.itemLevel}{" "}
                      {innerSelectedItem.characterClassName}]
                    </span>
                  </div>{" "}
                  <span>{innerSelectedItem.characterName}</span>
                  <Icon>
                    <MdClose />
                  </Icon>
                </button>
                {isBelowWidth500 && (
                  <ForMobileButton onClick={onClick}>삭제하기</ForMobileButton>
                )}
              </Item>
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
                  setSelectedCharacterIdList(
                    selectedCharacterIdList.concat(character.characterId)
                  );
                  setInnerSelectedCharacter(
                    innerSelectedCharacter.concat({
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
