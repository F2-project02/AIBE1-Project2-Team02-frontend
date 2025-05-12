// 📄 src/components/Search/CertifiedMentorFilterModal.jsx
import {
  Dialog,
  Box,
  Typography,
  IconButton,
  Button,
  Checkbox,
  FormControlLabel,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import RestartAltIcon from "@mui/icons-material/RestartAlt";
import GradientButton from "../Button/GradientButton";
import { useState, useEffect, useRef } from "react";

export default function CertifiedMentorFilterModal({
  open,
  onClose,
  initialChecked = false,
  onSubmit,
}) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [checked, setChecked] = useState(initialChecked);

  const prevOpenRef = useRef(false);

  useEffect(() => {
    if (!prevOpenRef.current && open) {
      setChecked(initialChecked);
    }
    prevOpenRef.current = open;
  }, [open, initialChecked]);

  const handleReset = () => {
    setChecked(false);
  };

  const handleComplete = () => {
    onSubmit(checked);
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="xs"
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
            인증 멘토 필터
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
          <Typography fontSize={14} color="var(--text-300)" mb={2}>
            인증된 멘토는 본인 인증 및 검증 절차를 거쳐 활동하는 전문가입니다.
            신뢰할 수 있는 과외를 원하신다면 이 옵션을 선택해 주세요.
          </Typography>

          <FormControlLabel
            control={
              <Checkbox
                checked={checked}
                onChange={(e) => setChecked(e.target.checked)}
                sx={{
                  color: "var(--primary-100)",
                  "&.Mui-checked": {
                    color: "var(--primary-100)",
                  },
                }}
              />
            }
            label={<Typography fontSize={15}>인증 멘토만 보기</Typography>}
          />
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