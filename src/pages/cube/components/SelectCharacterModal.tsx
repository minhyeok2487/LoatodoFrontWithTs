import { useQueryClient } from "@tanstack/react-query";
import React from "react";
import styled from "styled-components";

import useAddCubeCharacter from "@core/hooks/mutations/cube/useAddCubeCharacter";
import useCharacters from "@core/hooks/queries/character/useCharacters";
import queryKeyGenerator from "@core/utils/queryKeyGenerator";

import Button from "@components/Button";
import Modal from "@components/Modal";

interface CharacterSelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  existingCharacterIds: number[];
}

const SelectCharacterModal: React.FC<CharacterSelectionModalProps> = ({
  isOpen,
  onClose,
  existingCharacterIds,
}) => {
  const queryClient = useQueryClient();

  const getCharacters = useCharacters();
  const addCubeCharacter = useAddCubeCharacter({
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeyGenerator.getCubeCharacters(),
      });
    },
  });

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="캐릭터 선택">
      <CharacterList>
        {getCharacters.data?.map((char) => {
          const isExisting = existingCharacterIds.includes(char.characterId);

          return (
            <Button
              key={char.characterId}
              size="large"
              variant="outlined"
              onClick={() =>
                !isExisting &&
                addCubeCharacter.mutate({
                  characterId: char.characterId,
                  characterName: char.characterName,
                })
              }
              disabled={isExisting}
            >
              {char.characterName} / {char.itemLevel} /{" "}
              {char.characterClassName}
              {isExisting && " (이미 추가됨)"}
            </Button>
          );
        })}
      </CharacterList>
    </Modal>
  );
};

export default SelectCharacterModal;

const CharacterList = styled.div`
  display: flex;
  flex-direction: column;
  align-items: stretch;
  gap: 10px;
`;
