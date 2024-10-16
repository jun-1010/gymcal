import { RoutineElement, Routines } from "../../utilities/RoutineUtil";
import { Events } from "../../utilities/Type";
import { RoutineRules } from "../molecules/RoutineRules";
import { CategorizedElements } from "../../utilities/ElementUtil";
import RoutineTable from "../molecules/RoutineTable";

interface RoutineProps {
  selectEvent: Events;
  routine: RoutineElement[];
  setRoutine: React.Dispatch<React.SetStateAction<RoutineElement[]>>;
  displayMode: number;
  setDisplayMode: React.Dispatch<React.SetStateAction<number>>;
  categorizedElements: CategorizedElements;
  detailOpens: number[];
  setDetailOpens: React.Dispatch<React.SetStateAction<number[]>>;
  setRoutines: React.Dispatch<React.SetStateAction<Routines>>;
}

const Routine = ({
  selectEvent,
  routine,
  setRoutine,
  displayMode,
  setDisplayMode,
  categorizedElements,
  detailOpens,
  setDetailOpens,
  setRoutines,
}: RoutineProps) => {
  return (
    <div
      className={`routine ${displayMode === 0 ? "routine--disabled" : ""} ${displayMode === 1 ? "routine--side" : ""} ${
        displayMode === 2 ? "routine--full" : ""
      }`}
    >
      <RoutineTable
        selectEvent={selectEvent}
        routine={routine}
        setRoutine={setRoutine}
        setDisplayMode={setDisplayMode}
        setRoutines={setRoutines}
      />
      <RoutineRules
        selectEvent={selectEvent}
        routine={routine}
        categorizedElements={categorizedElements}
        detailOpens={detailOpens}
        setDetailOpens={setDetailOpens}
      />
    </div>
  );
};

export default Routine;
