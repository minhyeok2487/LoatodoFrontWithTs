import { FormControlLabel, Grid, Switch } from "@mui/material";
import { useCharacters } from "../core/apis/Character.api";
import DefaultLayout from "../layouts/DefaultLayout";
import "../styles/components/CharacterSetting.css";
import * as characterApi from "../core/apis/Character.api";
import { useSetRecoilState } from "recoil";
import { loading } from "../core/atoms/Loading.atom";
const CharacterSetting = () => {
  const { data: characters, refetch: refetchCharacters } = useCharacters();
  const setLoadingState = useSetRecoilState(loading);

  if (characters === undefined) {
    return null;
  }

  const handleChange = async (
    event: React.ChangeEvent<HTMLInputElement>,
    characterId: number,
    characterName: string,
    settingName: string
  ) => {
    setLoadingState(true);
    try {
        await characterApi.updateSetting(characterId, characterName, event.target.checked, settingName);
        await refetchCharacters();
    } catch (error) {
      console.error(error);
    }
    setLoadingState(false);
  };

  const selectSetting = (
    characterId: number,
    characterName: string,
    setting: boolean,
    settingName: string
  ) => (
    <FormControlLabel
      control={
        <Switch
          id={`${characterName}_${settingName}`}
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
  return (
    <DefaultLayout>
      <div className="todo-wrap setting">
        <Grid container spacing={1.5} overflow={"hidden"}>
          {characters.map((character) => (
            <Grid key={character.sortNumber} item>
              <div className="character-wrap">
                <div
                  className="character-info"
                  style={{
                    backgroundImage:
                      character.characterImage !== null
                        ? `url(${character.characterImage})`
                        : "",
                    backgroundPosition:
                      character.characterClassName === "도화가" ||
                      character.characterClassName === "기상술사"
                        ? "left 10px top -80px"
                        : "left 10px top -30px",
                    backgroundColor: "gray", // 배경색을 회색으로 설정
                  }}
                >
                  <span>
                    @{character.serverName} {character.characterClassName}
                  </span>
                  <h3 style={{ margin: 0 }}>{character.characterName}</h3>
                  <h2 style={{ margin: 0 }}>Lv. {character.itemLevel}</h2>
                </div>
                <div className="content-wrap">
                  <div
                    className="content"
                    style={{ justifyContent: "space-around" }}
                  >
                    <div>
                      <span>캐릭터 출력</span>
                    </div>
                    {selectSetting(
                      character.characterId,
                      character.characterName,
                      character.settings.showCharacter,
                      "showCharacter"
                    )}
                  </div>
                </div>
                <p className="title">일일 숙제</p>
                <div className="content-wrap">
                  <div
                    className="content"
                    style={{ justifyContent: "space-around" }}
                  >
                    <div>
                      <span>에포나의뢰</span>
                    </div>
                    {selectSetting(
                      character.characterId,
                      character.characterName,
                      character.settings.showEpona,
                      "showEpona"
                    )}
                  </div>
                </div>
                <div className="content-wrap">
                  <div
                    className="content"
                    style={{ justifyContent: "space-around" }}
                  >
                    <div>
                      <p>카오스던전</p>
                    </div>
                    {selectSetting(
                      character.characterId,
                      character.characterName,
                      character.settings.showChaos,
                      "showChaos"
                    )}
                  </div>
                </div>
                <div className="content-wrap">
                  <div
                    className="content"
                    style={{ justifyContent: "space-around" }}
                  >
                    <div>
                      <p>가디언토벌</p>
                    </div>
                    {selectSetting(
                      character.characterId,
                      character.characterName,
                      character.settings.showGuardian,
                      "showGuardian"
                    )}
                  </div>
                </div>
              </div>
              <div className="character-wrap" style={{ marginTop: 10 }}>
                <p className="title" style={{ paddingTop: 8 }}>
                  주간 숙제
                </p>
                <div className="content-wrap">
                  <div
                    className="content"
                    style={{ justifyContent: "space-around" }}
                  >
                    <div>
                      주간 레이드
                      {selectSetting(
                        character.characterId,
                        character.characterName,
                        character.settings.showWeekTodo,
                        "showWeekTodo"
                      )}
                    </div>
                  </div>
                </div>
                <div className="content-wrap">
                  <div
                    className="content"
                    style={{ justifyContent: "space-around" }}
                  >
                    <div>
                      주간 에포나
                      {selectSetting(
                        character.characterId,
                        character.characterName,
                        character.settings.showWeekEpona,
                        "showWeekEpona"
                      )}
                    </div>
                  </div>
                </div>
                <div className="content-wrap">
                  <div
                    className="content"
                    style={{ justifyContent: "space-around" }}
                  >
                    <div>
                      실마엘 교환
                      {selectSetting(
                        character.characterId,
                        character.characterName,
                        character.settings.showSilmaelChange,
                        "showSilmaelChange"
                      )}
                    </div>
                  </div>
                </div>
                <div className="content-wrap">
                  <div
                    className="content"
                    style={{ justifyContent: "space-around" }}
                  >
                    <div>
                      큐브 티켓
                      {selectSetting(
                        character.characterId,
                        character.characterName,
                        character.settings.showCubeTicket,
                        "showCubeTicket"
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </Grid>
          ))}
        </Grid>
      </div>
    </DefaultLayout>
  );
};

export default CharacterSetting;
