import { useCallback, useMemo, useState } from "react";
import styled, { css, useTheme } from "styled-components";

import {
  useCheckSilmaelExchange,
} from "@core/hooks/mutations/todo";
import useCubeCharacters from "@core/hooks/queries/cube/useCubeCharacters";
import { useCustomTodos } from "@core/hooks/queries/todo";
import { updateCharacterQueryData } from "@core/lib/queryClient";
import type { Character } from "@core/types/character";
import type { Friend } from "@core/types/friend";
import { getCubeTicketKeys } from "@core/utils";

import BoxTitle from "@components/BoxTitle";
import Button from "@components/Button";

import EditIcon from "@assets/svg/EditIcon";

import Elysian from "./Elysian";
import Check from "./element/Check";
import Cube from "./element/Cube";
import CustomContents from "./element/CustomContents";
import HellKey from "./element/HellKey";
import TrialSand from "./element/TrialSand";

interface Props {
  character: Character;
  friend?: Friend;
}

const STORAGE_KEY = "weekly-accordion-state";

const getStoredExpanded = (characterId: number): boolean => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const map: Record<string, boolean> = JSON.parse(stored);
      return map[characterId] ?? true;
    }
  } catch {
    // ignore
  }
  return true;
};

const setStoredExpanded = (characterId: number, value: boolean) => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    const map: Record<string, boolean> = stored ? JSON.parse(stored) : {};
    map[characterId] = value;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(map));
  } catch {
    // ignore
  }
};

const WeeklyContents = ({ character, friend }: Props) => {
  const theme = useTheme();
  const [expanded, setExpanded] = useState(() =>
    getStoredExpanded(character.characterId)
  );
  const [addCustomTodoMode, setAddCustomTodoMode] = useState(false);

  const toggleExpanded = useCallback(() => {
    setExpanded((prev) => {
      const next = !prev;
      setStoredExpanded(character.characterId, next);
      return next;
    });
  }, [character.characterId]);

  // 깐부의 캐릭터라면 나에게 설정한 값도 체크해야 함
  const accessible = friend ? friend.fromFriendSettings.showWeekTodo : true;

  const customTodos = useCustomTodos(friend?.friendUsername);
  const getCubeCharacters = useCubeCharacters();

  const checkSilmaelExchange = useCheckSilmaelExchange({
    onSuccess: (character, { friendUsername }) => {
      updateCharacterQueryData({
        character,
        friendUsername,
      });
    },
  });

  const handleCheckSilmael = useCallback(() => {
    checkSilmaelExchange.mutate({
      friendUsername: friend?.friendUsername,
      characterId: character.characterId,
    });
  }, [checkSilmaelExchange, friend?.friendUsername, character.characterId]);

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

  const showTodoSection =
    character.settings.showSilmaelChange ||
    character.settings.showElysian ||
    (customTodos.data?.some(
      (todo) =>
        todo.frequency === "WEEKLY" &&
        todo.characterId === character.characterId
    ) ?? false);

  const showResourceSection =
    character.settings.showHellKey ||
    character.settings.showTrialSand;

  const showCubeSection = character.settings.showCubeTicket;

  return (
    <Wrapper>
      <TitleRow onClick={toggleExpanded}>
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

        <TitleRight>
          <Button
            css={addCustomTodoButtonCss}
            variant="icon"
            size={18}
            onClick={(e) => {
              e.stopPropagation();
              setAddCustomTodoMode(true);
            }}
          >
            <EditIcon />
          </Button>
          <ToggleArrow $expanded={expanded}>▼</ToggleArrow>
        </TitleRight>
      </TitleRow>

      {!expanded && resourceParts.length > 0 && (
        <ResourceRow onClick={toggleExpanded}>
          {resourceParts.join(" · ")}
        </ResourceRow>
      )}

      <CollapsiblePanel $expanded={expanded}>
        <CollapsibleInner>
          <DetailContent>
            {showTodoSection && (
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
                      onClick={handleCheckSilmael}
                      onRightClick={handleCheckSilmael}
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
            )}

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
          </DetailContent>
        </CollapsibleInner>
      </CollapsiblePanel>
    </Wrapper>
  );
};

export default WeeklyContents;

export const Wrapper = styled.div`
  width: 100%;
  background: ${({ theme }) => theme.app.bg.white};
`;

const TitleRow = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: 0 0 0 10px;
  cursor: pointer;
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

const TitleRight = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
`;

const addCustomTodoButtonCss = css`
  padding: 8px 6px;
  border-radius: 0;
`;

const ToggleArrow = styled.span<{ $expanded: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 8px 6px;
  font-size: 10px;
  color: ${({ theme }) => theme.app.text.light2};
  transition: transform 0.2s ease;
  transform: rotate(${({ $expanded }) => ($expanded ? "180deg" : "0deg")});
`;

const CollapsiblePanel = styled.div<{ $expanded: boolean }>`
  display: grid;
  grid-template-rows: ${({ $expanded }) => ($expanded ? "1fr" : "0fr")};
  transition: grid-template-rows 0.25s ease;
`;

const CollapsibleInner = styled.div`
  overflow: hidden;
  min-height: 0;
`;

const ResourceRow = styled.div`
  overflow: hidden;
  min-height: 0;
  padding: 2px 10px 6px;
  font-size: 13px;
  color: ${({ theme }) => theme.app.text.light2};
  border-top: 1px solid ${({ theme }) => theme.app.border};
  cursor: pointer;
`;

const DetailContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 8px 6px;
  border-top: 1px solid ${({ theme }) => theme.app.border};
`;

const Section = styled.div`
  display: flex;
  flex-direction: column;
`;

const SectionTitle = styled.p`
  font-size: 13px;
  font-weight: 600;
  color: ${({ theme }) => theme.app.text.dark1};
  margin-bottom: 2px;
  padding-left: 4px;
`;

const SectionBody = styled.div`
  border: 1px solid ${({ theme }) => theme.app.border};
  border-radius: 8px;
  overflow: hidden;

  > * + * {
    border-top: 1px solid ${({ theme }) => theme.app.border};
  }
`;

const TodoWrap = styled.div<{
  $currentCount: number;
  $totalCount: number;
}>`
  opacity: ${(props) => (props.$currentCount === props.$totalCount ? 0.5 : 1)};
`;
