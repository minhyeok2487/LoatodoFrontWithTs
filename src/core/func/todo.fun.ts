import { CharacterType } from "../types/Character.type";
import { MemberType } from "../types/Member.type";

// 일일 숙제의 총 수를 계산하는 함수
export const getTotalDayTodos = (characters: CharacterType[]): number => {
  return characters.reduce((accumulator, character) => {
    if (character.settings.showCharacter) {
      if (character.settings.showChaos) {
        accumulator++;
      }
      if (character.settings.showGuardian) {
        accumulator++;
      }
    }
    return accumulator;
  }, 0);
};

// 일일 숙제를 완료한 수를 계산하는 함수
export const getCompletedDayTodos = (characters: CharacterType[]): number => {
  return characters.reduce((accumulator, character) => {
    if (character.settings.showCharacter) {
      if (character.chaosCheck === 2) {
        accumulator++;
      }
      if (character.guardianCheck === 1) {
        accumulator++;
      }
    }
    return accumulator;
  }, 0);
};

// 주간 숙제의 총 수를 계산하는 함수
export const getTotalWeekTodos = (characters: CharacterType[]): number => {
  return characters.reduce((accumulator, character) => {
    if (character.goldCharacter) {
      character.todoList.forEach((todo) => {
        accumulator++;
      });
    }
    return accumulator;
  }, 0);
};

// 주간 숙제를 완료한 수를 계산하는 함수
export const getCompletedWeekTodos = (characters: CharacterType[]): number => {
  return characters.reduce((accumulator, character) => {
    if (character.goldCharacter) {
      character.todoList.forEach((todo) => {
        if (todo.check) {
          accumulator++;
        }
      });
    }
    return accumulator;
  }, 0);
};

export const getCharactersByServer = (
  characters: CharacterType[],
  serverName: string | null
): CharacterType[] => {
  if (serverName === "" || serverName === undefined || serverName === null) {
    const serverCounts = getServerList(characters);
    const maxCountServerName = Array.from(serverCounts.entries()).reduce(
      (a, b) => (b[1] > a[1] ? b : a)
    )[0];
    return characters.filter(
      (character) => character.serverName === maxCountServerName
    );
  } else {
    // serverName이 주어진 경우 해당 서버의 캐릭터 데이터 반환
    return characters.filter(
      (character) => character.serverName === serverName
    );
  }
};

export const getServerList = (
  characters: CharacterType[]
): Map<string, number> => {
  const serverCounts = new Map<string, number>();
  characters.forEach((character) => {
    const count = serverCounts.get(character.serverName) || 0;
    serverCounts.set(character.serverName, count + 1);
  });
  return serverCounts;
};

export const getDefaultServer = (
  characters: CharacterType[],
  member: MemberType
): string => {
  if (member.mainCharacter != undefined) {
    return member.mainCharacter.serverName;
  } else {
    const serverCounts = getServerList(characters);
    return Array.from(serverCounts.entries()).reduce((a, b) =>
      b[1] > a[1] ? b : a
    )[0];
  }
};
