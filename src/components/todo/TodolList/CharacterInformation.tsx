import styled from "styled-components";

import type { Character } from "@core/types/character";
import { getIsSpecialist } from "@core/utils/character.util";

interface Props {
  character: Character;
}

const CharacterInformation = ({ character }: Props) => {
  return (
    <Wrapper
      style={{
        backgroundImage:
          character.characterImage !== null
            ? `url(${character.characterImage})`
            : undefined,
        backgroundPosition: getIsSpecialist(character.characterClassName)
          ? "left 10px top -80px"
          : "left 10px top -30px",
      }}
    >
      {character.goldCharacter && <GoldCharacter>골드 획득 지정</GoldCharacter>}

      <Server>
        @{character.serverName} {character.characterClassName}
      </Server>
      <Nickname>{character.characterName}</Nickname>
      <Level>Lv. {character.itemLevel}</Level>
    </Wrapper>
  );
};

export default CharacterInformation;

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  padding: 0 15px;
  height: 112px;
  border-radius: 7px 7px 0 0;
  line-height: 1.1;
  color: ${({ theme }) => theme.app.palette.gray[0]};
  border: 1px solid ${({ theme }) => theme.app.border};
  border-bottom: none;
  background-color: ${({ theme }) => theme.app.palette.gray[500]};
  background-size: 150%;
`;

const GoldCharacter = styled.div`
  padding: 2px 5px;
  margin-bottom: 8px;
  background: ${({ theme }) => theme.app.palette.yellow[350]};
  font-size: 12px;
  line-height: 14px;
  border-radius: 3px;
  font-weight: 600;
  color: ${({ theme }) => theme.app.palette.gray[800]};
`;

const Server = styled.span`
  margin-bottom: 6px;
  font-size: 12px;
`;

const Nickname = styled.span`
  margin-bottom: 3px;
  font-size: 16px;
`;

const Level = styled.span`
  font-size: 14px;
`;
