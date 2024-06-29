import { RAID_SORT_ORDER } from "@core/constants";
import { CharacterType, Todo } from "@core/types/character";
import { Member } from "@core/types/member";

// 일일 숙제의 총 수를 계산하는 함수
export const getTotalDayTodos = (characters: CharacterType[]): number => {
  return characters.reduce((acc, character) => {
    let newAcc = acc;

    if (character.settings.showCharacter) {
      if (character.settings.showChaos) {
        newAcc += 1;
      }
      if (character.settings.showGuardian) {
        newAcc += 1;
      }
    }
    return newAcc;
  }, 0);
};

// 일일 숙제를 완료한 수를 계산하는 함수
export const getCompletedDayTodos = (characters: CharacterType[]): number => {
  return characters.reduce((acc, character) => {
    let newAcc = acc;

    if (character.settings.showCharacter) {
      if (character.chaosCheck === 2) {
        newAcc += 1;
      }
      if (character.guardianCheck === 1) {
        newAcc += 1;
      }
    }
    return newAcc;
  }, 0);
};

// 주간 숙제의 총 수를 계산하는 함수
export const getTotalWeekTodos = (characters: CharacterType[]): number => {
  return characters.reduce((acc, character) => {
    let newAcc = acc;

    if (character.goldCharacter) {
      character.todoList.forEach((todo) => {
        newAcc += 1;
      });
    }
    return newAcc;
  }, 0);
};

// 주간 숙제를 완료한 수를 계산하는 함수
export const getCompletedWeekTodos = (characters: CharacterType[]): number => {
  return characters.reduce((acc, character) => {
    let newAcc = acc;

    if (character.goldCharacter) {
      character.todoList.forEach((todo) => {
        if (todo.check) {
          newAcc += 1;
        }
      });
    }
    return newAcc;
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
  }

  // serverName이 주어진 경우 해당 서버의 캐릭터 데이터 반환
  return characters.filter((character) => character.serverName === serverName);
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
  member: Member
): string => {
  if (member.mainCharacter.serverName !== null) {
    return member.mainCharacter.serverName;
  }

  return findManyCharactersServer(characters);
};

export const calculateRaidStatus = (characters: CharacterType[]) => {
  const todoListGroupedByWeekCategory = characters
    .flatMap((character) => character.todoList)
    .reduce<{ [key: string]: Todo[] }>((acc, todo) => {
      const newAcc = { ...acc };

      newAcc[todo.weekCategory] = newAcc[todo.weekCategory] || [];
      newAcc[todo.weekCategory].push(todo);

      return newAcc;
    }, {});

  const isDealer = (characterClassName: string) => {
    switch (characterClassName) {
      case "도화가":
      case "홀리나이트":
      case "바드":
        return false;
      default:
        return true;
    }
  };

  const raidStatus = RAID_SORT_ORDER.map((key) => {
    const todoResponseDtos = todoListGroupedByWeekCategory[key] || [];
    const count = todoResponseDtos.filter((dto) => dto.check).length;
    const totalCount = todoResponseDtos.length;
    const dealerCount = todoResponseDtos.filter((dto) =>
      isDealer(dto.characterClassName)
    ).length;
    const supportCount = totalCount - dealerCount;

    return {
      name: key,
      count,
      dealerCount,
      supportCount,
      totalCount,
    };
  });

  return raidStatus.filter((raid) => raid.totalCount >= 1);
};

export const calculateFriendRaids = (characters: CharacterType[]) => {
  const todoListGroupedByWeekCategory = characters
    .flatMap((character) => character.todoList)
    .reduce<{ [key: string]: Todo[] }>((acc, todo) => {
      const newAcc = { ...acc };

      newAcc[todo.weekCategory] = newAcc[todo.weekCategory] || [];
      newAcc[todo.weekCategory].push(todo);

      return newAcc;
    }, {});

  const isDealer = (characterClassName: string) => {
    switch (characterClassName) {
      case "도화가":
      case "홀리나이트":
      case "바드":
        return false;
      default:
        return true;
    }
  };

  const raidStatus = RAID_SORT_ORDER.map((key) => {
    const todoResponseDtos = todoListGroupedByWeekCategory[key] || [];
    const count = todoResponseDtos.filter((dto) => dto.check).length;
    const totalCount = todoResponseDtos.length;
    const dealerCount = todoResponseDtos.filter((dto) =>
      isDealer(dto.characterClassName)
    ).length;
    const supportCount = totalCount - dealerCount;

    return {
      name: key,
      count,
      dealerCount,
      supportCount,
      totalCount,
    };
  });

  return raidStatus;
};

export const findManyCharactersServer = (
  characters: CharacterType[]
): string => {
  const serverCounts = getServerList(characters);
  return Array.from(serverCounts.entries()).reduce((a, b) =>
    b[1] > a[1] ? b : a
  )[0];
};
