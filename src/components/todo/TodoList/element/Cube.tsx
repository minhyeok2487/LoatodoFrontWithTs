import { FiMinus } from "@react-icons/all-files/fi/FiMinus";
import { FiPlus } from "@react-icons/all-files/fi/FiPlus";
import { useMemo } from "react";
import styled, { css } from "styled-components";

import { useUpdateCubeTicket } from "@core/hooks/mutations/todo";
import useCubeCharacters from "@core/hooks/queries/cube/useCubeCharacters";
import useModalState from "@core/hooks/useModalState";
import { updateCharacterQueryData } from "@core/lib/queryClient";
import type { Character } from "@core/types/character";
import type { Friend } from "@core/types/friend";
import { getCubeTicketKeys } from "@core/utils";

import Button from "@components/Button";
import CubeCharacterManager from "@components/CubeCharacterManager";
import CubeDashboardModal from "@components/CubeDashboardModal";
import Modal from "@components/Modal";

import EditIcon from "@assets/svg/EditIcon";
import MoreDetailIcon from "@assets/svg/MoreDetailIcon";

interface Props {
  character: Character;
  friend?: Friend;
}

const Cube = ({ character, friend }: Props) => {
  const [cubeDashboardModal, setCubeDashboardModal] =
    useModalState<Character>();
  const [cubeCharacterModal, setCubeCharacterModal] = useModalState<number>();
  const getCubeCharacters = useCubeCharacters();
  const updateCubeTicket = useUpdateCubeTicket({
    onSuccess: (character, { friendUsername }) => {
      updateCharacterQueryData({
        character,
        friendUsername,
      });
    },
  });

  const cubeCharacter = useMemo(() => {
    if (getCubeCharacters.data) {
      return (
        getCubeCharacters.data.find(
          (cubeCharacter) =>
            cubeCharacter.characterName === character.characterName
        ) ?? null
      );
    }

    return null;
  }, [getCubeCharacters]);

  const useCubeCharacter =
    !friend && character.settings.linkCubeCal && !!cubeCharacter;

  const totalCubeTickets = useMemo(() => {
    if (useCubeCharacter && cubeCharacter) {
      return getCubeTicketKeys(cubeCharacter).reduce((acc, key) => {
        return acc + (cubeCharacter[key] as number);
      }, 0);
    }

    return character.cubeTicket;
  }, [character, cubeCharacter]);

  return (
    <Wrapper>
      <CubeCounter>
        {useCubeCharacter ? (
          <>큐브 티켓: {totalCubeTickets} 장</>
        ) : (
          <>
            {!useCubeCharacter && (
              <CubeActionButton
                disabled={character.cubeTicket <= 0}
                onClick={() => {
                  updateCubeTicket.mutate({
                    friendUsername: friend?.friendUsername,
                    characterId: character.characterId,
                    num: -1,
                  });
                }}
              >
                <FiMinus />
              </CubeActionButton>
            )}
            {totalCubeTickets} 장
            {!useCubeCharacter && (
              <CubeActionButton
                onClick={() => {
                  updateCubeTicket.mutate({
                    friendUsername: friend?.friendUsername,
                    characterId: character.characterId,
                    num: 1,
                  });
                }}
              >
                <FiPlus />
              </CubeActionButton>
            )}{" "}
            큐브 티켓
          </>
        )}
      </CubeCounter>

      <Buttons>
        {useCubeCharacter && (
          <Button
            css={rightButtonCss}
            type="button"
            variant="icon"
            size={18}
            onClick={() => setCubeCharacterModal(character.characterId)}
          >
            <EditIcon />
          </Button>
        )}

        <Button
          css={rightButtonCss}
          type="button"
          variant="icon"
          size={18}
          onClick={() => setCubeDashboardModal(character)}
        >
          <MoreDetailIcon />
        </Button>
      </Buttons>

      <CubeDashboardModal
        onClose={() => setCubeDashboardModal()}
        targetCharacter={cubeDashboardModal}
      />

      <Modal
        isOpen={!!cubeCharacterModal}
        onClose={() => setCubeCharacterModal()}
      >
        <CubeCharacterManager characterId={cubeCharacterModal as number} />
      </Modal>
    </Wrapper>
  );
};

export default Cube;

const Wrapper = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding-left: 10px;
  font-size: 14px;
  border-top: 1px solid ${({ theme }) => theme.app.border};
`;

const CubeCounter = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 5px;
  margin: 5px 0;
`;

const CubeActionButton = styled.button`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 22px;
  height: 22px;
  border-radius: 4px;
  background: ${({ theme }) => theme.app.palette.yellow[300]};
  font-size: 16px;
  color: ${({ theme }) => theme.app.palette.gray[0]};

  &:disabled {
    background: ${({ theme }) => theme.app.palette.gray[250]};
  }
`;

const Buttons = styled.div`
  display: flex;
  flex-direction: row;
`;

const rightButtonCss = css`
  padding: 8px 6px;
  border-radius: 0;
`;
