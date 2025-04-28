// src/components/GradientButton.jsx

import { Button, Box } from "@mui/material";
import { useTheme } from "@mui/material/styles";

export default function GradientButton({
  children,
  onClick,
  fullWidth = false,
  size = "md",
  startIcon = null,
  endIcon = null,
  sx = {},
}) {
  const theme = useTheme();

  const sizeStyles = {
    xs: {
      paddingX: { xs: 2, sm: 3, md: 4 },
      paddingY: { xs: 0.8, sm: 1, md: 1.2 },
      fontSize: { xs: "0.8rem", sm: "0.9rem", md: "1rem" },
      borderRadius: { xs: "12px", sm: "14px", md: "16px" },
    },
    md: {
      paddingX: { xs: 3, sm: 4, md: 6 },
      paddingY: { xs: 1, sm: 1.2, md: 1.5 },
      fontSize: { xs: "0.9rem", sm: "1rem", md: "1.1rem" },
      borderRadius: { xs: "14px", sm: "16px", md: "20px" }, 
    },
  };

  return (
    <Button
      onClick={onClick}
      fullWidth={fullWidth}
      variant="contained"
      sx={{
        background: `linear-gradient(90deg, ${theme.palette.primary.main} 0%, #FFBAD0 100%)`,
        color: theme.palette.primary.contrastText,
        fontWeight: 500,
        boxShadow: "0px 4px 12px rgba(91, 141, 239, 0.3)",
        textTransform: "none",
        whiteSpace: "nowrap",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 1,
        transition: "all 0.3s ease",
        borderRadius: sizeStyles[size].borderRadius,
        "&:hover": {
          background: `linear-gradient(90deg, ${theme.palette.primary.main} 0%, #FFBAD0 100%)`, 
          filter: "brightness(1.03)", // 대신 살짝 밝게
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
