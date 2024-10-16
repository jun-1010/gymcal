import StyledBadge from "../atoms/StyledBadge";

interface ModeButtonsProps {
  displayMode: number;
  setDisplayMode: React.Dispatch<React.SetStateAction<number>>;
  isMobile: boolean;
  badgeContent: number;
}

const ModeButtons = ({ displayMode, setDisplayMode, isMobile, badgeContent }: ModeButtonsProps) => {
  return (
    <div className="mode-buttons">
      <div
        className={`mode-buttons__item ${displayMode === 0 ? "mode-buttons__item--active" : ""}`}
        onClick={() => setDisplayMode(0)}
      >
        <StyledBadge color="primary">難度表</StyledBadge>
      </div>
      {!isMobile ? (
        <div
          onClick={() => setDisplayMode(1)}
          className={`mode-buttons__item ${displayMode === 1 ? "mode-buttons__item--active" : ""}`}
        >
          <StyledBadge badgeContent={badgeContent} color="primary">
            ハーフ
          </StyledBadge>
        </div>
      ) : (
        <></>
      )}
      <div
        className={`mode-buttons__item ${displayMode === 2 ? "mode-buttons__item--active" : ""}`}
        onClick={() => setDisplayMode(2)}
      >
        <StyledBadge badgeContent={badgeContent} color="primary">
          構成表
        </StyledBadge>
      </div>
    </div>
  );
};

export default ModeButtons;
