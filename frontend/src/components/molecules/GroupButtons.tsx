import { getGroupName, GroupNames } from "../../utilities/Type";

type GroupButtonsProps = {
  selectEvent: number;
  selectGroup: number;
  setSelectGroup: React.Dispatch<React.SetStateAction<number>>;
};

const GroupButtons = ({
  selectEvent,
  selectGroup,
  setSelectGroup,
}: GroupButtonsProps) => {
  return (
    <div className="elements__header">
      <div className="group-tabs">
        {GroupNames[selectEvent] &&
          Object.keys(GroupNames[selectEvent]).map((groupKey) => (
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
    </div>
  );
};

export default GroupButtons;
