import {
  Box,
  IconButton,
  Typography,
  Select,
  MenuItem,
  FormControl,
} from "@mui/material";
import {
  KeyboardArrowLeft as KeyboardArrowLeftIcon,
  KeyboardArrowRight as KeyboardArrowRightIcon,
  FirstPage as FirstPageIcon,
  LastPage as LastPageIcon,
} from "@mui/icons-material";

export default function TablePagination({
  page = 0,
  totalPages = 1,
  rowsPerPage = 10,
  totalItems = 0,
  onPageChange,
  onRowsPerPageChange,
}) {
  // 페이지 변경 핸들러
  const handlePageChange = (newPage) => {
    if (newPage >= 0 && newPage < totalPages && onPageChange) {
      onPageChange(newPage);
    }
  };

  // 페이지당 행 수 변경 핸들러
  const handleRowsPerPageChange = (event) => {
    if (onRowsPerPageChange) {
      onRowsPerPageChange(parseInt(event.target.value, 10));
    }
  };

  // 현재 표시되는 아이템 범위 계산
  const startItem = page * rowsPerPage + 1;
  const endItem = Math.min((page + 1) * rowsPerPage, totalItems);

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        px: 2,
        py: 1.5,
        borderTop: "1px solid #ddd",
        backgroundColor: "background.paper",
      }}
    >
      {/* 현재 표시 중인 아이템 정보 */}
      <Typography variant="body2" color="text.secondary">
        {totalItems > 0
          ? `${startItem}-${endItem} / 총 ${totalItems}개`
          : "0개 항목"}
      </Typography>

      {/* 페이지 이동 버튼들 */}
      <Box sx={{ display: "flex", alignItems: "center" }}>
        {/* 첫 페이지로 */}
        <IconButton
          size="small"
          onClick={() => handlePageChange(0)}
          disabled={page === 0}
          aria-label="첫 페이지로"
        >
          <FirstPageIcon fontSize="small" />
        </IconButton>

        {/* 이전 페이지로 */}
        <IconButton
          size="small"
          onClick={() => handlePageChange(page - 1)}
          disabled={page === 0}
          aria-label="이전 페이지로"
        >
          <KeyboardArrowLeftIcon fontSize="small" />
        </IconButton>

        {/* 페이지 번호 표시 */}
        <Typography
          variant="body2"
          sx={{ mx: 1, minWidth: "60px", textAlign: "center" }}
        >
          {totalPages > 0 ? `${page + 1} / ${totalPages}` : "1 / 1"}
        </Typography>

        {/* 다음 페이지로 */}
        <IconButton
          size="small"
          onClick={() => handlePageChange(page + 1)}
          disabled={page >= totalPages - 1}
          aria-label="다음 페이지로"
        >
          <KeyboardArrowRightIcon fontSize="small" />
        </IconButton>

        {/* 마지막 페이지로 */}
        <IconButton
          size="small"
          onClick={() => handlePageChange(totalPages - 1)}
          disabled={page >= totalPages - 1}
          aria-label="마지막 페이지로"
        >
          <LastPageIcon fontSize="small" />
        </IconButton>
      </Box>
    </Box>
  );
}
