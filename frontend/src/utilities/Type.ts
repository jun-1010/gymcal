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
  [Events.あん馬]: {
    [ElementGroup.EG1]: "セア系",
    [ElementGroup.EG2]: "旋回技（ひねり・転向・倒立）",
    [ElementGroup.EG3]: "旋回技（移動）",
    [ElementGroup.EG4]: "終末技",
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
  床_旋回 = 4,
  あん馬_縦向き移動技 = 5,
  あん馬_把手上ロシアン転向技 = 6,
  あん馬_馬端ロシアン転向技 = 7,
  あん馬_一把手上ロシアン転向技 = 8,
  あん馬_馬背ロシアン転向技 = 9,
  あん馬_倒立技 = 10,
  あん馬_ロシアン転向移動技1 = 11,
  あん馬_移動ひねり技 = 12,
  あん馬_ひねり技 = 13,
  あん馬_ショーンべズゴ系 = 14,
  あん馬_開脚旋回技 = 15,
  あん馬_ブスナリ系 = 16,
  あん馬_ロシアン転向移動技2 = 17,
  あん馬_トンフェイ系 = 18,
}

// element__tileの状態表示に使用
export enum ElementStatus {
  選択可能 = 1,
  選択済み = 2,
  同一枠選択済み = 3,
  技数制限_グループ = 4,
  技数制限_全体 = 5,
  床_力技制限 = 6,
  床_旋回制限 = 7,
  あん馬_縦向き移動技制限 = 8,
  あん馬_ロシアン転向技制限 = 9,
  あん馬_倒立技制限 = 10,
  あん馬_ロシアン転向移動技制限1 = 11,
  あん馬_移動ひねり技制限 = 12,
  あん馬_ひねり技制限 = 13,
  あん馬_ショーンべズゴ系制限 = 14,
  あん馬_開脚旋回技制限 = 15,
  あん馬_ブスナリ系制限 = 16,
  あん馬_ロシアン転向移動技制限2 = 17,
  あん馬_トンフェイ系制限 = 18,
}

// active, selected, disabledの3つで十分
export const statusClass = (status: number) => {
  if (status === 1) {
    return "elements__tile--active";
  } else if (status === 2) {
    return "elements__tile--selected";
  } else if (3 <= status) {
    return "elements__tile--disabled";
  } else {
    return "";
  }
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
  床_旋回制限 = 13,
  あん馬_縦向き移動技制限 = 14,
  あん馬_ロシアン転向技制限 = 15,
  あん馬_倒立技制限 = 16,
  あん馬_ロシアン転向移動技制限1 = 17,
  あん馬_移動ひねり技制限 = 18,
  あん馬_ひねり技制限 = 19,
  あん馬_ショーンべズゴ系制限 = 20,
  あん馬_開脚旋回技制限 = 21,
  あん馬_ブスナリ系制限 = 22,
  あん馬_ロシアン転向移動技制限2 = 23,
  あん馬_トンフェイ系制限 = 24,
}

export const RuleKey = (ruleKey: number): string => {
  for (const key in Rules) {
    if (Rules[key as keyof typeof Rules] === ruleKey) {
      return key;
    }
  }
  return "Undefined";
};

export const RuleName = (rule: number): string => {
  const ruleKey = RuleKey(rule);
  const parts = ruleKey.split("_");
  if (parts.length === 1) {
    return parts[0];
  } else {
    return parts[1];
  }
};
