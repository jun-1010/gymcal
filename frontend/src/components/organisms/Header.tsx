import { RoutineElement } from "../../utilities/RoutineUtil";
import { Events } from "../../utilities/Type";
import HeaderEventButtons from "../molecules/HeaderEventButtons";
import HeaderIcons from "../molecules/HeaderIcons";

interface HeaderProps {
  selectEvent: Events;
  setSelectEvent: React.Dispatch<React.SetStateAction<number>>;
  routineOpen: number;
  setRoutineOpen: React.Dispatch<React.SetStateAction<number>>;
  isMobile: boolean;
  routine: RoutineElement[];
}

const Header = ({ selectEvent, setSelectEvent, routineOpen, setRoutineOpen, isMobile, routine }: HeaderProps) => {
  return (
    <div className="header">
      <div className="header__left">
        <a className="header__title" href="./">
          {/* <img src="./icon_枠なし_透過.png" alt="" /> */}
          <p>GymCal</p>
        </a>
      </div>
      <HeaderEventButtons selectEvent={selectEvent} setSelectEvent={setSelectEvent} isMobile={isMobile} />
      <div className="header__right">
        <HeaderIcons
          routineOpen={routineOpen}
          setRoutineOpen={setRoutineOpen}
          isMobile={isMobile}
          badgeContent={routine.length}
        />
      </div>
    </div>
  );
};

export default Header;
