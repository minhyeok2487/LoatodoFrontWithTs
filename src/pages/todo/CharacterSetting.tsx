import { FormControlLabel, Grid, Switch } from "@mui/material";
import Tooltip from "@mui/material/Tooltip";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import styled from "styled-components";

import DefaultLayout from "@layouts/DefaultLayout";

import useUpdateCharacterSetting from "@core/hooks/mutations/character/useUpdateCharacterSetting";
import useCharacters from "@core/hooks/queries/character/useCharacters";
import type { CharacterSettingName } from "@core/types/character";
import queryKeyGenerator from "@core/utils/queryKeyGenerator";

import BoxTitle from "@components/BoxTitle";
import CharacterInformation from "@components/todo/TodoList/CharacterInformation";

import DeletedCharacterRecovery from "./components/DeletedCharacterRecovery";

type SettingGroups = Array<(SettingItem | TitleItem)[]>;

interface SettingItem {
  label: string;
  name: CharacterSettingName;
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
      label: "카오스던전",
      name: "showChaos",
    },
    {
      label: "카던 임계값",
      name: "thresholdChaos",
    },
    {
      label: "가디언토벌",
      name: "showGuardian",
    },
    {
      label: "가토 임계값",
      name: "thresholdGuardian",
    },
  ],
  [
    { label: "주간 숙제" },
    {
      label: "주간 레이드",
      name: "showWeekTodo",
    },
    {
      label: "더보기 버튼 출력",
      name: "showMoreButton",
    },
    {
      label: "실마엘 교환",
      name: "showSilmaelChange",
    },
    {
      label: "큐브 티켓",
      name: "showCubeTicket",
    },
    {
      label: "낙원",
      name: "showElysian",
    },
  ],
];

const CharacterSetting = () => {
  const queryClient = useQueryClient();
  const getCharacters = useCharacters();
  const updateCharacterSetting = useUpdateCharacterSetting({
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeyGenerator.getCharacters(),
      });
    },
  });

  // 상태 관리: 각 캐릭터의 threshold 설정을 저장
  const [thresholdSettings, setThresholdSettings] = useState<
    Record<string, Record<string, number>>
  >({});

  // 초기 상태 설정
  useEffect(() => {
    if (getCharacters.data) {
      const initialSettings = getCharacters.data.reduce(
        (acc, character) => {
          acc[character.characterId] = {
            thresholdGuardian: character.settings.thresholdGuardian,
            thresholdChaos: character.settings.thresholdChaos,
          };
          return acc;
        },
        {} as Record<string, Record<string, number>>
      );
      setThresholdSettings(initialSettings);
    }
  }, [getCharacters.data]);

  if (!getCharacters.data) {
    return null;
  }

  return (
    <DefaultLayout>
      <Wrapper>
        <DeletedCharacterRecovery />
        <Grid container spacing={1.5} overflow="hidden">
          {getCharacters.data.map((character) => (
            <Item key={character.characterId} item>
              <Body>
                <CharacterInformation character={character} isSetting />

                {settingGroups.map((settings, index) => {
                  return (
                    <Box key={index}>
                      {settings.map((item) => {
                        if ("name" in item) {
                          const value =
                            thresholdSettings[character.characterId]?.[
                              item.name
                            ];

                          if (
                            item.name === "thresholdGuardian" ||
                            item.name === "thresholdChaos"
                          ) {
                            return (
                              <Row key={item.name}>
                                <Label>{item.label}</Label>
                                <Tooltip
                                  title={
                                    <>
                                      입력된 값 이상일 때, 숙제가 출력됩니다.
                                      <br />
                                      엔터 키를 누르면 저장됩니다.
                                      <br />
                                      해당 기능은 상단 설정이 출력상태일 때,
                                      동작합니다.
                                    </>
                                  }
                                  arrow
                                >
                                  <Input
                                    key={item.name}
                                    type="number"
                                    value={value}
                                    onChange={(event) => {
                                      const newValue = Number(
                                        event.target.value
                                      );
                                      setThresholdSettings((prev) => ({
                                        ...prev,
                                        [character.characterId]: {
                                          ...prev[character.characterId],
                                          [item.name]: newValue,
                                        },
                                      }));
                                    }}
                                    onKeyDown={(event) => {
                                      if (event.key === "Enter") {
                                        updateCharacterSetting.mutate({
                                          characterId: character.characterId,
                                          characterName:
                                            character.characterName,
                                          name: item.name,
                                          value,
                                        });
                                      }
                                    }}
                                  />
                                </Tooltip>
                              </Row>
                            );
                          }

                          const originalValue = character.settings[item.name];

                          if (typeof originalValue === "boolean") {
                            return (
                              <Row key={item.name}>
                                <Label>{item.label}</Label>

                                <FormControlLabel
                                  control={
                                    <Switch
                                      onChange={(event) => {
                                        updateCharacterSetting.mutate({
                                          characterId: character.characterId,
                                          characterName:
                                            character.characterName,
                                          name: item.name,
                                          value: event.target.checked,
                                        });
                                      }}
                                      checked={originalValue}
                                    />
                                  }
                                  label={originalValue ? "출력" : "미출력"}
                                  labelPlacement="start"
                                />
                              </Row>
                            );
                          }
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
  background: ${({ theme }) => theme.app.bg.white};
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

  &:not(:first-of-type) {
    border-top: 1px solid ${({ theme }) => theme.app.border};
  }

  .MuiFormControlLabel-label {
    font-size: inherit;
    color: inherit;
    font-weight: inherit;
  }
`;

const Input = styled.input`
  width: 60px; // 너비 조정
  padding: 5px; // 패딩 추가
  border: 1px solid ${({ theme }) => theme.app.border}; // 테두리 색상
  border-radius: 4px; // 모서리 둥글게
  font-size: 14px; // 글자 크기
  color: ${({ theme }) => theme.app.text.dark2}; // 글자 색상
  background: ${({ theme }) => theme.app.bg.white}; // 배경 색상
  transition: border-color 0.3s; // 테두리 색상 변화 효과

  &:focus {
    border-color: ${({ theme }) =>
      theme.app.text.dark1}; // 포커스 시 테두리 색상
    outline: none; // 기본 아웃라인 제거
  }
`;

const Label = styled.span``;
