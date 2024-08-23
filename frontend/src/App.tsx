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

  // 種目かグループが変更されたら表示する技テーブルを更新する
  useEffect(() => {
    if (Object.keys(categorizedElements).length === 0) {
      return;
    }
    const newGroupElements = getGroupElements(
      categorizedElements,
      selectEvent,
      selectGroup
    );
    setGroupElements(newGroupElements);
  }, [selectEvent, selectGroup]);

  // 種目が変更された場合
  useEffect(() => {
    setSelectGroup(ElementGroup.EG1); // EG1を選択する
    setRoutine([]); // 演技構成をリセットする
  }, [selectEvent]);

  // 演技構成が変更された場合
  useEffect(() => {
    // グループ得点を更新する
    updateElementGroupScoreInRoutine(selectEvent, routine, setRoutine);
    // 組み合わせ加点を更新する
    updateConnectionInRoutine(selectEvent, routine, setRoutine);
  }, [routine]);

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
            categorizedElements={categorizedElements}
          />
        </div>
      ) : (
        <div>
          <p>ただいま絶賛開発中です。</p>
          <p>もう少しお待ち下さい🙇</p>
        </div>
      )}
    </div>
  );
};

export default App;
