import { MdSave } from "@react-icons/all-files/md/MdSave";
import { useQueryClient } from "@tanstack/react-query";
import { useRef, useState } from "react";
import styled from "styled-components";

import useUpdateCharacterMemo from "@core/hooks/mutations/character/useUpdateCharacterMemo";
import type { Character } from "@core/types/character";
import { getIsSpecialist } from "@core/utils/character.util";
import queryKeyGenerator from "@core/utils/queryKeyGenerator";

import PiNotePencil from "@assets/svg/PiNotePencil";

interface Props {
  character: Character;
}

const CharacterInformation = ({ character }: Props) => {
  const queryClient = useQueryClient();
  const memoRef = useRef<HTMLInputElement>(null);

  const [editMemo, setEditMemo] = useState(false);

  const updateCharacterMemo = useUpdateCharacterMemo({
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeyGenerator.getCharacters(),
      });

      setEditMemo(false);
    },
  });

  const submitMemo = () => {
    if (memoRef.current) {
      updateCharacterMemo.mutate({
        characterId: character.characterId,
        memo: memoRef.current.value,
      });
    }
  };

  return (
    <Wrapper>
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
          {editMemo && (
            <button type="button" onClick={submitMemo}>
              <MdSave />
            </button>
          )}
          {!editMemo && (
            <button
              type="button"
              onClick={() => {
                setEditMemo(true);
                memoRef.current?.focus();
              }}
            >
              <PiNotePencil />
            </button>
          )}
        </Buttons>
      </CharacterBox>
      <MemoInput
        ref={memoRef}
        placeholder="메모 추가"
        defaultValue={character.memo || ""}
        $isHidden={character.memo === null && !editMemo}
        onKeyDown={(e) => {
          e.stopPropagation();
          const target = e.target as HTMLInputElement;

          if (e.key === "Enter") {
            submitMemo();

            target.blur();
          }
        }}
      />
    </Wrapper>
  );
};

export default CharacterInformation;

const Wrapper = styled.div``;

const MemoInput = styled.input<{ $isHidden: boolean }>`
  position: ${({ $isHidden }) => ($isHidden ? "absolute" : "relative")};
  left: ${({ $isHidden }) => ($isHidden ? "-9999px" : "unset")};
  padding: 5px 10px;
  width: 100%;
  font-size: 12px;
  border: 1px solid ${({ theme }) => theme.app.border};
  border-bottom: none;
  background: ${({ theme }) => theme.app.bg.white};
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
  background: rgba(0, 0, 0, 0.8);
  bottom: 0;
  right: 0;
  padding: 5px;

  svg {
    width: 20px;
    height: 20px;
  }
`;
