import styled from "@emotion/styled";
import { FormControlLabel, Grid, Switch } from "@mui/material";
import { useQueryClient } from "@tanstack/react-query";

import DefaultLayout from "@layouts/DefaultLayout";

import useUpdateVisibleSetting from "@core/hooks/mutations/character/useUpdateVisibleSetting";
import useCharacters from "@core/hooks/queries/character/useCharacters";
import type { VisibleSettingName } from "@core/types/character";
import queryKeyGenerator from "@core/utils/queryKeyGenerator";

import BoxTitle from "@components/BoxTitle";
import CharacterInformation from "@components/todo/TodolList/CharacterInformation";

type SettingGroups = Array<(SettingItem | TitleItem)[]>;

interface SettingItem {
  label: string;
  name: VisibleSettingName;
}

interface TitleItem {
  label: string;
}

const settingGroups: SettingGroups = [
  [
    {
      label: "캐릭터 출력",
      name: "showCharacter",
    },
    { label: "일일 숙제" },
    {
      label: "에포나의뢰",
      name: "showEpona",
    },
    {
      label: "카오스던전",
      name: "showChaos",
    },
    {
      label: "가디언토벌",
      name: "showGuardian",
    },
  ],
  [
    { label: "주간 숙제" },
    {
      label: "주간 레이드",
      name: "showWeekTodo",
    },
    {
      label: "주간 에포나",
      name: "showWeekEpona",
    },
    {
      label: "실마엘 교환",
      name: "showSilmaelChange",
    },
    {
      label: "큐브 티켓",
      name: "showCubeTicket",
    },
  ],
];

const CharacterSetting = () => {
  const queryClient = useQueryClient();

  const getCharacters = useCharacters();

  const updateVisibleSetting = useUpdateVisibleSetting({
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeyGenerator.getCharacters(),
      });
    },
  });

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

                {settingGroups.map((settings, index) => {
                  return (
                    <Box key={index}>
                      {settings.map((item) => {
                        if ("name" in item) {
                          const checked = character.settings[item.name];

                          return (
                            <Row key={item.name}>
                              <Label>{item.label}</Label>

                              <FormControlLabel
                                control={
                                  <Switch
                                    onChange={(event) => {
                                      updateVisibleSetting.mutate({
                                        characterId: character.characterId,
                                        characterName: character.characterName,
                                        name: item.name,
                                        value: event.target.checked,
                                      });
                                    }}
                                    checked={checked}
                                  />
                                }
                                label={checked ? "출력" : "미출력"}
                                labelPlacement="start"
                              />
                            </Row>
                          );
                        }

                        return (
                          <Row key={item.label}>
                            <BoxTitle>{item.label}</BoxTitle>
                          </Row>
                        );
                      })}
                    </Box>
                  );
                })}
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
