import { isConnectable, RoutineElement } from "../../utilities/RoutineUtil";
import AddIcon from "@mui/icons-material/Add";
import AddBoxIcon from "@mui/icons-material/AddBox";
import CloseIcon from "@mui/icons-material/Close";
import { difficulties, element_groups, ElementGroup, Events, hasCVEvents } from "../../utilities/Type";

interface RoutineTableElementProps {
  selectEvent: Events;
  element: RoutineElement;
  index: number;
  setRoutine: (routine: RoutineElement[]) => void;
  routine: RoutineElement[];
}
const RoutineTableElement = ({ selectEvent, element, index, setRoutine, routine }: RoutineTableElementProps) => {
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

  // 無効技を飛ばしたindex
  let validIndex = -1;
  routine
    .filter((e) => e.is_qualified)
    .forEach((e, i) => {
      if (e.id === element.id) {
        validIndex = i;
      }
    });

  return (
    <div
      className={`routine__element 
        ${hasCVEvents(selectEvent) && "routine__element--with-cv"} 
        ${element.is_qualified ? "" : "routine__element--unqualified"}`}
      key={element.id}
    >
      {/* No. */}
      <span className={`routine__item`}>{validIndex === -1 ? "" : validIndex + 1}</span>
      {/* 組み合わせボタン */}
      <span
        className={`routine__item routine__icon ${element.is_connected ? "routine__icon--active" : ""}`}
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
      {/* 名前 */}
      <span className={`routine__item`}>
        {element.code ? `${element.code}.` : ""}
        {element.alias ? element.alias : element.name}
      </span>
      {/* EG */}
      <span className={`routine__item ${selectEvent === Events.跳馬 && "routine__item--hidden"}`}>
        {element_groups[element.element_group - 1]}
        {element.element_group_score! > 0 ? `(${element.element_group_score?.toFixed(1)})` : ``}
      </span>
      {/* 難度 */}
      <span className="routine__item routine__item--center">
        {selectEvent === Events.跳馬 ? (element.difficulty / 10).toFixed(1) : difficulties[element.difficulty - 1]}
      </span>
      {/* CV */}
      <span className={`routine__item ${!hasCVEvents(selectEvent) && "routine__item--hidden"}`}>
        {element.connection_value}
      </span>
      {/* 削除ボタン */}
      <span className="routine__item routine__icon">
        <CloseIcon
          sx={{
            fontSize: "1rem",
          }}
          onClick={() => {
            setRoutine(routine.filter((e) => e !== element));
          }}
        />
      </span>
    </div>
  );
};

export default RoutineTableElement;
