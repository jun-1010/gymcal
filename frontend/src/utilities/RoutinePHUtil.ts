import { Element, isElementTypeIncluded } from "./ElementUtil";
import { RoutineElement } from "./RoutineUtil";
import { ElementType } from "./Type";

const russianTypes = [
  ElementType.あん馬_把手上ロシアン転向技,
  ElementType.あん馬_馬端ロシアン転向技,
  ElementType.あん馬_一把手上ロシアン転向技,
  ElementType.あん馬_馬背ロシアン転向技,
];

// RoutineRules用 | 選択済みの縦向き移動技コード取得
export const getPHTravelLimitCodes = (routine: RoutineElement[]) => {
  return routine
    .filter((element) =>
      isElementTypeIncluded(element.element_type, ElementType.あん馬_縦向き移動技)
    )
    .map((element) => element.code!);
};

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

// RoutineRules用 | 選択済みの倒立技コード取得
export const getPHHandstandLimitCodes = (routine: RoutineElement[]) =>
  routine
    .filter((element) =>
      isElementTypeIncluded(element.element_type, ElementType.あん馬_倒立技)
    )
    .map((element) => (element.code ? element.code : element.alias));

// RoutineRules用 | 選択済みのロシアン転向移動技コード取得
export const getPHRussianTravelLimit1Codes = (routine: RoutineElement[]) =>
  routine
    .filter((element) =>
      isElementTypeIncluded(element.element_type, ElementType.あん馬_ロシアン転向移動技1)
    )
    .map((element) => element.code!);

// RoutineRules用 | 選択済みの移動ひねり技コード取得
export const getPHTravelSpindleLimitCodes = (routine: RoutineElement[]) =>
  routine
    .filter((element) =>
      isElementTypeIncluded(element.element_type, ElementType.あん馬_移動ひねり技)
    )
    .map((element) => element.code!);

// RoutineRules用 | 選択済みのひねり技コード取得
export const getPHSpindleLimitCodes = (routine: RoutineElement[]) =>
  routine
    .filter((element) =>
      isElementTypeIncluded(element.element_type, ElementType.あん馬_ひねり技)
    )
    .map((element) => element.code!);

// RoutineRules用 | 選択済みのショーンべズゴ系コード取得
export const getPHSohnBezugoLimitCodes = (routine: RoutineElement[]) =>
  routine
    .filter((element) =>
      isElementTypeIncluded(element.element_type, ElementType.あん馬_ショーンべズゴ系)
    )
    .map((element) => (element.code ? element.code : element.alias)); // codeがない技は独自に追加した技だからaliasはあるはず

// RoutineRules用 | 選択済みの開脚旋回技コード取得
export const getPHFlairLimitCodes = (routine: RoutineElement[]) =>
  routine
    .filter((element) =>
      isElementTypeIncluded(element.element_type, ElementType.あん馬_開脚旋回技)
    )
    .map((element) => (element.code ? element.code : element.alias));

// RoutineRules用 | 選択済みのブスナリ系コード取得
export const getPHBusnariLimitCodes = (routine: RoutineElement[]) =>
  routine
    .filter((element) =>
      isElementTypeIncluded(element.element_type, ElementType.あん馬_ブスナリ系)
    )
    .map((element) => (element.code ? element.code : element.alias));

// RoutineRules用 | 選択済みのロシアン転向移動技コード取得
export const getPHRussianTravelLimit2Codes = (routine: RoutineElement[]) =>
  routine
    .filter((element) =>
      isElementTypeIncluded(element.element_type, ElementType.あん馬_ロシアン転向移動技2)
    )
    .map((element) => element.code!);

// RoutineRules用 | 選択済みのトンフェイ系コード取得
export const getPHTongFeiLimitCodes = (routine: RoutineElement[]) =>
  routine
    .filter((element) =>
      isElementTypeIncluded(element.element_type, ElementType.あん馬_トンフェイ系)
    )
    .map((element) => element.code!);

// RoutineRules用 | 選択済みのニンレイエス系コード取得
export const getPHNinReyesLimitCodes = (routine: RoutineElement[]) =>
  routine
    .filter((element) =>
      isElementTypeIncluded(element.element_type, ElementType.あん馬_ニンレイエス系)
    )
    .map((element) => element.code!);

// RoutineRules用 | 選択済みのフロップ系コード取得
export const getPHFlopLimitCodes = (routine: RoutineElement[]) =>
  routine
    .filter((element) =>
      isElementTypeIncluded(element.element_type, ElementType.あん馬_フロップ系)
    )
    .map((element) => element.alias!); // フロップは独自追加技のためaliasを表示

// RoutineRules用 | 選択済みのフロップ系コード取得
export const getPHCombineLimitCodes = (routine: RoutineElement[]) =>
  routine
    .filter((element) =>
      isElementTypeIncluded(element.element_type, ElementType.あん馬_コンバイン系)
    )
    .map((element) => element.alias!); // コンバインは独自追加技のためaliasを表示
