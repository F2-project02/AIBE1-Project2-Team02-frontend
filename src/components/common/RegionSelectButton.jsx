// 📄 src/components/common/RegionSelectButton.jsx
import { Button } from "@mui/material";

export default function RegionSelectButton({ onClick, sx = {} }) {
  return (
    <Button
      variant="outlined"
      onClick={onClick}
      fullWidth
      sx={{
        height: 48,
        borderRadius: "8px",
        color: "var(--text-300)",
        backgroundColor: "var(--bg-200)",
        border: "none",
        fontSize: 14,
        fontWeight: 500,
        justifyContent: "flex-start",
        px: 2,
        py: 1,
        "&:hover": {
          backgroundColor: "var(--bg-300)",
        },
        ...sx,
      }}
    >
      지역
    </Button>
  );
}
