import { FiMinus } from "@react-icons/all-files/fi/FiMinus";
import { FiPlus } from "@react-icons/all-files/fi/FiPlus";
import { useQueryClient } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import styled, { css } from "styled-components";

import useCheckWeeklyTodo from "@core/hooks/mutations/todo/useCheckWeeklyTodo";
import useCubeCharacters from "@core/hooks/queries/cube/useCubeCharacters";
import type { Character } from "@core/types/character";
import type { Friend } from "@core/types/friend";
import queryKeyGenerator from "@core/utils/queryKeyGenerator";

import Button from "@components/Button";
import CubeRewardsModal from "@components/CubeRewardsModal";

import MoreDetailIcon from "@assets/svg/MoreDetailIcon";

interface Props {
  character: Character;
  friend?: Friend;
}

const CubeTicketManager = ({ character, friend }: Props) => {
  const queryClient = useQueryClient();

  const [cubeRewardsModalOpen, setCubeRewardsModalOpen] = useState(false);
  const getCubeCharacters = useCubeCharacters();
  const checkWeeklyTodo = useCheckWeeklyTodo({
    onSuccess: (character, { isFriend }) => {
      if (isFriend) {
        queryClient.invalidateQueries({
          queryKey: queryKeyGenerator.getFriends(),
        });
      } else {
        queryClient.invalidateQueries({
          queryKey: queryKeyGenerator.getCharacters(),
        });
      }
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

  return (
    <Wrapper>
      <CubeCounter>
        <CubeActionButton
          disabled={character.cubeTicket <= 0}
          onClick={() => {
            checkWeeklyTodo.mutate({
              isFriend: !!friend,
              characterId: character.characterId,
              characterName: character.characterName,
              action: "SUBSCTRACT_CUBE_TICKET",
            });
          }}
        >
          <FiMinus />
        </CubeActionButton>
        {character.cubeTicket} 장
        <CubeActionButton
          onClick={() => {
            checkWeeklyTodo.mutate({
              isFriend: !!friend,
              characterId: character.characterId,
              characterName: character.characterName,
              action: "ADD_CUBE_TICKET",
            });
          }}
        >
          <FiPlus />
        </CubeActionButton>
        큐브 티켓
      </CubeCounter>

      <Button
        css={rightButtonCss}
        type="button"
        variant="icon"
        size={18}
        onClick={() => setCubeRewardsModalOpen(true)}
      >
        <MoreDetailIcon />
      </Button>

      <CubeRewardsModal
        isOpen={cubeRewardsModalOpen}
        onClose={() => setCubeRewardsModalOpen(false)}
      />
    </Wrapper>
  );
};

export default CubeTicketManager;

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

const rightButtonCss = css`
  padding: 8px 6px;
  border-radius: 0;
`;
