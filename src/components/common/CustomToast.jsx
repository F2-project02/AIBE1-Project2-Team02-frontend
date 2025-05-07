// 📄 src/components/common/CustomToast.jsx
import { Snackbar, Box, Typography } from "@mui/material";

export default function CustomToast({
  open,
  onClose,
  message,
  iconSrc,
  type = "info",
  duration = 3000,
}) {
  const bgColorMap = {
    error: "var(--action-red-bg)",
    warning: "var(--action-yellow-bg)",
  };

  const textColorMap = {
    error: "var(--action-red)",
    warning: "var(--action-yellow)",
  };

  const isCustomType = ["error", "warning"].includes(type);

  return (
    <Snackbar
      open={open}
      autoHideDuration={duration}
      onClose={onClose}
      anchorOrigin={{ vertical: "top", horizontal: "center" }}
      ContentProps={{
        sx: isCustomType
          ? {
              backgroundColor: bgColorMap[type],
              boxShadow: "0 2px 10px rgba(0, 0, 0, 0.08)",
              borderRadius: "12px",
              px: 2,
              py: 1,
            }
          : {},
      }}
      message={
        <Box display="flex" alignItems="center" gap={1.5}>
          {iconSrc && (
            <Box
              component="img"
              src={iconSrc}
              alt="toast-icon"
              sx={{ width: 30, height: 30 }}
            />
          )}
          <Typography
            fontSize="0.9rem"
            fontWeight={500}
            color={isCustomType ? textColorMap[type] : undefined}
          >
            {message}
          </Typography>
        </Box>
      }
    />
  );
}
