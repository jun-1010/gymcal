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
  [Events.つり輪]: {
    [ElementGroup.EG1]: "振動技",
    [ElementGroup.EG2]: "力静止技",
    [ElementGroup.EG3]: "振動力静止技",
    [ElementGroup.EG4]: "終末技",
  },
  // 他の種目も追加する
};

export const getGroupName = (selectEvent: number, selectGroup: number): string => {
  if (!GroupNames[selectEvent] || !GroupNames[selectEvent][selectGroup]) {
    return "Undefined";
  }
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
  あん馬_ニンレイエス系 = 19,
  あん馬_フロップ系 = 20,
  あん馬_コンバイン系 = 21,
  つり輪_振動倒立技 = 22,
  つり輪_力技制限1を切れる技 = 23,
  つり輪_力技制限2_脚前挙 = 24,
  つり輪_力技制限2_脚上挙 = 25,
  つり輪_力技制限2_十字倒立 = 26,
  つり輪_力技制限2_背面水平 = 27,
  つり輪_力技制限2_上水平 = 28,
  つり輪_力技制限2_開脚上水平 = 29,
  つり輪_力技制限2_中水平 = 30,
  つり輪_力技制限2_正面水平 = 31,
  つり輪_力技制限2_上向き中水平 = 32,
  つり輪_力技制限2_十字懸垂 = 33,
  // つり輪_力技制限2_脚前挙十字懸垂 = 34,
  // つり輪_力技制限2_脚上挙十字懸垂  = 35,
  つり輪_力技制限2_倒立 = 36,
  つり輪_ヤマワキ系 = 37,
  つり輪_後ろ振り上がり倒立 = 38,
}

export const getElementTypeName = (targetElementType: number): string => {
  let elementTypeKey = "";
  for (const key in ElementType) {
    if (ElementType[key as keyof typeof ElementType] === targetElementType) {
      elementTypeKey = key;
    }
  }
  let elementTypeName = "";
  const parts = elementTypeKey.split("_");
  elementTypeName = parts[parts.length - 1];
  return `${elementTypeName}`;
};

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
  あん馬_ロシアン転向移動技1 = 11,
  あん馬_移動ひねり技制限 = 12,
  あん馬_ひねり技制限 = 13,
  あん馬_ショーンべズゴ系 = 14,
  あん馬_開脚旋回技制限 = 15,
  あん馬_ブスナリ系制限 = 16,
  あん馬_ロシアン転向移動技2 = 17,
  あん馬_トンフェイ系制限 = 18,
  あん馬_ニンレイエス系制限 = 19,
  あん馬_フロップ系制限 = 20,
  あん馬_コンバイン系制限 = 21,
  終末技制限 = 22,
  つり輪_力技制限1 = 23,
  つり輪_力技制限2_脚前挙 = 24,
  つり輪_力技制限2_脚上挙 = 25,
  つり輪_力技制限2_十字倒立 = 26,
  つり輪_力技制限2_背面水平 = 27,
  つり輪_力技制限2_上水平 = 28,
  つり輪_力技制限2_開脚上水平 = 29,
  つり輪_力技制限2_中水平 = 30,
  つり輪_力技制限2_正面水平 = 31,
  つり輪_力技制限2_上向き中水平 = 32,
  つり輪_力技制限2_十字懸垂 = 33,
  // つり輪_力技制限2_脚前挙十字懸垂 = 34,
  // つり輪_力技制限2_脚上挙十字懸垂  = 35,
  つり輪_力技制限2_倒立 = 36,
}

// elementTypeに対応するelementStatusを返す
export const getElementStatusFromElementType = (elementType: ElementType): ElementStatus => {
  switch (elementType) {
    case ElementType.床_力技:
      return ElementStatus.床_力技制限;

    case ElementType.床_旋回:
      return ElementStatus.床_旋回制限;

    case ElementType.あん馬_縦向き移動技:
      return ElementStatus.あん馬_縦向き移動技制限;

    case ElementType.あん馬_把手上ロシアン転向技:
    case ElementType.あん馬_馬端ロシアン転向技:
    case ElementType.あん馬_一把手上ロシアン転向技:
    case ElementType.あん馬_馬背ロシアン転向技:
      return ElementStatus.あん馬_ロシアン転向技制限;

    case ElementType.あん馬_倒立技:
      return ElementStatus.あん馬_倒立技制限;

    case ElementType.あん馬_ロシアン転向移動技1:
      return ElementStatus.あん馬_ロシアン転向移動技1;

    case ElementType.あん馬_移動ひねり技:
      return ElementStatus.あん馬_移動ひねり技制限;

    case ElementType.あん馬_ひねり技:
      return ElementStatus.あん馬_ひねり技制限;

    case ElementType.あん馬_ショーンべズゴ系:
      return ElementStatus.あん馬_ショーンべズゴ系;

    case ElementType.あん馬_開脚旋回技:
      return ElementStatus.あん馬_開脚旋回技制限;

    case ElementType.あん馬_ブスナリ系:
      return ElementStatus.あん馬_ブスナリ系制限;

    case ElementType.あん馬_ロシアン転向移動技2:
      return ElementStatus.あん馬_ロシアン転向移動技2;

    case ElementType.あん馬_トンフェイ系:
      return ElementStatus.あん馬_トンフェイ系制限;

    case ElementType.あん馬_ニンレイエス系:
      return ElementStatus.あん馬_ニンレイエス系制限;

    case ElementType.あん馬_フロップ系:
      return ElementStatus.あん馬_フロップ系制限;

    case ElementType.あん馬_コンバイン系:
      return ElementStatus.あん馬_コンバイン系制限;

    case ElementType.つり輪_力技制限2_脚前挙:
      return ElementStatus.つり輪_力技制限2_脚前挙;

    case ElementType.つり輪_力技制限2_脚上挙:
      return ElementStatus.つり輪_力技制限2_脚上挙;

    case ElementType.つり輪_力技制限2_十字倒立:
      return ElementStatus.つり輪_力技制限2_十字倒立;

    case ElementType.つり輪_力技制限2_背面水平:
      return ElementStatus.つり輪_力技制限2_背面水平;

    case ElementType.つり輪_力技制限2_上水平:
      return ElementStatus.つり輪_力技制限2_上水平;

    case ElementType.つり輪_力技制限2_開脚上水平:
      return ElementStatus.つり輪_力技制限2_開脚上水平;

    case ElementType.つり輪_力技制限2_中水平:
      return ElementStatus.つり輪_力技制限2_中水平;

    case ElementType.つり輪_力技制限2_正面水平:
      return ElementStatus.つり輪_力技制限2_正面水平;

    case ElementType.つり輪_力技制限2_上向き中水平:
      return ElementStatus.つり輪_力技制限2_上向き中水平;

    case ElementType.つり輪_力技制限2_十字懸垂:
      return ElementStatus.つり輪_力技制限2_十字懸垂;

    case ElementType.つり輪_力技制限2_倒立:
      return ElementStatus.つり輪_力技制限2_倒立;

    default:
      return ElementStatus.選択可能;
  }
};

export const getElementStatusName = (targetElementStatus: number): string => {
  let elementStatusKey = "";
  for (const key in ElementStatus) {
    if (ElementStatus[key as keyof typeof ElementStatus] === targetElementStatus) {
      elementStatusKey = key;
    }
  }
  let elementStatusName = "";
  const parts = elementStatusKey.split("_");
  elementStatusName = parts[parts.length - 1];
  return `${elementStatusName}`;
};

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
  床_組み合わせ加点 = 4,
  ニュートラルディダクション = 5,
  技数減点 = 6,
  床_ダブル系不足 = 7,
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
  あん馬_ニンレイエス系制限 = 25,
  あん馬_フロップ系制限 = 26,
  あん馬_コンバイン系制限 = 27,
  終末技制限 = 28,
  つり輪_振動倒立不足 = 29,
  つり輪_力技制限1 = 30,
  つり輪_力技制限2 = 31,
  つり輪_組み合わせ加点 = 32,
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
