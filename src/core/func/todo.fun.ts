import { CharacterType } from "../types/Character.type";

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
