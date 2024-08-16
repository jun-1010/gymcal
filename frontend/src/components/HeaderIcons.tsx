import VerticalSplitIcon from "@mui/icons-material/VerticalSplit";
import ViewModuleIcon from "@mui/icons-material/ViewModule";
import ReorderIcon from "@mui/icons-material/Reorder";
import Badge, { BadgeProps } from "@mui/material/Badge";
import { styled } from "@mui/material/styles";
import { Opacity } from "@mui/icons-material";

interface HeaderIconsProps {
  routineOpen: number;
  setRoutineOpen: React.Dispatch<React.SetStateAction<number>>;
  isMobile: boolean;
  badgeContent: number;
}

const HeaderIcons = ({
  routineOpen,
  setRoutineOpen,
  isMobile,
  badgeContent,
}: HeaderIconsProps) => {
  const iconStyle = {
    fontSize: "2rem",
  };

  const StyledBadge = styled(Badge)<BadgeProps>(({ theme }) => ({
    "& .MuiBadge-badge": {
      right: 2,
      top: 3,
      border: `2px solid ${theme.palette.background.paper}`,
      padding: "0 4px",
    },
  }));

  return (
    <div className="header__icons">
      <div
        className={`header__icon ${routineOpen === 0 ? "header__icon--active" : ""}`}
        onClick={() => setRoutineOpen(0)}
      >
        <StyledBadge color="primary">
          <ViewModuleIcon sx={{...iconStyle, opacity: routineOpen === 0 ? "1" : "0.5"}} />
        </StyledBadge>
      </div>
      {!isMobile ? (
        <div
          onClick={() => setRoutineOpen(1)}
          className={`header__icon ${routineOpen === 1 ? "header__icon--active" : ""}`}
        >
          <StyledBadge badgeContent={badgeContent} color="primary">
            <VerticalSplitIcon sx={{ ...iconStyle, rotate: "180deg", opacity: routineOpen === 1 ? "1" : "0.5" }} />
          </StyledBadge>
        </div>
      ) : (
        <></>
      )}
      <div
        className={`header__icon ${routineOpen === 2 ? "header__icon--active" : ""}`}
        onClick={() => setRoutineOpen(2)}
      >
        <StyledBadge badgeContent={badgeContent} color="primary">
          <ReorderIcon sx={{...iconStyle, opacity: routineOpen === 2 ? "1" : "0.5"}} />
        </StyledBadge>
      </div>
    </div>
  );
};

export default HeaderIcons;
