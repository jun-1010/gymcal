import { useEffect, useRef, useState } from "react";
import { Events, getEventKey } from "../../utilities/Type";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import { Routines } from "../../utilities/RoutineUtil";

type HeaderEventButtonsProps = {
  selectEvent: number;
  setSelectEvent: React.Dispatch<React.SetStateAction<number>>;
  isMobile: boolean;
  routines: Routines;
};

const HeaderEventButtons = ({ selectEvent, setSelectEvent, isMobile, routines }: HeaderEventButtonsProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [routineLengths, setRoutineLengths] = useState([] as number[]);

  // 初期読み込み
  useEffect(() => {
    const newRoutineLengths = Object.entries(routines).map(([event, routine]) => {
      return routine.length;
    });
    setRoutineLengths(newRoutineLengths);
  }, [routines]);

  const handleSelect = (event: number) => {
    setSelectEvent(event);
    setIsOpen(false);
  };

  const handleClickOutside = (event: MouseEvent) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
      setIsOpen(false);
    }
  };

  // メニューの外側をクリックしたらメニューを閉じる
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
            <div className="event-dropdown__item">
              <span className="event-dropdown__text">
                {Object.keys(Events)
                  .filter((eventKey) => typeof eventKey === "string")
                  .find((eventKey) => eventKey === getEventKey(selectEvent))}
              </span>
              <span className={`event-dropdown__icon ${isOpen ? "event-dropdown__icon--open" : ""}`}>
                <KeyboardArrowDownIcon />
              </span>
            </div>
          </div>
          {isOpen && (
            <div className="event-dropdown__menu">
              {Object.entries(Events)
                .filter(([eventKey, event]) => typeof event === "number")
                .map(([eventKey, event]) => (
                  <div
                    key={eventKey}
                    className={`event-dropdown__item ${selectEvent === event && "event-dropdown__item--active"}`}
                    onClick={() => handleSelect(event as number)}
                  >
                    <span className="event-dropdown__text">{eventKey}</span>
                    <span
                      className={`event-dropdown__badge ${selectEvent === event && "event-dropdown__badge--active"}`}
                    >
                      {routineLengths[(event as number) - 1] || ""}
                    </span>
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
                className={`event-buttons__item ${selectEvent === event ? "event-buttons__item--active" : ""}`}
                onClick={() => {
                  setSelectEvent(event as number);
                }}
              >
                {eventKey}
                {routineLengths[(event as number) - 1] > 0 && (
                  <span className={`event-buttons__badge ${selectEvent === event && "event-buttons__badge--active"}`}>
                    {/* {routineLengths[(event as number) - 1] ? `(${routineLengths[(event as number) - 1]})` : ""} */}
                    {routineLengths[(event as number) - 1]}
                  </span>
                )}
              </div>
            ))}
        </div>
      )}
    </>
  );
};

export default HeaderEventButtons;
