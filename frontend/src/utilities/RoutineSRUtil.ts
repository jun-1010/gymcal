import { Element, isElementTypeIncluded } from "./ElementUtil";
import { RoutineElement } from "./RoutineUtil";
import { ElementGroup, ElementStatus, ElementType, getElementStatusFromElementType, getElementTypeName } from "./Type";

const strenghTypes = [
  ElementType.つり輪_力技制限2_脚前挙,
  ElementType.つり輪_力技制限2_脚上挙,
  ElementType.つり輪_力技制限2_十字倒立,
  ElementType.つり輪_力技制限2_背面水平,
  ElementType.つり輪_力技制限2_上水平,
  ElementType.つり輪_力技制限2_開脚上水平,
  ElementType.つり輪_力技制限2_中水平,
  ElementType.つり輪_力技制限2_正面水平,
  ElementType.つり輪_力技制限2_上向き中水平,
  ElementType.つり輪_力技制限2_十字懸垂,
  // ElementType.つり輪_力技制限2_脚前挙十字懸垂,
  // ElementType.つり輪_力技制限2_脚上挙十字懸垂,
  ElementType.つり輪_力技制限2_倒立,
];

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
// export const getSRStrengthLimit1Codes = (routine: RoutineElement[]): string[] => {
//   const hasStrengthLimitedElement = routine.some((element) => {
//     return element.is_qualified === false;
//   });

//   // is_qualified===falseがある → is_qualified===falseの技
//   if (hasStrengthLimitedElement) {
//     return routine.filter((element) => element.is_qualified === false).map((element) => element.code!);
//   }
//   // is_qualified===falseがない & 制限状態 → 制限状態の3技
//   let codes: string[] = [];
//   console.log("getSRStrengthLimit1Codes", routine);
//   routine.forEach((element) => {
//     if (isElementTypeIncluded(element.element_type, ElementType.つり輪_力技制限1を切れる技)) {
//       codes = [];
//     }
//     if (element.element_group === ElementGroup.EG2 || element.element_group === ElementGroup.EG3) {
//       codes.push(element.code!);
//     }
//   });
//   return codes.length >= 3 ? codes : [];
// };

// B以上の振動技で区切られた技コード
export const getSRStrengthLimit1Codes = (routine: RoutineElement[]): string[][] => {
  let codes_list: string[][] = [[]];
  let index = 0;
  routine.forEach((element) => {
    if (
      isElementTypeIncluded(element.element_type, ElementType.つり輪_力技制限1を切れる技) &&
      codes_list[index].length > 0 // この条件がないとEG1の技ごとに配列が追加されてしまう
    ) {
      index++;
      codes_list[index] = [];
    }
    if (element.element_group === ElementGroup.EG2 || element.element_group === ElementGroup.EG3) {
      codes_list[index].push(element.code!);
    }
  });
  return codes_list;
};

export const hasStrengtElement = (routine: RoutineElement[]): boolean =>
  routine.some((e) => e.element_group === ElementGroup.EG2 || e.element_group === ElementGroup.EG3);

export const getElementStatusLimited = (routine: RoutineElement[], targetElement: Element): ElementStatus => {
  const targetStrenghType = strenghTypes.find((type) =>
    isElementTypeIncluded(targetElement.element_type, type)
  ) as ElementType;

  if (!targetStrenghType) {
    return ElementStatus.選択可能;
  }

  // 判定
  let isTargetLimited = false;
  routine.forEach((element) => {
    if (
      isElementTypeIncluded(element.element_type, targetStrenghType) &&
      targetElement.element_group === element.element_group
    ) {
      isTargetLimited = true;
    }
  });

  // 制限状態の場合、該当のElementStatusを返す
  if (isTargetLimited) {
    return getElementStatusFromElementType(targetStrenghType);
  }

  return ElementStatus.選択可能;
};

// RoutineRules用 | 力技制限2に関する技タイプ
export const getSRStrengthLimit2Codes = (
  routine: RoutineElement[]
): { code: string; typeName: string; elementGroup: ElementGroup }[] => {
  // 制限状態の技
  let codes: { code: string; typeName: string; elementGroup: ElementGroup }[] = [];
  routine
    .filter((element) => element.is_qualified === true)
    .forEach((element) => {
      // 対象の種類については1つ選択していたらtrue
      const targetStrenghType = strenghTypes.find((type) =>
        isElementTypeIncluded(element.element_type, type)
      ) as ElementType;
      if (targetStrenghType) {
        codes.push({
          code: element.code!,
          typeName: getElementTypeName(targetStrenghType),
          elementGroup: element.element_group,
        });
      }
    });

  return codes;
};
