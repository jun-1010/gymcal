interface RoutineSummaryLabelProps {
  score: number;
  isActive: boolean;
  label: string;
}

const RoutineSummaryLabel = ({ score, isActive, label }: RoutineSummaryLabelProps) => {
  return (
    <>
      {score > 0 ? (
        <p className={`common__label ${isActive ? "common__label--active" : ""} routine__summary-label`}>
          {label}: {score.toFixed(1)}
        </p>
      ) : (
        <></>
      )}
    </>
  );
};

export default RoutineSummaryLabel;
