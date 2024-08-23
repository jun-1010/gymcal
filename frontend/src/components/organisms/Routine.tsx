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
  categorizedElements: CategorizedElements;
}

const Routine = ({
  selectEvent,
  routine,
  setRoutine,
  routineOpen,
  categorizedElements,
}: RoutineProps) => {
  return (
    <div
      className={`routine ${routineOpen === 0 ? "routine--disabled" : ""} ${
        routineOpen === 1 ? "routine--side" : ""
      } ${routineOpen === 2 ? "routine--full" : ""}`}
    >
      <RoutineTable selectEvent={selectEvent} routine={routine} setRoutine={setRoutine} />
      <RoutineRules routine={routine} categorizedElements={categorizedElements} />
    </div>
  );
};

export default Routine;
