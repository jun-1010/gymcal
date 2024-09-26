import { RoutineElement } from "../../utilities/RoutineUtil";
import { Events } from "../../utilities/Type";
import { RoutineRules } from "../molecules/RoutineRules";
import { CategorizedElements } from "../../utilities/ElementUtil";
import RoutineTable from "../molecules/RoutineTable";

interface RoutineProps {
  selectEvent: Events;
  routine: RoutineElement[];
  setRoutine: React.Dispatch<React.SetStateAction<RoutineElement[]>>;
  routineOpen: number;
  setRoutineOpen: React.Dispatch<React.SetStateAction<number>>;
  categorizedElements: CategorizedElements;
  detailOpens: number[];
  setDetailOpens: React.Dispatch<React.SetStateAction<number[]>>;
}

const Routine = ({
  selectEvent,
  routine,
  setRoutine,
  routineOpen,
  setRoutineOpen,
  categorizedElements,
  detailOpens,
  setDetailOpens
}: RoutineProps) => {
  return (
    <div
      className={`routine ${routineOpen === 0 ? "routine--disabled" : ""} ${
        routineOpen === 1 ? "routine--side" : ""
      } ${routineOpen === 2 ? "routine--full" : ""}`}
    >
      <RoutineTable
        selectEvent={selectEvent}
        routine={routine}
        setRoutine={setRoutine}
        setRoutineOpen={setRoutineOpen}
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
