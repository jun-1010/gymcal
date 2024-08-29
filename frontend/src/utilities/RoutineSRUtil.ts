import { Element, isElementTypeIncluded } from "./ElementUtil";
import { RoutineElement } from "./RoutineUtil";
import { ElementGroup, ElementType } from "./Type";

// ヤマワキ系の組み合わせ加点の対象になっている技のコードを取得(1技だけど配列として返す)
export const srCombinationCode = (routine: RoutineElement[]) =>
  routine.filter((element) => element.is_connection_value_calculated === true).map((element) => element.code!);

// 振動倒立技の有無によるNDを計算
export const calculateSwingHandstandShortage = (routine: RoutineElement[]): number => {
  if (routine.length === 0) {
    return 0;
  }

  const hasSwingHandstand = routine.some((element) => {
    return isElementTypeIncluded(element.element_type, ElementType.つり輪_振動倒立技);
  });

  return hasSwingHandstand ? 0 : 0.3;
};

// 連続した力技をカウント
export const countSequenceStrengths = (routine: RoutineElement[]): number => {
  // B難度以上の振動技で切れない力技が3技選択されていたらtrue
  let count = 0;
  routine.forEach((element) => {
    // リセット
    if (isElementTypeIncluded(element.element_type, ElementType.つり輪_力技制限1を切れる技)) {
      count = 0;
    }
    if (element.element_group === ElementGroup.EG2 || element.element_group === ElementGroup.EG3) {
      count++;
    }
  });

  return count;
};

// ElementTile用 | 力技制限1
export const isSRStrengthLimit1 = (routine: Element[], targetElement: Element): boolean => {
  // 対象が力技以外ならfalse
  if (targetElement.element_group !== ElementGroup.EG2 && targetElement.element_group !== ElementGroup.EG3) {
    return false;
  }
  let count = 0;
  routine.forEach((element) => {
    // リセット
    if (isElementTypeIncluded(element.element_type, ElementType.つり輪_力技制限1を切れる技)) {
      count = 0;
    }
    if (element.element_group === ElementGroup.EG2 || element.element_group === ElementGroup.EG3) {
      count++;
    }
  });
  return count >= 3;
};

// RoutineRules用 | 力技制限1に関する技コード
export const getSRStrengthLimit1Codes = (routine: RoutineElement[]): string[] => {
  const hasStrengthLimitedElement = routine.some((element) => {
    return element.is_qualified === false;
  });

  // is_qualified===falseがある → is_qualified===falseの技
  if (hasStrengthLimitedElement) {
    return routine.filter((element) => element.is_qualified === false).map((element) => element.code!);
  }
  // is_qualified===falseがない & 制限状態 → 制限状態の3技
  let codes: string[] = [];
  routine.forEach((element) => {
    if (isElementTypeIncluded(element.element_type, ElementType.つり輪_力技制限1を切れる技)) {
      codes = [];
    }
    if (element.element_group === ElementGroup.EG2 || element.element_group === ElementGroup.EG3) {
      codes.push(element.code!);
    }
  });
  return codes.length >= 3 ? codes : [];
};
