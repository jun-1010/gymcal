
import StyledBadge from "../atoms/StyledBadge";

interface ModeButtonsProps {
  routineOpen: number;
  setRoutineOpen: React.Dispatch<React.SetStateAction<number>>;
  isMobile: boolean;
  badgeContent: number;
}

const ModeButtons = ({ routineOpen, setRoutineOpen, isMobile, badgeContent }: ModeButtonsProps) => {
  return (
    <div className="mode-buttons">
      <div
        className={`mode-buttons__item ${routineOpen === 0 ? "mode-buttons__item--active" : ""}`}
        onClick={() => setRoutineOpen(0)}
      >
        <StyledBadge color="primary">難度表</StyledBadge>
      </div>
      {!isMobile ? (
        <div
          onClick={() => setRoutineOpen(1)}
          className={`mode-buttons__item ${routineOpen === 1 ? "mode-buttons__item--active" : ""}`}
        >
          <StyledBadge badgeContent={badgeContent} color="primary">
            ハーフ
          </StyledBadge>
        </div>
      ) : (
        <></>
      )}
      <div
        className={`mode-buttons__item ${routineOpen === 2 ? "mode-buttons__item--active" : ""}`}
        onClick={() => setRoutineOpen(2)}
      >
        <StyledBadge badgeContent={badgeContent} color="primary">
          構成表
        </StyledBadge>
      </div>
    </div>
  );
};

export default ModeButtons;
