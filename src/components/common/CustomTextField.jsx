// 📄 src/components/common/CustomTextField.jsx
import { TextField, Typography } from "@mui/material";

export default function CustomTextField({
  sx = {},
  inputSx = {},
  InputProps = {},
  ...props
}) {
  return (
    <TextField
      variant="outlined"
      fullWidth
      {...props}
      InputProps={{
        ...InputProps,
        sx: {
          height: 48,
          fontSize: 14,
          px: 2,
          py: 1,
          backgroundColor: "var(--bg-100)",
          borderRadius: "8px",
          ...sx,
        },
      }}
      inputProps={{
        sx: {
          padding: 0,
          color: "var(--text-100)",
          ...inputSx,
        },
      }}
      sx={{
        "& .MuiOutlinedInput-root": {
          "& fieldset": {
            borderColor: "var(--bg-300)",
          },
          "&:hover fieldset": {
            borderColor: "var(--action-primary-bg)",
          },
          "&.Mui-focused fieldset": {
            borderColor: "var(--action-primary-bg)",
          },
        },
      }}
    />
  );
}
