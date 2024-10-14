import { Link } from "react-router-dom";
import { RoutineElement, Routines } from "../../utilities/RoutineUtil";
import { Events } from "../../utilities/Type";
import KeyboardArrowLeftIcon from "@mui/icons-material/KeyboardArrowLeft";
import MenuIcon from "@mui/icons-material/Menu";
import ModeButtons from "../molecules/ModeButtons";

interface HeaderProps {
  selectEvent: Events;
  setSelectEvent: React.Dispatch<React.SetStateAction<number>>;
  routineOpen: number;
  setRoutineOpen: React.Dispatch<React.SetStateAction<number>>;
  isMobile: boolean;
  routine: RoutineElement[];
  routines: Routines;
}

const Header = ({
  selectEvent,
  setSelectEvent,
  routineOpen,
  setRoutineOpen,
  isMobile,
  routine,
  routines,
}: HeaderProps) => {
  return (
    <div className="header">
      <div className="header__left">
        <Link className="header__title" to={"/"}>
          {isMobile ? <KeyboardArrowLeftIcon /> : <MenuIcon />}
          <p>{Events[selectEvent]}</p>
        </Link>
      </div>
      <ModeButtons
        routineOpen={routineOpen}
        setRoutineOpen={setRoutineOpen}
        isMobile={isMobile}
        badgeContent={routine.length}
      />
      <div className="header__right"></div>
    </div>
  );
};

export default Header;
