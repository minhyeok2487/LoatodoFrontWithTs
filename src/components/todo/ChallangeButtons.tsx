import styled from "@emotion/styled";
import { BsCheck } from "@react-icons/all-files/bs/BsCheck";
import type { FC } from "react";
import { toast } from "react-toastify";

import { useCharacters } from "@core/apis/character.api";
import * as characterApi from "@core/apis/character.api";
import useWindowSize from "@core/hooks/useWindowSize";
import { CharacterType } from "@core/types/character";
import { FriendType } from "@core/types/friend";

interface Props {
  characters: CharacterType[];
  server: string;
  friend?: FriendType;
}

const ChallangeButtons: FC<Props> = ({ characters, server, friend }) => {
  const { refetch: refetchCharacters } = useCharacters();
  const { width } = useWindowSize();

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
          <BsCheck />
        </Indicator>
        {width < 500 ? "도가토" : "도전 가디언 토벌"}
      </ChallangeButton>
      <ChallangeButton
        type="button"
        isActive={characters.length > 0 && characters[0].challengeAbyss}
        onClick={() => updateChallenge(server, "Abyss")}
      >
        <Indicator>
          <BsCheck />
        </Indicator>
        {width < 500 ? "도비스" : "도전 어비스 던전"}
      </ChallangeButton>
    </Wrapper>
  );
};

export default ChallangeButtons;

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
  text-decoration: ${({ isActive }) => (isActive ? "line-through" : "none")};

  ${Indicator} {
    background: ${({ isActive, theme }) =>
      isActive ? theme.app.green : "transparent"};
    color: ${({ isActive, theme }) =>
      isActive ? theme.app.white : "transparent"};
  }
`;
