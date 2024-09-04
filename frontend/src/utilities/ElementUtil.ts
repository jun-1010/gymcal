import { difficulties, ElementGroup, ElementType, Events, getEventKey, getGroupKey } from "./Type";

export interface Element {
  id: number;
  code: string | null;
  event: number;
  element_group: number;
  name: string;
  alias: string | null;
  difficulty: number;
  row_number: number;
  column_number: number;
  start_direction: number | null;
  end_direction: number | null;
  element_type: string | null;
}

export interface GroupElements {
  [rowKey: string]: {
    [columnNumber: number]: Element | {};
  };
}

export interface CategorizedElements {
  [eventKey: string]: {
    [groupKey: string]: GroupElements;
  };
}

interface MaxColumnNumbers {
  [eventKey: string]: {
    [groupKey: string]: number;
  };
}

export const categorizeElements = (elements: Element[]): CategorizedElements => {
  // 最も右にある要素のrow_numberを各グループごとに取得する
  let maxColumnNumbers: MaxColumnNumbers = {};
  elements.forEach((element) => {
    const eventKey = getEventKey(element.event);
    const groupKey = getGroupKey(element.element_group);

    // 種目ごとに初期化
    if (!maxColumnNumbers[eventKey]) {
      maxColumnNumbers[eventKey] = {};
    }

    // グループごとに初期化
    if (!maxColumnNumbers[eventKey][groupKey]) {
      maxColumnNumbers[eventKey][groupKey] = 0;
    }

    if (element.column_number > maxColumnNumbers[eventKey][groupKey]) {
      maxColumnNumbers[eventKey][groupKey] = element.column_number;
    }
  });

  const categorizedElements: CategorizedElements = {};

  elements.forEach((element) => {
    const eventKey = getEventKey(element.event);
    const groupKey = getGroupKey(element.element_group);
    const rowKey = `row${element.row_number}`;

    // 種目ごとに初期化
    if (!categorizedElements[eventKey]) {
      categorizedElements[eventKey] = {};
    }

    // グループごとに初期化
    if (!categorizedElements[eventKey][groupKey]) {
      categorizedElements[eventKey][groupKey] = {};
    }

    // 行ごとに初期化
    if (!categorizedElements[eventKey][groupKey][rowKey]) {
      categorizedElements[eventKey][groupKey][rowKey] = {};

      // 最大列数分の要素を初期化
      for (let i = 0; i < maxColumnNumbers[eventKey][groupKey]; i++) {
        categorizedElements[eventKey][groupKey][rowKey][i + 1] = {};
      }
    }

    // 要素を追加
    categorizedElements[eventKey][groupKey][rowKey][element.column_number] = element;
  });

  return categorizedElements;
};

export const getGroupElements = (
  categorizedElements: CategorizedElements,
  selectEvent: number,
  selectGroup: number
): GroupElements => {
  const eventKey = getEventKey(selectEvent);
  const groupKey = getGroupKey(selectGroup);
  // 存在チェック
  if (!categorizedElements[eventKey] || !categorizedElements[eventKey][groupKey]) {
    return {} as GroupElements;
  }

  const groupElements = categorizedElements[eventKey][groupKey];

  return groupElements;
};

// 技コードから技を取得する TODO:イシュー立てて実装（ContextAPI導入後...selectEventとselectGroupが使いたいため）
// export const getElementNameByCode = (
//   categorizedElements: CategorizedElements,
//   code: string
// ): string => {
//   const elements = Object.values(categorizedElements).flat();
//   console.log(elements);
//   // return elements.find((element) => element.code === code) || {} as Element;
//   // return
//   return "hoge";
// };

export const isElementTypeIncluded = (elementTypes: string | null, elementTypeToCheck: number) => {
  if (elementTypes === null || typeof elementTypes !== "string") {
    return false;
  }
  return elementTypes.split("-").includes(elementTypeToCheck.toString());
};

// 指定のtypeに該当するElementを取得
export const getElementsByType = (
  selectEvent: Events,
  selectGroups: ElementGroup[],
  targetElementType: ElementType,
  categorizedElements: CategorizedElements
): Element[] => {
  let targetElements = [] as Element[];
  selectGroups.forEach((selectGroup) => {
    const groupElements = getGroupElements(categorizedElements, selectEvent, selectGroup);

    const targetGroupElements = Object.values(groupElements).flatMap((rowElements) =>
      Object.values(rowElements).filter(
        (element) =>
          "element_type" in element &&
          isElementTypeIncluded(element.element_type, targetElementType)
      )
    ) as Element[];

    targetElements = [...targetElements, ...targetGroupElements];
  });

  // 技のコードを昇順に並べる
  return targetElements.sort((a, b) => a.id - b.id);
};
