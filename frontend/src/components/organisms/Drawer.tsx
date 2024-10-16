import { RoutineElement, Routines } from "../../utilities/RoutineUtil";
import { Events } from "../../utilities/Type";
import EventMenu from "../pages/EventMenu";

interface DrawerProps {
  selectEvent: Events;
  drawerOpen: boolean;
  isMobile: boolean;
  routines: Routines;
  setRoutine: React.Dispatch<React.SetStateAction<RoutineElement[]>>;
  setRoutines: React.Dispatch<React.SetStateAction<Routines>>;
  setSelectEvent: React.Dispatch<React.SetStateAction<number>>;
  setDrawerOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const Drawer = ({
  selectEvent,
  drawerOpen,
  isMobile,
  routines,
  setRoutine,
  setSelectEvent,
  setDrawerOpen,
  setRoutines,
}: DrawerProps) => {
  return (
    <div className={`drawer ${drawerOpen ? "drawer--open" : ""}`}>
      <EventMenu
        selectEvent={selectEvent}
        isMobile={isMobile}
        routines={routines}
        setRoutine={setRoutine}
        setRoutines={setRoutines}
        setSelectEvent={setSelectEvent}
        setDrawerOpen={setDrawerOpen}
      />
    </div>
  );
};

export default Drawer;
