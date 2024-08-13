import { Element } from "./Element";
import { ElementGroup, Events } from "./Type";

export const calculateDifficulty = (elements: Element[]): string => {
  let difficulty = 0;
  elements.forEach((element) => {
    difficulty += element.difficulty / 10;
  });
  return (Math.floor(difficulty * 10) / 10).toFixed(1); // 小数点第２位以下を切り捨て
};

// 引数で受け取ったelement.codeがroutineに含まれているか
export const isCodeInRoutine = (routine: Element[], code: string): boolean => {
  return routine.some((element) => element.code === code);
};

// 引数で受け取ったelement_groupの技数制限(鉄棒手放し技のみ条件付きで5技)
export const isGroupLimited = (
  routine: Element[],
  targetElement: Element
): boolean => {
  let limit = 4;
  if (targetElement.event === Events.鉄棒 && targetElement.element_group === ElementGroup.EG2) {
    limit = 5;
  }
  let count = 0;
  routine.forEach((element) => {
    if (element.element_group === targetElement.element_group) {
      count++;
    }
  });
  return count == limit;
};

export const isDisabledElement = (
  routine: Element[],
  targetElement: Element
): boolean => {
  // routineに含まれている場合
  if (isCodeInRoutine(routine, targetElement.code)) {
    return true;
  }
  // 該当グループの技数制限(鉄棒手放し技のみ条件付きで5技)
  if (isGroupLimited(routine, targetElement)) {
    return true;
  }
  return false;
};
