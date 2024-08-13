import React, { useEffect, useState } from "react";
import {
  Element,
  categorizeElements,
  getGroupElements,
  GroupElements,
} from "./Element";
import "./App.css";
import GroupTabs from "./components/GroupTabs";
import { Events, ElementGroup } from "./Type";
import EventButtons from "./components/EventButtons";
import VerticalSplitIcon from "@mui/icons-material/VerticalSplit";
import ViewModuleIcon from "@mui/icons-material/ViewModule";
import ReorderIcon from "@mui/icons-material/Reorder";
import AddBoxOutlinedIcon from "@mui/icons-material/AddBoxOutlined";
import AddBoxIcon from "@mui/icons-material/AddBox";
import CloseIcon from "@mui/icons-material/Close";
import {
  calculateDifficulty,
  isCodeInRoutine,
  isDisabledElement,
} from "./Routine";

const url = "http://localhost:8000/api/elements";

const App: React.FC = () => {
  const [categorizedElements, setCategorizedElements] = useState({});
  const [selectEvent, setSelectEvent] = useState(Events.床);
  const [selectGroup, setSelectGroup] = useState(ElementGroup.EG1);
  const [groupElements, setGroupElements] = useState({} as GroupElements);
  const [routineOpen, setRoutineOpen] = useState(1); // 0: 難度表 1: 半分 2:演技構成
  const [routine, setRoutine] = useState([] as Element[]);
  const [disabledElements, setDisabledElements] = useState([] as Element[]);

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
  }, [selectEvent]);

  const getIcon = () => {
    if (routineOpen === 0) {
      return (
        <ViewModuleIcon
          sx={{
            fontSize: "2.5rem",
          }}
        />
      );
    } else if (routineOpen === 1) {
      return (
        <VerticalSplitIcon
          sx={{
            transform: "rotate(180deg)",
            fontSize: "2.5rem",
          }}
        />
      );
    } else if (routineOpen === 2) {
      return (
        <ReorderIcon
          sx={{
            fontSize: "2.5rem",
          }}
        />
      );
    }
  };

  return (
    <div className="App">
      <div className="header">
        <h1 className="header__title">
          <a href="/">GymCal</a>
        </h1>
        <EventButtons
          selectEvent={selectEvent}
          setSelectEvent={setSelectEvent}
        />
        <div
          onClick={() => {
            // 0→1→2→0と変化させる
            setRoutineOpen((routineOpen + 1) % 3);
          }}
          className="header__routine"
        >
          {getIcon()}
        </div>
      </div>
      <div className="main">
        <div className={`elements ${routineOpen === 1 && "elements--side"}`}>
          <div className="elements__header">
            <GroupTabs
              selectEvent={selectEvent}
              selectGroup={selectGroup}
              setSelectGroup={setSelectGroup}
            />
          </div>
          {Object.keys(groupElements).length ? (
            <div className="elements__group">
              {Object.entries(groupElements as Object).map(
                ([rowKey, rowElements]) => (
                  <div className="elements__row" key={rowKey}>
                    {Object.entries(rowElements as Object).map(
                      ([difficultyKey, element]) => (
                        <>
                          {element.name ? (
                            <div
                              className={`elements__tile ${
                                isDisabledElement(routine, element)
                                  ? "elements__tile--disabled"
                                  : "elements__tile--active"
                              }`}
                              key={`${rowKey}-${difficultyKey}`}
                              onClick={() => {
                                if (isDisabledElement(routine, element)) {
                                  return;
                                }
                                setRoutine([...routine, element]);
                              }}
                            >
                              <div className="elements__label-box">
                                <span className="elements__difficulty">
                                  {difficultyKey}
                                </span>
                                {element.alias && (
                                  <span className="elements__alias">
                                    {element.alias}
                                  </span>
                                )}
                              </div>
                              <div>
                                {element.code}.{element.name}
                              </div>
                            </div>
                          ) : (
                            <div
                              className="elements__tile"
                              key={`${rowKey}-${difficultyKey}`}
                            ></div>
                          )}
                        </>
                      )
                    )}
                  </div>
                )
              )}
            </div>
          ) : (
            <div>
              <p>ただいま絶賛開発中です。</p>
              <p>もう少しお待ち下さい🙇</p>
            </div>
          )}
        </div>
        {routineOpen === 1 && (
          <div className="routine">
            <div className="routine__header">
              演技構成: <span>{calculateDifficulty(routine)}</span>
            </div>
            {routine.length ? (
              <div className="routine__elements">
                {routine.map((element, index) => (
                  <div className="routine__element" key={element.name}>
                    <AddBoxOutlinedIcon />
                    <span>{index + 1}</span>
                    <span>{element.code}</span>
                    <span className="routine__element--name">
                      {element.alias && <>{element.alias}</>}
                      {element.name}
                    </span>
                    <CloseIcon
                      onClick={() =>
                        setRoutine(routine.filter((e) => e !== element))
                      }
                    />
                  </div>
                ))}
              </div>
            ) : (
              <p>演技構成はありません</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default App;
