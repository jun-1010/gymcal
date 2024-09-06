import { Element, isElementTypeIncluded } from "./ElementUtil";
import { calculateMultipleSaltoShortage, isFXCircleLimit, isFXStrengthLimit } from "./RoutineFXUtil";
import { checkOneRailBeginLimit } from "./RoutinePBUtil";
import { isPHRussianLimit } from "./RoutinePHUtil";
import {
  calculateSwingHandstandShortage,
  getSRElementStatusLimited,
  hasStrengtElement,
  isSRStrengthLimit1,
} from "./RoutineSRUtil";
import { ELEMENT_COUNT_DEDUCTIONS, ElementGroup, ElementStatus, ElementType, Events } from "./Type";

// 6種目分のroutine
export interface Routines {
  [eventKey: string]: RoutineElement[];
}

export const initialRoutines: Routines = {
  [Events.床]: [] as RoutineElement[],
  [Events.あん馬]: [] as RoutineElement[],
  [Events.つり輪]: [] as RoutineElement[],
  [Events.跳馬]: [] as RoutineElement[],
  [Events.平行棒]: [] as RoutineElement[],
  [Events.鉄棒]: [] as RoutineElement[],
};

// Elementをroutineに格納するときに使用する拡張クラス
export interface RoutineElement extends Element {
  // 接続状態を保持する
  is_connected: boolean | null; // null or false: 未接続, true: 接続済み
  // 加算の計算済み状態を保持する（代入は何回レンダリングしてもいいけど加算は1回だけしたい）
  // null or false: 未計算, true: 計算済み
  is_connection_value_calculated: boolean | null;
  // 組み合わせ加点
  connection_value: number | null;
  // グループ得点
  element_group_score: number | null;
  // 認定されるかを保持する(4連続以上の力技にfalseを適用)
  is_qualified: boolean;
}

// EG技数制限(鉄棒手放し技のみ条件付きで5技)
export const isGroupLimited = (routine: RoutineElement[], targetElement: Element): boolean => {
  let limit = 4;
  // if (
  //   targetElement.event === Events.鉄棒 &&
  //   targetElement.element_group === ElementGroup.EG2
  // ) {
  //   limit = 5;
  // }
  let count = 0;
  routine
    .filter((element) => element.is_qualified)
    .forEach((element) => {
      if (element.element_group === targetElement.element_group) {
        count++;
      }
    });
  return count == limit;
};

// シンプルな技数制限を確認する共通関数(1演技に2つまで等)
export const checkTypeCount = (
  routine: RoutineElement[],
  targetElement: Element,
  targetType: ElementType,
  limit: number
) => {
  // targetElementが判定対象のtypeではない場合、選択不可にしない
  if (!isElementTypeIncluded(targetElement.element_type, targetType)) {
    return false;
  }
  // 演技構成に含まれているtargetTypeに該当する技をカウントする
  const count = routine.filter(
    (element) => element.is_qualified && isElementTypeIncluded(element.element_type, targetType)
  ).length;

  return count >= limit;
};

// 表示Elementの状態を取得
export const getElementStatus = (
  selectEvent: Events,
  routine: RoutineElement[],
  targetElement: Element
): ElementStatus => {
  // 共通制限ルールを最優先表示
  if (routine.some((element) => element.id === targetElement.id)) {
    return ElementStatus.選択済み;
  } else if (routine.some((element) => element.code !== "" && element.code === targetElement.code)) {
    return ElementStatus.同一枠選択済み;
  } else if (isGroupLimited(routine, targetElement)) {
    return ElementStatus.技数制限_グループ;
  } else if (routine.filter((element) => element.is_qualified).length >= 8) {
    return ElementStatus.技数制限_全体;
  }
  // 固有ルールの表示[床以外]
  if (selectEvent !== Events.床) {
    if (routine.length > 0 && routine[routine.length - 1].element_group === ElementGroup.EG4) {
      return ElementStatus.終末技制限;
    }
  }
  // 固有ルールの表示[床]
  if (selectEvent === Events.床) {
    if (isFXStrengthLimit(routine, targetElement)) {
      return ElementStatus.床_力技制限;
    } else if (isFXCircleLimit(routine, targetElement)) {
      return ElementStatus.床_旋回制限;
    }
  }
  // 固有ルールの表示[あん馬]
  if (selectEvent === Events.あん馬) {
    if (checkTypeCount(routine, targetElement, ElementType.あん馬_縦向き移動技, 2)) {
      return ElementStatus.あん馬_縦向き移動技制限;
    } else if (isPHRussianLimit(routine, targetElement)) {
      return ElementStatus.あん馬_ロシアン転向技制限; // 複数種類ある
    } else if (checkTypeCount(routine, targetElement, ElementType.あん馬_倒立技, 2)) {
      return ElementStatus.あん馬_倒立技制限;
    } else if (checkTypeCount(routine, targetElement, ElementType.あん馬_ロシアン転向移動技1, 2)) {
      return ElementStatus.あん馬_ロシアン転向移動技1;
    } else if (checkTypeCount(routine, targetElement, ElementType.あん馬_移動ひねり技, 2)) {
      return ElementStatus.あん馬_移動ひねり技制限;
    } else if (checkTypeCount(routine, targetElement, ElementType.あん馬_ひねり技, 2)) {
      return ElementStatus.あん馬_ひねり技制限;
    } else if (checkTypeCount(routine, targetElement, ElementType.あん馬_ショーンべズゴ系, 2)) {
      return ElementStatus.あん馬_ショーンべズゴ系;
    } else if (checkTypeCount(routine, targetElement, ElementType.あん馬_開脚旋回技, 4)) {
      return ElementStatus.あん馬_開脚旋回技制限;
    } else if (checkTypeCount(routine, targetElement, ElementType.あん馬_ブスナリ系, 1)) {
      return ElementStatus.あん馬_ブスナリ系制限;
    } else if (checkTypeCount(routine, targetElement, ElementType.あん馬_ロシアン転向移動技2, 1)) {
      return ElementStatus.あん馬_ロシアン転向移動技2;
    } else if (checkTypeCount(routine, targetElement, ElementType.あん馬_トンフェイ系, 1)) {
      return ElementStatus.あん馬_トンフェイ系制限;
    } else if (checkTypeCount(routine, targetElement, ElementType.あん馬_ニンレイエス系, 1)) {
      return ElementStatus.あん馬_ニンレイエス系制限;
    } else if (checkTypeCount(routine, targetElement, ElementType.あん馬_フロップ系, 1)) {
      return ElementStatus.あん馬_フロップ系制限;
    } else if (checkTypeCount(routine, targetElement, ElementType.あん馬_コンバイン系, 1)) {
      return ElementStatus.あん馬_コンバイン系制限;
    }
  }
  // 固有ルールの表示[つり輪]
  if (selectEvent === Events.つり輪) {
    if (isSRStrengthLimit1(routine, targetElement)) {
      return ElementStatus.つり輪_力技制限1;
    } else if (hasStrengtElement(routine)) {
      return getSRElementStatusLimited(routine, targetElement); // 力技制限2
    }
  }
  // 固有ルールの表示[跳馬]
  if (selectEvent === Events.跳馬) {
    if (routine.length === 2) {
      return ElementStatus.跳馬_2技制限;
    } else if (routine.some((element) => element.element_group === targetElement.element_group)) {
      return ElementStatus.跳馬_グループ制限;
    }
  }
  // 固有ルールの表示[平行棒]
  if (selectEvent === Events.平行棒) {
    if (checkTypeCount(routine, targetElement, ElementType.平行棒_宙返り技制限_ドミトリエンコ系, 1)) {
      return ElementStatus.平行棒_宙返り技制限_ドミトリエンコ系;
    } else if (checkTypeCount(routine, targetElement, ElementType.平行棒_宙返り技制限_ハラダ系, 1)) {
      return ElementStatus.平行棒_宙返り技制限_ハラダ系;
    } else if (checkTypeCount(routine, targetElement, ElementType.平行棒_宙返り技制限_ハラダ系, 1)) {
      return ElementStatus.平行棒_宙返り技制限_ハラダ系;
    } else if (checkTypeCount(routine, targetElement, ElementType.平行棒_宙返り技制限_パフニュク系, 1)) {
      return ElementStatus.平行棒_宙返り技制限_パフニュク系;
    } else if (checkTypeCount(routine, targetElement, ElementType.平行棒_宙返り技制限_モリスエ系, 1)) {
      return ElementStatus.平行棒_宙返り技制限_モリスエ系;
    } else if (checkTypeCount(routine, targetElement, ElementType.平行棒_宙返り技制限_爆弾カット系, 1)) {
      return ElementStatus.平行棒_宙返り技制限_爆弾カット系;
    } else if (checkTypeCount(routine, targetElement, ElementType.平行棒_宙返り技制限_前方ダブル腕支持系, 1)) {
      return ElementStatus.平行棒_宙返り技制限_前方ダブル腕支持系;
    } else if (checkTypeCount(routine, targetElement, ElementType.平行棒_宙返り技制限_ベーレ系, 1)) {
      return ElementStatus.平行棒_宙返り技制限_ベーレ系;
    } else if (checkTypeCount(routine, targetElement, ElementType.平行棒_宙返り技制限_フォキン系, 1)) {
      return ElementStatus.平行棒_宙返り技制限_フォキン系;
    } else if (checkTypeCount(routine, targetElement, ElementType.平行棒_宙返り技制限_タナカ系, 1)) {
      return ElementStatus.平行棒_宙返り技制限_タナカ系;
    } else if (checkTypeCount(routine, targetElement, ElementType.平行棒_宙返り技制限_ギャニオン系, 1)) {
      return ElementStatus.平行棒_宙返り技制限_ギャニオン系;
    } else if (checkTypeCount(routine, targetElement, ElementType.平行棒_宙返り技制限_テハダ系, 1)) {
      return ElementStatus.平行棒_宙返り技制限_テハダ系;
    } else if (checkTypeCount(routine, targetElement, ElementType.平行棒_車輪系, 2)) {
      return ElementStatus.平行棒_車輪系制限;
    } else if (checkTypeCount(routine, targetElement, ElementType.平行棒_棒下宙返り系, 2)) {
      return ElementStatus.平行棒_棒下宙返り系制限;
    } else if (checkTypeCount(routine, targetElement, ElementType.平行棒_アーム倒立系, 2)) {
      return ElementStatus.平行棒_アーム倒立系制限;
    } else if (checkOneRailBeginLimit(routine, targetElement)) {
      return ElementStatus.平行棒_単棒倒立系制限;
    }
  }
  // 固有ルールの表示[鉄棒]
  if (selectEvent === Events.鉄棒) {
    if (checkTypeCount(routine, targetElement, ElementType.鉄棒_アドラー系, 2)) {
      return ElementStatus.鉄棒_アドラー系制限;
    } else if (checkTypeCount(routine, targetElement, ElementType.鉄棒_手放し技制限_トカチェフ系, 2)) {
      return ElementStatus.鉄棒_手放し技制限_トカチェフ系;
    } else if (checkTypeCount(routine, targetElement, ElementType.鉄棒_手放し技制限_コバチ系, 2)) {
      return ElementStatus.鉄棒_手放し技制限_コバチ系;
    } else if (checkTypeCount(routine, targetElement, ElementType.鉄棒_手放し技制限_ギンガー系, 2)) {
      return ElementStatus.鉄棒_手放し技制限_ギンガー系;
    } else if (checkTypeCount(routine, targetElement, ElementType.鉄棒_手放し技制限_イェーガー系, 2)) {
      return ElementStatus.鉄棒_手放し技制限_イェーガー系;
    } else if (checkTypeCount(routine, targetElement, ElementType.鉄棒_手放し技制限_マルケロフ系, 2)) {
      return ElementStatus.鉄棒_手放し技制限_マルケロフ系;
    } else if (checkTypeCount(routine, targetElement, ElementType.鉄棒_手放し技制限_ゲイロード系, 2)) {
      return ElementStatus.鉄棒_手放し技制限_ゲイロード系;
    } else if (checkTypeCount(routine, targetElement, ElementType.鉄棒_ひねり技制限_ヒーリー系, 1)) {
      return ElementStatus.鉄棒_ひねり技制限_ヒーリー系;
    } else if (checkTypeCount(routine, targetElement, ElementType.鉄棒_ひねり技制限_リバルコ系, 1)) {
      return ElementStatus.鉄棒_ひねり技制限_リバルコ系;
    } else if (checkTypeCount(routine, targetElement, ElementType.鉄棒_ひねり技制限_シュタルダーリバルコ系, 1)) {
      return ElementStatus.鉄棒_ひねり技制限_シュタルダーリバルコ系;
    } else if (checkTypeCount(routine, targetElement, ElementType.鉄棒_ひねり技制限_キンテロ系, 1)) {
      return ElementStatus.鉄棒_ひねり技制限_キンテロ系;
    }
  }

  return ElementStatus.選択可能;
};

// RoutineRules用 | 演技構成に含まれる指定タイプの技を取得(idとcode)
export const getRoutineElementsByType = (routine: RoutineElement[], types: ElementType[]) => {
  let targetRoutineElements: RoutineElement[] = [];
  routine.forEach((element) => {
    types.forEach((type) => {
      if (isElementTypeIncluded(element.element_type, type)) {
        targetRoutineElements.push(element);
      }
    });
  });

  return targetRoutineElements;
};

/***************************************************************
 * ユーザーアクションに応じてroutineを更新する関数
 * ************************************************************/

// 演技構成が適切か確認して修正する
export const updateRoutineForValidation = (
  selectEvent: number,
  routine: RoutineElement[],
  setRoutine: (routine: RoutineElement[]) => void
) => {
  let newRoutine = [...routine];
  // つり輪で振動倒立技が解除されて力技が4連続になるケース
  if (selectEvent === Events.つり輪) {
    let strengthCount = 0;
    newRoutine = routine.map((element) => {
      if (isElementTypeIncluded(element.element_type, ElementType.つり輪_力技制限1を切れる技)) {
        strengthCount = 0;
      }
      if (element.element_group === ElementGroup.EG2 || element.element_group === ElementGroup.EG3) {
        strengthCount++;
      }
      if (strengthCount >= 4 && element.is_qualified === true) {
        element.is_qualified = false;
      }
      return element;
    });
  }

  // 平行棒
  if (selectEvent === Events.平行棒) {
    newRoutine = routine.map((element, index) => {
      // 単棒終了技について
      if (isElementTypeIncluded(element.element_type, ElementType.平行棒_単棒終了技)) {
        if (index === routine.length - 1) {
          // 単棒終了技が最後の技の場合は無効にする
          return { ...element, is_qualified: false };
        }
        if (!isElementTypeIncluded(routine[index + 1].element_type, ElementType.平行棒_単棒開始技)) {
          // 単棒終了技が単棒開始技に繋がっていない場合は無効にする
          return { ...element, is_qualified: false };
        }
      }
      // 単棒開始技について
      if (isElementTypeIncluded(element.element_type, ElementType.平行棒_単棒開始技)) {
        if (index === 0) {
          // 単棒開始技が1技目の場合は無効にする
          return { ...element, is_qualified: false };
        }
        if (!isElementTypeIncluded(routine[index - 1].element_type, ElementType.平行棒_単棒終了技)) {
          // 単棒開始技が単棒終了技に繋がっていない場合は無効にする
          return { ...element, is_qualified: false };
        }
      }
      // 有効化
      if (element.is_qualified === false) {
        // 単棒終了技→単棒開始技になっていれば有効にする
        if (
          isElementTypeIncluded(element.element_type, ElementType.平行棒_単棒終了技) &&
          index < routine.length - 1 &&
          isElementTypeIncluded(routine[index + 1].element_type, ElementType.平行棒_単棒開始技)
        ) {
          return { ...element, is_qualified: true };
        }
      }
      return element;
    });
  }

  // 変更がある場合のみ setRoutine を呼び出す(useEffectの無限ループ対策)
  if (JSON.stringify(newRoutine) !== JSON.stringify(routine)) {
    setRoutine(newRoutine);
  }
};

// グループ得点
export const updateElementGroupScoreInRoutine = (
  selectEvent: number,
  routine: RoutineElement[],
  setRoutine: (routine: RoutineElement[]) => void
) => {
  // 以降の計算のために全elementのelement_group_scoreを追加(0.3or0.5)
  const newRoutineWithAllScore = routine.map((element) => {
    if (element.is_qualified === false) {
      return { ...element, element_group_score: 0 } as RoutineElement;
    }
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
    return { ...element, element_group_score } as RoutineElement;
  });

  // 各グループで最高得点を持つelementを取得する
  let maxScores = new Array(4).fill(0);
  newRoutineWithAllScore.forEach((element) => {
    if (element.element_group_score! > maxScores[element.element_group - 1]) {
      maxScores[element.element_group - 1] = element.element_group_score!;
    }
  });

  // 各グループで最高のグループ得点を持つ最初のelementのみ適用する
  const updateFlgs = new Array(4).fill(false);
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
        const firstEG1Element = newRoutine.find((element) => element.element_group === ElementGroup.EG1);
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
  // 床と跳馬以外
  if (selectEvent !== Events.床 && selectEvent !== Events.跳馬) {
    // 終末技グループ得点を修正
    newRoutine = newRoutine.map((element, index) => {
      if (
        index === newRoutine.length - 1 && // 最後の技
        element.element_group === ElementGroup.EG4 // 終末技グループ
      ) {
        return {
          ...element,
          element_group_score: element.difficulty / 10,
        };
      }
      return element;
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
  } else if (selectEvent === Events.鉄棒) {
    // 技が[EG2&&C難度未満]もしくは[(EG1orEG3)&&D難度未満]の場合を無効化(start/end_directionがnull)
    if (previousElement.end_direction?.toString() === "" || element.start_direction?.toString() === "") {
      return false;
    }
    // 技の終わりと技の始まりが合わない組み合わせを無効化
    if (previousElement.end_direction !== element.start_direction) {
      return false;
    }
    // EG2以外の組み合わせを無効化
    if (previousElement.element_group !== ElementGroup.EG2 && element.element_group !== ElementGroup.EG2) {
      return false;
    }
    return true;
  } else {
    return true;
  }
};

// 組み合わせ
export const updateConnectionInRoutine = (
  selectEvent: number,
  routine: RoutineElement[],
  setRoutine: (routine: RoutineElement[]) => void
) => {
  // [共通]組み合わせ対象が適切か確認(並べ替えされた場合を想定 ← [+]押下時はhandleConnectionClick()で対応済み)
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
  if (selectEvent === Events.床) {
    newRoutine.forEach((element, index) => {
      if (element.is_connected) {
        const previousElement = routine[index - 1];
        // ひねりを伴う1回宙同士の組み合わせ → null
        if (
          isElementTypeIncluded(previousElement.element_type, ElementType.ひねりを伴う1回宙) &&
          isElementTypeIncluded(element.element_type, ElementType.ひねりを伴う1回宙)
        ) {
          element.connection_value = null;
          return; // 次の要素へ
        }

        // D以上 + BorC → 0.1
        if (
          (previousElement.difficulty >= 4 && element.difficulty === 2) ||
          (previousElement.difficulty >= 4 && element.difficulty === 3)
        ) {
          element.connection_value = 0.1;
          return;
        }
        // BorC + D以上 → 0.1
        if (
          (previousElement.difficulty === 2 && element.difficulty >= 4) ||
          (previousElement.difficulty === 3 && element.difficulty >= 4)
        ) {
          element.connection_value = 0.1;
          return;
        }
        // D以上 + D以上 → 0.2
        if (previousElement.difficulty >= 4 && element.difficulty >= 4) {
          element.connection_value = 0.2;
          return;
        }
      }
    });
  } else if (selectEvent === Events.つり輪) {
    newRoutine.forEach((element, index) => {
      // ヤマワキ系加点の計算(ヤマワキorジョナサン+後ろ振り上がり倒立 → ヤマワキ系の難度点0.1加算)
      const nextElement = routine[index + 1] ? routine[index + 1] : null;
      if (
        nextElement &&
        isElementTypeIncluded(element.element_type, ElementType.つり輪_ヤマワキ系) &&
        isElementTypeIncluded(nextElement.element_type, ElementType.つり輪_後ろ振り上がり倒立)
      ) {
        if (nextElement.is_connected) {
          //ヤマワキ系の難度点0.1加算
          if (element.is_connection_value_calculated === false) {
            // 未計算
            element.difficulty += 1;
            element.is_connection_value_calculated = true;
          }
        } else {
          // ヤマワキ系の難度点リセット
          if (element.is_connection_value_calculated === true) {
            // 計算済み
            element.difficulty -= 1;
            element.is_connection_value_calculated = false;
          }
        }
      }
    });
  } else if (selectEvent === Events.鉄棒) {
    newRoutine.forEach((element, index) => {
      if (element.is_connected) {
        const previousElement = routine[index - 1];
        // 手放し技同士の組み合わせ
        if (previousElement.element_group === ElementGroup.EG2 && element.element_group === ElementGroup.EG2) {
          // C + D以上 || D以上 + C → 0.1
          if (
            (previousElement.difficulty === 3 && element.difficulty >= 4) ||
            (previousElement.difficulty >= 4 && element.difficulty === 3)
          ) {
            element.connection_value = 0.1;
            return;
          }
          // D + D → 0.1
          if (previousElement.difficulty === 4 && element.difficulty === 4) {
            element.connection_value = 0.1;
            return;
          }
          // D + E以上 || E以上 + D → 0.2
          if (
            (previousElement.difficulty === 4 && element.difficulty >= 5) ||
            (previousElement.difficulty >= 5 && element.difficulty === 4)
          ) {
            element.connection_value = 0.2;
            return;
          }
        }
        // 手放し技と手放し技以外の組み合わせ
        if (
          (previousElement.element_group === ElementGroup.EG2 && element.element_group !== ElementGroup.EG2) ||
          (previousElement.element_group !== ElementGroup.EG2 && element.element_group === ElementGroup.EG2)
        ) {
          // D以上 + E以上 || E以上 + D以上 → 0.2
          if (
            (previousElement.difficulty >= 4 && element.difficulty >= 5) ||
            (previousElement.difficulty >= 5 && element.difficulty >= 4)
          ) {
            element.connection_value = 0.2;
            return;
          }
          // D + D以上 || D以上 + D → 0.1
          if (
            (previousElement.difficulty === 4 && element.difficulty >= 4) ||
            (previousElement.difficulty >= 4 && element.difficulty === 4)
          ) {
            element.connection_value = 0.1;
            return;
          }
        }
      }
    });
  }

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
export const calculateNeutralDeduction = (selectEvent: Events, routine: RoutineElement[]): number => {
  if (selectEvent === Events.床) {
    return calculateElementCountDeduction(routine) + calculateMultipleSaltoShortage(routine);
  } else if (selectEvent === Events.つり輪) {
    return calculateElementCountDeduction(routine) + calculateSwingHandstandShortage(routine);
  }

  return calculateElementCountDeduction(routine);
};

// 技数減点を計算
export const calculateElementCountDeduction = (routine: RoutineElement[]): number => {
  const elementCountDeduction =
    routine.length < ELEMENT_COUNT_DEDUCTIONS.length ? ELEMENT_COUNT_DEDUCTIONS[routine.length] : 0;

  return elementCountDeduction;
};

// 各グループ得点の合計を計算
export const calculateTotalElementGroupScore = (routine: RoutineElement[]) => {
  let total = 0;
  routine
    .filter((element) => element.is_qualified)
    .forEach((element) => {
      if (element.element_group_score === undefined || element.element_group_score === null) {
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
  routine
    .filter((element) => element.is_qualified)
    .forEach((element) => {
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
