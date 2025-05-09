import {
  Dialog,
  Box,
  Typography,
  TextField,
  Button,
  IconButton,
  InputAdornment,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import RestartAltIcon from "@mui/icons-material/RestartAlt";
import GradientButton from "../Button/GradientButton";
import { useState, useEffect } from "react";

export default function PriceFilterModal({
  open,
  onClose,
  onSubmit,
  initialRange = [0, 300000],
}) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const [minPrice, setMinPrice] = useState(initialRange[0]);
  const [maxPrice, setMaxPrice] = useState(initialRange[1]);

  useEffect(() => {
    if (open) {
      setMinPrice(initialRange[0]);
      setMaxPrice(initialRange[1]);
    }
  }, [open]);

  const handleReset = () => {
    setMinPrice(0);
    setMaxPrice(300000);
  };

  const handleSubmit = () => {
    onSubmit([minPrice, maxPrice]);
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
        bgcolor="#fff"
        display="flex"
        flexDirection="column"
        justifyContent="space-between"
      >
        {/* 헤더 */}
        <Box position="relative" textAlign="center" mb={3}>
          <Typography fontSize={24} fontWeight={600}>
            수업료 필터
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

        <Box mt={1}>
          <Typography fontSize={14} color="var(--text-300)" mb={3}>
            1회당 희망 수업료
          </Typography>

          {/* 입력 필드 */}
          <Box display="flex" alignItems="center" gap={2}>
            <Box flex={1}>
              <Typography
                fontSize={13}
                fontWeight={600}
                color="var(--primary-100)"
                mb={0.5}
              >
                최소 금액
              </Typography>
              <TextField
                fullWidth
                type="number"
                value={minPrice}
                onChange={(e) => setMinPrice(Number(e.target.value))}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">원</InputAdornment>
                  ),
                }}
                variant="standard"
                sx={{
                  input: {
                    fontWeight: 500,
                    fontSize: 18,
                  },
                }}
              />
            </Box>
            <Typography fontSize={20} color="var(--text-200)">
              ~
            </Typography>
            <Box flex={1}>
              <Typography
                fontSize={13}
                fontWeight={600}
                color="var(--primary-100)"
                mb={0.5}
              >
                최대 금액
              </Typography>
              <TextField
                fullWidth
                type="number"
                value={maxPrice}
                onChange={(e) => setMaxPrice(Number(e.target.value))}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">원</InputAdornment>
                  ),
                }}
                variant="standard"
                sx={{
                  input: {
                    fontWeight: 500,
                    fontSize: 18,
                  },
                }}
              />
            </Box>
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
            onClick={handleSubmit}
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
