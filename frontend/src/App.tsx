import React, { useEffect, useRef, useState } from "react";
import { categorizeElements, getGroupElements, GroupElements } from "./utilities/ElementUtil";
import "./App.css";
import { Events, ElementGroup } from "./utilities/Type";

import {
  initialRoutines,
  RoutineElement,
  Routines,
  updateConnectionInRoutine,
  updateElementGroupScoreInRoutine,
  updateRoutineForValidation,
} from "./utilities/RoutineUtil";
import useMedia from "use-media";
import Header from "./components/organisms/Header";
import Elements from "./components/organisms/Elements";
import Routine from "./components/organisms/Routine";
import Lp from "./components/pages/Lp";
import Hint from "./components/pages/Hint";

// const url = "http://54.250.128.188:8000/api/elements"; // iPadで見る用
const url = "http://localhost:8000/api/elements";

const App: React.FC = () => {
  const [categorizedElements, setCategorizedElements] = useState({});
  const [selectEvent, setSelectEvent] = useState(Events.床);
  const [selectGroup, setSelectGroup] = useState(ElementGroup.EG1);
  const [groupElements, setGroupElements] = useState({} as GroupElements);
  const [routineOpen, setRoutineOpen] = useState(0); // 0: 難度表 1: 半分 2:演技構成
  const [routines, setRoutines] = useState(initialRoutines as Routines);
  const [routine, setRoutine] = useState([] as RoutineElement[]);
  const isMobile = useMedia({ maxWidth: "849px" });
  const [isInitialized, setIsInitialized] = useState(false); // 初回読み込み完了時にtrue
  const [isLoading, setIsLoading] = useState(true); // ローディング状態
  const [isVisible, setIsVisible] = useState(true); // true ならローディング画面表示, false なら非表示
  const [isLpVisible, setIsLpVisible] = useState(true); // LPの表示状態
  const [isLpHidden, setIsLpHidden] = useState(false); // 「次回から表示しない」か否か
  const [hintNum, setHintNum] = useState(-1); // 選択できない技を選択しようとした時に原因のルール番号を格納する(ヒントの表示状態にも利用する)
  const [detailOpens, setDetailOpens] = useState([] as number[]); // 詳細表示中のルールの番号を格納する

  const fetchData = async () => {
    try {
      const response = await fetch(url);
      const data = await response.json();
      const newCategorizedElements = categorizeElements(data.elements);
      setCategorizedElements(newCategorizedElements);
    } catch (error) {
      console.log(error);
    }
  };

  // LP判定
  useEffect(() => {
    // 「次回から表示しない」が選択していない場合は何もしない
    const storedIsLpHidden = localStorage.getItem("isLpHidden") as string | null;
    // null(= 初アクセス) の場合
    if (!storedIsLpHidden) {
      localStorage.setItem("isLpHidden", "false");
      setIsLpHidden(false);
      setIsLpVisible(true);
      return;
    }
    // true または false の場合はその値をセット
    const isLpHidden = storedIsLpHidden === "true";
    if (isLpHidden) {
      setIsLpVisible(false);
    }
    setIsLpHidden(isLpHidden);
  }, []);

  // ローディング処理
  useEffect(() => {
    // フェードアウト
    setTimeout(() => {
      setIsVisible(false);
    }, 2000);

    // フェードアウト後にDOMを無効化するために使う
    setTimeout(() => {
      setIsLoading(false);
    }, 2500);
  }, []);

  // 読み込み判定
  useEffect(() => {
    // 読み込み完了済みなら何もしない
    if (isInitialized) {
      return;
    }
    const storedSelectEvent = localStorage.getItem("selectEvent");
    const storedSelectGroup = localStorage.getItem("selectGroup");
    const storedRoutineOpen = localStorage.getItem("routineOpen");
    const storedRoutines = localStorage.getItem("routines");
    // localStorageに値がない(= 初アクセス)場合は何もしない
    if (!storedSelectEvent || !storedSelectGroup || !storedRoutineOpen || !storedRoutines) {
      return;
    }
    const parsedSelectEvent = parseInt(storedSelectEvent);
    const parsedSelectGroup = parseInt(storedSelectGroup);
    const parsedRoutineOpen = parseInt(storedRoutineOpen);
    const parsedRoutines = JSON.parse(storedRoutines) as Routines;
    // すべての要素が空の配列かどうかをチェック
    const isEmpty = Object.values(parsedRoutines).every((routine) => Array.isArray(routine) && routine.length === 0);
    if (
      selectEvent === parsedSelectEvent &&
      selectGroup === parsedSelectGroup &&
      routineOpen === parsedRoutineOpen &&
      (isEmpty || JSON.stringify(routines) === JSON.stringify(parsedRoutines))
    ) {
      // console.log("初回読み込み完了");
      setIsInitialized(true);
    }
  }, [selectEvent, selectGroup, routineOpen, routines]);

  useEffect(() => {
    fetchData();
  }, []);

  // 初期読み込み時にcategorizedElementsが取得されたらgroupElementsを更新する
  // categorizedElementsが更新されるのは初回読み込み時のみ
  useEffect(() => {
    setGroupElements(getGroupElements(categorizedElements, selectEvent, selectGroup));
  }, [categorizedElements]);

  // localStorageからデータを取得する
  useEffect(() => {
    // selectEventとselectGroupの取得
    const storedSelectEvent = localStorage.getItem("selectEvent");
    const storedSelectGroup = localStorage.getItem("selectGroup");
    const storedRoutineOpen = localStorage.getItem("routineOpen");
    const storedRoutines = localStorage.getItem("routines");

    // selectEventとselectGroupが存在しない = 初アクセス
    if (!storedSelectEvent || !storedSelectGroup || !storedRoutineOpen || !storedRoutines) {
      localStorage.setItem("selectEvent", Events.床.toString());
      localStorage.setItem("selectGroup", ElementGroup.EG1.toString());
      localStorage.setItem("routineOpen", "0");
      localStorage.setItem("routines", JSON.stringify(initialRoutines));
      return;
    }
    const parsedSelectEvent = parseInt(storedSelectEvent);
    const parsedSelectGroup = parseInt(storedSelectGroup);
    const parsedRoutineOpen = parseInt(storedRoutineOpen);
    setSelectEvent(parsedSelectEvent);
    setSelectGroup(parsedSelectGroup);
    setRoutineOpen(parsedRoutineOpen);

    const parsedRoutines = JSON.parse(storedRoutines);
    // すべての要素が空の配列かどうかをチェック
    const isEmpty = Object.values(parsedRoutines).every((routine) => Array.isArray(routine) && routine.length === 0);
    if (isEmpty) {
      return;
    }
    setRoutines(parsedRoutines);
  }, []);

  // 種目が更新された場合
  useEffect(() => {
    if (!isInitialized) {
      return;
    }
    // EG1にリセット
    setSelectGroup(ElementGroup.EG1);
    // 表示する技を更新する
    setGroupElements(getGroupElements(categorizedElements, selectEvent, selectGroup));
    // localStorageに保存する
    localStorage.setItem("selectEvent", selectEvent.toString());

    // 種目変更に応じて表示演技構成を更新する
    if (routines[selectEvent].length > 0) {
      // routinesに保存済みデータが存在するならroutineに代入する
      setRoutine(routines[selectEvent]);
    } else {
      // routinesに保存済みデータが存在しないなら空配列にする
      setRoutine([] as RoutineElement[]);
    }
  }, [selectEvent]);

  // グループが変更された場合
  useEffect(() => {
    if (Object.keys(categorizedElements).length === 0) {
      return;
    }
    // 表示する技を更新する
    setGroupElements(getGroupElements(categorizedElements, selectEvent, selectGroup));
    // localStorageに保存する
    localStorage.setItem("selectGroup", selectGroup.toString());
  }, [selectGroup]);

  // 演技構成が変更された場合
  useEffect(() => {
    if (!isInitialized) {
      return;
    }
    // 無効技が発生するケースを想定
    updateRoutineForValidation(selectEvent, routine, setRoutine);
    // グループ得点を更新する
    updateElementGroupScoreInRoutine(selectEvent, routine, setRoutine);
    // 組み合わせ加点を更新する
    updateConnectionInRoutine(selectEvent, routine, setRoutine);
    // routinesを更新する
    setRoutines({
      ...routines,
      [selectEvent]: routine,
    } as Routines);
  }, [routine]);

  // routinesが変更されたときにlocalStorageに保存する
  useEffect(() => {
    // routineをユーザーが変更した場合
    if (isInitialized) {
      localStorage.setItem("routines", JSON.stringify(routines));
    } else {
      // localStorageからroutinesにデータが格納された場合
      // ガード節:routinesに未反映の場合を除外する
      if (routines[selectEvent].length === 0) {
        return;
      }
      setRoutine(routines[selectEvent]);
    }
  }, [routines]);

  // 画面幅変更時（PC→SP）にside modeの場合は演技構成表を開く
  useEffect(() => {
    if (isMobile && routineOpen === 1) {
      setRoutineOpen(2);
    }
  }, [isMobile]);

  // 表示モード変更時
  useEffect(() => {
    if (!isInitialized) {
      return;
    }
    localStorage.setItem("routineOpen", routineOpen.toString());
  }, [routineOpen]);

  return (
    <div className="App">
      {isLoading && (
        <div className={`loading ${!isVisible ? "loading--hidden" : ""}`}>
          <img src="./icon_枠なし_透過.png" alt="Loading..." className={`loading__icon`} />
          <p></p>
        </div>
      )}
      {!isLpHidden && isLpVisible && <Lp setIsLpVisible={setIsLpVisible} />}
      {hintNum !== -1 && (
        <Hint
          hintNum={hintNum}
          setHintNum={setHintNum}
          setRoutineOpen={setRoutineOpen}
          isMobile={isMobile}
          setDetailOpens={setDetailOpens}
        />
      )}
      <Header
        selectEvent={selectEvent}
        setSelectEvent={setSelectEvent}
        routineOpen={routineOpen}
        setRoutineOpen={setRoutineOpen}
        isMobile={isMobile}
        routine={routine}
        routines={routines}
      />
      {Object.keys(groupElements).length ? (
        <div className="main">
          {/* 難度表 */}
          <Elements
            routineOpen={routineOpen}
            selectEvent={selectEvent}
            selectGroup={selectGroup}
            setSelectGroup={setSelectGroup}
            groupElements={groupElements}
            routine={routine}
            setRoutine={setRoutine}
            setHintNum={setHintNum}
            isMobile={isMobile}
          />
          {/* 演技構成表 */}
          <Routine
            selectEvent={selectEvent}
            routine={routine}
            setRoutine={setRoutine}
            routineOpen={routineOpen}
            setRoutineOpen={setRoutineOpen}
            categorizedElements={categorizedElements}
            detailOpens={detailOpens}
            setDetailOpens={setDetailOpens}
            setRoutines={setRoutines}
          />
        </div>
      ) : (
        <div className="main__emplty">
          <p>ただいま絶賛開発中です。</p>
          <p>もう少しお待ち下さい🙇</p>
        </div>
      )}
    </div>
  );
};

export default App;
