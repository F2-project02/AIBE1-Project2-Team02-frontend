// src/components/common/CustomSelect.jsx
import { Select } from "@mui/material";

export default function CustomSelect({ sx = {}, inputSx = {}, ...props }) {
  return (
    <Select
      fullWidth
      displayEmpty
      variant="outlined"
      value={props.value ?? ""}
      {...props}
      sx={{
        height: 48,
        fontSize: 14,
        fontWeight: 500,
        color: "var(--text-300)",
        backgroundColor: "var(--bg-200)",
        borderRadius: "8px",
        border: "none",
        px: 2,
        py: 1,
        ...sx,
        "& .MuiOutlinedInput-notchedOutline": {
          border: "var(--bg-300)",
        },
        "&:hover .MuiOutlinedInput-notchedOutline": {
          border: "var(--bg-300)",
        },
        "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
          border: "var(--bg-300)",
        },
      }}
      inputProps={{
        sx: {
          padding: 0,
          ...inputSx,
        },
      }}
    />
  );
}
