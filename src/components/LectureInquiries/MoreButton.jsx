// src/components/common/MoreButton.jsx
import { Button, Box } from "@mui/material";

export default function MoreButton({ isExpanded, onClick }) {
  return (
    <Box display="flex" justifyContent="center" mb={2}>
      <Button
        fullWidth
        variant="outlined"
        sx={{
          backgroundColor: "var(--bg-100)",
          borderRadius: "10px",
          borderColor: "var(--bg-300)",
          color: "var(--text-400)",
          fontWeight: 600,
          maxHeight: 36,
          p: 1.5,
          ":hover": {
            backgroundColor: "var(--bg-200)",
          },
        }}
        onClick={onClick}
      >
        {isExpanded ? "접기" : "더보기"}
      </Button>
    </Box>
  );
}
