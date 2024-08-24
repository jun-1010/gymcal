import React from "react";

interface RoutineRuleProps {
  summaryNode: React.ReactNode;
  descriptionNode: React.ReactNode;
  show: boolean;
}

const RoutineRule: React.FC<RoutineRuleProps> = ({
  summaryNode,
  descriptionNode,
  show,
}: RoutineRuleProps) => {
  return (
    <details className="rules__details" style={{ display: show ? "block" : "none" }}>
      <summary>{summaryNode}</summary>
      {descriptionNode}
    </details>
  );
};

export default RoutineRule;
