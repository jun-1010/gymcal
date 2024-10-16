import { RoutineElement, Routines } from "../../utilities/RoutineUtil";
import { Events } from "../../utilities/Type";
import EventMenu from "../pages/EventMenu";

interface DrawerProps {
  selectEvent: Events;
  drawerOpen: boolean;
  isMobile: boolean;
  routines: Routines;
  setRoutine: React.Dispatch<React.SetStateAction<RoutineElement[]>>;
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
}: DrawerProps) => {
  return (
    <div className={`drawer ${drawerOpen ? "drawer--open" : ""}`}>
      <EventMenu
        selectEvent={selectEvent}
        isMobile={isMobile}
        routines={routines}
        setRoutine={setRoutine}
        setSelectEvent={setSelectEvent}
        setDrawerOpen={setDrawerOpen}
      />
    </div>
  );
};

export default Drawer;
