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
  if (
    !isElementTypeIncluded(targetElement.element_type, ElementType.あん馬_縦向き移動技)
  ) {
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

// ElementTile用 | 倒立技判定
export const isPHHandstandLimit = (
  routine: Element[],
  targetElement: Element
): boolean => {
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
    .filter((element) =>
      isElementTypeIncluded(element.element_type, ElementType.あん馬_倒立技)
    )
    .map((element) => (element.code ? element.code : element.alias));

// ElementTile用 | ロシアン転向移動技判定
export const isPHRussianTravelLimit1 = (
  routine: Element[],
  targetElement: Element
): boolean => {
  // 対象がロシアン転向移動技以外ならfalse
  if (
    !isElementTypeIncluded(
      targetElement.element_type,
      ElementType.あん馬_ロシアン転向移動技1
    )
  ) {
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
    .filter((element) =>
      isElementTypeIncluded(element.element_type, ElementType.あん馬_ロシアン転向移動技1)
    )
    .map((element) => element.code!);

// ElementTile用 | 移動ひねり技判定
export const isPHTravelSpindleLimit = (
  routine: Element[],
  targetElement: Element
): boolean => {
  // 対象が移動ひねり技以外ならfalse
  if (
    !isElementTypeIncluded(targetElement.element_type, ElementType.あん馬_移動ひねり技)
  ) {
    return false;
  }
  // 2つ選択していたらtrue
  const count = routine.filter((element) =>
    isElementTypeIncluded(element.element_type, ElementType.あん馬_移動ひねり技)
  ).length;

  return count == 2;
};

// RoutineRules用 | 選択済みの移動ひねり技コード取得
export const getPHTravelSpindleLimitCodes = (routine: RoutineElement[]) =>
  routine
    .filter((element) =>
      isElementTypeIncluded(element.element_type, ElementType.あん馬_移動ひねり技)
    )
    .map((element) => element.code!);

// ElementTile用 | ひねり技判定
export const isPHSpindleLimit = (routine: Element[], targetElement: Element): boolean => {
  // 対象がひねり技以外ならfalse
  if (!isElementTypeIncluded(targetElement.element_type, ElementType.あん馬_ひねり技)) {
    return false;
  }
  // 2つ選択していたらtrue
  const count = routine.filter((element) =>
    isElementTypeIncluded(element.element_type, ElementType.あん馬_ひねり技)
  ).length;

  return count == 2;
};

// RoutineRules用 | 選択済みのひねり技コード取得
export const getPHSpindleLimitCodes = (routine: RoutineElement[]) =>
  routine
    .filter((element) =>
      isElementTypeIncluded(element.element_type, ElementType.あん馬_ひねり技)
    )
    .map((element) => element.code!);

// ElementTile用 | ショーンべズゴ判定
export const isPHSohnBezugoLimit = (
  routine: Element[],
  targetElement: Element
): boolean => {
  // 対象がショーンべズゴ系以外ならfalse
  if (
    !isElementTypeIncluded(
      targetElement.element_type,
      ElementType.あん馬_ショーンべズゴ系
    )
  ) {
    return false;
  }
  // 2つ選択していたらtrue
  const count = routine.filter((element) =>
    isElementTypeIncluded(element.element_type, ElementType.あん馬_ショーンべズゴ系)
  ).length;

  return count == 2;
};

// RoutineRules用 | 選択済みのショーンべズゴ系コード取得
export const getPHSohnBezugoLimitCodes = (routine: RoutineElement[]) =>
  routine
    .filter((element) =>
      isElementTypeIncluded(element.element_type, ElementType.あん馬_ショーンべズゴ系)
    )
    .map((element) => (element.code ? element.code : element.alias)); // codeがない技は独自に追加した技だからaliasはあるはず

// ElementTile用 | 開脚旋回技判定
export const isPHFlairLimit = (routine: Element[], targetElement: Element): boolean => {
  // 対象が開脚旋回技以外ならfalse
  if (!isElementTypeIncluded(targetElement.element_type, ElementType.あん馬_開脚旋回技)) {
    return false;
  }
  // 4つ選択していたらtrue
  const count = routine.filter((element) =>
    isElementTypeIncluded(element.element_type, ElementType.あん馬_開脚旋回技)
  ).length;

  return count == 4;
};

// RoutineRules用 | 選択済みの開脚旋回技コード取得
export const getPHFlairLimitCodes = (routine: RoutineElement[]) =>
  routine
    .filter((element) =>
      isElementTypeIncluded(element.element_type, ElementType.あん馬_開脚旋回技)
    )
    .map((element) => (element.code ? element.code : element.alias));

// ElementTile用 | ブスナリ技判定
export const isPHBusnariLimit = (routine: Element[], targetElement: Element): boolean => {
  // 対象がブスナリ技以外ならfalse
  if (!isElementTypeIncluded(targetElement.element_type, ElementType.あん馬_ブスナリ系)) {
    return false;
  }
  // 1つ選択していたらtrue
  const count = routine.filter((element) =>
    isElementTypeIncluded(element.element_type, ElementType.あん馬_ブスナリ系)
  ).length;

  return count == 1;
};

// RoutineRules用 | 選択済みのブスナリ系コード取得
export const getPHBusnariLimitCodes = (routine: RoutineElement[]) =>
  routine
    .filter((element) =>
      isElementTypeIncluded(element.element_type, ElementType.あん馬_ブスナリ系)
    )
    .map((element) => (element.code ? element.code : element.alias));

// ElementTile用 | ロシアン転向移動技判定2
export const isPHRussianTravelLimit2 = (
  routine: Element[],
  targetElement: Element
): boolean => {
  // 対象がロシアン転向移動技以外ならfalse
  if (
    !isElementTypeIncluded(
      targetElement.element_type,
      ElementType.あん馬_ロシアン転向移動技2
    )
  ) {
    return false;
  }
  // 2つ選択していたらtrue
  const count = routine.filter((element) =>
    isElementTypeIncluded(element.element_type, ElementType.あん馬_ロシアン転向移動技2)
  ).length;

  return count == 1;
};

// RoutineRules用 | 選択済みのロシアン転向移動技コード取得
export const getPHRussianTravelLimit2Codes = (routine: RoutineElement[]) =>
  routine
    .filter((element) =>
      isElementTypeIncluded(element.element_type, ElementType.あん馬_ロシアン転向移動技2)
    )
    .map((element) => element.code!);

// ElementTile用 | トンフェイ系判定
export const isPHTongFeiLimit = (routine: Element[], targetElement: Element): boolean => {
  // 対象がトンフェイ系以外ならfalse
  if (
    !isElementTypeIncluded(targetElement.element_type, ElementType.あん馬_トンフェイ系)
  ) {
    return false;
  }
  // 1つ選択していたらtrue
  const count = routine.filter((element) =>
    isElementTypeIncluded(element.element_type, ElementType.あん馬_トンフェイ系)
  ).length;

  return count == 1;
};

// RoutineRules用 | 選択済みのトンフェイ系コード取得
export const getPHTongFeiLimitCodes = (routine: RoutineElement[]) =>
  routine
    .filter((element) =>
      isElementTypeIncluded(element.element_type, ElementType.あん馬_トンフェイ系)
    )
    .map((element) => element.code!);

// ElementTile用 ニンレイエス系判定
export const isPHNinReyesLimit = (
  routine: Element[],
  targetElement: Element
): boolean => {
  // 対象がニンレイエス系以外ならfalse
  if (
    !isElementTypeIncluded(targetElement.element_type, ElementType.あん馬_ニンレイエス系)
  ) {
    return false;
  }
  // 1つ選択していたらtrue
  const count = routine.filter((element) =>
    isElementTypeIncluded(element.element_type, ElementType.あん馬_ニンレイエス系)
  ).length;

  return count == 1;
};

// RoutineRules用 | 選択済みのニンレイエス系コード取得
export const getPHNinReyesLimitCodes = (routine: RoutineElement[]) =>
  routine
    .filter((element) =>
      isElementTypeIncluded(element.element_type, ElementType.あん馬_ニンレイエス系)
    )
    .map((element) => element.code!);

// ElementTile用 | フロップ系判定
export const isPHFlopLimit = (routine: Element[], targetElement: Element): boolean => {
  // 対象がフロップ系以外ならfalse
  if (!isElementTypeIncluded(targetElement.element_type, ElementType.あん馬_フロップ系)) {
    return false;
  }
  // 1つ選択していたらtrue
  const count = routine.filter((element) =>
    isElementTypeIncluded(element.element_type, ElementType.あん馬_フロップ系)
  ).length;

  return count == 1;
};

// RoutineRules用 | 選択済みのフロップ系コード取得
export const getPHFlopLimitCodes = (routine: RoutineElement[]) =>
  routine
    .filter((element) =>
      isElementTypeIncluded(element.element_type, ElementType.あん馬_フロップ系)
    )
    .map((element) => element.alias!); // フロップは独自追加技のためaliasを表示

// ElementTile用 | コンバイン系判定
export const isPHCombineLimit = (routine: Element[], targetElement: Element): boolean => {
  // 対象がフロップ系以外ならfalse
  if (
    !isElementTypeIncluded(targetElement.element_type, ElementType.あん馬_コンバイン系)
  ) {
    return false;
  }
  // 1つ選択していたらtrue
  const count = routine.filter((element) =>
    isElementTypeIncluded(element.element_type, ElementType.あん馬_コンバイン系)
  ).length;

  return count == 1;
};

// RoutineRules用 | 選択済みのフロップ系コード取得
export const getPHCombineLimitCodes = (routine: RoutineElement[]) =>
  routine
    .filter((element) =>
      isElementTypeIncluded(element.element_type, ElementType.あん馬_コンバイン系)
    )
    .map((element) => element.alias!); // コンバインは独自追加技のためaliasを表示
