import { difficulties, getEventKey, getGroupKey } from "./Type";

export interface Element {
  id: string;
  event: number;
  element_group: number;
  name: string;
  alias?: string;
  difficulty: number;
  row_number: number;
  created_at: string | null;
  updated_at: string | null;
}

export interface GroupElements {
  [rowKey: string]: {
    [difficultyKey: string]: {} | Element | {};
  };
}

export interface CategorizedElements {
  [eventKey: string]: {
    [groupKey: string]: GroupElements;
  };
}

export const categorizeElements = (
  elements: Element[]
): CategorizedElements => {
  const categorizedElements: CategorizedElements = {};

  elements.forEach((element) => {
    const eventKey = getEventKey(element.event);
    const groupKey = getGroupKey(element.element_group);
    const rowKey = `row${element.row_number}`;
    const difficultyKey = difficulties[element.difficulty - 1] || ""; // difficultyが1から始まるため、インデックスは difficulty - 1

    // イベントごとに初期化
    if (!categorizedElements[eventKey]) {
      categorizedElements[eventKey] = {};
    }

    // エレメントグループごとに初期化
    if (!categorizedElements[eventKey][groupKey]) {
      categorizedElements[eventKey][groupKey] = {};
    }

    // 行ごとに初期化
    if (!categorizedElements[eventKey][groupKey][rowKey]) {
      categorizedElements[eventKey][groupKey][rowKey] = {};
      // 全難易度分の要素を初期化
      difficulties.forEach((difficulty) => {
        categorizedElements[eventKey][groupKey][rowKey][difficulty] = {};
      });
    }

    // 要素を追加
    categorizedElements[eventKey][groupKey][rowKey][difficultyKey] = element;
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
  console.log("getGroupElements: ", eventKey, groupKey);
  console.log(categorizedElements);
  // 存在チェック
  if (
    !categorizedElements[eventKey] ||
    !categorizedElements[eventKey][groupKey]
  ) {
    return {} as GroupElements;
  }

  const groupElements = categorizedElements[eventKey][groupKey];

  return groupElements;
};
