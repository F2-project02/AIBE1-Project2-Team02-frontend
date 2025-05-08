// src/components/CreateLecture/FormFieldWrapper.jsx
import { Box, Typography } from "@mui/material";

export default function FormFieldWrapper({
  label,
  children,
  required = false,
}) {
  return (
    <Box sx={{ mb: 3 }}>
      {label && (
        <Typography variant="subtitle2" fontWeight={600} mb={1.5}>
          {label}
          {required && <span style={{ color: "var(--action-red)" }}> *</span>}
        </Typography>
      )}
      {children}
    </Box>
  );
}
