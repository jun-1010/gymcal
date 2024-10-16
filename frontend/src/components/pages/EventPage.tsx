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
import { Events, Events_en } from "../../utilities/Type";
import { CategorizedElements, getGroupElements, GroupElements } from "../../utilities/ElementUtil";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import Drawer from "../organisms/Drawer";

interface EventPageProps {
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

const EventPage = ({
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
}: EventPageProps) => {
  const { eventType } = useParams<{ eventType: keyof typeof Events_en }>();
  const location = useLocation();
  const navigate = useNavigate();

  const [displayMode, setDisplayMode] = useState(isMobile ? 0 : 1); // 0:難度表 1:演技表&構成表 2:構成表
  const [hintNum, setHintNum] = useState(-1); // 選択できない技を選択しようとした時に原因のルール番号を格納する(ヒントの表示状態にも利用する)
  const [detailOpens, setDetailOpens] = useState([] as number[]); // 詳細表示中のルールの番号を格納する
  const [drawerOpen, setDrawerOpen] = useState(false); // PCモードで使用するドロワー開閉状態

  // URLの変更に対する処理
  useEffect(() => {
    if (typeof eventType !== "string" || !(eventType in Events_en)) {
      // 型ガード || 無効URL
      navigate(`/not-found`);
      return;
    }

    setSelectEvent(Events_en[eventType] as number);
    const currentPath = location.pathname.split("/")[1]; // 現在のパスを取得
    if (currentPath !== eventType) {
      // 現在のパスとeventTypeが異なる場合のみナビゲート
      navigate(`/${eventType}`);
    }
  }, [eventType, location]); // URLが変わった時(直接変更 or Appでのnavigate)

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
    if (isMobile && displayMode === 1) {
      setDisplayMode(0);
    }
  }, [isMobile]);

  return (
    <>
      {hintNum !== -1 && (
        <Hint
          hintNum={hintNum}
          setHintNum={setHintNum}
          setDisplayMode={setDisplayMode}
          isMobile={isMobile}
          setDetailOpens={setDetailOpens}
          routine={routine}
        />
      )}
      <div className={`main ${drawerOpen ? "main--drawer-open" : ""}`}>
        <Header
          selectEvent={selectEvent}
          setSelectEvent={setSelectEvent}
          displayMode={displayMode}
          setDisplayMode={setDisplayMode}
          isMobile={isMobile}
          routine={routine}
          routines={routines}
          drawerOpen={drawerOpen}
          setDrawerOpen={setDrawerOpen}
        />
        {Object.keys(groupElements).length ? (
          <div className="content">
            {/* 難度表 */}
            <Elements
              displayMode={displayMode}
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
              displayMode={displayMode}
              setDisplayMode={setDisplayMode}
              categorizedElements={categorizedElements}
              detailOpens={detailOpens}
              setDetailOpens={setDetailOpens}
              setRoutines={setRoutines}
            />
          </div>
        ) : (
          <div className="content__emplty">
            <p>技データが取得できません</p>
          </div>
        )}
      </div>
      {!isMobile && drawerOpen && (
        <Drawer
          selectEvent={selectEvent}
          drawerOpen={drawerOpen}
          isMobile={isMobile}
          routines={routines}
          setRoutine={setRoutine}
          setSelectEvent={setSelectEvent}
          setDrawerOpen={setDrawerOpen}
        />
      )}
    </>
  );
};

export default EventPage;
