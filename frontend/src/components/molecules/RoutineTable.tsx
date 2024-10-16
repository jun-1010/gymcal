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
import { ElementStatus, Events, getEventKey, hasCVEvents, RuleName, Rules } from "../../utilities/Type";
import RoutineSummaryLabel from "../atoms/RoutineSummaryLabel";
import RoutineTableElement from "../atoms/RoutineTableElement";
import DeleteIcon from "@mui/icons-material/Delete";
import { calculateMultipleSaltoShortage } from "../../utilities/RoutineFXUtil";
import { calculateSwingHandstandShortage } from "../../utilities/RoutineSRUtil";
import { calculateVTScore } from "../../utilities/RoutineVTUtil";
import WarningIcon from "@mui/icons-material/Warning";
import RoutineDeleteModal from "../pages/RoutineDeleteModal";

interface RoutineTableProps {
  selectEvent: Events;
  routine: RoutineElement[];
  setRoutine: React.Dispatch<React.SetStateAction<RoutineElement[]>>;
  setDisplayMode: React.Dispatch<React.SetStateAction<number>>;
  setRoutines: React.Dispatch<React.SetStateAction<Routines>>;
}

const RoutineTable = ({ selectEvent, routine, setRoutine, setDisplayMode, setRoutines }: RoutineTableProps) => {
  return (
    <>
      <div className="routine__title-box">
        <div className="routine__title" id={ElementStatus.選択可能.toString()}>
          演技構成表
        </div>
        {routine.length > 0 && (
          <RoutineDeleteModal
            selectEvent={selectEvent}
            setRoutine={setRoutine}
            setRoutines={setRoutines}
            allowIndividualReset={true} // ここで切り替え
          />
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
                setDisplayMode(0);
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
