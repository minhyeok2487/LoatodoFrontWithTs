import { IoTrashOutline } from "@react-icons/all-files/io5/IoTrashOutline";
import { useQueryClient } from "@tanstack/react-query";
import { useRef, useState } from "react";
import { toast } from "react-toastify";
import styled, { css } from "styled-components";

import useRemoveCharacter from "@core/hooks/mutations/character/useRemoveCharacter";
import { useUpdateCharacterMemo } from "@core/hooks/mutations/todo";
import useIsGuest from "@core/hooks/useIsGuest";
import { updateCharacterQueryData } from "@core/lib/queryClient";
import type { Character } from "@core/types/character";
import type { Friend } from "@core/types/friend";
import { getIsSpecialist } from "@core/utils";
import queryKeyGenerator from "@core/utils/queryKeyGenerator";

import Button from "@components/Button";
import Modal from "@components/Modal";
import MultilineInput from "@components/todo/TodoList/element/MultilineInput";

import AddMemoIcon from "@assets/svg/AddMemoIcon";
import SaveIcon from "@assets/svg/SaveIcon";

interface Props {
  isSetting?: boolean;
  character: Character;
  friend?: Friend;
}

const CharacterInformation = ({ isSetting, character, friend }: Props) => {
  const queryClient = useQueryClient();
  const memoRef = useRef<HTMLTextAreaElement>(null);
  const isGuest = useIsGuest();
  const [removeCharacterModal, setRemoveCharacterModal] = useState(false);

  const [editMemo, setEditMemo] = useState(false);

  const updateCharacterMemo = useUpdateCharacterMemo({
    onSuccess: (character, { friendUsername }) => {
      updateCharacterQueryData({
        character,
        friendUsername,
      });

      setEditMemo(false);
    },
  });

  const removeCharacter = useRemoveCharacter({
    onSuccess: () => {
      toast.success(`"${character.characterName}" 캐릭터를 삭제했습니다.`);

      queryClient.invalidateQueries({
        queryKey: queryKeyGenerator.getCharacters(),
      });

      queryClient.invalidateQueries({
        queryKey: queryKeyGenerator.getDeletedCharacters(), // 삭제된 캐릭터 쿼리 키
      });
    },
  });

  const submitMemo = () => {
    if (memoRef.current) {
      updateCharacterMemo.mutate({
        friendUsername: friend?.friendUsername,
        characterId: character.characterId,
        memo: memoRef.current.value,
      });
    }
  };

  return (
    <Wrapper>
      <Modal
        title="캐릭터 삭제"
        isOpen={removeCharacterModal}
        onClose={() => setRemoveCharacterModal(false)}
        buttons={[
          {
            onClick: () => removeCharacter.mutate(character.characterId),
            label: "삭제",
          },
          {
            onClick: () => setRemoveCharacterModal(false),
            label: "취소",
          },
        ]}
      >
        <RemoveCaution>
          <RemoveCaution>
            <strong>필독</strong>
            <span>
              해당 기능은 닉네임 변경으로 자투리 캐릭터가 생겼을 때 삭제하기
              위한 기능입니다.
            </span>
            <span>
              삭제된 캐릭터는 관리자에게 요청 후 복구해야하므로 상당한 시간이
              필요합니다.
            </span>
            <span>
              [캐릭터 숨김]을 원하시는 경우 [캐릭터 출력] 스위치를 통해
              미출력으로 변경해 주시기를 바랍니다.
            </span>
          </RemoveCaution>
        </RemoveCaution>
      </Modal>

      <CharacterBox
        style={{
          backgroundImage:
            character.characterImage !== null
              ? `url(${character.characterImage})`
              : undefined,
          backgroundPosition: getIsSpecialist(character.characterClassName)
            ? "left 10px top -80px"
            : "left 10px top -30px",
        }}
      >
        {character.goldCharacter && <GoldBadge>골드 획득 지정</GoldBadge>}

        <Server>
          @{character.serverName} {character.characterClassName}
        </Server>
        <Nickname>{character.characterName}</Nickname>
        <Level>Lv. {character.itemLevel}</Level>

        <Buttons>
          {isSetting ? (
            <Button
              css={buttonCss}
              variant="icon"
              size={20}
              onClick={() => {
                if (isGuest) {
                  toast.warn("테스트 계정은 이용하실 수 없습니다.");
                  return;
                }

                setRemoveCharacterModal(true);
              }}
            >
              <IoTrashOutline />
            </Button>
          ) : (
            <>
              {editMemo ? (
                <Button
                  css={buttonCss}
                  variant="icon"
                  size={18}
                  onClick={submitMemo}
                >
                  <SaveIcon />
                </Button>
              ) : (
                <Button
                  css={buttonCss}
                  variant="icon"
                  size={18}
                  onClick={() => {
                    if (isGuest) {
                      toast.warn("테스트 계정은 이용하실 수 없습니다.");
                      return;
                    }

                    setEditMemo(true);
                    memoRef.current?.focus();
                  }}
                >
                  <AddMemoIcon />
                </Button>
              )}
            </>
          )}
        </Buttons>
      </CharacterBox>
      {!isSetting && (
        <MultilineInput
          ref={memoRef}
          inputCss={memoInputCss}
          onEnterPress={submitMemo}
          onClick={() => {
            setEditMemo(true);
          }}
          isHidden={character.memo === null && !editMemo}
          placeholder="메모 추가"
          defaultValue={character.memo || ""}
          maxLength={100}
        />
      )}
    </Wrapper>
  );
};

export default CharacterInformation;

const Wrapper = styled.div``;

const RemoveCaution = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  font-size: 16px;
  color: ${({ theme }) => theme.app.text.black};

  strong {
    font-size: 20px;
    font-weight: 700;
    color: ${({ theme }) => theme.app.text.red};
  }
`;

const memoInputCss = css`
  padding: 5px 10px;
  border: 1px solid ${({ theme }) => theme.app.border};
  border-bottom: none;
  background: ${({ theme }) => theme.app.bg.white};

  &:disabled {
    cursor: default;
  }
`;

const CharacterBox = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  padding: 0 15px;
  height: 112px;
  border-radius: 7px 7px 0 0;
  line-height: 1.1;
  color: ${({ theme }) => theme.app.palette.gray[0]};
  border: 1px solid ${({ theme }) => theme.app.border};
  border-bottom: none;
  background-color: ${({ theme }) => theme.app.palette.gray[500]};
  background-size: 150%;
`;

const GoldBadge = styled.div`
  padding: 2px 5px;
  margin-bottom: 8px;
  background: ${({ theme }) => theme.app.palette.yellow[350]};
  font-size: 12px;
  line-height: 14px;
  border-radius: 3px;
  font-weight: 600;
  color: ${({ theme }) => theme.app.palette.gray[800]};
`;

const Server = styled.span`
  margin-bottom: 6px;
  font-size: 12px;
`;

const Nickname = styled.span`
  margin-bottom: 3px;
  font-size: 16px;
`;

const Level = styled.span`
  font-size: 14px;
`;

const Buttons = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 5px;
  position: absolute;
  bottom: 0;
  right: 0;
  border-radius: 5px 0 0 0;
  overflow: hidden;
  button {
    background: rgba(0, 0, 0, 0.6) !important;
  }
`;

const buttonCss = css`
  padding: 5px;
  border-radius: 0;
  color: ${({ theme }) => theme.app.palette.gray[0]};
`;
