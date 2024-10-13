import { useEffect, useState } from "react";
import Elements from "../organisms/Elements";
import Header from "../organisms/Header";
import Hint from "../organisms/Hint";
import Routine from "../organisms/Routine";
import {
  RoutineElement,
  Routines,
  updateConnectionInRoutine,
  updateElementGroupScoreInRoutine,
  updateRoutineForValidation,
} from "../../utilities/RoutineUtil";
import { Events } from "../../utilities/Type";
import { CategorizedElements, getGroupElements, GroupElements } from "../../utilities/ElementUtil";

interface MainContentProps {
  routineOpen: number;
  setRoutineOpen: React.Dispatch<React.SetStateAction<number>>;
  isMobile: boolean;
  routine: RoutineElement[];
  setRoutine: React.Dispatch<React.SetStateAction<RoutineElement[]>>;
  selectEvent: Events;
  setSelectEvent: React.Dispatch<React.SetStateAction<number>>;
  routines: Routines;
  setRoutines: React.Dispatch<React.SetStateAction<Routines>>;

  selectGroup: number;
  setSelectGroup: React.Dispatch<React.SetStateAction<number>>;
  groupElements: GroupElements;
  setGroupElements: React.Dispatch<React.SetStateAction<GroupElements>>;
  categorizedElements: CategorizedElements;
  isInitialized: boolean;
}

const MainContent = ({
  routineOpen,
  setRoutineOpen,
  isMobile,
  routine,
  setRoutine,
  selectEvent,
  setSelectEvent,
  selectGroup,
  setSelectGroup,
  routines,
  setRoutines,
  groupElements,
  setGroupElements,
  categorizedElements,
  isInitialized,
}: MainContentProps) => {
  const [hintNum, setHintNum] = useState(-1); // 選択できない技を選択しようとした時に原因のルール番号を格納する(ヒントの表示状態にも利用する)
  const [detailOpens, setDetailOpens] = useState([] as number[]); // 詳細表示中のルールの番号を格納する

  // グループが変更された場合
  useEffect(() => {
    // 表示する技を更新する
    setGroupElements(getGroupElements(categorizedElements, selectEvent, selectGroup));
    localStorage.setItem("selectGroup", selectGroup.toString());
  }, [selectGroup]);

  // 演技構成が変更された場合
  useEffect(() => {
    if (!isInitialized) {
      return;
    }
    // 無効技が発生するケースを想定
    updateRoutineForValidation(selectEvent, routine, setRoutine);
    // グループ得点を更新する
    updateElementGroupScoreInRoutine(selectEvent, routine, setRoutine);
    // 組み合わせ加点を更新する
    updateConnectionInRoutine(selectEvent, routine, setRoutine);
    // routinesを更新する
    setRoutines({
      ...routines,
      [selectEvent]: routine,
    } as Routines);
  }, [routine]);

  // routinesが変更されたときにlocalStorageに保存する
  useEffect(() => {
    // routineをユーザーが変更した場合
    if (isInitialized) {
      localStorage.setItem("routines", JSON.stringify(routines));
    } else {
      // localStorageからroutinesにデータが格納された場合
      // ガード節:routinesに未反映の場合を除外する
      if (routines[selectEvent].length === 0) {
        return;
      }
      setRoutine(routines[selectEvent]);
    }
  }, [routines]);

  // 画面幅変更時（PC→SP）にside modeの場合
  useEffect(() => {
    if (isMobile && routineOpen === 1) {
      setRoutineOpen(0);
    }
  }, [isMobile]);

  return (
    <>
      {hintNum !== -1 && (
        <Hint
          hintNum={hintNum}
          setHintNum={setHintNum}
          setRoutineOpen={setRoutineOpen}
          isMobile={isMobile}
          setDetailOpens={setDetailOpens}
          routine={routine}
        />
      )}
      <Header
        selectEvent={selectEvent}
        setSelectEvent={setSelectEvent}
        routineOpen={routineOpen}
        setRoutineOpen={setRoutineOpen}
        isMobile={isMobile}
        routine={routine}
        routines={routines}
      />
      {Object.keys(groupElements).length ? (
        <div className="main">
          {/* 難度表 */}
          <Elements
            routineOpen={routineOpen}
            selectEvent={selectEvent}
            selectGroup={selectGroup}
            setSelectGroup={setSelectGroup}
            groupElements={groupElements}
            routine={routine}
            setRoutine={setRoutine}
            setHintNum={setHintNum}
            isMobile={isMobile}
          />
          {/* 演技構成表 */}
          <Routine
            selectEvent={selectEvent}
            routine={routine}
            setRoutine={setRoutine}
            routineOpen={routineOpen}
            setRoutineOpen={setRoutineOpen}
            categorizedElements={categorizedElements}
            detailOpens={detailOpens}
            setDetailOpens={setDetailOpens}
            setRoutines={setRoutines}
          />
        </div>
      ) : (
        <div className="main__emplty">
          <p>技データが取得できません🙇</p>
        </div>
      )}
    </>
  );
};

export default MainContent;
