import { Element, isElementTypeIncluded } from "./ElementUtil";
import { RoutineElement } from "./RoutineUtil";
import {
  ElementGroup,
  ElementStatus,
  ElementType,
  getElementStatusFromElementType,
  getElementTypeName,
} from "./Type";

const saltoTypes = [
  ElementType.平行棒_宙返り技制限_ドミトリエンコ系,
  ElementType.平行棒_宙返り技制限_ハラダ系,
  ElementType.平行棒_宙返り技制限_パフニュク系,
  ElementType.平行棒_宙返り技制限_モリスエ系,
  ElementType.平行棒_宙返り技制限_爆弾カット系,
  ElementType.平行棒_宙返り技制限_前方ダブル腕支持系,
  ElementType.平行棒_宙返り技制限_ベーレ系,
  ElementType.平行棒_宙返り技制限_フォキン系,
  ElementType.平行棒_宙返り技制限_タナカ系,
  ElementType.平行棒_宙返り技制限_ギャニオン系,
  ElementType.平行棒_宙返り技制限_テハダ系,
];

/*****************************************************************
 * 宙返り技制限に関する関数
 ******************************************************************/
// ElementTile用 | 対象の技と同じ宙返りタイプが演技構成に含まれている場合、そのタイプを返す
export const getPBSaltoStatusLimited = (routine: RoutineElement[], targetElement: Element) => {
  const targetSaltoType = saltoTypes.find((type) =>
    isElementTypeIncluded(targetElement.element_type, type)
  ) as ElementType;

  // 対象の技が宙返り技ではない
  if (!targetSaltoType) {
    return ElementStatus.選択可能;
  }

  // 対象の技と同じ宙返りタイプが演技構成に含まれている
  if (
    routine.some(
      (element) =>
        isElementTypeIncluded(element.element_type, targetSaltoType) &&
        element.element_group === targetElement.element_group
    )
  ) {
    return getElementStatusFromElementType(targetSaltoType);
  }
  return ElementStatus.選択可能;
};

// RoutineRules用 | 宙返り技制限コード取得
export const getPBSaltoLimitCodes = (routine: RoutineElement[]) => {
  let codes: { code: string; typeName: string; elementGroup: ElementGroup }[] = [];
  routine
    .filter((element) => element.is_qualified === true)
    .forEach((element) => {
      // 対象の種類については1つ選択していたらtrue
      const targetSaltoType = saltoTypes.find((type) =>
        isElementTypeIncluded(element.element_type, type)
      ) as ElementType;
      if (targetSaltoType) {
        codes.push({
          code: element.code!,
          typeName: getElementTypeName(targetSaltoType),
          elementGroup: element.element_group,
        });
      }
    });

  return codes;
};

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
