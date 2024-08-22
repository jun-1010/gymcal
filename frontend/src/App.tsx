import React, { useEffect, useState } from "react";
import {
  Element,
  categorizeElements,
  getGroupElements,
  GroupElements,
} from "./utilities/ElementUtil";
import "./App.css";
import {
  Events,
  ElementGroup,
  difficulties,
  element_groups,
  ElementStatus,
} from "./utilities/Type";

import AddIcon from "@mui/icons-material/Add";
import AddBoxIcon from "@mui/icons-material/AddBox";
import CloseIcon from "@mui/icons-material/Close";
import {
  calculateTotalScore,
  calculateElementCountDeduction,
  calculateTotalConnectionValue,
  calculateTotalDifficulty,
  calculateTotalElementGroupScore,
  isConnectable,
  getElementStatus,
  RoutineElement,
  updateConnectionInRoutine,
  updateElementGroupScoreInRoutine,
  calculateNeutralDeduction,
  calculateMultipleSaltoShortage,
} from "./utilities/RoutineUtil";
import useMedia from "use-media";
import { AppliedRules } from "./components/AppliedRules";
import Header from "./components/organism/Header";
import Elements from "./components/organism/Elements";

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

  // そもそも組み合わせさせないための処理
  const handleConnectionClick = (element: RoutineElement, index: number) => {
    // 更新用関数
    const updateRoutine = (targetElement: RoutineElement) => {
      const newRoutine = routine.map((e, i) => (i === index ? targetElement : e));
      setRoutine(newRoutine);
    };

    // 組み合わせ解除は無条件で実行
    if (element.is_connected) {
      updateRoutine({ ...element, is_connected: false, connection_value: null });
      return; // handleConnectionClick()の終了
    }

    // 組み合わせが適切なら組み合わせを有効化
    if (isConnectable(selectEvent, routine, element, index)) {
      updateRoutine({ ...element, is_connected: true });
      return; // handleConnectionClick()の終了
    }
  };

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
          <div
            className={`routine ${routineOpen === 0 ? "routine--disabled" : ""} ${
              routineOpen === 1 ? "routine--side" : ""
            } ${routineOpen === 2 ? "routine--full" : ""}`}
          >
            <div className="routine__title">演技構成表</div>
            <div className="routine__table">
              {routine.length ? (
                <div className="routine__elements">
                  <div className="routine__element routine__element--header">
                    <span className="routine__item">No.</span>
                    <span></span>
                    <span className="routine__item">名前</span>
                    <span className="routine__item">EG</span>
                    <span className="routine__item">難度</span>
                    <span className="routine__item">CV</span>
                  </div>
                  {routine.map((element, index) => (
                    <div className="routine__element" key={element.name}>
                      <span className="routine__item">{index + 1}</span>
                      <span
                        className={`routine__item routine__icon ${
                          element.is_connected ? "routine__icon--active" : ""
                        }`}
                        onClick={() => handleConnectionClick(element, index)}
                      >
                        {element.is_connected ? (
                          <AddBoxIcon
                            sx={{
                              fontSize: "1.5rem",
                            }}
                          />
                        ) : (
                          <AddIcon
                            sx={{
                              fontSize: "1rem",
                            }}
                          />
                        )}
                      </span>
                      <span className="routine__item">
                        {element.code}.{element.alias ? element.alias : element.name}
                      </span>
                      <span className="routine__item">
                        {element_groups[element.element_group - 1]}
                        {element.element_group_score! > 0
                          ? `(${element.element_group_score?.toFixed(1)})`
                          : ``}
                      </span>
                      <span className="routine__item">
                        {difficulties[element.difficulty - 1]}
                      </span>
                      <span className="routine__item">{element.connection_value}</span>
                      <span className="routine__item routine__icon">
                        <CloseIcon
                          sx={{
                            fontSize: "1rem",
                          }}
                          onClick={() => setRoutine(routine.filter((e) => e !== element))}
                        />
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <div>
                  <p>演技構成はありません</p>
                  <p>技を選択してください</p>
                </div>
              )}
              <div className="routine__summaries">
                <div className="routine__summary">
                  {/* 合計Dスコア */}
                  {calculateTotalScore(routine) > 0 ? (
                    <p className="common__label common__label--active routine__summary-label">
                      Dスコア: {calculateTotalScore(routine).toFixed(1)}
                    </p>
                  ) : (
                    <></>
                  )}
                  {/* グループ得点 */}
                  {calculateTotalElementGroupScore(routine) > 0 ? (
                    <p className="common__label routine__summary-label">
                      EG: {calculateTotalElementGroupScore(routine).toFixed(1)}
                    </p>
                  ) : (
                    <></>
                  )}
                  {/* 難度点 */}
                  {calculateTotalDifficulty(routine) > 0 ? (
                    <p className="common__label routine__summary-label">
                      難度: {calculateTotalDifficulty(routine).toFixed(1)}
                    </p>
                  ) : (
                    <></>
                  )}
                  {/* 組み合わせ加点 */}
                  {calculateTotalConnectionValue(routine) > 0 ? (
                    <p className="common__label routine__summary-label">
                      CV: {calculateTotalConnectionValue(routine).toFixed(1)}
                    </p>
                  ) : (
                    <></>
                  )}
                </div>
                <div className="routine__summary">
                  {/* ニュートラルディダクション */}
                  {calculateNeutralDeduction(routine) > 0 ? (
                    <p className="common__label common__label--active routine__summary-label">
                      ND:{calculateNeutralDeduction(routine).toFixed(1)}
                    </p>
                  ) : (
                    <></>
                  )}
                  {/* 技数減点 */}
                  {calculateElementCountDeduction(routine) > 0 ? (
                    <p className="common__label routine__summary-label">
                      技数減点: {calculateElementCountDeduction(routine).toFixed(1)}
                    </p>
                  ) : (
                    <></>
                  )}
                  {/* ダブル系不足 */}
                  {calculateMultipleSaltoShortage(routine) > 0 ? (
                    <p className="common__label routine__summary-label">
                      ダブル系不足: {calculateMultipleSaltoShortage(routine).toFixed(1)}
                    </p>
                  ) : (
                    <></>
                  )}
                </div>
              </div>
            </div>
            <div className="routine__title">関連ルール</div>
            <AppliedRules routine={routine} categorizedElements={categorizedElements} />
          </div>
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
