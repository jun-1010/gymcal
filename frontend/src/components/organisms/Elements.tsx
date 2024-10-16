import React, { useEffect, useState } from "react";
import { GroupElements } from "../../utilities/ElementUtil";
import { RoutineElement } from "../../utilities/RoutineUtil";
import { ElementGroup, Events } from "../../utilities/Type";
import ElementsGroupButtons from "../molecules/ElementsGroupButtons";
import ElementsGroup from "../molecules/ElementsGroup";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";

interface ElementsProps {
  displayMode: number;
  selectEvent: Events;
  selectGroup: ElementGroup;
  setSelectGroup: React.Dispatch<React.SetStateAction<ElementGroup>>;
  groupElements: GroupElements;
  routine: RoutineElement[];
  setRoutine: React.Dispatch<React.SetStateAction<RoutineElement[]>>;
  setHintNum: React.Dispatch<React.SetStateAction<number>>;
  isMobile: boolean;
}

const Elements = ({
  displayMode,
  selectEvent,
  selectGroup,
  setSelectGroup,
  groupElements,
  routine,
  setRoutine,
  setHintNum,
  isMobile,
}: ElementsProps) => {
  const [fontSize, setFontSize] = useState(isMobile ? 0.8 : 0.9);

  return (
    <div
      className={`elements ${displayMode === 0 ? "elements--full" : ""} ${displayMode === 1 ? "elements--side" : ""}  ${
        displayMode === 2 ? "elements--disabled" : ""
      }`}
    >
      <ElementsGroupButtons selectEvent={selectEvent} selectGroup={selectGroup} setSelectGroup={setSelectGroup} />
      <ElementsGroup
        selectEvent={selectEvent}
        groupElements={groupElements}
        setRoutine={setRoutine}
        routine={routine}
        fontSize={fontSize}
        setHintNum={setHintNum}
      />

      <div className="elements__zoom">
        <button className="elements__zoom-icon" onClick={() => setFontSize(fontSize / 0.9)}>
          <AddIcon />
        </button>
        <button className="elements__zoom-icon" onClick={() => setFontSize(fontSize * 0.9)}>
          <RemoveIcon />
        </button>
      </div>
    </div>
  );
};
export default Elements;
