import React from "react";
import { GroupElements } from "../../utilities/ElementUtil";
import { RoutineElement } from "../../utilities/RoutineUtil";
import { ElementGroup, Events } from "../../utilities/Type";
import GroupButtons from "../molecules/GroupButtons";
import ElementsGroup from "../molecules/ElementsGroup";

interface ElementsProps {
  routineOpen: number;
  selectEvent: Events;
  selectGroup: ElementGroup;
  setSelectGroup: React.Dispatch<React.SetStateAction<ElementGroup>>;
  groupElements: GroupElements;
  routine: RoutineElement[];
  setRoutine: (routine: RoutineElement[]) => void;
}

const Elements = ({
  routineOpen,
  selectEvent,
  selectGroup,
  setSelectGroup,
  groupElements,
  routine,
  setRoutine,
}: ElementsProps) => {
  return (
    <div
      className={`elements ${routineOpen === 0 ? "elements--full" : ""} ${
        routineOpen === 1 ? "elements--side" : ""
      }  ${routineOpen === 2 ? "elements--disabled" : ""}`}
    >
      <GroupButtons
        selectEvent={selectEvent}
        selectGroup={selectGroup}
        setSelectGroup={setSelectGroup}
      />
      <ElementsGroup
        selectEvent={selectEvent}
        groupElements={groupElements}
        setRoutine={setRoutine}
        routine={routine}
      />
    </div>
  );
};
export default Elements;
