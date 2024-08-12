import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import { Events, getEventKey, getGroupName, GroupNames } from "../Type";
import { useEffect } from "react";

type GroupTabProps = {
  selectEvent: number;
  selectGroup: number;
  setSelectGroup: React.Dispatch<React.SetStateAction<number>>;
};

const GroupTabs = ({
  selectEvent,
  selectGroup,
  setSelectGroup,
}: GroupTabProps) => {
  return (
    <div className="group-tabs">
      {GroupNames[selectEvent] && Object.keys(GroupNames[selectEvent]).map((groupKey) => (
        <div
          key={groupKey}
          className={`group-tabs__item ${
            selectGroup === parseInt(groupKey) ? "group-tabs__item--active" : ""
          }`}
          onClick={() => setSelectGroup(parseInt(groupKey))}
        >
          {getGroupName(selectEvent, parseInt(groupKey))}
        </div>
      ))}
    </div>
  );
};

export default GroupTabs;
