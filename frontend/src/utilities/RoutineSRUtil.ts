import { isElementTypeIncluded } from "./ElementUtil";
import { RoutineElement } from "./RoutineUtil";
import { ElementType } from "./Type";

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
