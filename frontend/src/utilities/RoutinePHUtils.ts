import { Element, isElementTypeIncluded } from "./ElementUtil";
import { RoutineElement } from "./RoutineUtil";
import { ElementType } from "./Type";

// ElementTile用 | 縦向き移動技判定
export const isPHTravelLimit = (routine: Element[], targetElement: Element): boolean => {
  // 対象が縦向き移動技以外ならfalse
  if (!isElementTypeIncluded(targetElement.element_type, ElementType.あん馬_縦向き移動技)) {
    return false;
  }
  const count = routine.filter((element) =>
    isElementTypeIncluded(element.element_type, ElementType.あん馬_縦向き移動技)
  ).length;

  return count == 2;
};

// RoutineRules用 | 選択済みの縦向き移動技コード取得
export const getPHTravelLimitCodes = (routine: RoutineElement[]) => {
  let codes: string[] = [];

  routine.forEach((element) => {
    if (isElementTypeIncluded(element.element_type, ElementType.あん馬_縦向き移動技)) {
      codes.push(element.code!);
    }
  });

  return codes;
};
