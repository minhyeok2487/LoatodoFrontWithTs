import { Grid } from "@mui/material";
import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "react-toastify";
import styled from "styled-components";

import useRecoveryCharacter from "@core/hooks/mutations/character/useRecoveryCharacter";
import useDeletedCharacters from "@core/hooks/queries/character/useDeletedCharacters";
import { getIsSpecialist } from "@core/utils";
import queryKeyGenerator from "@core/utils/queryKeyGenerator";

import Button from "@components/Button";

const DeletedCharacterRecovery = () => {
  const queryClient = useQueryClient();
  const [showCharacters, setShowCharacters] = useState(false);
  const getDeletedCharacters = useDeletedCharacters();

  const recoverCharacterMutation = useRecoveryCharacter({
    onSuccess: (characterName) => {
      toast.success(`"${characterName}"을 복구했습니다.`);
      queryClient.invalidateQueries({
        queryKey: queryKeyGenerator.getCharacters(),
      });
      queryClient.invalidateQueries({
        queryKey: queryKeyGenerator.getDeletedCharacters(),
      });
    },
  });

  const recoverCharacter = (characterId: number, characterName: string) => {
    if (window.confirm(`${characterName}을 복구하시겠습니까?`)) {
      recoverCharacterMutation.mutate(characterId);
    }
  };

  if (!getDeletedCharacters.data) {
    return null;
  }

  const clickBtn = () => {
    if (getDeletedCharacters.data.length === 0) {
      toast.error("삭제된 캐릭터가 없습니다.");
    } else {
      setShowCharacters(!showCharacters);
    }
  };

  return (
    <Wrapper>
      <Button onClick={clickBtn}>삭제된 캐릭터 복구</Button>
      {showCharacters && getDeletedCharacters.data.length > 0 && (
        <CharacterList>
          <Instruction>캐릭터를 클릭하면 복구할 수 있습니다.</Instruction>
          <Grid container spacing={1.5} overflow="hidden">
            {getDeletedCharacters.data.map((character) => (
              <Item key={character.characterId} item>
                <Body
                  onClick={() =>
                    recoverCharacter(
                      character.characterId,
                      character.characterName
                    )
                  }
                >
                  <CharacterBox
                    style={{
                      backgroundImage:
                        character.characterImage !== null
                          ? `url(${character.characterImage})`
                          : undefined,
                      backgroundPosition: getIsSpecialist(
                        character.characterClassName
                      )
                        ? "left 10px top -80px"
                        : "left 10px top -30px",
                    }}
                  >
                    <Server>
                      @{character.serverName} {character.characterClassName}
                    </Server>
                    <Nickname>{character.characterName}</Nickname>
                    <Level>Lv. {character.itemLevel}</Level>
                  </CharacterBox>
                </Body>
              </Item>
            ))}
          </Grid>
        </CharacterList>
      )}
    </Wrapper>
  );
};

export default DeletedCharacterRecovery;

const Wrapper = styled.div`
  margin-bottom: 12px;
`;

const CharacterList = styled.div`
  padding: 8px;
  margin-top: 12px;
  width: 88%;
  background: ${({ theme }) => theme.app.bg.white};
  border: 1px solid ${({ theme }) => theme.app.border};
  border-radius: 10px;
`;

const Instruction = styled.p`
  font-size: 16px;
  font-weight: bold;
  margin: 5px 0;
  margin-left: 15px;
`;

const Item = styled(Grid)`
  width: 192px;
`;

const Body = styled.div`
  display: flex;
  flex-direction: column;
`;

const CharacterBox = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  padding: 0 15px;
  height: 112px;
  border-radius: 10px; /* 둥근 모서리 */
  line-height: 1.1;
  color: ${({ theme }) => theme.app.palette.gray[0]};
  border: 1px solid ${({ theme }) => theme.app.border};
  background-color: ${({ theme }) => theme.app.palette.gray[500]};
  background-size: 150%;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2); /* 그림자 효과 */

  &:hover {
    transform: scale(1.02); /* 약간의 확대 효과 */
    cursor: pointer;
    border: 2px solid ${({ theme }) => theme.app.bg.reverse};
  }
`;

const Server = styled.span`
  margin-bottom: 6px;
  font-size: 12px;
`;

const Nickname = styled.span`
  margin-bottom: 3px;
  font-size: 16px;
  font-weight: bold; /* 강조된 이름 */
`;

const Level = styled.span`
  font-size: 14px;
`;
