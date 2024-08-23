import {
  calculateElementCountDeduction,
  calculateMultipleSaltoShortage,
  calculateNeutralDeduction,
  calculateTotalConnectionValue,
  calculateTotalDifficulty,
  calculateTotalElementGroupScore,
  calculateTotalScore,
  RoutineElement,
} from "../../utilities/RoutineUtil";
import { Events } from "../../utilities/Type";
import RoutineSummaryLabel from "../atoms/RoutineSummaryLabel";
import RoutineTableElement from "../atoms/RoutineTableElement";

interface RoutineTableProps {
  selectEvent: Events;
  routine: RoutineElement[];
  setRoutine: (routine: RoutineElement[]) => void;
}

const RoutineTable = ({ selectEvent, routine, setRoutine }: RoutineTableProps) => {
  return (
    <>
      <div className="routine__title">演技構成表</div>
      <div className="routine__table">
        {routine.length ? (
          <div className="routine__elements">
            <div className="routine__element routine__element--header">
              <span className="routine__item">No.</span>
              <span></span>
              <span className="routine__item">名前</span>
              <span className="routine__item">EG</span>
              <span className="routine__item">難度</span>
              <span className="routine__item">CV</span>
            </div>
            {routine.map((element, index) => (
              <RoutineTableElement
                selectEvent={selectEvent}
                element={element}
                index={index}
                setRoutine={setRoutine}
                routine={routine}
              />
            ))}
          </div>
        ) : (
          <div>
            <p>演技構成はありません</p>
            <p>技を選択してください</p>
          </div>
        )}
        <div className="routine__summaries">
          <div className="routine__summary">
            {/* 合計Dスコア */}
            <RoutineSummaryLabel
              score={calculateTotalScore(routine)}
              isActive={true}
              label="Dスコア"
            />
            {/* グループ得点 */}
            <RoutineSummaryLabel
              score={calculateTotalElementGroupScore(routine)}
              isActive={false}
              label="EG"
            />
            {/* 難度点 */}
            <RoutineSummaryLabel
              score={calculateTotalDifficulty(routine)}
              isActive={false}
              label="難度"
            />
            {/* 組み合わせ加点 */}
            <RoutineSummaryLabel
              score={calculateTotalConnectionValue(routine)}
              isActive={false}
              label="CV"
            />
          </div>
          <div className="routine__summary">
            {/* ニュートラルディダクション */}
            <RoutineSummaryLabel
              score={calculateNeutralDeduction(routine)}
              isActive={true}
              label="ND"
            />
            {/* 技数減点 */}
            <RoutineSummaryLabel
              score={calculateElementCountDeduction(routine)}
              isActive={false}
              label="技数減点"
            />
            {/* ダブル系不足 */}
            <RoutineSummaryLabel
              score={calculateMultipleSaltoShortage(routine)}
              isActive={false}
              label="ダブル系不足"
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default RoutineTable;
