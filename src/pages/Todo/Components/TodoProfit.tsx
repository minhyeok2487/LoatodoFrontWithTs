import { useRecoilState } from "recoil";
import { serverState } from "../../../atoms/Todo.atom";
import { useCharacterData, useMember } from "../../../apis/Member.api";
import { CharacterDto } from "../../../types/MemberResponse";
const TodoProfit = () => {
  const [server, setServer] = useRecoilState(serverState);
  // 캐릭터 데이터 가져오기
  const { data: characters } = useCharacterData();

  // 회원 데이터 가져오기
  const { data: member } = useMember();

  // 서버 상태를 가져오는 함수
  const getDefaultServer = () => {
    if (member?.mainCharacter.serverName) {
      return member.mainCharacter.serverName;
    } else {
      if (characters?.characterDtoMap != null) {
        return Object.keys(characters.characterDtoMap)[0];
      } else {
        return "";
      }
    }
  };
  setServer(getDefaultServer());

  if (characters == undefined || member == undefined) {
    return null;
  }
  const characterList: CharacterDto[] = Object.values(
    characters.characterDtoMap[server]
  ).flat();

  //1. 예상 일일 수익
  const totalDayGold = characterList.reduce((accumulator, character) => {
    if (character.settings.showChaos) {
      accumulator += character.chaosGold;
    }
    if (character.settings.showGuardian) {
      accumulator += character.guardianGold;
    }
    return accumulator;
  }, 0);

  //2. 일일 수익
  const getDayGold = characterList.reduce((accumulator, character) => {
    if (character.chaosCheck >= 1) {
      for (var i = 0; i < character.chaosCheck; i++) {
        accumulator += character.chaosGold / 2;
      }
    }
    if (character.guardianCheck === 1) {
      accumulator += character.guardianGold;
    }
    return accumulator;
  }, 0);

  //3. 예상 주간 수익
  const totalWeekGold = characterList.reduce((accumulator, character) => {
    if (character.goldCharacter) {
      character.todoList.forEach((todo) => {
        accumulator += todo.gold;
      });
    }
    return accumulator;
  }, 0);

  //4. 주간 수익
  const getWeekGold = characterList.reduce((accumulator, character) => {
    if (character.goldCharacter) {
      accumulator += character.weekGold;
    }
    return accumulator;
  }, 0);

  const percentage = ((getWeekGold / totalWeekGold) * 100).toFixed(1);

  return (
    <div className="setting-wrap">
      <div className="content-box">
        <p>일일 수익</p>
        <span className="bar">
          <i style={{ width: `${(getDayGold / totalDayGold) * 100}%` }}></i>
          <em style={{ textAlign: "center" }}>
            {((getDayGold / totalDayGold) * 100).toFixed(1)} %
          </em>
        </span>
        <p>
          {getDayGold.toFixed(2)} / <span>{totalDayGold.toFixed(2)}</span>G
        </p>
      </div>
      <div className="content-box">
        <p>주간 수익</p>
        <span className="bar">
          {percentage ? (
            <em style={{ left: "30.0%" }}>골드 획득 캐릭터를 지정해주세요</em>
          ) : (
            <>
              <i style={{ width: `${percentage}%` }}></i>
              <em style={{ textAlign: "center" }}>{percentage} %</em>
            </>
          )}
        </span>
        <p className={`${percentage == "100" ? "on" : ""}`}>
          {getWeekGold.toLocaleString()} /{" "}
          <span>{totalWeekGold.toLocaleString()}</span>G
        </p>
      </div>
    </div>
  );
};

export default TodoProfit;
