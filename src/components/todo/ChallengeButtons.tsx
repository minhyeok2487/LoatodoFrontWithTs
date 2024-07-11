import { BsCheck } from "@react-icons/all-files/bs/BsCheck";
import { useQueryClient } from "@tanstack/react-query";
import type { FC } from "react";
import { toast } from "react-toastify";
import styled from "styled-components";

import useUpdateChallenge from "@core/hooks/mutations/character/useUpdateChallenge";
import useIsBelowWidth from "@core/hooks/useIsBelowWidth";
import type { Character } from "@core/types/character";
import type { Friend } from "@core/types/friend";
import type { Challenge, ServerName } from "@core/types/lostark";
import queryKeyGenerator from "@core/utils/queryKeyGenerator";

interface Props {
  characters: Character[];
  server: ServerName;
  friend?: Friend;
}

const ChallengeButtons: FC<Props> = ({ characters, server, friend }) => {
  const queryClient = useQueryClient();
  const isBelowWidth500 = useIsBelowWidth(500);

  const updateChallange = useUpdateChallenge({
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeyGenerator.getCharacters(),
      });
    },
  });

  if (characters === undefined || characters.length < 1) {
    return null;
  }

  // 도전 어비스/가디언 체크
  const updateChallenge = (server: ServerName, content: Challenge) => {
    if (friend) {
      toast.warn("기능 준비 중입니다.");
    } else {
      updateChallange.mutate({
        serverName: server,
        content: content as Challenge,
      });
    }
  };

  return (
    <Wrapper>
      <ChallengeButton
        type="button"
        $isActive={characters.length > 0 && characters[0].challengeGuardian}
        onClick={() => updateChallenge(server, "Guardian")}
      >
        <Indicator>
          <BsCheck />
        </Indicator>
        {isBelowWidth500 ? "도가토" : "도전 가디언 토벌"}
      </ChallengeButton>
      <ChallengeButton
        type="button"
        $isActive={characters.length > 0 && characters[0].challengeAbyss}
        onClick={() => updateChallenge(server, "Abyss")}
      >
        <Indicator>
          <BsCheck />
        </Indicator>
        {isBelowWidth500 ? "도비스" : "도전 어비스 던전"}
      </ChallengeButton>
    </Wrapper>
  );
};

export default ChallengeButtons;

const Wrapper = styled.div`
  flex: 1;
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  gap: 5px;
  flex-wrap: wrap;
`;

const Indicator = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 22px;
  height: 22px;
  border: 1px solid ${({ theme }) => theme.app.border};
  border-radius: 4px;
  font-size: 18px;

  svg {
    stroke-width: 1px;
  }
`;

const ChallengeButton = styled.button<{ $isActive: boolean }>`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 10px;
  padding: 8px 10px;
  background: ${({ theme }) => theme.app.bg.light};
  border: 1px solid ${({ theme }) => theme.app.border};
  font-size: 14px;
  color: ${({ $isActive, theme }) =>
    $isActive ? theme.app.gray2 : theme.app.text.main};
  text-decoration: ${({ $isActive }) => ($isActive ? "line-through" : "none")};

  ${Indicator} {
    background: ${({ $isActive, theme }) =>
      $isActive ? theme.app.green : "transparent"};
    color: ${({ $isActive, theme }) =>
      $isActive ? theme.app.white : "transparent"};
  }
`;
