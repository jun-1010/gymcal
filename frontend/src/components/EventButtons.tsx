import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import { Events, getEventKey, getGroupName, GroupNames } from "../Type";

type EventTabProps = {
  selectEvent: number;
  setSelectEvent: React.Dispatch<React.SetStateAction<number>>;
};

const EventTabs = ({ selectEvent, setSelectEvent }: EventTabProps) => {
  return (
    <div className="event-buttons">
      {Object.entries(Events)
        .filter(([eventKey, event]) => typeof event === "number")
        .map(([eventKey, event]) => (
          <div
            key={eventKey}
            className={`event-buttons__item ${
              selectEvent === event ? "event-buttons__item--active" : ""
            }`}
            onClick={() => {
              setSelectEvent(event as number);
            }}
          >
            {eventKey}
          </div>
        ))}
    </div>
  );
};

export default EventTabs;
