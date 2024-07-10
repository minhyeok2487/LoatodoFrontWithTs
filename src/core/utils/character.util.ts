import type { ClassName } from "@core/types/lostark";

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
