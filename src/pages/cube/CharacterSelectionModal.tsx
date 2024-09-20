import { useQueryClient } from "@tanstack/react-query";
import React from "react";
import styled from "styled-components";

import useAddCubeCharacter from "@core/hooks/mutations/cube/useAddCubeCharacter";
import useCharacters from "@core/hooks/queries/character/useCharacters";
import queryKeyGenerator from "@core/utils/queryKeyGenerator";

import Modal from "@components/Modal";

interface CharacterSelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  existingCharacterIds: number[];
}

const CharacterSelectionModal: React.FC<CharacterSelectionModalProps> = ({
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
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalContent>
        <h2>캐릭터 선택</h2>
        <CharacterList>
          {getCharacters.data?.map((char) => {
            const isExisting = existingCharacterIds.includes(char.characterId);

            return (
              <CharacterItem
                key={char.characterId}
                onClick={() =>
                  !isExisting &&
                  addCubeCharacter.mutate({
                    characterId: char.characterId,
                    characterName: char.characterName,
                  })
                }
                $isDisabled={isExisting}
              >
                {char.characterName} / {char.itemLevel} /{" "}
                {char.characterClassName}
                {isExisting && " (이미 추가됨)"}
              </CharacterItem>
            );
          })}
        </CharacterList>
      </ModalContent>
    </Modal>
  );
};

export default CharacterSelectionModal;

const ModalContent = styled.div`
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
`;

const CharacterList = styled.ul`
  list-style-type: none;
  padding: 0;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 10px;
`;

const CharacterItem = styled.li<{ $isDisabled: boolean }>`
  padding: 10px;
  border: 1px solid #eee;
  text-align: center;
  opacity: ${(props) => (props.$isDisabled ? 0.5 : 1)};
  pointer-events: ${(props) => (props.$isDisabled ? "none" : "auto")};
  cursor: ${(props) => (props.$isDisabled ? "not-allowed" : "pointer")};
`;
