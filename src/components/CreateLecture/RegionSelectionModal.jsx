// src/components/CreateLecture/RegionSelectionModal.jsx

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Box,
  Typography,
  Button,
  Chip,
  IconButton,
  CircularProgress,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import CheckIcon from "@mui/icons-material/Check";
import RestartAltIcon from "@mui/icons-material/RestartAlt";
import { regionApi } from "../../lib/api/RegionApi";

export default function RegionSelectionModal({
  open,
  onClose,
  onSubmit,
  selectedRegions = [],
}) {
  const [selectedProvince, setSelectedProvince] = useState(null);
  const [selectedDistrict, setSelectedDistrict] = useState(null);
  const [selectedDongs, setSelectedDongs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // API로부터 가져온 데이터
  const [provinces, setProvinces] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [dongs, setDongs] = useState([]);

  // 시도 목록 로드
  useEffect(() => {
    const loadProvinces = async () => {
      try {
        setLoading(true);
        const response = await regionApi.getSidos();
        setProvinces(response);
      } catch (error) {
        console.error("시도 목록 로드 실패:", error);
        setError("시도 목록을 불러오는데 실패했습니다.");
      } finally {
        setLoading(false);
      }
    };

    if (open) {
      loadProvinces();
    }
  }, [open]);

  // 시/도 선택 핸들러
  const handleProvinceClick = async (province) => {
    setSelectedProvince(province);
    setSelectedDistrict(null);
    setSelectedDongs([]);
    setDongs([]);

    try {
      setLoading(true);
      const response = await regionApi.getSigungus(province);
      setDistricts(response);
    } catch (error) {
      console.error("시군구 목록 로드 실패:", error);
      setError("시군구 목록을 불러오는데 실패했습니다.");
    } finally {
      setLoading(false);
    }
  };

  // 구/군 선택 핸들러
  const handleDistrictClick = async (district) => {
    setSelectedDistrict(district);
    setSelectedDongs([]);

    try {
      setLoading(true);
      const response = await regionApi.getDongs(selectedProvince, district);
      setDongs(response);
    } catch (error) {
      console.error("읍면동 목록 로드 실패:", error);
      setError("읍면동 목록을 불러오는데 실패했습니다.");
    } finally {
      setLoading(false);
    }
  };

  // 동 선택 토글 핸들러
  const toggleDong = (dong) => {
    setSelectedDongs((prev) => {
      const isExist = prev.some((d) => d.regionCode === dong.regionCode);
      if (isExist) {
        return prev.filter((d) => d.regionCode !== dong.regionCode);
      } else {
        // displayName을 생성하기 위해 dong 객체에 추가
        const dongWithDisplay = {
          ...dong,
          displayName: `${dong.sido} ${dong.sigungu} ${dong.dong || ""}`.trim(),
          name: dong.dong || dong.sigungu, // 이전 코드와의 호환성을 위해
          code: dong.regionCode, // 이전 코드와의 호환성을 위해
        };
        return [...prev, dongWithDisplay];
      }
    });
  };

  // 완료 핸들러
  const handleSubmit = () => {
    onSubmit(selectedDongs);
  };

  // 초기화 핸들러
  const handleReset = () => {
    setSelectedDongs([]);
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="sm"
      PaperProps={{
        sx: {
          borderRadius: "16px",
          maxHeight: "80vh",
        },
      }}
    >
      <DialogTitle>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h6" fontWeight={600}>
            지역 선택
          </Typography>
          <IconButton onClick={onClose} size="small">
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>

      <DialogContent>
        {/* 에러 메시지 */}
        {error && (
          <Typography color="error" sx={{ mb: 2 }}>
            {error}
          </Typography>
        )}

        {/* 로딩 상태 */}
        {loading && (
          <Box display="flex" justifyContent="center" my={2}>
            <CircularProgress size={24} />
          </Box>
        )}

        {/* 시/도 선택 버튼 */}
        <Box display="flex" flexWrap="wrap" gap={1} mb={4}>
          {provinces.map((province) => (
            <Chip
              key={province}
              label={province}
              onClick={() => handleProvinceClick(province)}
              sx={{
                bgcolor:
                  selectedProvince === province
                    ? "var(--action-primary-bg)"
                    : "white",
                color:
                  selectedProvince === province
                    ? "var(--primary-200)"
                    : "var(--text-300)",
                border:
                  selectedProvince === province
                    ? "none"
                    : "1px solid var(--bg-300)",
                "&:hover": {
                  bgcolor:
                    selectedProvince === province
                      ? "var(--action-primary-bg)"
                      : "var(--bg-200)",
                },
              }}
            />
          ))}
        </Box>

        {/* 구/군 선택 테이블 */}
        {selectedProvince && (
          <Box
            display="flex"
            gap={2}
            mb={4}
            sx={{
              border: "1px solid var(--bg-300)",
              borderRadius: 1,
              overflow: "hidden",
              minHeight: 200,
            }}
          >
            {/* 구/군 목록 */}
            <Box sx={{ width: "40%", borderRight: "1px solid var(--bg-300)" }}>
              {districts.map((district) => (
                <Box
                  key={district}
                  onClick={() => handleDistrictClick(district)}
                  sx={{
                    p: 2,
                    cursor: "pointer",
                    bgcolor:
                      selectedDistrict === district
                        ? "var(--bg-200)"
                        : "transparent",
                    color:
                      selectedDistrict === district
                        ? "var(--text-100)"
                        : "var(--text-300)",
                    fontWeight: selectedDistrict === district ? 600 : 400,
                    borderBottom: "1px solid var(--bg-300)",
                    "&:hover": {
                      bgcolor: "var(--bg-200)",
                    },
                  }}
                >
                  {district}
                </Box>
              ))}
            </Box>

            {/* 동 목록 */}
            <Box sx={{ width: "60%" }}>
              {selectedDistrict &&
                dongs.map((dong) => (
                  <Box
                    key={dong.regionCode}
                    onClick={() => toggleDong(dong)}
                    sx={{
                      p: 2,
                      cursor: "pointer",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      borderBottom: "1px solid var(--bg-300)",
                      color: selectedDongs.some(
                        (d) => d.regionCode === dong.regionCode
                      )
                        ? "var(--primary-200)"
                        : "var(--text-300)",
                      fontWeight: selectedDongs.some(
                        (d) => d.regionCode === dong.regionCode
                      )
                        ? 600
                        : 400,
                      "&:hover": {
                        bgcolor: "var(--bg-200)",
                      },
                    }}
                  >
                    <Typography>
                      {dong.dong ? `${dong.dong}` : `${dong.sigungu} 전체`}
                    </Typography>
                    {selectedDongs.some(
                      (d) => d.regionCode === dong.regionCode
                    ) && (
                      <CheckIcon
                        sx={{ fontSize: 20, color: "var(--primary-200)" }}
                      />
                    )}
                  </Box>
                ))}
            </Box>
          </Box>
        )}

        {/* 선택 항목 2 */}
        <Typography variant="subtitle2" fontWeight={600} mb={2}>
          선택 항목 {selectedDongs.length}
        </Typography>

        {/* 선택된 지역 표시 */}
        <Box display="flex" gap={1} mb={4} flexWrap="wrap">
          {selectedDongs.map((dong, index) => (
            <Chip
              key={index}
              label={dong.displayName}
              onDelete={() => toggleDong(dong)}
              sx={{
                bgcolor: "var(--action-primary-bg)",
                color: "var(--primary-200)",
                "& .MuiChip-deleteIcon": {
                  color: "var(--primary-200)",
                },
              }}
            />
          ))}
        </Box>

        {/* 버튼 영역 */}
        <Box display="flex" gap={2}>
          <Button
            variant="outlined"
            startIcon={<RestartAltIcon />}
            onClick={handleReset}
            sx={{
              borderColor: "var(--bg-300)",
              color: "var(--text-300)",
            }}
          >
            초기화
          </Button>

          <Button
            variant="contained"
            fullWidth
            onClick={handleSubmit}
            disabled={selectedDongs.length === 0}
            sx={{
              background: "linear-gradient(45deg, #5B8DEF, #F57EC2)",
              fontWeight: 600,
              "&:hover": {
                background: "linear-gradient(45deg, #4A7BD4, #E36BAB)",
              },
              "&:disabled": {
                background: "var(--bg-300)",
                color: "var(--text-400)",
              },
            }}
          >
            선택 완료
          </Button>
        </Box>
      </DialogContent>
    </Dialog>
  );
}
