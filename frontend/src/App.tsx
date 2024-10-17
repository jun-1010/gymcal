import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, useParams, useNavigate } from "react-router-dom";

import { categorizeElements, getGroupElements, GroupElements } from "./utilities/ElementUtil";
import "./App.css";
import { Events, ElementGroup } from "./utilities/Type";
import { initialRoutines, RoutineElement, Routines } from "./utilities/RoutineUtil";
import useMedia from "use-media";
import Lp from "./components/pages/Lp";
import EventPage from "./components/pages/EventPage";
import EventMenu from "./components/pages/EventMenu";
import NotFound from "./components/pages/NotFound";

const url = "http://54.250.128.188:8000/api/elements";
// const url = "http://localhost:8000/api/elements";

const App: React.FC = () => {
  const isMobile = useMedia({ maxWidth: "849px" }, true); // 初期値を設定することで、ダイレクト処理のバグを防ぐ
  const [categorizedElements, setCategorizedElements] = useState({});
  const [selectEvent, setSelectEvent] = useState(Events.床);
  const [selectGroup, setSelectGroup] = useState(ElementGroup.EG1);
  const [groupElements, setGroupElements] = useState({} as GroupElements);
  const [routines, setRoutines] = useState(initialRoutines as Routines);
  const [routine, setRoutine] = useState([] as RoutineElement[]);
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

  // 読み込み判定
  useEffect(() => {
    // 読み込み完了済みなら何もしない
    if (isInitialized) {
      return;
    }
    const storedSelectGroup = localStorage.getItem("selectGroup");
    const storedRoutines = localStorage.getItem("routines");
    // localStorageに値がない(= 初アクセス)場合は何もしない
    if (!storedSelectGroup || !storedRoutines) {
      return;
    }
    const parsedSelectGroup = parseInt(storedSelectGroup);
    const parsedRoutines = JSON.parse(storedRoutines) as Routines;
    // すべての要素が空の配列かどうかをチェック
    const isEmpty = Object.values(parsedRoutines).every((routine) => Array.isArray(routine) && routine.length === 0);
    if (selectGroup === parsedSelectGroup && (isEmpty || JSON.stringify(routines) === JSON.stringify(parsedRoutines))) {
      // console.log("初回読み込み完了");
      setIsInitialized(true);
    }
  }, [selectGroup, routines]);

  // 初期読み込み時にcategorizedElementsが取得されたらgroupElementsを更新する
  // categorizedElementsが更新されるのは初回読み込み時のみ
  useEffect(() => {
    setGroupElements(getGroupElements(categorizedElements, selectEvent, selectGroup));
  }, [categorizedElements]);

  // localStorageからデータを取得する
  useEffect(() => {
    const storedSelectGroup = localStorage.getItem("selectGroup");
    const storedRoutines = localStorage.getItem("routines");

    // selectEventとselectGroupが存在しない = 初アクセス
    if (!storedSelectGroup || !storedRoutines) {
      localStorage.setItem("selectGroup", ElementGroup.EG1.toString());
      localStorage.setItem("routines", JSON.stringify(initialRoutines));
      return;
    }
    const parsedSelectGroup = parseInt(storedSelectGroup);
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
      <Router>
        <Routes>
          {/* PCで「/」にアクセスされたら「/fx」にリダイレクト */}
          <Route
            path="/"
            element={
              isMobile ? (
                <EventMenu
                  selectEvent={selectEvent}
                  isMobile={isMobile}
                  routines={routines}
                  setRoutine={setRoutine}
                  setRoutines={setRoutines}
                  setSelectEvent={setSelectEvent}
                  setDrawerOpen={() => {}} // SPモードでは使わない(しApp.tsxに定義されていない)
                />
              ) : (
                <Navigate to="/fx" replace />
              )
            }
          />
          <Route
            path="/:eventType"
            element={
              <EventPage
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
            }
          />
          {/* 404 NotFoundページ */}
          <Route path="*" element={<NotFound />} />
          <Route path="/not-found" element={<NotFound />} />
        </Routes>
      </Router>
    </div>
  );
};

export default App;
