import { Element, isElementTypeIncluded } from "./ElementUtil";
import { RoutineElement } from "./RoutineUtil";
import { ElementType } from "./Type";

const russianTypes = [
  ElementType.あん馬_把手上ロシアン転向技,
  ElementType.あん馬_馬端ロシアン転向技,
  ElementType.あん馬_一把手上ロシアン転向技,
  ElementType.あん馬_馬背ロシアン転向技,
];

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
  return routine
    .filter((element) => isElementTypeIncluded(element.element_type, ElementType.あん馬_縦向き移動技))
    .map((element) => element.code!);
};

// ElementTile用 | ロシアン転向技判定
export const isPHRussianLimit = (routine: Element[], targetElement: Element): boolean => {
  // 対象がロシアン転向技以外ならfalse
  if (!russianTypes.some((type) => isElementTypeIncluded(targetElement.element_type, type))) {
    return false;
  }

  // 全種類合計で2つ選択していたらtrue
  const allRussianCount = routine.filter((element) =>
    russianTypes.some((type) => isElementTypeIncluded(element.element_type, type))
  ).length;
  if (allRussianCount == 2) {
    return true;
  }

  // 対象の種類については1つ選択していたらtrue
  const targetRussianType = russianTypes.find((type) =>
    isElementTypeIncluded(targetElement.element_type, type)
  ) as ElementType;
  const sameTypeCount = routine.filter((element) =>
    isElementTypeIncluded(element.element_type, targetRussianType)
  ).length;

  if (sameTypeCount == 1) {
    return true;
  }

  return false;
};

// RoutineRules用 | 選択済みのロシアン転向技コード取得
export const getPHRussianLimitCodes = (routine: RoutineElement[]) =>
  routine
    .filter((element) => russianTypes.some((type) => isElementTypeIncluded(element.element_type, type)))
    .map((element) => element.code!);

// ElementTile用 | 倒立技判定
export const isPHHandstandLimit = (routine: Element[], targetElement: Element): boolean => {
  // 対象が倒立技以外ならfalse
  if (!isElementTypeIncluded(targetElement.element_type, ElementType.あん馬_倒立技)) {
    return false;
  }
  // 2つ選択していたらtrue
  const count = routine.filter((element) =>
    isElementTypeIncluded(element.element_type, ElementType.あん馬_倒立技)
  ).length;

  return count == 2;
};

// RoutineRules用 | 選択済みの倒立技コード取得
export const getPHHandstandLimitCodes = (routine: RoutineElement[]) =>
  routine
    .filter((element) => isElementTypeIncluded(element.element_type, ElementType.あん馬_倒立技))
    .map((element) => (element.code ? element.code : element.alias));

// ElementTile用 | ロシアン転向移動技判定
export const isPHRussianTravelLimit1 = (routine: Element[], targetElement: Element): boolean => {
  // 対象がロシアン転向移動技以外ならfalse
  if (!isElementTypeIncluded(targetElement.element_type, ElementType.あん馬_ロシアン転向移動技1)) {
    return false;
  }
  // 2つ選択していたらtrue
  const count = routine.filter((element) =>
    isElementTypeIncluded(element.element_type, ElementType.あん馬_ロシアン転向移動技1)
  ).length;

  return count == 2;
};

// RoutineRules用 | 選択済みのロシアン転向移動技コード取得
export const getPHRussianTravelLimit1Codes = (routine: RoutineElement[]) =>
  routine
    .filter((element) => isElementTypeIncluded(element.element_type, ElementType.あん馬_ロシアン転向移動技1))
    .map((element) => element.code!);
