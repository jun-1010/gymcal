import { Element, isElementTypeIncluded } from "./ElementUtil";
import { RoutineElement } from "./RoutineUtil";
import { ElementType } from "./Type";

/******************************************************************
 * 単棒から始まる技の選択制限
 ******************************************************************/
export const checkOneRailBeginLimit = (routine: RoutineElement[], targetElement: Element) => {
  // 対象の技が単棒技でない場合は制限をかけない
  if (!isElementTypeIncluded(targetElement.element_type, ElementType.平行棒_単棒開始技)) {
    return false;
  } else {
    // 演技構成が空の場合は制限をかける
    if (routine.length === 0) {
      return true;
    }
    // 演技構成の最後が単棒で終了する技の場合のみ選択可能
    const lastElement = routine[routine.length - 1];
    if (isElementTypeIncluded(lastElement.element_type, ElementType.平行棒_単棒終了技)) {
      return false;
    }
    return true;
  }
};
