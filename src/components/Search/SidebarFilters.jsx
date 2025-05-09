import {
  Box,
  Typography,
  TextField,
  Button,
  Divider,
  InputAdornment,
} from "@mui/material";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import SearchIcon from "@mui/icons-material/Search";

export default function SidebarFilters({
  onKeywordSubmit,
  onKeywordChange,
  onOpenCategory,
  onOpenRegion,
  onOpenPrice,
  onOpenRating,
  onOpenCertified,
  showKeyword = true,
}) {
  return (
    <Box>
      {showKeyword && (
        <>
          <Typography
            variant="subtitle2"
            fontWeight={600}
            fontSize={14}
            color="var(--text-100)"
            gutterBottom
          >
            키워드 검색
          </Typography>

          <TextField
            fullWidth
            placeholder="키워드를 입력하세요"
            variant="outlined"
            size="small"
            onChange={(e) => onKeywordChange(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                onKeywordSubmit?.(e.target.value);
              }
            }}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <SearchIcon sx={{ color: "var(--text-300)", fontSize: 20 }} />
                </InputAdornment>
              ),
            }}
            sx={{
              mb: 2,
              bgcolor: "var(--bg-200)",
              borderRadius: "12px",
              "& .MuiOutlinedInput-root": {
                height: 44,
                borderRadius: "12px",
                fontSize: "0.95rem",
                pl: 0.5,
                pr: 2,
                "& fieldset": {
                  border: "none",
                },
                "&:hover fieldset": {
                  border: "none",
                },
                "&.Mui-focused fieldset": {
                  border: "none",
                },
              },
              "& input": {
                color: "var(--text-100)",
              },
              "& input::placeholder": {
                color: "var(--text-300)",
                opacity: 1,
              },
            }}
          />
        </>
      )}

      <Typography
        variant="subtitle2"
        fontWeight={600}
        fontSize={14}
        color="var(--text-100)"
        gutterBottom
      >
        필터로 검색
      </Typography>

      <Divider sx={{ mb: 2, borderColor: "var(--bg-300)" }} />

      <StyledFilterButton onClick={onOpenCategory}>과목</StyledFilterButton>
      <StyledFilterButton onClick={onOpenRegion}>지역</StyledFilterButton>
      <StyledFilterButton onClick={onOpenPrice}>수업료</StyledFilterButton>
      <StyledFilterButton onClick={onOpenRating}>평점</StyledFilterButton>
      <StyledFilterButton onClick={onOpenCertified}>
        인증 여부
      </StyledFilterButton>
    </Box>
  );
}

const StyledFilterButton = ({ children, ...props }) => (
  <Button
    fullWidth
    endIcon={<ArrowForwardIosIcon sx={{ fontSize: 16 }} />}
    sx={{
      justifyContent: "space-between",
      mb: 1.5,
      height: 44,
      textTransform: "none",
      backgroundColor: "var(--bg-200)",
      color: "var(--text-300)",
      fontSize: "0.95rem",
      fontWeight: 500,
      borderRadius: "12px",
      px: 2,
      "&:hover": {
        backgroundColor: "var(--bg-300)",
      },
      "&.Mui-disabled": {
        color: "var(--text-400)",
        backgroundColor: "var(--bg-200)",
        opacity: 1,
      },
    }}
    {...props}
  >
    {children}
  </Button>
);
