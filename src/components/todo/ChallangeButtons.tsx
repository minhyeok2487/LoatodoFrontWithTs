import styled from "@emotion/styled";
import type { FC } from "react";
import { RiCheckFill } from "react-icons/ri";
import { toast } from "react-toastify";

import { useCharacters } from "@core/apis/Character.api";
import * as characterApi from "@core/apis/Character.api";
import { CharacterType } from "@core/types/Character.type";
import { FriendType } from "@core/types/Friend.type";

interface Props {
  characters: CharacterType[];
  server: string;
  friend?: FriendType;
}

const ChallangeButtons: FC<Props> = ({ characters, server, friend }) => {
  const { refetch: refetchCharacters } = useCharacters();

  if (characters === undefined || characters.length < 1) {
    return null;
  }

  // 도전 어비스/가디언 체크
  const updateChallenge = async (serverName: string, content: string) => {
    if (friend) {
      toast.warn("기능 준비중입니다.");
    } else {
      try {
        await characterApi.updateChallenge(serverName, content);
        refetchCharacters();
      } catch (error) {
        console.error("Error updating updateChallenge:", error);
      }
    }
  };

  return (
    <Wrapper>
      <ChallangeButton
        type="button"
        isActive={characters.length > 0 && characters[0].challengeGuardian}
        onClick={() => updateChallenge(server, "Guardian")}
      >
        <Indicator>
          <RiCheckFill size="18" strokeWidth="0.7" />
        </Indicator>
        도전 가디언 토벌
      </ChallangeButton>
      <ChallangeButton
        type="button"
        isActive={characters.length > 0 && characters[0].challengeAbyss}
        onClick={() => updateChallenge(server, "Abyss")}
      >
        <Indicator>
          <RiCheckFill size="18" strokeWidth="0.7" />
        </Indicator>
        도전 어비스 던전
      </ChallangeButton>
    </Wrapper>
  );
};

export default ChallangeButtons;

const Wrapper = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  gap: 5px;
`;

const Indicator = styled.span`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 22px;
  height: 22px;
  border: 1px solid ${({ theme }) => theme.app.border};
  border-radius: 4px;
`;

const ChallangeButton = styled.button<{ isActive: boolean }>`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 10px;
  padding: 10px;
  background: ${({ theme }) => theme.app.bg.light};
  border: 1px solid ${({ theme }) => theme.app.border};
  font-size: 14px;
  color: ${({ isActive, theme }) =>
    isActive ? theme.app.gray2 : theme.app.text.main};
  text-decoration: ${({ isActive }) => (isActive ? "line-through" : "normal")};

  ${Indicator} {
    background: ${({ isActive, theme }) =>
      isActive ? theme.app.green : "transparent"};
    color: ${({ isActive, theme }) =>
      isActive ? theme.app.white : "transparent"};
  }
`;
