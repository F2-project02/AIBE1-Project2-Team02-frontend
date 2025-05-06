// src/components/Button/GradientButton.jsx

import { Button, Box } from "@mui/material";

export default function GradientButton({
  children,
  onClick,
  fullWidth = false,
  size = "md",
  startIcon = null,
  endIcon = null,
  sx = {},
}) {
  const sizeStyles = {
    xs: {
      paddingX: { xs: 2, sm: 2.5 },
      paddingY: { xs: 0.8, sm: 1 },
      fontSize: { xs: "0.75rem", sm: "0.85rem" },
      borderRadius: { xs: "12px", sm: "14px" },
    },
    md: {
      paddingX: { xs: 3, sm: 4 },
      paddingY: { xs: 1, sm: 1.2 },
      fontSize: { xs: "0.9rem", sm: "1rem" },
      borderRadius: { xs: "14px", sm: "16px" },
    },
  };

  return (
    <Button
      onClick={onClick}
      fullWidth={fullWidth}
      variant="contained"
      disableElevation
      sx={{
        background: "var(--primary-gradient)", 
        color: "#fff",
        fontWeight: 600,
        textTransform: "none",
        whiteSpace: "nowrap",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 1,
        transition: "all 0.3s ease",
        borderRadius: sizeStyles[size].borderRadius,
        "&:hover": {
          background: "var(--primary-gradient)",
          filter: "brightness(0.95)",
        },
        ...sizeStyles[size],
        ...sx,
      }}
    >
      {startIcon && (
        <Box component="span" sx={{ display: "flex", alignItems: "center" }}>
          {startIcon}
        </Box>
      )}
      {children}
      {endIcon && (
        <Box component="span" sx={{ display: "flex", alignItems: "center" }}>
          {endIcon}
        </Box>
      )}
    </Button>
  );
}