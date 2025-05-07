// src/components/Search/RegionFilterDialog.jsx

import { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  Chip,
  IconButton,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import GradientButton from "../Button/GradientButton";
import RegionSelectionModal from "../CreateLecture/RegionSelectionModal";

function RegionFilterDialog({
  open,
  onClose,
  selectedRegions,
  setSelectedRegions,
}) {
  const [regionModalOpen, setRegionModalOpen] = useState(false);
  const [tempSelectedRegions, setTempSelectedRegions] = useState([]);

  // 다이얼로그 열릴 때 초기 데이터 설정
  useState(() => {
    if (open) {
      // 이미 선택된 지역이 있으면 사용, 없으면 빈 배열로 초기화
      setTempSelectedRegions(
        selectedRegions.map((region) => {
          // 단순 문자열인 경우 객체 형태로 변환
          if (typeof region === "string") {
            const parts = region.split(" ");
            const sido = parts[0];
            const sigungu = parts[1];
            const dong = parts.slice(2).join(" ");

            return {
              sido,
              sigungu,
              dong,
              regionCode: `code-${sido}-${sigungu}-${dong}`, // 임시 코드 생성
              displayName: region,
              name: dong || sigungu,
              code: `code-${sido}-${sigungu}-${dong}`,
            };
          }
          return region;
        })
      );
    }
  }, [open, selectedRegions]);

  // 선택 완료 핸들러
  const handleConfirm = () => {
    // 선택된 지역 정보를 상위 컴포넌트로 전달
    // 표시 형식은 이전과 동일하게 문자열 형태로 변환하여 전달
    setSelectedRegions(tempSelectedRegions.map((region) => region.displayName));
    onClose();
  };

  // 선택 초기화 핸들러
  const handleReset = () => {
    setTempSelectedRegions([]);
  };

  // RegionSelectionModal에서 지역 선택 완료 시 호출되는 핸들러
  const handleRegionSelect = (regions) => {
    setTempSelectedRegions(regions);
    setRegionModalOpen(false);
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
          overflowY: "visible",
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
          지역 필터
        </Typography>
        <IconButton onClick={onClose} size="small">
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent sx={{ pb: 1, minHeight: 300 }}>
        {/* 선택된 지역 표시 */}
        <Box sx={{ mb: 2 }}>
          <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 1 }}>
            선택 항목 {tempSelectedRegions.length}
          </Typography>

          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mb: 2 }}>
            {tempSelectedRegions.map((region, index) => (
              <Chip
                key={index}
                label={region.displayName}
                onDelete={() => {
                  setTempSelectedRegions((prev) =>
                    prev.filter((_, i) => i !== index)
                  );
                }}
                sx={{
                  backgroundColor: "var(--action-yellow-bg)",
                  color: "var(--action-yellow)",
                  fontWeight: 500,
                  borderRadius: "8px",
                }}
              />
            ))}

            {tempSelectedRegions.length > 0 && (
              <Button
                variant="text"
                onClick={handleReset}
                sx={{ color: "var(--text-400)", fontSize: 14, ml: 1 }}
              >
                초기화
              </Button>
            )}
          </Box>
        </Box>

        {/* 지역 선택 버튼 */}
        <Box display="flex" justifyContent="center" mt={4}>
          <Button
            variant="contained"
            onClick={() => setRegionModalOpen(true)}
            sx={{
              width: "80%",
              py: 1.5,
              borderRadius: "12px",
              background: "var(--primary-gradient)",
              color: "white",
              fontWeight: 600,
              textTransform: "none",
              "&:hover": {
                background: "var(--primary-gradient)",
                filter: "brightness(0.95)",
              },
            }}
          >
            지역 선택하기
          </Button>
        </Box>

        {/* 지역 선택 가이드 */}
        <Box
          mt={4}
          p={3}
          sx={{ backgroundColor: "var(--bg-200)", borderRadius: "12px" }}
        >
          <Typography variant="subtitle2" fontWeight={600} gutterBottom>
            지역 선택 가이드
          </Typography>
          <Typography variant="body2" color="var(--text-300)">
            • 시/도 &gt; 시/군/구 &gt; 동/읍/면 순서로 선택해 주세요.
          </Typography>
          <Typography variant="body2" color="var(--text-300)">
            • 시/군/구 전체를 지정하거나 특정 동만 선택할 수 있습니다.
          </Typography>
          <Typography variant="body2" color="var(--text-300)">
            • 여러 지역을 선택하면 해당 지역에서 제공하는 과외를 모두
            검색합니다.
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
          선택 완료 ({tempSelectedRegions.length})
        </GradientButton>
      </DialogActions>
      // RegionSelectionModal 호출
      <RegionSelectionModal
        open={regionModalOpen}
        onClose={() => setRegionModalOpen(false)}
        onSubmit={handleRegionSelect}
        selectedRegions={tempSelectedRegions}
      />
    </Dialog>
  );
}

export default RegionFilterDialog;
