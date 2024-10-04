import { useEffect, useRef, useState } from "react";
import {
  calculateElementCountDeduction,
  calculateNeutralDeduction,
  calculateTotalConnectionValue,
  calculateTotalDifficulty,
  calculateTotalElementGroupScore,
  calculateTotalScore,
  initialRoutines,
  RoutineElement,
  Routines,
} from "../../utilities/RoutineUtil";
import { Events, getEventKey, hasCVEvents, RuleName, Rules } from "../../utilities/Type";
import RoutineSummaryLabel from "../atoms/RoutineSummaryLabel";
import RoutineTableElement from "../atoms/RoutineTableElement";
import DeleteIcon from "@mui/icons-material/Delete";
import { calculateMultipleSaltoShortage } from "../../utilities/RoutineFXUtil";
import { calculateSwingHandstandShortage } from "../../utilities/RoutineSRUtil";
import { calculateVTScore } from "../../utilities/RoutineVTUtil";
import WarningIcon from "@mui/icons-material/Warning";

interface RoutineTableProps {
  selectEvent: Events;
  routine: RoutineElement[];
  setRoutine: (routine: RoutineElement[]) => void;
  setRoutineOpen: React.Dispatch<React.SetStateAction<number>>;
  setRoutines: React.Dispatch<React.SetStateAction<Routines>>;
}

const RoutineTable = ({ selectEvent, routine, setRoutine, setRoutineOpen, setRoutines }: RoutineTableProps) => {
  const [deleteMenuOpen, setDeleteMenuOpen] = useState(false);
  const deleteMenuRef = useRef<HTMLDivElement>(null);
  const [resetTarget, setResetTarget] = useState(0);
  const [resetErrorMessage, setResetErrorMessage] = useState("");

  const handleClickOutside = (event: MouseEvent) => {
    if (deleteMenuRef.current && !deleteMenuRef.current.contains(event.target as Node)) {
      setResetTarget(0);
      setResetErrorMessage("");
      setDeleteMenuOpen(false);
    }
  };

  // メニューの外側をクリックしたらメニューを閉じる
  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <>
      <div className="routine__title-box">
        <div className="routine__title">演技構成表</div>
        {routine.length ? (
          <div className="routine__delete" ref={deleteMenuRef}>
            <span className="routine__delete-icon">
              <DeleteIcon onClick={() => setDeleteMenuOpen(!deleteMenuOpen)} />
            </span>
            {deleteMenuOpen && (
              <div className="routine__delete-menu">
                <p className="routine__delete-title">演技構成のリセット</p>
                <p>リセットする対象を選んでください</p>
                <p className="routine__delete-line" />
                <label className="routine__delete-label">
                  <input
                    type="radio"
                    name="resetTarget"
                    value="1"
                    defaultChecked={false}
                    onChange={() => setResetTarget(1)}
                  />
                  <p>{getEventKey(selectEvent)}の演技構成</p>
                </label>
                <label className="routine__delete-label">
                  <input
                    type="radio"
                    name="resetTarget"
                    value="2"
                    defaultChecked={false}
                    onChange={() => setResetTarget(2)}
                  />
                  <p>全種目の演技構成</p>
                </label>
                {resetErrorMessage !== "" && <p className="routine__delete-alert">{resetErrorMessage}</p>}
                <p className="routine__delete-line" />
                <table className="common__table routine__delete-table">
                  <tbody>
                    <tr className="common__table-row">
                      <td className="common__table-cell">
                        <WarningIcon color="error"/>
                        この操作は元に戻せません
                      </td>
                    </tr>
                  </tbody>
                </table>
                <div className="routine__delete-button-box">
                  <div
                    className="routine__delete-button"
                    onClick={() => {
                      setResetTarget(0);
                      setDeleteMenuOpen(false);
                    }}
                  >
                    キャンセル
                  </div>
                  <div
                    className="routine__delete-button routine__delete-button--alert"
                    onClick={() => {
                      if (resetTarget === 0) {
                        setResetErrorMessage("リセットする対象を選んでください");
                        return;
                      } else if (resetTarget === 2) {
                        setRoutines(initialRoutines);
                      }
                      // 1,2共通処理
                      setResetTarget(0);
                      setResetErrorMessage("");
                      setRoutine([]);
                      setDeleteMenuOpen(false);
                    }}
                  >
                    リセットする
                  </div>
                </div>
              </div>
            )}
          </div>
        ) : (
          <></>
        )}
      </div>
      <div className="routine__table">
        {routine.length ? (
          <div className="routine__elements">
            <div
              className={`routine__element routine__element--header ${
                hasCVEvents(selectEvent) && "routine__element--with-cv"
              }`}
            >
              <span className={`routine__item`}>No.</span>
              <span></span>
              <span className={`routine__item`}>名前</span>
              <span className={`routine__item ${selectEvent === Events.跳馬 ? "routine__item--hidden" : ""}`}>EG</span>
              <span className="routine__item routine__item--center">難度</span>
              <span className={`routine__item ${!hasCVEvents(selectEvent) && "routine__item--hidden"}`}>CV</span>
            </div>
            {routine.map((element, index) => (
              <RoutineTableElement
                selectEvent={selectEvent}
                element={element}
                index={index}
                setRoutine={setRoutine}
                routine={routine}
                key={element.id}
              />
            ))}
          </div>
        ) : (
          <div className="routine__empty-box">
            <div className="routine__empty-message-box">
              <p className="routine__empty-message--bold">まだ技を選択していません。</p>
              <p className="routine__empty-message--small">難度表から技を選択しましょう！</p>
            </div>
            <div
              className="common__button"
              onClick={() => {
                setRoutineOpen(0);
              }}
            >
              難度表を見る
            </div>
          </div>
        )}
        <div className="routine__summaries">
          <div className="routine__summary">
            <RoutineSummaryLabel
              score={calculateTotalScore(routine)}
              isActive={true}
              label="Dスコア"
              show={selectEvent !== Events.跳馬}
            />
            <RoutineSummaryLabel
              score={calculateVTScore(routine)}
              isActive={true}
              label={`${routine.length === 2 ? "平均" : ""}Dスコア`}
              show={selectEvent === Events.跳馬}
            />
            <RoutineSummaryLabel
              score={calculateTotalElementGroupScore(routine)}
              isActive={false}
              label="EG"
              show={selectEvent !== Events.跳馬}
            />
            <RoutineSummaryLabel
              score={calculateTotalDifficulty(routine)}
              isActive={false}
              label="難度"
              show={selectEvent !== Events.跳馬}
            />
            <RoutineSummaryLabel
              score={calculateTotalConnectionValue(routine)}
              isActive={false}
              label="CV"
              show={hasCVEvents(selectEvent)}
            />
          </div>
          <div className="routine__summary">
            <RoutineSummaryLabel
              score={calculateNeutralDeduction(selectEvent, routine)}
              isActive={true}
              label="ND"
              show={selectEvent !== Events.跳馬}
            />
            <RoutineSummaryLabel
              score={calculateElementCountDeduction(routine)}
              isActive={false}
              label={RuleName(Rules.技数減点)}
              show={selectEvent !== Events.跳馬}
            />
            <RoutineSummaryLabel
              score={calculateMultipleSaltoShortage(routine)}
              isActive={false}
              label={RuleName(Rules.床_ダブル系不足)}
              show={selectEvent === Events.床}
            />
            <RoutineSummaryLabel
              score={calculateSwingHandstandShortage(routine)}
              isActive={false}
              label={RuleName(Rules.つり輪_振動倒立不足)}
              show={selectEvent === Events.つり輪}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default RoutineTable;
