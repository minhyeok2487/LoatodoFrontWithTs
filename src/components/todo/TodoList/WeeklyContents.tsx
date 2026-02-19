import { useMemo, useState } from "react";
import styled, { css } from "styled-components";

import useCubeCharacters from "@core/hooks/queries/cube/useCubeCharacters";
import { useCustomTodos } from "@core/hooks/queries/todo";
import type { Character } from "@core/types/character";
import type { Friend } from "@core/types/friend";
import { getCubeTicketKeys } from "@core/utils";

import BoxTitle from "@components/BoxTitle";
import Button from "@components/Button";

import EditIcon from "@assets/svg/EditIcon";

import WeeklyDetailModal from "./WeeklyDetailModal";

interface Props {
  character: Character;
  friend?: Friend;
}

const WeeklyContents = ({ character, friend }: Props) => {
  const [modalOpen, setModalOpen] = useState(false);

  // 깐부의 캐릭터라면 나에게 설정한 값도 체크해야 함
  const accessible = friend ? friend.fromFriendSettings.showWeekTodo : true;

  const customTodos = useCustomTodos(friend?.friendUsername);
  const getCubeCharacters = useCubeCharacters();

  // 진행률 계산 (주간 할 일만)
  const { current, total } = useMemo(() => {
    let total = 0;
    let current = 0;

    if (character.settings.showSilmaelChange) {
      total += 1;
      current += character.silmaelChange ? 1 : 0;
    }

    if (character.settings.showElysian) {
      total += 1;
      current += character.elysianCount >= 5 ? 1 : 0;
    }

    // 커스텀 WEEKLY 숙제
    if (customTodos.data) {
      customTodos.data
        .filter(
          (todo) =>
            todo.frequency === "WEEKLY" &&
            todo.characterId === character.characterId
        )
        .forEach((todo) => {
          total += 1;
          current += todo.checked ? 1 : 0;
        });
    }

    return { current, total };
  }, [character, customTodos.data]);

  // 큐브 티켓 총 수량 계산
  const cubeTicketCount = useMemo(() => {
    if (!friend && character.settings.linkCubeCal && getCubeCharacters.data) {
      const cubeChar = getCubeCharacters.data.find(
        (c) => c.characterName === character.characterName
      );
      if (cubeChar) {
        return getCubeTicketKeys(cubeChar).reduce(
          (acc, key) => acc + (cubeChar[key] as number),
          0
        );
      }
    }
    return character.cubeTicket;
  }, [character, getCubeCharacters.data, friend]);

  // 자원 요약 라인 구성
  const resourceParts = useMemo(() => {
    const parts: string[] = [];

    if (character.settings.showHellKey) {
      parts.push(`열쇠 ${character.hellKey}`);
    }
    if (character.settings.showTrialSand) {
      parts.push(`모래 ${character.trialSand}/5`);
    }
    if (character.settings.showCubeTicket) {
      parts.push(`큐브 ${cubeTicketCount}`);
    }

    return parts;
  }, [character, cubeTicketCount]);

  if (!accessible) {
    return null;
  }

  const isDone = total > 0 && current === total;

  return (
    <Wrapper>
      <TitleRow onClick={() => setModalOpen(true)}>
        <TitleLeft>
          <BoxTitle>주간 숙제</BoxTitle>
          {total > 0 && (
            <ProgressIndicator>
              <Dots>
                {Array.from({ length: total }, (_, i) => (
                  <Dot key={i} $filled={i < current} $done={isDone} />
                ))}
              </Dots>
              <ProgressText $done={isDone}>
                {current}/{total}
              </ProgressText>
            </ProgressIndicator>
          )}
        </TitleLeft>

        <Button
          css={settingButtonCss}
          variant="icon"
          size={18}
          onClick={(e) => {
            e.stopPropagation();
            setModalOpen(true);
          }}
        >
          <EditIcon />
        </Button>
      </TitleRow>

      {resourceParts.length > 0 && (
        <ResourceRow onClick={() => setModalOpen(true)}>
          {resourceParts.join(" · ")}
        </ResourceRow>
      )}

      <WeeklyDetailModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        character={character}
        friend={friend}
      />
    </Wrapper>
  );
};

export default WeeklyContents;

export const Wrapper = styled.div`
  width: 100%;
  background: ${({ theme }) => theme.app.bg.white};
  cursor: pointer;
`;

const TitleRow = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: 0 0 0 10px;
`;

const TitleLeft = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 8px;
  flex: 1;
`;

const ProgressIndicator = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 6px;
`;

const Dots = styled.div`
  display: flex;
  flex-direction: row;
  gap: 3px;
  max-width: 80px;
  flex-wrap: wrap;
`;

const Dot = styled.span<{ $filled: boolean; $done: boolean }>`
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: ${({ $filled, $done, theme }) =>
    $done
      ? theme.app.palette.gray[250]
      : $filled
        ? theme.app.palette.yellow[300]
        : theme.app.border};
`;

const ProgressText = styled.span<{ $done: boolean }>`
  font-size: 13px;
  font-weight: 600;
  color: ${({ $done, theme }) =>
    $done ? theme.app.text.light2 : theme.app.text.dark2};
`;

const ResourceRow = styled.div`
  padding: 2px 10px 6px;
  font-size: 13px;
  color: ${({ theme }) => theme.app.text.light2};
  border-top: 1px solid ${({ theme }) => theme.app.border};
`;

const settingButtonCss = css`
  padding: 8px 6px;
  border-radius: 0;
`;
