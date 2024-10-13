import React, { useEffect, useState } from "react";
import { categorizeElements, getGroupElements, GroupElements } from "./utilities/ElementUtil";
import "./App.css";
import { Events, ElementGroup } from "./utilities/Type";

import { initialRoutines, RoutineElement, Routines } from "./utilities/RoutineUtil";
import useMedia from "use-media";
import Lp from "./components/pages/Lp";
import MainContent from "./components/pages/MainContent";

// const url = "http://54.250.128.188:8000/api/elements"; // iPadで見る用
const url = "http://localhost:8000/api/elements";

const App: React.FC = () => {
  const [categorizedElements, setCategorizedElements] = useState({});
  const [selectEvent, setSelectEvent] = useState(Events.床);
  const [selectGroup, setSelectGroup] = useState(ElementGroup.EG1);
  const [groupElements, setGroupElements] = useState({} as GroupElements);
  const [routineOpen, setRoutineOpen] = useState(1); // 0:難度表 1:半分 2:演技構成
  const [routines, setRoutines] = useState(initialRoutines as Routines);
  const [routine, setRoutine] = useState([] as RoutineElement[]);
  const isMobile = useMedia({ maxWidth: "849px" });
  const [isInitialized, setIsInitialized] = useState(false); // 初回読み込み完了時にtrue
  const [isLoading, setIsLoading] = useState(true); // ローディング状態
  const [isVisible, setIsVisible] = useState(true); // true ならローディング画面表示, false なら非表示
  const [isLpVisible, setIsLpVisible] = useState(true); // LPの表示状態
  const [isLpHidden, setIsLpHidden] = useState(false); // 「次回から表示しない」か否か

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

  // 先にデータを読み込んでおく
  useEffect(() => {
    fetchData();
  }, []);

  // 読み込み判定 TODO: EventMenu導入でselectEventとselectGroupはurlから取得可能になる
  useEffect(() => {
    // 読み込み完了済みなら何もしない
    if (isInitialized) {
      return;
    }
    const storedSelectEvent = localStorage.getItem("selectEvent");
    const storedSelectGroup = localStorage.getItem("selectGroup");
    const storedRoutines = localStorage.getItem("routines");
    // localStorageに値がない(= 初アクセス)場合は何もしない
    if (!storedSelectEvent || !storedSelectGroup || !storedRoutines) {
      return;
    }
    const parsedSelectEvent = parseInt(storedSelectEvent);
    const parsedSelectGroup = parseInt(storedSelectGroup);
    const parsedRoutines = JSON.parse(storedRoutines) as Routines;
    // すべての要素が空の配列かどうかをチェック
    const isEmpty = Object.values(parsedRoutines).every((routine) => Array.isArray(routine) && routine.length === 0);
    if (
      selectEvent === parsedSelectEvent &&
      selectGroup === parsedSelectGroup &&
      (isEmpty || JSON.stringify(routines) === JSON.stringify(parsedRoutines))
    ) {
      // console.log("初回読み込み完了");
      setIsInitialized(true);
    }
  }, [selectEvent, selectGroup, routines]);

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
    const storedRoutines = localStorage.getItem("routines");

    // selectEventとselectGroupが存在しない = 初アクセス
    if (!storedSelectEvent || !storedSelectGroup || !storedRoutines) {
      localStorage.setItem("selectEvent", Events.床.toString());
      localStorage.setItem("selectGroup", ElementGroup.EG1.toString());
      localStorage.setItem("routines", JSON.stringify(initialRoutines));
      return;
    }
    const parsedSelectEvent = parseInt(storedSelectEvent);
    const parsedSelectGroup = parseInt(storedSelectGroup);
    setSelectEvent(parsedSelectEvent);
    setSelectGroup(parsedSelectGroup);

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
    localStorage.setItem("selectEvent", selectEvent.toString());

    // 演技構成を更新する
    if (routines[selectEvent].length > 0) {
      // routinesに保存済みデータが存在するならroutineに代入する
      setRoutine(routines[selectEvent]);
    } else {
      // routinesに保存済みデータが存在しないなら空配列にする
      setRoutine([] as RoutineElement[]);
    }
  }, [selectEvent]);

  return (
    <div className="App">
      {isLoading && (
        <div className={`loading ${!isVisible ? "loading--hidden" : ""}`}>
          <img src="./icon_枠なし_透過.png" alt="Loading..." className={`loading__icon`} />
          <p></p>
        </div>
      )}
      {!isLpHidden && isLpVisible && <Lp setIsLpVisible={setIsLpVisible} />}
      <MainContent
        routineOpen={routineOpen}
        setRoutineOpen={setRoutineOpen}
        isMobile={isMobile}
        routine={routine}
        setRoutine={setRoutine}
        selectEvent={selectEvent}
        setSelectEvent={setSelectEvent}
        selectGroup={selectGroup}
        setSelectGroup={setSelectGroup}
        routines={routines}
        setRoutines={setRoutines}
        groupElements={groupElements}
        setGroupElements={setGroupElements}
        categorizedElements={categorizedElements}
        isInitialized={isInitialized}
      />
    </div>
  );
};

export default App;
