import styled from "@emotion/styled";
import { FormControlLabel, Grid, Switch } from "@mui/material";
import { useQueryClient } from "@tanstack/react-query";
import { useSetRecoilState } from "recoil";

import DefaultLayout from "@layouts/DefaultLayout";

import * as characterApi from "@core/apis/character.api";
import { loading } from "@core/atoms/loading.atom";
import useCharacters from "@core/hooks/queries/useCharacters";

import BoxTitle from "@components/BoxTitle";
import CharacterInformation from "@components/todo/TodolList/CharacterInformation";

const CharacterSetting = () => {
  const queryClient = useQueryClient();

  const { getCharacters, getCharactersQueryKey } = useCharacters();
  const setLoadingState = useSetRecoilState(loading);

  const handleChange = async (
    event: React.ChangeEvent<HTMLInputElement>,
    characterId: number,
    characterName: string,
    settingName: string
  ) => {
    setLoadingState(true);
    try {
      await characterApi.updateSetting(
        characterId,
        characterName,
        event.target.checked,
        settingName
      );

      queryClient.invalidateQueries({
        queryKey: getCharactersQueryKey,
      });
    } catch (error) {
      console.error(error);
    }
    setLoadingState(false);
  };

  const renderSwitch = (
    characterId: number,
    characterName: string,
    setting: boolean,
    settingName: string
  ) => (
    <FormControlLabel
      control={
        <Switch
          onChange={(event) =>
            handleChange(event, characterId, characterName, settingName)
          }
          checked={setting}
        />
      }
      label={setting ? "출력" : "미출력"}
      labelPlacement="start"
    />
  );

  if (!getCharacters.data) {
    return null;
  }
  return (
    <DefaultLayout>
      <Wrapper>
        <Grid container spacing={1.5} overflow="hidden">
          {getCharacters.data.map((character) => (
            <Item key={character.sortNumber} item>
              <Body>
                <CharacterInformation character={character} />

                <Box>
                  <Row>
                    <Label>캐릭터 출력</Label>

                    {renderSwitch(
                      character.characterId,
                      character.characterName,
                      character.settings.showCharacter,
                      "showCharacter"
                    )}
                  </Row>
                  <Row>
                    <BoxTitle>일일 숙제</BoxTitle>
                  </Row>
                  <Row>
                    <Label>에포나의뢰</Label>

                    {renderSwitch(
                      character.characterId,
                      character.characterName,
                      character.settings.showEpona,
                      "showEpona"
                    )}
                  </Row>
                  <Row>
                    <Label>카오스던전</Label>

                    {renderSwitch(
                      character.characterId,
                      character.characterName,
                      character.settings.showChaos,
                      "showChaos"
                    )}
                  </Row>
                  <Row>
                    <Label>가디언토벌</Label>

                    {renderSwitch(
                      character.characterId,
                      character.characterName,
                      character.settings.showGuardian,
                      "showGuardian"
                    )}
                  </Row>
                </Box>

                <Box>
                  <Row>
                    <BoxTitle>주간 숙제</BoxTitle>
                  </Row>
                  <Row>
                    <Label>주간 레이드</Label>

                    {renderSwitch(
                      character.characterId,
                      character.characterName,
                      character.settings.showWeekTodo,
                      "showWeekTodo"
                    )}
                  </Row>
                  <Row>
                    <Label>주간 에포나</Label>

                    {renderSwitch(
                      character.characterId,
                      character.characterName,
                      character.settings.showWeekEpona,
                      "showWeekEpona"
                    )}
                  </Row>
                  <Row>
                    <Label>실마엘 교환</Label>

                    {renderSwitch(
                      character.characterId,
                      character.characterName,
                      character.settings.showSilmaelChange,
                      "showSilmaelChange"
                    )}
                  </Row>
                  <Row>
                    <Label>큐브 티켓</Label>

                    {renderSwitch(
                      character.characterId,
                      character.characterName,
                      character.settings.showCubeTicket,
                      "showCubeTicket"
                    )}
                  </Row>
                </Box>
              </Body>
            </Item>
          ))}
        </Grid>
      </Wrapper>
    </DefaultLayout>
  );
};

export default CharacterSetting;

const Wrapper = styled.div`
  width: 100%;
`;

const Item = styled(Grid)`
  width: 212px;
`;

const Body = styled.div`
  display: flex;
  flex-direction: column;
`;

const Box = styled.div`
  background: ${({ theme }) => theme.app.bg.light};
  border: 1px solid ${({ theme }) => theme.app.border};

  & + & {
    margin-top: 7px;
  }
`;

const Row = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: 5px 10px;
  color: ${({ theme }) => theme.app.text.dark2};
  font-size: 14px;

  & + & {
    border-top: 1px solid ${({ theme }) => theme.app.border};
  }

  .MuiFormControlLabel-label {
    font-size: inherit;
    color: inherit;
    font-weight: inherit;
  }
`;

const Label = styled.span``;
