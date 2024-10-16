import { Link } from "react-router-dom";
import { calculateTotalScore, RoutineElement, Routines } from "../../utilities/RoutineUtil";
import { Events } from "../../utilities/Type";
import KeyboardArrowLeftIcon from "@mui/icons-material/KeyboardArrowLeft";
import MenuIcon from "@mui/icons-material/Menu";
import ModeButtons from "../molecules/ModeButtons";

interface HeaderProps {
  selectEvent: Events;
  setSelectEvent: React.Dispatch<React.SetStateAction<number>>;
  displayMode: number;
  setDisplayMode: React.Dispatch<React.SetStateAction<number>>;
  isMobile: boolean;
  routine: RoutineElement[];
  routines: Routines;
  drawerOpen: boolean;
  setDrawerOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const Header = ({
  selectEvent,
  setSelectEvent,
  displayMode,
  setDisplayMode,
  isMobile,
  routine,
  routines,
  drawerOpen,
  setDrawerOpen,
}: HeaderProps) => {
  return (
    <div className="header">
      <div className="header__left">
        {isMobile ? (
          <Link className="header__title" to={"/"}>
            <KeyboardArrowLeftIcon />
            <p>{Events[selectEvent]}</p>
          </Link>
        ) : (
          <div
            className="header__title"
            onClick={() => {
              setDrawerOpen((prevState) => !prevState);
            }}
          >
            {!drawerOpen && <MenuIcon />}
            <p>{Events[selectEvent]}</p>
          </div>
        )}
      </div>
      <ModeButtons
        displayMode={displayMode}
        setDisplayMode={setDisplayMode}
        isMobile={isMobile}
        badgeContent={routine.length}
      />
      <div className="header__right">
      </div>
    </div>
  );
};

export default Header;
