import { useState } from "react";
import styled, { useTheme } from "styled-components";

import {
  useCheckSilmaelExchange,
} from "@core/hooks/mutations/todo";
import { updateCharacterQueryData } from "@core/lib/queryClient";
import type { Character } from "@core/types/character";
import type { Friend } from "@core/types/friend";

import Modal from "@components/Modal";

import Elysian from "./Elysian";
import Check from "./element/Check";
import Cube from "./element/Cube";
import HellKey from "./element/HellKey";
import TrialSand from "./element/TrialSand";
import CustomContents from "./element/CustomContents";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  character: Character;
  friend?: Friend;
}

const WeeklyDetailModal = ({ isOpen, onClose, character, friend }: Props) => {
  const theme = useTheme();
  const [addCustomTodoMode, setAddCustomTodoMode] = useState(false);

  const checkSilmaelExchange = useCheckSilmaelExchange({
    onSuccess: (character, { friendUsername }) => {
      updateCharacterQueryData({
        character,
        friendUsername,
      });
    },
  });

  const showResourceSection =
    character.settings.showHellKey ||
    character.settings.showTrialSand;

  const showCubeSection = character.settings.showCubeTicket;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="주간 할 일">
      <ModalContent>
        <Section>
          <SectionTitle>주간 할 일</SectionTitle>
          <SectionBody>
            {character.settings.showSilmaelChange && (
              <TodoWrap
                $currentCount={character.silmaelChange ? 1 : 0}
                $totalCount={1}
              >
                <Check
                  indicatorColor={theme.app.palette.yellow[300]}
                  totalCount={1}
                  currentCount={character.silmaelChange ? 1 : 0}
                  onClick={() => {
                    checkSilmaelExchange.mutate({
                      friendUsername: friend?.friendUsername,
                      characterId: character.characterId,
                    });
                  }}
                  onRightClick={() => {
                    checkSilmaelExchange.mutate({
                      friendUsername: friend?.friendUsername,
                      characterId: character.characterId,
                    });
                  }}
                >
                  실마엘 혈석 교환
                </Check>
              </TodoWrap>
            )}

            {character.settings.showElysian && (
              <Elysian character={character} friend={friend} />
            )}

            <CustomContents
              setAddMode={setAddCustomTodoMode}
              addMode={addCustomTodoMode}
              character={character}
              friend={friend}
              frequency="WEEKLY"
            />
          </SectionBody>
        </Section>

        {showResourceSection && (
          <Section>
            <SectionTitle>보유 자원</SectionTitle>
            <SectionBody>
              {character.settings.showHellKey && (
                <HellKey character={character} friend={friend} />
              )}
              {character.settings.showTrialSand && (
                <TrialSand character={character} friend={friend} />
              )}
            </SectionBody>
          </Section>
        )}

        {showCubeSection && (
          <Section>
            <SectionTitle>큐브 티켓</SectionTitle>
            <SectionBody>
              <Cube character={character} friend={friend} />
            </SectionBody>
          </Section>
        )}
      </ModalContent>
    </Modal>
  );
};

export default WeeklyDetailModal;

const ModalContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  min-width: 280px;
`;

const Section = styled.div`
  display: flex;
  flex-direction: column;
`;

const SectionTitle = styled.p`
  font-size: 15px;
  font-weight: 600;
  color: ${({ theme }) => theme.app.text.dark1};
  margin-bottom: 4px;
  padding-left: 2px;
`;

const SectionBody = styled.div`
  border: 1px solid ${({ theme }) => theme.app.border};
  border-radius: 8px;
  overflow: hidden;

  > * + * {
    border-top: 1px solid ${({ theme }) => theme.app.border};
  }

  /* Override internal border-top styles from reused components */
  > div {
    border-top-style: none;
  }

  > * + div {
    border-top: 1px solid ${({ theme }) => theme.app.border};
  }
`;

const TodoWrap = styled.div<{
  $currentCount: number;
  $totalCount: number;
}>`
  opacity: ${(props) => (props.$currentCount === props.$totalCount ? 0.5 : 1)};
`;
