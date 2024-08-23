import {
  calculateElementCountDeduction,
  calculateMultipleSaltoShortage,
  calculateNeutralDeduction,
  calculateTotalConnectionValue,
  calculateTotalDifficulty,
  calculateTotalElementGroupScore,
  calculateTotalScore,
  isConnectable,
  RoutineElement,
} from "../../utilities/RoutineUtil";
import AddIcon from "@mui/icons-material/Add";
import AddBoxIcon from "@mui/icons-material/AddBox";
import CloseIcon from "@mui/icons-material/Close";
import { difficulties, element_groups, Events } from "../../utilities/Type";

interface RoutineTableProps {
  selectEvent: Events;
  routine: RoutineElement[];
  setRoutine: (routine: RoutineElement[]) => void;
}

const RoutineTable = ({selectEvent, routine, setRoutine }: RoutineTableProps) => {
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
      return; // handleConnectionClick()の終了
    }

    // 組み合わせが適切なら組み合わせを有効化
    if (isConnectable(selectEvent, routine, element, index)) {
      updateRoutine({ ...element, is_connected: true });
      return; // handleConnectionClick()の終了
    }
  };

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
              <div className="routine__element" key={element.name}>
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
                  {element.code}.{element.alias ? element.alias : element.name}
                </span>
                <span className="routine__item">
                  {element_groups[element.element_group - 1]}
                  {element.element_group_score! > 0
                    ? `(${element.element_group_score?.toFixed(1)})`
                    : ``}
                </span>
                <span className="routine__item">
                  {difficulties[element.difficulty - 1]}
                </span>
                <span className="routine__item">{element.connection_value}</span>
                <span className="routine__item routine__icon">
                  <CloseIcon
                    sx={{
                      fontSize: "1rem",
                    }}
                    onClick={() => setRoutine(routine.filter((e) => e !== element))}
                  />
                </span>
              </div>
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
