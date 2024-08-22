export const difficulties = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J"];

export const element_groups = ["I", "II", "III", "IV", "V"];

export const ELEMENT_COUNT_DEDUCTIONS = [10, 7, 6, 5, 4, 3, 0, 0, 0];

export enum Events {
  床 = 1,
  あん馬 = 2,
  つり輪 = 3,
  跳馬 = 4,
  平行棒 = 5,
  鉄棒 = 6,
  // 女子跳馬 = 7,
  // 段違い平行棒 = 8,
  // 平均台 = 9,
  // 女子床 = 10,
}

export enum ElementGroup {
  EG1 = 1,
  EG2 = 2,
  EG3 = 3,
  EG4 = 4,
}

export const getEventKey = (event: number): string => {
  for (const key in Events) {
    if (Events[key as keyof typeof Events] === event) {
      return key;
    }
  }
  return "Undefined";
};

export const getGroupKey = (group: number): string => {
  for (const key in ElementGroup) {
    if (ElementGroup[key as keyof typeof ElementGroup] === group) {
      return key;
    }
  }
  return "Undefined";
};

export const GroupNames: { [key: number]: { [key: number]: string } } = {
  [Events.床]: {
    [ElementGroup.EG1]: "跳躍技以外",
    [ElementGroup.EG2]: "前方系の跳躍技",
    [ElementGroup.EG3]: "後方系の跳躍技",
    [ElementGroup.EG4]: "1回以上のひねりを伴う跳躍技",
  },
  // 他の種目も追加する
};

export const getGroupName = (selectEvent: number, selectGroup: number): string => {
  return `${getGroupKey(selectGroup)}:${GroupNames[selectEvent][selectGroup]}`;
};

export enum ElementType {
  ひねりを伴う1回宙 = 1,
  ダブル系 = 2,
  床_力技 = 3,
}

// TODO: Rulesに統合
export enum ElementStatus {
  選択可能 = 1,
  選択済み = 2,
  同一枠選択済み = 3,
  技数制限_グループ = 4,
  技数制限_全体 = 5,
  床_力技制限 = 6,
}

export const statusClassMap: { [key: number]: string } = {
  1: "elements__tile--active",
  2: "elements__tile--selected",
  3: "elements__tile--same-slot-selected",
  4: "elements__tile--group-limit",
  5: "elements__tile--total-limit",
  6: "elements__tile--floor-strength-limit",
};

export enum Rules {
  Dスコア = 1,
  グループ得点 = 2,
  難度点 = 3,
  組み合わせ加点 = 4,
  ニュートラルディダクション = 5,
  技数減点 = 6,
  ダブル系不足 = 7,
  同一技制限 = 8,
  同一枠制限 = 9,
  グループ技数制限 = 10,
  全体技数制限 = 11,
  床_力技制限 = 12,
}

export const RuleKey = (ruleKey: number): string => {
  for (const key in Rules) {
    if (Rules[key as keyof typeof Rules] === ruleKey) {
      return key;
    }
  }
  return "Undefined";
};
