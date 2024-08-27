import { Element, isElementTypeIncluded } from "./ElementUtil";
import { RoutineElement } from "./RoutineUtil";
import { ElementType } from "./Type";

// 床の力技制限判定
export const isFXStrengthLimit = (routine: Element[], targetElement: Element): boolean => {
  return (
    isElementTypeIncluded(targetElement.element_type, ElementType.床_力技) &&
    routine.some((element) => isElementTypeIncluded(element.element_type, ElementType.床_力技))
  );
};

// 床の旋回技制限判定
export const isFXCircleLimit = (routine: Element[], targetElement: Element): boolean => {
  return (
    isElementTypeIncluded(targetElement.element_type, ElementType.床_旋回) &&
    routine.some((element) => isElementTypeIncluded(element.element_type, ElementType.床_旋回))
  );
};

// ダブル系の有無によるNDを計算[床]
export const calculateMultipleSaltoShortage = (routine: RoutineElement[]): number => {
  if (routine.length === 0) {
    return 0;
  }

  const lastElement = routine[routine.length - 1] as RoutineElement;
  // routineの最後のelementのelement_typeが2でないならば0.3を返す
  if (!isElementTypeIncluded(lastElement.element_type, ElementType.ダブル系)) {
    return 0.3;
  }

  return 0;
};
