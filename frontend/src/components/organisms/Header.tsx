import { RoutineElement } from "../../utilities/RoutineUtil";
import { Events } from "../../utilities/Type";
import EventButtons from "../EventButtons";
import HeaderIcons from "../HeaderIcons";

interface HeaderProps {
  selectEvent: Events;
  setSelectEvent: React.Dispatch<React.SetStateAction<number>>;
  routineOpen: number;
  setRoutineOpen: React.Dispatch<React.SetStateAction<number>>;
  isMobile: boolean;
  routine: RoutineElement[];
}

const Header = ({
  selectEvent,
  setSelectEvent,
  routineOpen,
  setRoutineOpen,
  isMobile,
  routine,
}: HeaderProps) => {
  return (
    <div className="header">
      {isMobile ? (
        <>
          <div className="header__left">
            <h1 className="header__title">
              <a href="/">GymCal</a>
            </h1>
            <EventButtons
              selectEvent={selectEvent}
              setSelectEvent={setSelectEvent}
              isMobile={isMobile}
            />
          </div>
          <div className="header__right">
            <HeaderIcons
              routineOpen={routineOpen}
              setRoutineOpen={setRoutineOpen}
              isMobile={isMobile}
              badgeContent={routine.length}
            />
          </div>
        </>
      ) : (
        <>
          <div className="header__left">
            <h1 className="header__title">
              <a href="/">GymCal</a>
            </h1>
          </div>
          <EventButtons
            selectEvent={selectEvent}
            setSelectEvent={setSelectEvent}
            isMobile={isMobile}
          />
          <div className="header__right">
            <HeaderIcons
              routineOpen={routineOpen}
              setRoutineOpen={setRoutineOpen}
              isMobile={isMobile}
              badgeContent={routine.length}
            />
          </div>
        </>
      )}
    </div>
  );
};

export default Header;