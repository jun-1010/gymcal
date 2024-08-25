export const difficulties = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J"];

export const element_groups = ["I", "II", "III", "IV", "V"];

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

export const getEventKey = (eventKey: number): string => {
  for (const key in Events) {
    if (Events[key as keyof typeof Events] === eventKey) {
      return key;
    }
  }
  return "Undefined";
};

export const getGroupKey = (groupKey: number): string => {
  for (const key in ElementGroup) {
    if (ElementGroup[key as keyof typeof ElementGroup] === groupKey) {
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
  ビッグタンブリング = 2,
}

export enum ElementStatus {
  選択可能 = 1,
  選択済み = 2,
  同一枠選択済み = 3,
  技数制限_グループ = 4,
  技数制限_全体 = 5,
}

export const statusClassMap: { [key: number]: string } = {
  1: "elements__tile--active",
  2: "elements__tile--selected",
  3: "elements__tile--same-slot-selected",
  4: "elements__tile--group-limit",
  5: "elements__tile--total-limit",
};
