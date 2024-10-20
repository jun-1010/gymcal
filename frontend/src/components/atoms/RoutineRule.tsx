import React from "react";
import { ElementStatus } from "../../utilities/Type";

interface RoutineRuleProps {
  elementStatus?: ElementStatus;
  detailOpens: number[];
  setDetailOpens: React.Dispatch<React.SetStateAction<number[]>>;
  summaryNode: React.ReactNode;
  descriptionNode: React.ReactNode;
  show: boolean;
}

const RoutineRule: React.FC<RoutineRuleProps> = ({
  elementStatus, // 24~36は24にまとめる
  detailOpens,
  setDetailOpens,
  summaryNode,
  descriptionNode,
  show,
}: RoutineRuleProps) => {
  return (
    <details
      className="rules__details"
      style={{ display: show ? "block" : "none" }}
      id={elementStatus?.toString()}
      open={elementStatus && detailOpens.includes(elementStatus)}
      onToggle={(e) => {
        const detailsElement = e.target as HTMLDetailsElement;
        const isDetailsOpen = detailsElement.open;

        // elementStatusが存在しない場合、何もしない
        if (!elementStatus) return;

        setDetailOpens((prevState) => {
          if (isDetailsOpen) {
            // elementStatusが存在しない場合のみ追加
            return prevState.includes(elementStatus) ? prevState : [...prevState, elementStatus];
          } else {
            // elementStatusが存在する場合のみ削除
            return prevState.filter((row) => row !== elementStatus);
          }
        });
      }}
    >
      <summary>
        {elementStatus && <span className="rules__summary-prefix">{elementStatus + "."}</span>}
        {summaryNode}
      </summary>
      {descriptionNode}
    </details>
  );
};

export default RoutineRule;
