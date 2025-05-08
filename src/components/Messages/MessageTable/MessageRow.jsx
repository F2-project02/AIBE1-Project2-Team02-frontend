// src/components/Messages/MessageRow.jsx

import { TableRow, TableCell, Checkbox, Typography, Box } from "@mui/material";
import { useTheme } from "@mui/material/styles"; // theme 객체 사용
import { formatDateFromArray } from "../../../utils/messageDate";

export default function MessageRow({
  messageId,
  nickname,
  content,
  isRead,
  createdAt,
  isLast = false,
  removeBorder = false,
  onClick,
  isSelected, // 선택 상태
  onSelect, // 선택 핸들러
  isMobile,
}) {
  const theme = useTheme(); // theme 객체 가져오기
  const cellStyle = removeBorder ? { borderBottom: "none" } : {};
  const labelId = `enhanced-table-checkbox-${messageId}`;

  const handleCheckboxClick = (event) => {
    event.stopPropagation(); // 행 클릭 이벤트 방지
    onSelect(messageId); // 선택 핸들러 호출
  };

  const lastRowBorderStyle =
    isLast && !removeBorder
      ? { borderBottom: `1px solid ${theme.palette.divider}` }
      : removeBorder
      ? { borderBottom: "none" }
      : {}; // 기본 테두리 유지

  return (
    <TableRow
      onClick={() => onClick?.(messageId)}
      role="checkbox" // 접근성 역할
      aria-checked={isSelected} // 접근성 상태
      tabIndex={-1}
      key={messageId}
      selected={isSelected} // 선택된 행 스타일 적용
      sx={{
        cursor: "pointer",
        "&:last-child td, &:last-child th": {
          ...cellStyle,
          ...lastRowBorderStyle, // 마지막 행 테두리 스타일 적용
        },
      }}
    >
      {/* 체크박스 */}
      <TableCell padding="checkbox" sx={cellStyle}>
        <Checkbox
          size="small"
          checked={isSelected} // 선택 상태에 따라 체크
          onClick={handleCheckboxClick} // 클릭 시 핸들러 호출
          sx={{
            color: "var(--text-300)",
            "&.Mui-checked": {
              color: "var(--primary-100)",
            },
          }}
          inputProps={{ "aria-labelledby": labelId }} // 접근성 레이블
        />
      </TableCell>

      {/* 보낸 사람 */}
      <TableCell
        component="th"
        id={labelId}
        scope="row"
        sx={{
          ...cellStyle,
          maxWidth: 20,
          whiteSpace: "nowrap",
          overflow: "hidden",
          textOverflow: "ellipsis",
        }}
      >
        <Typography variant="body2">{nickname}</Typography>
      </TableCell>
      {/* 내용 (길면 말줄임) */}
      <TableCell sx={cellStyle}>
        <Box
          sx={{
            maxWidth: 400,
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          <Typography variant="body2">{content}</Typography>
        </Box>
      </TableCell>

      {!isMobile && (
        <>
          {/* 읽음 여부 */}
          <TableCell align="center" sx={cellStyle}>
            <Typography variant="body2">
              {isRead ? "읽음" : "읽지않음"}
            </Typography>
          </TableCell>

          {/* 날짜 */}
          <TableCell align="center" sx={cellStyle}>
            <Typography variant="body2">
              {createdAt ? formatDateFromArray(createdAt) : "-"}
            </Typography>
          </TableCell>
        </>
      )}
    </TableRow>
  );
}
