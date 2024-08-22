import { Element } from "./Element";
import {
  ELEMENT_COUNT_DEDUCTIONS,
  ElementGroup,
  ElementStatus,
  ElementType,
  Events,
} from "./Type";

// Elementにconnectionを追加
export interface RoutineElement extends Element {
  is_connected: boolean | null;
  connection_value: number | null;
  element_group_score: number | null;
}

// EG技数制限(鉄棒手放し技のみ条件付きで5技)
export const isGroupLimited = (routine: Element[], targetElement: Element): boolean => {
  let limit = 4;
  // if (
  //   targetElement.event === Events.鉄棒 &&
  //   targetElement.element_group === ElementGroup.EG2
  // ) {
  //   limit = 5;
  // }
  let count = 0;
  routine.forEach((element) => {
    if (element.element_group === targetElement.element_group) {
      count++;
    }
  });
  return count == limit;
};

// 床の力技制限判定
export const isFloorStrengthLimit = (
  routine: Element[],
  targetElement: Element
): boolean => {
  return (
    targetElement.element_type === ElementType.床_力技 &&
    routine.some((element) => element.element_type === ElementType.床_力技)
  );
};

// 表示Elementの状態を取得
export const getElementStatus = (routine: Element[], targetElement: Element): number => {
  if (routine.some((element) => element.id === targetElement.id)) {
    return ElementStatus.選択済み;
  } else if (routine.some((element) => element.code === targetElement.code)) {
    return ElementStatus.同一枠選択済み;
  } else if (isGroupLimited(routine, targetElement)) {
    return ElementStatus.技数制限_グループ;
  } else if (routine.length >= 8) {
    return ElementStatus.技数制限_全体;
  } else if (isFloorStrengthLimit(routine, targetElement)) {
    return ElementStatus.床_力技制限;
  } else {
    return ElementStatus.選択可能;
  }
};

/***************************************************************
 * ユーザーアクションに応じてroutineを更新する関数
 * ************************************************************/

// グループ得点
export const updateElementGroupScoreInRoutine = (
  selectEvent: number,
  routine: RoutineElement[],
  setRoutine: (routine: RoutineElement[]) => void
) => {
  // 以降の計算のために全elementのelement_group_scoreを追加(0.3or0.5)
  const newRoutineWithAllScore = routine.map((element) => {
    let element_group_score = 0;
    // 全ての種目のグループIは難度に関わらず0.5点が与えられる
    if (element.element_group === ElementGroup.EG1) {
      element_group_score = 0.5;
    } else {
      if (element.difficulty >= 4) {
        element_group_score = 0.5;
      } else {
        element_group_score = 0.3;
      }
    }
    return {
      ...element,
      element_group_score,
    } as RoutineElement;
  });

  // 各グループで最高得点を持つelementを取得する
  let maxScores = new Array(
    Object.keys(ElementGroup).length / 2 // keyとvalueをカウントしてしまうため2で割る
  ).fill(0);
  newRoutineWithAllScore.forEach((element) => {
    if (element.element_group_score! > maxScores[element.element_group - 1]) {
      maxScores[element.element_group - 1] = element.element_group_score!;
    }
  });

  // 各グループで最高のグループ得点を持つ最初のelementのみ適用する
  const updateFlgs = new Array(
    Object.keys(ElementGroup).length / 2 // keyとvalueをカウントしてしまうため2で割る
  ).fill(false);
  let newRoutine = newRoutineWithAllScore.map((element) => {
    if (
      !updateFlgs[element.element_group - 1] && // まだ適用していない
      maxScores[element.element_group - 1] === element.element_group_score // 最高得点を持っている
    ) {
      updateFlgs[element.element_group - 1] = true;
      return element; // newRoutineWithAllScoreで適用済み
    } else {
      // 既に該当グループの最高得点を別のelementに適用済みの場合
      return {
        ...element,
        element_group_score: 0,
      };
    }
  });

  // 【床】終末技グループのグループ得点を修正
  if (selectEvent === Events.床) {
    const lastElement = newRoutine[newRoutine.length - 1];
    newRoutine = newRoutine.map((element, index) => {
      if (element.element_group !== lastElement.element_group) {
        // 終末技グループ以外
        return element;
      }

      if (element.element_group === ElementGroup.EG1) {
        // 終末技グループがEG1(跳躍技以外)の場合
        const firstEG1Element = newRoutine.find(
          (element) => element.element_group === ElementGroup.EG1
        );
        if (firstEG1Element === element) {
          // 終末技グループがEG1の場合 && 最初のEG1の場合 は 0.5点
          return { ...element, element_group_score: 0.5 };
        } else {
          // 終末技グループがEG1の場合 && 最初のEG1以外の場合 は 0点
          return { ...element, element_group_score: 0 };
        }
      } else {
        // 終末技グループがEG1以外の場合
        if (index !== newRoutine.length - 1) {
          // 終末技グループがEG1以外の場合 && 終末技以外の場合 → 0点
          return { ...element, element_group_score: 0 };
        } else {
          // 終末技グループがEG1以外の場合 && 終末技の場合 → 技の難易度分を加点
          return { ...element, element_group_score: element.difficulty / 10 };
        }
      }
    });
  }

  // 変更がある場合のみ setRoutine を呼び出す(useEffectの無限ループ対策)
  if (JSON.stringify(newRoutine) !== JSON.stringify(routine)) {
    setRoutine(newRoutine);
  }
};

export const isConnectable = (
  selectEvent: number,
  routine: RoutineElement[],
  element: RoutineElement,
  index: number
): boolean => {
  // 1技目は組み合わせ不可
  if (index === 0) {
    return false;
  }

  const previousElement = routine[index - 1];

  // 【床】
  if (selectEvent === Events.床) {
    // 技の接続局面が両足着地でない場合を無効化(start/end_directionがnull)
    if (previousElement.end_direction === null || element.start_direction === null) {
      return false;
    }

    // 技の終わりと技の始まりが合わない組み合わせを無効化(この処理で切り返しも無効にできる)
    if (previousElement.end_direction !== element.start_direction) {
      return false;
    }

    // EG1に対する組み合わせを不可に
    if (
      previousElement.element_group === ElementGroup.EG1 || // 前の技がEG1
      element.element_group === ElementGroup.EG1 // 後の技がEG1
    ) {
      return false;
    }

    // 組み合わせは可能
    return true;
  } else {
    // TODO: 床以外
    return true;
  }
};

// 組み合わせ
export const updateConnectionInRoutine = (
  selectEvent: number,
  routine: RoutineElement[],
  setRoutine: (routine: RoutineElement[]) => void
) => {
  // 組み合わせ対象が適切か確認(並べ替えされた場合を想定 ← [+]押下時はhandleConnectionClick()で対応済み)
  let newRoutine: RoutineElement[] = routine.map((element, index) => {
    // 組み合わせが有効 && 組み合わせが適切(1技目チェック等) → 有効化
    if (element.is_connected && isConnectable(selectEvent, routine, element, index)) {
      return { ...element, is_connected: true };
    } else {
      // 組み合わせが無効 || 組み合わせが不適切 → 無効化
      return { ...element, is_connected: false };
    }
  });

  // 組み合わせ加点を計算
  newRoutine = newRoutine.map((element, index) => {
    if (element.is_connected) {
      const previousElement = routine[index - 1];
      // 【床】
      if (selectEvent === Events.床) {
        // ひねりを伴う1回宙同士の組み合わせ → null
        if (
          previousElement.element_type === ElementType.ひねりを伴う1回宙 &&
          element.element_type === ElementType.ひねりを伴う1回宙
        ) {
          return { ...element, connection_value: null };
        }

        // D以上 + BorC → 0.1
        if (
          (previousElement.difficulty >= 4 && element.difficulty === 2) ||
          (previousElement.difficulty >= 4 && element.difficulty === 3)
        ) {
          return { ...element, connection_value: 0.1 };
        }
        // BorC + D以上 → 0.1
        if (
          (previousElement.difficulty === 2 && element.difficulty >= 4) ||
          (previousElement.difficulty === 3 && element.difficulty >= 4)
        ) {
          return { ...element, connection_value: 0.1 };
        }
        // D以上 + D以上 → 0.2
        if (previousElement.difficulty >= 4 && element.difficulty >= 4) {
          return { ...element, connection_value: 0.2 };
        }
      }

      return element; // TODO: 他の種目は別途追加する
    } else {
      // 組み合わせ非対象の場合は connection_value を 更新しない
      return element;
    }
  });

  // 変更がある場合のみ setRoutine を呼び出す(useEffectの無限ループ対策)
  if (JSON.stringify(newRoutine) !== JSON.stringify(routine)) {
    setRoutine(newRoutine);
  }
};

/***************************************************************
 * 完成済routineから値を取得する関数
 * ************************************************************/

// 合計Dスコアを計算
export const calculateTotalScore = (routine: RoutineElement[]): number => {
  let totalDScore = 0;
  // 難度点
  totalDScore += calculateTotalDifficulty(routine);
  // グループ得点
  totalDScore += calculateTotalElementGroupScore(routine);
  // 組み合わせ加点
  totalDScore += calculateTotalConnectionValue(routine);
  return totalDScore;
};

// ニュートラルディダクションを計算
export const calculateNeutralDeduction = (routine: RoutineElement[]): number => {
  return (
    calculateElementCountDeduction(routine) + calculateMultipleSaltoShortage(routine)
  );
};

// 技数減点を計算
export const calculateElementCountDeduction = (routine: RoutineElement[]): number => {
  const elementCountDeduction =
    routine.length < ELEMENT_COUNT_DEDUCTIONS.length
      ? ELEMENT_COUNT_DEDUCTIONS[routine.length]
      : 0;

  return elementCountDeduction;
};

// ダブル系の有無によるNDを計算
export const calculateMultipleSaltoShortage = (routine: RoutineElement[]): number => {
  if (routine.length === 0) {
    return 0;
  }

  const lastElement = routine[routine.length - 1] as RoutineElement;
  // routineの最後のelementのelement_typeが2でないならば0.3を返す
  if (lastElement.element_type !== 2) {
    return 0.3;
  }

  return 0;
};

// 各グループ得点の合計を計算
export const calculateTotalElementGroupScore = (routine: RoutineElement[]) => {
  let total = 0;
  routine.forEach((element) => {
    if (
      element.element_group_score === undefined ||
      element.element_group_score === null
    ) {
      // routineのレンダリングタイミングによってundefinedのままの場合を想定
      return;
    }
    total += element.element_group_score;
  });
  return total;
};

// 難度点の合計を計算
export const calculateTotalDifficulty = (routine: RoutineElement[]) => {
  let total = 0;
  routine.forEach((element) => {
    total += element.difficulty / 10;
  });
  return total; // 小数点第２位以下を切り捨て
};

// CVの合計を計算
export const calculateTotalConnectionValue = (routine: RoutineElement[]) => {
  let total = 0;
  routine.forEach((element) => {
    if (element.connection_value === undefined || element.connection_value === null) {
      // routineのレンダリングタイミングによってundefinedのままの場合を想定
      return;
    }
    total += element.connection_value;
  });
  return total;
};
