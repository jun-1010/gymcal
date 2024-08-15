import { Element } from "./Element";
import { ElementGroup, Events } from "./Type";

// Elementにconnectionを追加
export interface RoutineElement extends Element {
  connection?: boolean;
  element_group_score?: number;
}

export const calculateDifficulty = (routine: RoutineElement[]): string => {
  let difficulty = 0;
  routine.forEach((element) => {
    difficulty += element.difficulty / 10;
  });
  return (Math.floor(difficulty * 10) / 10).toFixed(1); // 小数点第２位以下を切り捨て
};

export const calculateND = (routine: RoutineElement[]): string => {
  
  // 技数減点

  // 構成要求

  return "0.3";
}

// 引数で受け取ったelement.codeがroutineに含まれているか
export const isCodeInRoutine = (routine: Element[], code: string): boolean => {
  return routine.some((element) => element.code === code);
};

// EG技数制限(鉄棒手放し技のみ条件付きで5技)
export const isGroupLimited = (
  routine: Element[],
  targetElement: Element
): boolean => {
  let limit = 4;
  if (targetElement.event === Events.鉄棒 && targetElement.element_group === ElementGroup.EG2) {
    limit = 5;
  }
  let count = 0;
  routine.forEach((element) => {
    if (element.element_group === targetElement.element_group) {
      count++;
    }
  });
  return count == limit;
};

export const isDisabledElement = (
  routine: Element[],
  targetElement: Element
): boolean => {
  // routineに含まれている場合
  if (isCodeInRoutine(routine, targetElement.code)) {
    return true;
  }
  // 該当グループの技数制限(鉄棒手放し技のみ条件付きで5技)
  if (isGroupLimited(routine, targetElement)) {
    return true;
  }
  // 8技制限
  if (routine.length >= 8) {
    return true;
  }
  return false;
};

// グループ得点
export const updateRoutineWithElementGroupScore = (
  selectEvent: number,
  routine: RoutineElement[],
  setRoutine: (routine: RoutineElement[]) => void
) => {
  // 全てのelementのelement_group_scoreをdifficultyに応じて追加(0.3or0.5)
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
