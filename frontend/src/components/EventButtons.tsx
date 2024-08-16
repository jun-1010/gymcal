import { useEffect, useRef, useState } from "react";
import { Events, getEventKey, getGroupName, GroupNames } from "../Type";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";

type EventTabProps = {
  selectEvent: number;
  setSelectEvent: React.Dispatch<React.SetStateAction<number>>;
  isMobile: boolean;
};

const EventTabs = ({ selectEvent, setSelectEvent, isMobile }: EventTabProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleSelect = (event: number) => {
    setSelectEvent(event);
    setIsOpen(false);
  };

  const handleClickOutside = (event: MouseEvent) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <>
      {isMobile ? (
        <div className="event-dropdown" ref={dropdownRef}>
          <div className="event-dropdown__selected" onClick={() => setIsOpen(!isOpen)}>
            <span className="event-dropdown__text">
              {Object.keys(Events)
                .filter((eventKey) => typeof eventKey === "string")
                .find((eventKey) => eventKey === getEventKey(selectEvent))}
            </span>
            <span
              className={`event-dropdown__icon ${
                isOpen ? "event-dropdown__icon--open" : ""
              }`}
            >
              <KeyboardArrowUpIcon />
            </span>
          </div>
          {isOpen && (
            <div className="event-dropdown__menu">
              {Object.entries(Events)
                .filter(
                  ([eventKey, event]) =>
                    typeof event === "number" && event !== selectEvent
                )
                .map(([eventKey, event]) => (
                  <div
                    key={eventKey}
                    className={`event-dropdown__item ${
                      selectEvent === event ? "event-dropdown__item--active" : ""
                    }`}
                    onClick={() => handleSelect(event as number)}
                  >
                    {eventKey}
                  </div>
                ))}
            </div>
          )}
        </div>
      ) : (
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
      )}
    </>
  );
};

export default EventTabs;
