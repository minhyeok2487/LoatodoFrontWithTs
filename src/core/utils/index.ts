import { RAID_SORT_ORDER } from "@core/constants";
import type { Character, TodoRaid } from "@core/types/character";
import type { CubeCharacter, CubeReward } from "@core/types/cube";
import type { ClassName, ServerName } from "@core/types/lostark";
import type { Member } from "@core/types/member";
import type { Weekday } from "@core/types/schedule";

export const getWeekdayNumber = (weekday: Weekday): number => {
  switch (weekday) {
    case "MONDAY":
      return 1;
    case "TUESDAY":
      return 2;
    case "WEDNESDAY":
      return 3;
    case "THURSDAY":
      return 4;
    case "FRIDAY":
      return 5;
    case "SATURDAY":
      return 6;
    default:
      return 0;
  }
};

export const getIsDealer = (className: ClassName) => {
  if (
    className === "바드" ||
    className === "홀리나이트" ||
    className === "도화가"
  ) {
    return false;
  }

  return true;
};

export const getIsSpecialist = (className: ClassName) => {
  if (className === "기상술사" || className === "도화가") {
    return true;
  }

  return false;
};

// 일일 숙제의 총 수를 계산하는 함수
export const getTotalDayTodos = (characters: Character[]): number => {
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
export const getCompletedDayTodos = (characters: Character[]): number => {
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
export const getTotalWeekTodos = (characters: Character[]): number => {
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
export const getCompletedWeekTodos = (characters: Character[]): number => {
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
  characters: Character[],
  serverName: ServerName | null
): Character[] => {
  if (!serverName) {
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
  characters: Character[]
): Map<ServerName, number> => {
  const serverCounts = new Map<ServerName, number>();

  characters.forEach((character) => {
    const count = serverCounts.get(character.serverName) || 0;

    serverCounts.set(character.serverName, count + 1);
  });

  return serverCounts;
};

export const getDefaultServer = (
  characters: Character[],
  member: Member
): ServerName => {
  return (
    member.mainCharacter.serverName || findManyCharactersServer(characters)
  );
};

export const calculateRaidStatus = (characters: Character[]) => {
  const todoListGroupedByWeekCategory = characters
    .flatMap((character) => character.todoList)
    .reduce<{ [key: string]: TodoRaid[] }>((acc, todo) => {
      const newAcc = { ...acc };

      newAcc[todo.weekCategory] = newAcc[todo.weekCategory] || [];
      newAcc[todo.weekCategory].push(todo);

      return newAcc;
    }, {});

  const raidStatus = RAID_SORT_ORDER.map((key) => {
    const todoResponseDtos = todoListGroupedByWeekCategory[key] || [];
    const count = todoResponseDtos.filter((dto) => dto.check).length;
    const totalCount = todoResponseDtos.length;
    const dealerCount = todoResponseDtos.filter((dto) =>
      getIsDealer(dto.characterClassName)
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

export const calculateFriendRaids = (characters: Character[]) => {
  const todoListGroupedByWeekCategory = characters
    .flatMap((character) => character.todoList)
    .reduce<{ [key: string]: TodoRaid[] }>((acc, todo) => {
      const newAcc = { ...acc };

      newAcc[todo.weekCategory] = newAcc[todo.weekCategory] || [];
      newAcc[todo.weekCategory].push(todo);

      return newAcc;
    }, {});

  const raidStatus = RAID_SORT_ORDER.map((key) => {
    const todoResponseDtos = todoListGroupedByWeekCategory[key] || [];
    const count = todoResponseDtos.filter((dto) => dto.check).length;
    const totalCount = todoResponseDtos.length;
    const dealerCount = todoResponseDtos.filter((dto) =>
      getIsDealer(dto.characterClassName)
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
  characters: Character[]
): ServerName => {
  const serverCounts = getServerList(characters);

  return Array.from(serverCounts.entries()).reduce((a, b) =>
    b[1] > a[1] ? b : a
  )[0];
};

export const calculateCubeReward = ({
  cubeCharacters,
  cubeRewards,
}: {
  cubeCharacters: CubeCharacter;
  cubeRewards: CubeReward;
}) => {};

export const getTicketNameByKey = (key: string) => {
  if (key.includes("ban")) {
    return `${key.replace("ban", "")}금제`;
  }

  if (key.includes("unlock")) {
    return `${key.replace("unlock", "")}해금`;
  }

  return "";
};
