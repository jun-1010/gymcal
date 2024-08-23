import { Events } from "../../utilities/Type";
import { RoutineElement } from "../../utilities/RoutineUtil";
import { GroupElements } from "../../utilities/ElementUtil";
import ElementsTile from "../atoms/ElementsTile";

interface elementsGroupProps {
  selectEvent: Events;
  groupElements: GroupElements;
  setRoutine: (routine: RoutineElement[]) => void;
  routine: RoutineElement[];
}
const ElementsGroup = ({
  selectEvent,
  groupElements,
  setRoutine,
  routine,
}: elementsGroupProps) => {
  return (
    <div className="elements__group">
      {Object.entries(groupElements as Object).map(([rowKey, rowElements]) => (
        <div className="elements__row" key={rowKey}>
          {Object.entries(rowElements as Object).map(([column_number, element]) => (
            <ElementsTile
              selectEvent={selectEvent}
              element={element}
              setRoutine={setRoutine}
              routine={routine}
              elementsTileKey={`${rowKey}-${column_number}`}
              key={`${rowKey}-${column_number}`}
            />
          ))}
        </div>
      ))}
    </div>
  );
};

export default ElementsGroup;
