import { isConnectable, RoutineElement } from "../../utilities/RoutineUtil";
import AddIcon from "@mui/icons-material/Add";
import AddBoxIcon from "@mui/icons-material/AddBox";
import CloseIcon from "@mui/icons-material/Close";
import { difficulties, element_groups, Events } from "../../utilities/Type";

interface RoutineTableElementProps {
  selectEvent: Events;
  element: RoutineElement;
  index: number;
  setRoutine: (routine: RoutineElement[]) => void;
  routine: RoutineElement[];
}
const RoutineTableElement = ({
  selectEvent,
  element,
  index,
  setRoutine,
  routine,
}: RoutineTableElementProps) => {
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
      return;
    }

    // 組み合わせが適切なら組み合わせを有効化
    if (isConnectable(selectEvent, routine, element, index)) {
      updateRoutine({ ...element, is_connected: true });
      return;
    }
  };

  return (
    <div className="routine__element" key={element.id}>
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
        {element.code ? `${element.code}.` : ""}
        {element.alias ? element.alias : element.name}
      </span>
      <span className="routine__item">
        {element_groups[element.element_group - 1]}
        {element.element_group_score! > 0
          ? `(${element.element_group_score?.toFixed(1)})`
          : ``}
      </span>
      <span className="routine__item routine__item--center">
        {difficulties[element.difficulty - 1]}
      </span>
      <span className="routine__item">{element.connection_value}</span>
      <span className="routine__item routine__icon">
        <CloseIcon
          sx={{
            fontSize: "1rem",
          }}
          onClick={() => {
            console.log(routine.filter((e) => e !== element));
            setRoutine(routine.filter((e) => e !== element));
          }}
        />
      </span>
    </div>
  );
};

export default RoutineTableElement;
