import { RoutineElement } from "./RoutineUtil";

// ヤマワキ系の組み合わせ加点の対象になっている技のコードを取得(1技だけど配列として返す)
export const srCombinationCode = (routine: RoutineElement[]) =>
  routine.filter((element) => element.is_connection_value_calculated === true).map((element) => element.code!);
