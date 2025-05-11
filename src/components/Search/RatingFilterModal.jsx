// 📄 src/components/Search/RatingFilterModal.jsx
import {
  Dialog,
  Box,
  Typography,
  IconButton,
  Slider,
  Button,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import RestartAltIcon from "@mui/icons-material/RestartAlt";
import GradientButton from "../Button/GradientButton";
import { useState, useEffect } from "react";

export default function RatingFilterModal({
  open,
  onClose,
  initialRating = 0,
  onSubmit,
}) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const [rating, setRating] = useState(initialRating);

  useEffect(() => {
    if (open) setRating(initialRating);
  }, [open, initialRating]);

  const handleReset = () => {
    setRating(0);
  };

  const handleComplete = () => {
    onSubmit(rating);
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="xs"
      fullWidth
      fullScreen={isMobile}
      PaperProps={{
        sx: {
          borderRadius: isMobile ? 0 : "12px",
        },
      }}
    >
      <Box
        p={4}
        height={isMobile ? "100vh" : "auto"}
        bgcolor="#fefefe"
        display="flex"
        flexDirection="column"
        justifyContent="space-between"
      >
        {/* 헤더 */}
        <Box position="relative" textAlign="center" mb={3}>
          <Typography fontSize={24} fontWeight={600}>
            평점
          </Typography>
          <IconButton
            onClick={onClose}
            sx={{
              position: "absolute",
              right: 0,
              top: "50%",
              transform: "translateY(-50%)",
              color: "var(--text-400)",
            }}
          >
            <CloseIcon />
          </IconButton>
        </Box>

        {/* 본문 */}
        <Box mt={1}>
          <Typography fontSize={14} color="var(--text-300)" mb={3}>
            이 평점 이상인 과외만 검색할게요
          </Typography>

          <Slider
            value={rating}
            onChange={(_, val) => setRating(val)}
            step={0.5}
            marks
            min={0}
            max={5}
            valueLabelDisplay="auto"
            sx={{
              mt: 4,
              color: "var(--primary-100)",
            }}
          />

          <Box textAlign="center" mt={2}>
            <Typography
              variant="h4"
              fontWeight={700}
              color="var(--primary-100)"
            >
              {rating.toFixed(1)}점 이상
            </Typography>
          </Box>
        </Box>

        {/* 버튼 영역 */}
        <Box mt={5} display="flex" gap={1}>
          <Button
            startIcon={<RestartAltIcon />}
            onClick={handleReset}
            sx={{
              flex: 1,
              height: 52,
              borderRadius: "8px",
              color: "var(--text-300)",
              border: "1px solid var(--bg-300)",
              "&:hover": {
                backgroundColor: "var(--bg-200)",
              },
            }}
          >
            초기화
          </Button>
          <GradientButton
            onClick={handleComplete}
            sx={{
              flex: 2,
              height: 52,
              borderRadius: "8px",
              fontWeight: 600,
              fontSize: 16,
            }}
          >
            선택 완료
          </GradientButton>
        </Box>
      </Box>
    </Dialog>
  );
}