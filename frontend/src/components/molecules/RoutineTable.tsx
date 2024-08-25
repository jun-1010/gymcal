import { useEffect, useRef, useState } from "react";
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
import DeleteIcon from "@mui/icons-material/Delete";

interface RoutineTableProps {
  selectEvent: Events;
  routine: RoutineElement[];
  setRoutine: (routine: RoutineElement[]) => void;
  setRoutineOpen: React.Dispatch<React.SetStateAction<number>>;
}

const RoutineTable = ({ selectEvent, routine, setRoutine, setRoutineOpen }: RoutineTableProps) => {
  const [deleteMenuOpen, setDeleteMenuOpen] = useState(false);
  const deleteMenuRef = useRef<HTMLDivElement>(null);

  const handleClickOutside = (event: MouseEvent) => {
    if (deleteMenuRef.current && !deleteMenuRef.current.contains(event.target as Node)) {
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
                <p className="routine__delete-title">演技構成をリセットしますか？</p>
                <div className="routine__detete-textbox">
                  <div className="routine__delete-button" onClick={() => setDeleteMenuOpen(false)}>
                    キャンセル
                  </div>
                  <div
                    className="routine__delete-button routine__delete-button--alert"
                    onClick={() => {
                      setRoutine([]);
                      setDeleteMenuOpen(false);
                    }}
                  >
                    リセット
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
            <div className="routine__element routine__element--header">
              <span className="routine__item">No.</span>
              <span></span>
              <span className="routine__item">名前</span>
              <span className="routine__item">EG</span>
              <span className="routine__item routine__item--center">難度</span>
              <span className="routine__item">CV</span>
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
              className="routine__empty-button"
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
            <RoutineSummaryLabel score={calculateTotalScore(routine)} isActive={true} label="Dスコア" show={true} />
            <RoutineSummaryLabel
              score={calculateTotalElementGroupScore(routine)}
              isActive={false}
              label="EG"
              show={true}
            />
            <RoutineSummaryLabel score={calculateTotalDifficulty(routine)} isActive={false} label="難度" show={true} />
            <RoutineSummaryLabel
              score={calculateTotalConnectionValue(routine)}
              isActive={false}
              label="CV"
              show={selectEvent === Events.床 || selectEvent === Events.鉄棒}
            />
          </div>
          <div className="routine__summary">
            <RoutineSummaryLabel
              score={calculateNeutralDeduction(selectEvent, routine)}
              isActive={true}
              label="ND"
              show={true}
            />
            <RoutineSummaryLabel
              score={calculateElementCountDeduction(routine)}
              isActive={false}
              label="技数減点"
              show={true}
            />
            <RoutineSummaryLabel
              score={calculateMultipleSaltoShortage(routine)}
              isActive={false}
              label="ダブル系不足"
              show={selectEvent === Events.床}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default RoutineTable;
