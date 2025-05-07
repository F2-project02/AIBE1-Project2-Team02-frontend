// src/components/Search/PriceFilterDialog.jsx

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  Slider,
  IconButton,
  InputAdornment,
  TextField,
  Stack,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import GradientButton from "../Button/GradientButton";

function PriceFilterDialog({ open, onClose, priceRange, setPriceRange }) {
  const [tempPriceRange, setTempPriceRange] = useState({ min: 0, max: 100000 });
  const [inputValues, setInputValues] = useState({ min: "0", max: "10" });

  // 다이얼로그 열릴 때 임시 가격 범위 초기화
  useEffect(() => {
    if (open) {
      setTempPriceRange({ ...priceRange });
      setInputValues({
        min: String(Math.floor(priceRange.min / 10000)),
        max: String(Math.floor(priceRange.max / 10000)),
      });
    }
  }, [open, priceRange]);

  // 슬라이더 변경 핸들러
  const handleSliderChange = (event, newValue) => {
    const [min, max] = newValue;
    setTempPriceRange({ min: min * 10000, max: max * 10000 });
    setInputValues({
      min: String(min),
      max: String(max),
    });
  };

  // 입력값 변경 핸들러
  const handleInputChange = (type) => (event) => {
    const value = event.target.value;

    // 숫자 또는 빈 문자열만 허용
    if (value === "" || /^[0-9]*$/.test(value)) {
      setInputValues((prev) => ({
        ...prev,
        [type]: value,
      }));

      // 빈 문자열이 아닌 경우 가격 범위 업데이트
      if (value !== "") {
        const numValue = parseInt(value, 10);
        if (!isNaN(numValue)) {
          setTempPriceRange((prev) => ({
            ...prev,
            [type]: numValue * 10000,
          }));
        }
      }
    }
  };

  // input 블러 핸들러 (입력 완료 시)
  const handleInputBlur = (type) => () => {
    let value = inputValues[type];

    // 빈 문자열이면 기본값 설정
    if (value === "") {
      value = type === "min" ? "0" : "10";
      setInputValues((prev) => ({
        ...prev,
        [type]: value,
      }));
    }

    // 숫자로 변환
    const numValue = parseInt(value, 10);

    // 범위 체크
    if (type === "min" && numValue > parseInt(inputValues.max, 10)) {
      value = inputValues.max;
      setInputValues((prev) => ({
        ...prev,
        min: value,
      }));
    } else if (type === "max" && numValue < parseInt(inputValues.min, 10)) {
      value = inputValues.min;
      setInputValues((prev) => ({
        ...prev,
        max: value,
      }));
    }

    // 최종 가격 범위 업데이트
    setTempPriceRange((prev) => ({
      ...prev,
      [type]: parseInt(value, 10) * 10000,
    }));
  };

  // 선택 완료 핸들러
  const handleConfirm = () => {
    setPriceRange(tempPriceRange);
    onClose();
  };

  // 가격 초기화 핸들러
  const handleReset = () => {
    setTempPriceRange({ min: 0, max: 100000 });
    setInputValues({ min: "0", max: "10" });
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="sm"
      PaperProps={{
        sx: {
          borderRadius: "20px",
        },
      }}
    >
      <DialogTitle
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Typography variant="h6" fontWeight={600}>
          수업료 필터
        </Typography>
        <IconButton onClick={onClose} size="small">
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent>
        <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 1 }}>
          1회당 희망 수업료
        </Typography>

        {/* 가격 입력 필드 */}
        <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 4 }}>
          <TextField
            value={inputValues.min}
            onChange={handleInputChange("min")}
            onBlur={handleInputBlur("min")}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">만원</InputAdornment>
              ),
            }}
            variant="outlined"
            size="small"
            sx={{
              width: "50%",
              "& .MuiOutlinedInput-root": {
                borderRadius: "12px",
              },
            }}
          />
          <Typography variant="body1" color="var(--text-300)">
            ~
          </Typography>
          <TextField
            value={inputValues.max}
            onChange={handleInputChange("max")}
            onBlur={handleInputBlur("max")}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">만원</InputAdornment>
              ),
            }}
            variant="outlined"
            size="small"
            sx={{
              width: "50%",
              "& .MuiOutlinedInput-root": {
                borderRadius: "12px",
              },
            }}
          />
        </Stack>

        {/* 가격 슬라이더 */}
        <Box sx={{ px: 2 }}>
          <Slider
            value={[
              Math.round(tempPriceRange.min / 10000),
              Math.round(tempPriceRange.max / 10000),
            ]}
            onChange={handleSliderChange}
            min={0}
            max={10}
            step={1}
            marks={[
              { value: 0, label: "무료" },
              { value: 2, label: "2만원" },
              { value: 5, label: "5만원" },
              { value: 10, label: "10만원" },
            ]}
            sx={{
              color: "var(--primary-100)",
              "& .MuiSlider-thumb": {
                width: 20,
                height: 20,
                backgroundColor: "#fff",
                boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                "&::before": {
                  width: 8,
                  height: 8,
                  backgroundColor: "var(--primary-100)",
                },
              },
              "& .MuiSlider-markLabel": {
                fontSize: 12,
                color: "var(--text-300)",
              },
            }}
          />
        </Box>

        {/* 가격대 버튼 - 미리 정의된 가격 범위들 */}
        <Typography variant="subtitle2" fontWeight={600} sx={{ mt: 4, mb: 2 }}>
          빠른 가격대 선택
        </Typography>

        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
          {[
            { label: "무료", min: 0, max: 0 },
            { label: "~2만원", min: 0, max: 20000 },
            { label: "2~5만원", min: 20000, max: 50000 },
            { label: "5~10만원", min: 50000, max: 100000 },
          ].map((range) => (
            <Button
              key={range.label}
              variant="outlined"
              onClick={() => {
                setTempPriceRange({ min: range.min, max: range.max });
                setInputValues({
                  min: String(Math.floor(range.min / 10000)),
                  max: String(Math.floor(range.max / 10000)),
                });
              }}
              sx={{
                borderRadius: "20px",
                borderColor: "var(--bg-300)",
                color: "var(--text-300)",
                textTransform: "none",
                "&:hover": {
                  borderColor: "var(--primary-100)",
                  backgroundColor: "var(--action-primary-bg)",
                },
              }}
            >
              {range.label}
            </Button>
          ))}
        </Box>
      </DialogContent>

      <DialogActions sx={{ px: 3, py: 2 }}>
        <Button
          onClick={handleReset}
          sx={{
            color: "var(--text-300)",
            textTransform: "none",
            fontWeight: "500",
          }}
        >
          초기화
        </Button>
        <GradientButton onClick={handleConfirm} size="xs">
          가격 설정 완료
        </GradientButton>
      </DialogActions>
    </Dialog>
  );
}

export default PriceFilterDialog;
