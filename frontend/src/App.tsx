import React, { useEffect, useState } from "react";
import {
  categorizeElements,
  getGroupElements,
  GroupElements,
} from "./utilities/ElementUtil";
import "./App.css";
import { Events, ElementGroup } from "./utilities/Type";

import {
  RoutineElement,
  Routines,
  updateConnectionInRoutine,
  updateElementGroupScoreInRoutine,
} from "./utilities/RoutineUtil";
import useMedia from "use-media";
import Header from "./components/organisms/Header";
import Elements from "./components/organisms/Elements";
import Routine from "./components/organisms/Routine";

const url = "http://localhost:8000/api/elements";

const App: React.FC = () => {
  const [categorizedElements, setCategorizedElements] = useState({});
  const [selectEvent, setSelectEvent] = useState(Events.床);
  const [selectGroup, setSelectGroup] = useState(ElementGroup.EG1);
  const [groupElements, setGroupElements] = useState({} as GroupElements);
  const [routineOpen, setRoutineOpen] = useState(0); // 0: 難度表 1: 半分 2:演技構成
  const [routines, setRoutines] = useState({} as Routines);
  const [routine, setRoutine] = useState([] as RoutineElement[]);
  const isMobile = useMedia({ maxWidth: "850px" });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(url);
        const data = await response.json();
        const newCategorizedElements = categorizeElements(data.elements);
        setCategorizedElements(newCategorizedElements);
        const newGroupElements = getGroupElements(
          newCategorizedElements,
          selectEvent,
          selectGroup
        );
        setGroupElements(newGroupElements);
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
  }, []);

  // 初期読み込み時にlocalStorageからデータを取得する
  useEffect(() => {
    // routinesの取得
    const storedRoutines = localStorage.getItem("routines");
    if (storedRoutines) {
      const parsedRoutines = JSON.parse(storedRoutines);
      setRoutines(parsedRoutines);

      // 初期化時にroutineも設定する(routinesの初期化を防ぐために必要)
      if (parsedRoutines[selectEvent]) {
        setRoutine(parsedRoutines[selectEvent]);
      }
    }

    // selectEventの取得
    const storedSelectEvent = localStorage.getItem("selectEvent");
    if (storedSelectEvent) {
      setSelectEvent(parseInt(storedSelectEvent));
    }
    // selectGroupの取得
    const storedSelectGroup = localStorage.getItem("selectGroup");
    if (storedSelectGroup) {
      setSelectGroup(parseInt(storedSelectGroup));
    }
  }, []);

  // 種目かグループが変更された場合
  useEffect(() => {
    if (Object.keys(categorizedElements).length === 0) {
      return;
    }
    // 表示する技を更新する
    setGroupElements(getGroupElements(categorizedElements, selectEvent, selectGroup));
    // localStorageに保存する
    localStorage.setItem("selectEvent", selectEvent.toString());
    localStorage.setItem("selectGroup", selectGroup.toString());
  }, [selectEvent, selectGroup]);

  // 種目が変更された場合
  useEffect(() => {
    // routines[selectEvent]が存在するならroutineに代入する
    if (routines[selectEvent]) {
      setRoutine(routines[selectEvent]);
    }
  }, [selectEvent]);

  // 演技構成が変更された場合
  useEffect(() => {
    // グループ得点を更新する
    updateElementGroupScoreInRoutine(selectEvent, routine, setRoutine);
    // 組み合わせ加点を更新する
    updateConnectionInRoutine(selectEvent, routine, setRoutine);
    // routinesを更新する
    setRoutines({
      ...routines,
      [selectEvent]: routine,
    });
  }, [routine]);

  // routinesが変更されたときにlocalStorageに保存する
  useEffect(() => {
    localStorage.setItem("routines", JSON.stringify(routines));
  }, [routines]);

  // 画面幅変更時（PC→SP）にside modeの場合は演技構成表を開く
  useEffect(() => {
    if (isMobile && routineOpen === 1) {
      setRoutineOpen(2);
    }
  }, [isMobile]);

  return (
    <div className="App">
      <Header
        selectEvent={selectEvent}
        setSelectEvent={setSelectEvent}
        routineOpen={routineOpen}
        setRoutineOpen={setRoutineOpen}
        isMobile={isMobile}
        routine={routine}
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
          />
          {/* 演技構成表 */}
          <Routine
            selectEvent={selectEvent}
            routine={routine}
            setRoutine={setRoutine}
            routineOpen={routineOpen}
            setRoutineOpen={setRoutineOpen}
            categorizedElements={categorizedElements}
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
