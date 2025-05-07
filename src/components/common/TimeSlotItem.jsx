// src/components/common/TimeSlotItem.jsx

import { Box, TextField, Typography, IconButton } from "@mui/material";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import DeleteIcon from "@mui/icons-material/Delete";

export default function TimeSlotItem({ slot, onChange, onDelete }) {
  return (
    <Box
      sx={{
        mt: 3,
        mb: 3,
      }}
    >
      {/* 요일 표시 */}
      <Box
        display="flex"
        alignItems="center"
        gap={1}
        mb={1.5}
        sx={{ color: "var(--primary-300)", fontWeight: 600 }}
      >
        <AccessTimeIcon sx={{ fontSize: 20 }} />
        <Typography variant="body2">{slot.dayOfWeek}요일</Typography>
      </Box>

      <Box display="flex" alignItems="center" gap={2} flexWrap="wrap">
        {/* 시작 시간 */}
        <TextField
          type="time"
          value={slot.startTime}
          onChange={(e) => onChange(slot.id, "startTime", e.target.value)}
          size="small"
          sx={{
            width: { xs: 120, sm: 130, md: 140 },
            "& .MuiOutlinedInput-root": {
              borderRadius: "8px",
            },
          }}
          inputProps={{ step: 600 }}
        />

        <Typography variant="body1" fontWeight={500}>
          ~
        </Typography>

        {/* 종료 시간 */}
        <TextField
          type="time"
          value={slot.endTime}
          onChange={(e) => onChange(slot.id, "endTime", e.target.value)}
          size="small"
          sx={{
            width: { xs: 120, sm: 130, md: 140 },
            "& .MuiOutlinedInput-root": {
              borderRadius: "8px",
            },
          }}
          inputProps={{ step: 600 }}
        />

        <IconButton
          onClick={() => onDelete(slot.id)}
          sx={{ ml: "auto", color: "var(--action-red)" }}
        >
          <DeleteIcon />
        </IconButton>
      </Box>
    </Box>
  );
}