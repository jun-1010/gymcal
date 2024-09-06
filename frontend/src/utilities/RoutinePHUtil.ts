import { Element, isElementTypeIncluded } from "./ElementUtil";
import { RoutineElement } from "./RoutineUtil";
import { ElementType } from "./Type";

const russianTypes = [
  ElementType.あん馬_把手上ロシアン転向技,
  ElementType.あん馬_馬端ロシアン転向技,
  ElementType.あん馬_一把手上ロシアン転向技,
  ElementType.あん馬_馬背ロシアン転向技,
];

// ElementTile用 | ロシアン転向技判定
export const isPHRussianLimit = (routine: Element[], targetElement: Element): boolean => {
  // 対象がロシアン転向技以外ならfalse
  if (
    !russianTypes.some((type) => isElementTypeIncluded(targetElement.element_type, type))
  ) {
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
    .filter((element) =>
      russianTypes.some((type) => isElementTypeIncluded(element.element_type, type))
    )
    .map((element) => element.code!);