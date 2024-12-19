import dayjs from "dayjs";

import { RAID_SORT_ORDER } from "@core/constants";
import type { Character, TodoRaid } from "@core/types/character";
import type { CubeReward, CurrentCubeTickets } from "@core/types/cube";
import type { ClassName, ServerName, WeekContentCategory } from "@core/types/lostark";
import type { Member } from "@core/types/member";
import type { Weekday } from "@core/types/schedule";

export const getTimeAgoString = (fromDate: string) => {
  const now = dayjs();

  const monthsAgo = now.diff(dayjs(fromDate), "months");
  if (monthsAgo >= 1) {
    return `${monthsAgo}개월 전`;
  }

  const weeksAgo = now.diff(dayjs(fromDate), "weeks");
  if (weeksAgo >= 1) {
    return `${weeksAgo}주 전`;
  }

  const daysAgo = now.diff(dayjs(fromDate), "days");
  if (daysAgo >= 1) {
    return `${daysAgo}일 전`;
  }

  const hoursAgo = now.diff(dayjs(fromDate), "hours");
  if (hoursAgo >= 1) {
    return `${hoursAgo}시간 전`;
  }

  const minutesAgo = now.diff(dayjs(fromDate), "minutes");
  if (minutesAgo >= 1) {
    return `${minutesAgo}분 전`;
  }

  return `방금`;
};

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

export const getServerCounts = (characters: Character[]) => {
  const counts = characters.reduce<{ [key in ServerName]?: number }>(
    (acc, character) => {
      const newAcc = { ...acc };

      if (newAcc[character.serverName] !== undefined) {
        newAcc[character.serverName]! += 1;
      } else {
        newAcc[character.serverName] = 1;
      }

      return newAcc;
    },
    {}
  );

  return counts;
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
      // weekCategory가 아닌 weekContent를 기준으로 그룹핑
      const raidName = todo.weekCategory;
      const newAcc = { ...acc };
      newAcc[raidName] = newAcc[raidName] || [];
      newAcc[raidName].push(todo);
      return newAcc;
    }, {});

  const raidStatus = Object.entries(todoListGroupedByWeekCategory).map(([raidName, todos]) => {
    const groupedByDifficulty = todos.reduce((acc, todo) => {
      const difficulty = todo.weekContentCategory; // WeekContentCategory 타입 사용
      acc[difficulty] = acc[difficulty] || [];
      acc[difficulty].push(todo);
      return acc;
    }, {} as Record<WeekContentCategory, TodoRaid[]>);

    const difficulties = Object.entries(groupedByDifficulty).map(([difficulty, diffTodos]) => {
      const dealerTodos = diffTodos.filter((dto) => getIsDealer(dto.characterClassName));
      const supportTodos = diffTodos.filter((dto) => !getIsDealer(dto.characterClassName));

      return {
        difficulty: difficulty as WeekContentCategory,
        totalCount: diffTodos.length,
        dealerCount: dealerTodos.length,
        dealerChecked: dealerTodos.filter((dto) => dto.check).length,
        supportCount: supportTodos.length,
        supportChecked: supportTodos.filter((dto) => dto.check).length,
      };
    });

    return {
      name: raidName,
      difficulties,
      totalCount: todos.length,
      dealerCount: todos.filter((dto) => getIsDealer(dto.characterClassName)).length,
      dealerChecked: todos.filter((dto) => getIsDealer(dto.characterClassName) && dto.check).length,
      supportCount: todos.filter((dto) => !getIsDealer(dto.characterClassName)).length,
      supportChecked: todos.filter((dto) => !getIsDealer(dto.characterClassName) && dto.check).length,
    };
  });

  return raidStatus;
};

export const findManyCharactersServer = (
  characters: Character[]
): ServerName => {
  const counts = getServerCounts(characters);

  return Object.entries(counts).reduce((a, b) =>
    b[1] > a[1] ? b : a
  )[0] as ServerName;
};

export const calculateCubeReward = ({
  currentCubeTickets,
  cubeRewards = [],
}: {
  currentCubeTickets: CurrentCubeTickets;
  cubeRewards?: CubeReward[];
}) => {
  const cubeKeys = getCubeTicketKeys(currentCubeTickets);

  return cubeKeys.reduce(
    (acc, key) => {
      const targetReward = cubeRewards.find(
        (item) => item.name === getCubeTicketNameByKey(key)
      );
      const targetCubeQuantity = currentCubeTickets[
        key as keyof typeof currentCubeTickets
      ] as number;
      const isT3 = key.includes("ban");
      const isT4 = key.includes("unlock");

      return {
        gold:
          acc.gold +
          targetCubeQuantity *
          (targetReward?.jewelry || 0) *
          (targetReward?.jewelryPrice || 0),
        silver: acc.silver + targetCubeQuantity * (targetReward?.shilling || 0),
        cardExp:
          acc.cardExp + targetCubeQuantity * (targetReward?.cardExp || 0),
        t3Jewel:
          acc.t3Jewel +
          targetCubeQuantity * (isT3 ? targetReward?.jewelry || 0 : 0),
        t3Aux1:
          acc.t3Aux1 + targetCubeQuantity * (targetReward?.solarGrace || 0),
        t3Aux2:
          acc.t3Aux2 + targetCubeQuantity * (targetReward?.solarBlessing || 0),
        t3Aux3:
          acc.t3Aux3 +
          targetCubeQuantity * (targetReward?.solarProtection || 0),
        t3LeapStone:
          acc.t3LeapStone +
          targetCubeQuantity * (isT3 ? targetReward?.leapStone || 0 : 0),
        t4Jewel:
          acc.t4Jewel +
          targetCubeQuantity * (isT4 ? targetReward?.jewelry || 0 : 0),
        t4LeapStone:
          acc.t4LeapStone +
          targetCubeQuantity * (isT4 ? targetReward?.leapStone || 0 : 0),
      };
    },
    {
      gold: 0,
      silver: 0,
      cardExp: 0,
      t3Jewel: 0,
      t3Aux1: 0,
      t3Aux2: 0,
      t3Aux3: 0,
      t3LeapStone: 0,
      t4Jewel: 0,
      t4LeapStone: 0,
    }
  );
};

export const getCubeTicketNameByKey = (key: string) => {
  if (key.includes("ban")) {
    return `${key.replace("ban", "")}금제`;
  }
  return `${key.replace("unlock", "")}해금`;
};

export const getCubeTicketKeyByName = (key: string) => {
  if (key.includes("금제")) {
    return `ban${key.replace("금제", "")}` as keyof CurrentCubeTickets;
  }

  return `unlock${key.replace("해금", "")}` as keyof CurrentCubeTickets;
};

export const getCubeTicketKeys = (currentCubeTickets: CurrentCubeTickets) => {
  return Object.keys(currentCubeTickets).filter((key) =>
    /(ban|unlock)[1-5]/.test(key)
  ) as (keyof CurrentCubeTickets)[];
};

export const getJewerlyResult = (num: number) => {
  const table = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0, 7: 0, 8: 0, 9: 0, 10: 0 };
  let restNum = num;

  while (restNum > 0) {
    let powerOfThree = Math.floor(Math.log(restNum) / Math.log(3));

    if (powerOfThree > 9) {
      powerOfThree = 9;
    }

    restNum -= 3 ** powerOfThree;
    table[(powerOfThree + 1) as keyof typeof table] += 1;
  }

  return table;
};
