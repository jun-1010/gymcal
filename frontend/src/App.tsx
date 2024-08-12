import React, { useEffect, useState } from "react";
import { categorizeElements, getGroupElements, GroupElements } from "./Element";
import "./App.css";
import GroupTabs from "./components/GroupTabs";
import { Events, ElementGroup } from "./Type";
import EventButtons from "./components/EventButtons";

const url = "http://localhost:8000/api/elements";

const App: React.FC = () => {
  const [categorizedElements, setCategorizedElements] = useState({});
  const [selectEvent, setSelectEvent] = useState(Events.床);
  const [selectGroup, setSelectGroup] = useState(ElementGroup.EG1);
  const [groupElements, setGroupElements] = useState({} as GroupElements);

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

  useEffect(() => {
    console.log("種目変更: ", selectEvent);
    // 種目が変更されたらEG1を選択する
    setSelectGroup(ElementGroup.EG1);
  }, [selectEvent]);

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
        <div>{/* 構成表アイコン */}</div>
      </div>
      <div className="elements">
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
                            className="elements__tile elements__tile--active"
                            key={`${rowKey}-${difficultyKey}`}
                          >
                            <div className="elements__label-box">
                              {element.name && (
                                <span className="elements__difficulty">
                                  {difficultyKey}
                                </span>
                              )}
                              {element.alias && (
                                <span className="elements__alias">
                                  {element.alias}
                                </span>
                              )}
                            </div>
                            <p>{element.name}</p>
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
    </div>
  );
};

export default App;
