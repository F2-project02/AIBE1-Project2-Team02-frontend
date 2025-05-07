// src/components/Search/MentorFilterDialog.jsx

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  FormControlLabel,
  Switch,
  IconButton,
  Divider,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import GradientButton from "../Button/GradientButton";
import VerifiedIcon from "@mui/icons-material/VerifiedUser";

function MentorFilterDialog({
  open,
  onClose,
  certifiedOnly,
  setCertifiedOnly,
}) {
  const [tempCertifiedOnly, setTempCertifiedOnly] = useState(false);

  // 다이얼로그 열릴 때 임시 상태 초기화
  useEffect(() => {
    if (open) {
      setTempCertifiedOnly(certifiedOnly);
    }
  }, [open, certifiedOnly]);

  // 선택 완료 핸들러
  const handleConfirm = () => {
    setCertifiedOnly(tempCertifiedOnly);
    onClose();
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
          멘토 필터
        </Typography>
        <IconButton onClick={onClose} size="small">
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            py: 2,
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <VerifiedIcon
              sx={{
                color: "var(--action-green)",
                mr: 1,
                fontSize: 24,
              }}
            />
            <Box>
              <Typography variant="subtitle1" fontWeight={600}>
                인증 멘토만 보기
              </Typography>
              <Typography variant="body2" color="var(--text-300)">
                학력 및 경력이 검증된 멘토만 볼 수 있어요
              </Typography>
            </Box>
          </Box>

          <Switch
            checked={tempCertifiedOnly}
            onChange={(e) => setTempCertifiedOnly(e.target.checked)}
            color="primary"
            sx={{
              "& .MuiSwitch-switchBase.Mui-checked": {
                color: "var(--action-green)",
              },
              "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": {
                backgroundColor: "var(--action-green-bg)",
              },
            }}
          />
        </Box>

        <Divider sx={{ my: 2 }} />

        <Box
          sx={{
            p: 2,
            borderRadius: "12px",
            backgroundColor: "var(--action-green-bg)",
            mb: 2,
          }}
        >
          <Typography variant="subtitle2" fontWeight={600} gutterBottom>
            인증 멘토는 어떻게 선정되나요?
          </Typography>
          <Typography variant="body2" color="var(--text-300)">
            MEN:TOSS 운영팀에서 멘토의 학력, 경력, 자격증 등 제출 자료를
            검토하여 인증합니다. 인증된 멘토는 프로필에 인증 배지가 표시됩니다.
          </Typography>
        </Box>

        <Box
          sx={{
            p: 2,
            borderRadius: "12px",
            backgroundColor: "var(--bg-200)",
          }}
        >
          <Typography variant="subtitle2" fontWeight={600} gutterBottom>
            인증이 필요하신가요?
          </Typography>
          <Typography variant="body2" color="var(--text-300)">
            멘토 프로필에서 인증 신청을 해주세요. 학력 증명서, 경력 증명서 등의
            증빙 자료를 제출하시면 빠르게 검토 후 인증해드립니다.
          </Typography>
        </Box>
      </DialogContent>

      <DialogActions sx={{ px: 3, py: 2 }}>
        <Button
          onClick={onClose}
          sx={{
            color: "var(--text-300)",
            textTransform: "none",
            fontWeight: "500",
          }}
        >
          취소
        </Button>
        <GradientButton onClick={handleConfirm} size="xs">
          적용하기
        </GradientButton>
      </DialogActions>
    </Dialog>
  );
}

export default MentorFilterDialog;
