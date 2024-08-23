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
            {calculateTotalScore(routine) > 0 ? (
              <p className="common__label common__label--active routine__summary-label">
                Dスコア: {calculateTotalScore(routine).toFixed(1)}
              </p>
            ) : (
              <></>
            )}
            {/* グループ得点 */}
            {calculateTotalElementGroupScore(routine) > 0 ? (
              <p className="common__label routine__summary-label">
                EG: {calculateTotalElementGroupScore(routine).toFixed(1)}
              </p>
            ) : (
              <></>
            )}
            {/* 難度点 */}
            {calculateTotalDifficulty(routine) > 0 ? (
              <p className="common__label routine__summary-label">
                難度: {calculateTotalDifficulty(routine).toFixed(1)}
              </p>
            ) : (
              <></>
            )}
            {/* 組み合わせ加点 */}
            {calculateTotalConnectionValue(routine) > 0 ? (
              <p className="common__label routine__summary-label">
                CV: {calculateTotalConnectionValue(routine).toFixed(1)}
              </p>
            ) : (
              <></>
            )}
          </div>
          <div className="routine__summary">
            {/* ニュートラルディダクション */}
            {calculateNeutralDeduction(routine) > 0 ? (
              <p className="common__label common__label--active routine__summary-label">
                ND:{calculateNeutralDeduction(routine).toFixed(1)}
              </p>
            ) : (
              <></>
            )}
            {/* 技数減点 */}
            {calculateElementCountDeduction(routine) > 0 ? (
              <p className="common__label routine__summary-label">
                技数減点: {calculateElementCountDeduction(routine).toFixed(1)}
              </p>
            ) : (
              <></>
            )}
            {/* ダブル系不足 */}
            {calculateMultipleSaltoShortage(routine) > 0 ? (
              <p className="common__label routine__summary-label">
                ダブル系不足: {calculateMultipleSaltoShortage(routine).toFixed(1)}
              </p>
            ) : (
              <></>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default RoutineTable;
