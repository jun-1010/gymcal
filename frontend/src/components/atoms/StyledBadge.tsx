import Badge, { BadgeProps } from "@mui/material/Badge";
import { styled } from "@mui/material/styles";

const StyledBadge = styled(Badge)<BadgeProps>(({ theme }) => ({
    "& .MuiBadge-badge": {
      right: 2,
      top: 3,
      border: `2px solid ${theme.palette.background.paper}`,
      padding: "0 4px",
      color: "white",
    },
  }));

  export default StyledBadge;