import { useNavigate } from "react-router-dom";
import { calculateOverallScore, calculateTotalScore, RoutineElement, Routines } from "../../utilities/RoutineUtil";
import { Events, Events_en } from "../../utilities/Type";
import KeyboardDoubleArrowLeftIcon from "@mui/icons-material/KeyboardDoubleArrowLeft";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import { calculateVTScore } from "../../utilities/RoutineVTUtil";
import RoutineDeleteModal from "./RoutineDeleteModal";

interface EventMenuProps {
  selectEvent: Events;
  isMobile: boolean;
  routines: Routines;
  setRoutine: React.Dispatch<React.SetStateAction<RoutineElement[]>>;
  setRoutines: React.Dispatch<React.SetStateAction<Routines>>;
  setSelectEvent: React.Dispatch<React.SetStateAction<number>>;
  setDrawerOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const EventMenu = ({ selectEvent, isMobile, routines, setRoutine, setRoutines, setSelectEvent, setDrawerOpen }: EventMenuProps) => {
  const navigate = useNavigate();

  // 型ガード関数
  const isValidEvent = (event: string | number): event is Events => typeof event === "number" && event in Events;

  const handleButtonClick = (event: string | Events) => {
    if (isValidEvent(event)) {
      setRoutine(routines[event]); // ここで格納しないとEventPageの初期読み込み時にroutineが空のためroutinesが初期化される
      setSelectEvent(event);
      navigate(`/${Events_en[event]}`);
    }
  };

  // スコア表示用のラベル生成
  const renderScoreLabel = (event: Events) => {
    const score = event === Events.跳馬 ? calculateVTScore(routines[event]) : calculateTotalScore(routines[event]);

    return score > 0 ? <div className="common__label common__label--active">{score.toFixed(1)}</div> : null;
  };

  return (
    <div className="event-menu">
      <div className="event-menu__header">
        <a href="./" className="event-menu__top-button">
          <img src="./icon_枠なし_透過.png" alt="サイトロゴ" className="event-menu__header-icon" />
          <p className="event-menu__header-title">GymCal</p>
        </a>
        <div
          className="event-menu__close"
          onClick={() => {
            setDrawerOpen(false);
          }}
        >
          {!isMobile && <KeyboardDoubleArrowLeftIcon />}
        </div>
      </div>

      <div className="event-menu__content">
        <div className="event-menu__total">
          <p className="event-menu__total-title">合計Dスコア</p>
          <p className="event-menu__total-score">{calculateOverallScore(routines).toFixed(1)}</p>
        </div>

        <div className="event-menu__section">
          <div className="event-menu__section-header">
            <p>種目</p>
            {/* {calculateOverallScore(routines) > 0 && (
              <RoutineDeleteModal
                selectEvent={selectEvent}
                setRoutine={setRoutine}
                setRoutines={setRoutines}
                allowIndividualReset={false} // ここで切り替え
              />
            )} */}
          </div>
          <div className="event-menu__list">
            {Object.entries(Events)
              .filter(([key]) => isNaN(Number(key))) // 数値キーを除外
              .map(([eventKey, event]) => (
                <div
                  key={event}
                  className={`event-menu__list-item ${
                    !isMobile && selectEvent === event && "event-menu__list-item--active"
                  }`}
                  onClick={() => handleButtonClick(event)}
                >
                  <div className="event-menu__list-item--block">
                    <div className="common__label event-menu__event-label">
                      {isValidEvent(event) && Events_en[event].toUpperCase()}
                    </div>
                    {eventKey}
                  </div>

                  <div className="event-menu__list-item--block">
                    {isValidEvent(event) && renderScoreLabel(event)}
                    <KeyboardArrowRightIcon />
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventMenu;
