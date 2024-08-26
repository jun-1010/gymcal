import React from "react";
import { getElementStatus, RoutineElement } from "../../utilities/RoutineUtil";
import { difficulties, ElementStatus, Events, statusClass } from "../../utilities/Type";
import { Element } from "../../utilities/ElementUtil";

interface ElementsTileProps {
  selectEvent: Events;
  element: Element;
  setRoutine: (routine: RoutineElement[]) => void;
  routine: RoutineElement[];
  elementsTileKey: string;
}

const ElementsTile = ({
  selectEvent,
  element,
  setRoutine,
  routine,
  elementsTileKey,
}: ElementsTileProps) => {
  // 技選択時のhandle関数
  const handleElementClick = (element: Element) => {
    if (getElementStatus(selectEvent, routine, element) === ElementStatus.選択済み) {
      setRoutine(routine.filter((e) => e.id !== element.id));
      return;
    }
    if (getElementStatus(selectEvent, routine, element) === ElementStatus.選択可能) {
      const newRoutineElement: RoutineElement = {
        ...element,
        is_connected: false,
        element_group_score: 0,
        connection_value: null,
      };
      setRoutine([...routine, newRoutineElement]);
    }
  };

  // ElementStatusを表示する関数
  const renderElementStatusLabel = (element: Element) => {
    const status = getElementStatus(selectEvent, routine, element);
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
    // 床_力技制限
    if (status === ElementStatus.床_力技制限) {
      return <div className="common__label">力技制限</div>;
    }
    // 床_旋回制限
    if (status === ElementStatus.床_旋回制限) {
      return <div className="common__label">旋回制限</div>;
    }
    // あん馬_縦向き移動技制限
    if (status === ElementStatus.あん馬_縦向き移動技制限) {
      return <div className="common__label">縦向き移動技制限</div>;
    }
    // あん馬_ロシアン転向技制限
    if (status === ElementStatus.あん馬_ロシアン転向技制限) {
      return <div className="common__label">ロシアン転向技制限</div>;
    }
    // あん馬_倒立技制限
    if (status === ElementStatus.あん馬_倒立技制限) {
      return <div className="common__label">倒立技制限</div>;
    }
    // あん馬_ロシアン転向移動技制限1
    if (status === ElementStatus.あん馬_ロシアン転向移動技制限1) {
      return <div className="common__label">ロシアン転向移動技1</div>;
    }
    // あん馬_移動ひねり技制限
    if (status === ElementStatus.あん馬_移動ひねり技制限) {
      return <div className="common__label">移動ひねり技制限</div>;
    }
    // あん馬_ひねり技制限
    if (status === ElementStatus.あん馬_ひねり技制限) {
      return <div className="common__label">ひねり技制限</div>;
    }
    // あん馬_ショーンべズゴ系制限
    if (status === ElementStatus.あん馬_ショーンべズゴ系制限) {
      return <div className="common__label">ショーンべズゴ系</div>;
    }
    // あん馬_開脚旋回技制限
    if (status === ElementStatus.あん馬_開脚旋回技制限) {
      return <div className="common__label">開脚旋回技制限</div>;
    }
    // あん馬_ブスナリ系技制限
    if (status === ElementStatus.あん馬_ブスナリ系制限) {
      return <div className="common__label">ブスナリ系制限</div>;
    }
    // あん馬_ロシアン転向移動技制限2
    if (status === ElementStatus.あん馬_ロシアン転向移動技制限2) {
      return <div className="common__label">ロシアン転向移動技2</div>;
    }
  };

  return (
    <React.Fragment key={elementsTileKey}>
      {element.id ? (
        <div
          className={`elements__tile ${statusClass(getElementStatus(selectEvent, routine, element))}`}
          key={elementsTileKey}
          onClick={() => {
            handleElementClick(element);
          }}
        >
          <div className="elements__labels">
            <span
              className={`common__label ${
                getElementStatus(selectEvent, routine, element) === ElementStatus.選択済み
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
          {element.alias && <span className="elements__alias">{element.alias}</span>}
          <div>
            {element.name && <>{element.code}.{element.name}</>}
            {/* {element.code}.{element.name} */}
          </div>
        </div>
      ) : (
        <div className="elements__tile" key={elementsTileKey}></div>
      )}
    </React.Fragment>
  );
};

export default ElementsTile;
