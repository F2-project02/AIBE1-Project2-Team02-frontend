// src/components/Messages/MessageRowMobile.jsx

import { Box, Typography, Checkbox } from "@mui/material";
import { format } from "date-fns";

export default function MessageRowMobile({
  message,
  isSelected,
  onSelect,
  onClick,
}) {
  const handleSelectClick = (e) => {
    e.stopPropagation();
    onSelect(message.messageId);
  };

  const formattedDate = format(new Date(message.sentDate), "yyyy.MM.dd");

  return (
    <Box
      display="flex"
      flexDirection="column"
      px={2}
      py={2}
      borderBottom="1px solid var(--bg-200)"
      bgcolor={isSelected ? "var(--bg-200)" : "var(--bg-100)"}
      onClick={() => onClick(message.messageId)}
      sx={{
        transition: "background-color 0.2s ease",
        "&:hover": {
          backgroundColor: "var(--bg-200)",
        },
        cursor: "pointer",
      }}
    >
      {/* 첫 줄: 체크박스 + 보낸사람 + 날짜 */}
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Box display="flex" alignItems="center">
          <Checkbox
            checked={isSelected}
            onClick={handleSelectClick}
            sx={{
              p: 0.5,
              pr: 2,
              color: "var(--text-300)",
              "&.Mui-checked": {
                color: "var(--primary-100)",
              },
            }}
          />
          <Typography fontWeight={600} fontSize={14} color="var(--text-100)">
            {message.nickname}
          </Typography>
        </Box>
        <Typography fontSize={13} color="var(--text-400)">
          {formattedDate}
        </Typography>
      </Box>

      {/* 둘째 줄: 메시지 내용 */}
      <Typography fontSize={14} color="var(--text-300)" mt={1} noWrap>
        {message.content}
      </Typography>
    </Box>
  );
}