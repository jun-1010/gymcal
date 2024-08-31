interface RoutineSummaryLabelProps {
  score: number;
  isActive: boolean;
  label: string;
  show: boolean;
}

const RoutineSummaryLabel = ({ score, isActive, label, show }: RoutineSummaryLabelProps) => {
  return (
    <>
      {show && score > 0 ? (
        <p className={`common__label ${isActive ? "common__label--active" : ""} `}>
          {label}: {score.toFixed(1)}
        </p>
      ) : (
        <></>
      )}
    </>
  );
};

export default RoutineSummaryLabel;
