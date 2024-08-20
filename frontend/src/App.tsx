import React, { useEffect, useState } from "react";
import { Element, categorizeElements, getGroupElements, GroupElements } from "./Element";
import "./App.css";
import GroupTabs from "./components/GroupTabs";
import {
  Events,
  ElementGroup,
  difficulties,
  element_groups,
  statusClassMap,
  ElementStatus,
} from "./Type";
import EventButtons from "./components/EventButtons";

import AddIcon from "@mui/icons-material/Add";
import AddBoxIcon from "@mui/icons-material/AddBox";
import CloseIcon from "@mui/icons-material/Close";
import {
  calculateTotalScore,
  calculateND,
  calculateTotalConnectionValue,
  calculateTotalDifficulty,
  calculateTotalElementGroupScore,
  isConnectable,
  getElementStatus,
  RoutineElement,
  updateConnectionInRoutine,
  updateElementGroupScoreInRoutine,
} from "./Routine";
import useMedia from "use-media";
import HeaderIcons from "./components/HeaderIcons";
import { AppliedRules } from "./components/AppliedRules";

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

  // 技選択時のhandle関数
  const handleElementClick = (element: Element) => {
    if (getElementStatus(routine, element) === ElementStatus.選択済み) {
      setRoutine(routine.filter((e) => e.id !== element.id));
      return;
    }
    if (getElementStatus(routine, element) === ElementStatus.選択可能) {
      const newRoutineElement: RoutineElement = {
        ...element,
        is_connected: false,
        element_group_score: 0,
        connection_value: null,
      };
      setRoutine([...routine, newRoutineElement]);
    }
  };

  // ElementStatusを表示する関数 TODO: Rulesに統合
  const renderElementStatusLabel = (element: Element) => {
    const status = getElementStatus(routine, element);
    // 選択可能 → 何も表示しない
    if (status === ElementStatus.選択可能) {
      return null;
    }
    // 選択済み → 選択済み(技番号)
    if (status === ElementStatus.選択済み) {
      const index = routine.findIndex((e) => e.id === element.id);
      return (
        <div className="common__label common__label--active">{`選択済み(${
          index + 1
        }技目)`}</div>
      );
    }
    // 同一枠選択済み → 同一枠選択済み(技番号)
    if (status === ElementStatus.同一枠選択済み) {
      const code = routine.find((e) => e.code === element.code)?.code;
      return <div className="common__label">{`同一枠(${code})`}</div>;
    }
    // 技数制限_グループ → 技数制限_グループ
    if (status === ElementStatus.技数制限_グループ) {
      return <div className="common__label">グループ技数制限</div>;
    }
    // 技数制限_全体 → 技数制限_全体
    if (status === ElementStatus.技数制限_全体) {
      return <div className="common__label">全体技数制限</div>;
    }
  };

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
      <div className="header">
        {isMobile ? (
          <>
            <div className="header__left">
              <h1 className="header__title">
                <a href="/">GymCal</a>
              </h1>
              <EventButtons
                selectEvent={selectEvent}
                setSelectEvent={setSelectEvent}
                isMobile={isMobile}
              />
            </div>
            <div className="header__right">
              <HeaderIcons
                routineOpen={routineOpen}
                setRoutineOpen={setRoutineOpen}
                isMobile={isMobile}
                badgeContent={routine.length}
              />
            </div>
          </>
        ) : (
          <>
            <div className="header__left">
              <h1 className="header__title">
                <a href="/">GymCal</a>
              </h1>
            </div>
            <EventButtons
              selectEvent={selectEvent}
              setSelectEvent={setSelectEvent}
              isMobile={isMobile}
            />
            <div className="header__right">
              <HeaderIcons
                routineOpen={routineOpen}
                setRoutineOpen={setRoutineOpen}
                isMobile={isMobile}
                badgeContent={routine.length}
              />
            </div>
          </>
        )}
      </div>
      {Object.keys(groupElements).length ? (
        <div className="main">
          <div
            className={`elements ${routineOpen === 0 ? "elements--full" : ""} ${
              routineOpen === 1 ? "elements--side" : ""
            }  ${routineOpen === 2 ? "elements--disabled" : ""}`}
          >
            <div className="elements__header">
              <GroupTabs
                selectEvent={selectEvent}
                selectGroup={selectGroup}
                setSelectGroup={setSelectGroup}
              />
            </div>
            <div className="elements__group">
              {Object.entries(groupElements as Object).map(([rowKey, rowElements]) => (
                <div className="elements__row" key={rowKey}>
                  {Object.entries(rowElements as Object).map(
                    ([column_number, element]) => (
                      <React.Fragment key={`${rowKey}-${column_number}`}>
                        {element.name ? (
                          <div
                            className={`elements__tile ${
                              statusClassMap[getElementStatus(routine, element)]
                            }`}
                            key={`${rowKey}-${column_number}`}
                            onClick={() => {
                              handleElementClick(element);
                            }}
                          >
                            <div className="elements__labels">
                              <span
                                className={`common__label ${
                                  getElementStatus(routine, element) ===
                                  ElementStatus.選択済み
                                    ? "common__label--active"
                                    : ""
                                }`}
                              >
                                {selectEvent === Events.跳馬
                                  ? element.difficulty
                                  : difficulties[element.difficulty - 1]}
                              </span>
                              {renderElementStatusLabel(element)}
                            </div>
                            {element.alias && (
                              <span className="elements__alias">{element.alias}</span>
                            )}
                            <div>
                              {element.code}.{element.name}
                            </div>
                          </div>
                        ) : (
                          <div
                            className="elements__tile"
                            key={`${rowKey}-${column_number}`}
                          ></div>
                        )}
                      </React.Fragment>
                    )
                  )}
                </div>
              ))}
            </div>
          </div>
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
                  {/* 技数減点 */}
                  {calculateND(routine) > 0 ? (
                    <p className="common__label common__label--active routine__summary-label">
                      ND:{calculateND(routine).toFixed(1)}
                    </p>
                  ) : (
                    <></>
                  )}
                </div>
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
