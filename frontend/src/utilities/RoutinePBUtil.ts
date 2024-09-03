import {
  CategorizedElements,
  Element,
  getGroupElements,
  isElementTypeIncluded,
} from "./ElementUtil";
import { RoutineElement } from "./RoutineUtil";
import {
  ElementGroup,
  ElementStatus,
  ElementType,
  Events,
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

// ElementTile用 | 対象の技と同じ宙返りタイプが演技構成に含まれている場合、そのタイプを返す
export const getPBSaltoStatusLimited = (
  routine: RoutineElement[],
  targetElement: Element
) => {
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

// ElementTile用 | 車輪系制限チェック
export const isPBGiantSwingLimit = (
  routine: RoutineElement[],
  targetElement: Element
) => {
  // 対象が車輪系でない場合、false
  if (!isElementTypeIncluded(targetElement.element_type, ElementType.平行棒_車輪系)) {
    return false;
  }
  // 車輪系が2つ以上選択済みである場合、true
  let count = 0;
  routine.forEach((element) => {
    if (isElementTypeIncluded(element.element_type, ElementType.平行棒_車輪系)) {
      count++;
    }
  });
  return count >= 2;
};

// RoutineRules用 | 車輪系制限コード取得
export const getPBGiantSwingLimitCodes = (routine: RoutineElement[]) => {
  let codes: { id: number; code: string }[] = [];
  routine
    .filter((element) => element.is_qualified === true)
    .forEach((element) => {
      if (isElementTypeIncluded(element.element_type, ElementType.平行棒_車輪系)) {
        codes.push({ id: element.id!, code: element.code! });
      }
    });

  return codes;
};

// ElementTile用 | 棒下宙返り系制限チェック
export const isPBFelgeLimit = (routine: RoutineElement[], targetElement: Element) => {
  // 対象が棒下宙返り系でない場合、false
  if (
    !isElementTypeIncluded(targetElement.element_type, ElementType.平行棒_棒下宙返り系)
  ) {
    return false;
  }
  // 棒下宙返り系が2つ以上選択済みである場合、true
  let count = 0;
  routine.forEach((element) => {
    if (isElementTypeIncluded(element.element_type, ElementType.平行棒_棒下宙返り系)) {
      count++;
    }
  });
  return count >= 2;
};

// RoutineRules用 | 棒下宙返り系制限コード取得
export const getPBFelgeLimitCodes = (routine: RoutineElement[]) => {
  let codes: { id: number; code: string }[] = [];
  routine
    .filter((element) => element.is_qualified === true)
    .forEach((element) => {
      if (isElementTypeIncluded(element.element_type, ElementType.平行棒_棒下宙返り系)) {
        codes.push({ id: element.id!, code: element.code! });
      }
    });

  return codes;
};

// RoutineRules用 | 棒下宙返り系の技を取得
export const getElementsByType = (
  selectEvent: Events,
  selectGroup: ElementGroup,
  targetElementType: ElementType,
  categorizedElements: CategorizedElements
): Element[] => {
  const groupElements = getGroupElements(categorizedElements, selectEvent, selectGroup);

  const felgeElements = Object.values(groupElements).flatMap((rowElements) =>
    Object.values(rowElements).filter(
      (element) =>
        "element_type" in element &&
        isElementTypeIncluded(element.element_type, targetElementType)
    )
  ) as Element[];

  // 技のコードを昇順に並べる
  return felgeElements.sort((a, b) => {
    if (a.code! < b.code!) {
      return -1;
    }
    if (a.code! > b.code!) {
      return 1;
    }
    return 0;
  });
};
