// src/components/CreateLecture/RegionSelectionModal.jsx

import { useState, useEffect, useMemo } from "react";
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
  Divider,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import CheckIcon from "@mui/icons-material/Check";
import RestartAltIcon from "@mui/icons-material/RestartAlt";
import GradientButton from "../Button/GradientButton";
import { RegionApiService } from "../Search/RegionApiService";

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

  // 중복 제거된 동 목록
  const uniqueDongs = useMemo(() => {
    if (!dongs || dongs.length === 0) return [];

    // 주소 기반으로 중복 제거
    const uniqueAddressMap = new Map();

    dongs.forEach((dong) => {
      const fullAddress = `${dong.sido} ${dong.sigungu} ${
        dong.dong || ""
      }`.trim();

      // 이미 존재하는 주소가 아닐 경우에만 추가
      if (!uniqueAddressMap.has(fullAddress)) {
        uniqueAddressMap.set(fullAddress, dong);
      }
    });

    // Map의 값들(dong 객체)을 배열로 반환
    return Array.from(uniqueAddressMap.values());
  }, [dongs]);

  // 모달이 열릴 때마다 선택된 지역 데이터를 초기화
  useEffect(() => {
    if (open) {
      // 이미 선택된 지역들을 selectedDongs에 설정
      const validRegions = selectedRegions
        .filter((region) => region && (region.regionCode || region.code))
        .map((region) => ({
          ...region,
          regionCode: region.regionCode || region.code,
          displayName:
            region.displayName ||
            `${region.sido || ""} ${region.sigungu || ""} ${
              region.dong || ""
            }`.trim(),
        }));
      setSelectedDongs(validRegions);
    }
  }, [open, selectedRegions]);

  // 시도 목록 로드
  useEffect(() => {
    const loadProvinces = async () => {
      try {
        setLoading(true);
        setError(null);

        // 실제 API 호출
        const sidoList = await RegionApiService.getSidos();
        setProvinces(sidoList);
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
    setDongs([]);

    try {
      setLoading(true);
      setError(null);

      // 실제 API 호출
      const sigunguList = await RegionApiService.getSigungus(province);
      setDistricts(sigunguList);
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

    try {
      setLoading(true);
      setError(null);

      // 실제 API 호출
      const dongList = await RegionApiService.getDongs(
        selectedProvince,
        district
      );
      setDongs(dongList);
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
      // 동일한 지역 코드 체크
      const existingIndex = prev.findIndex(
        (d) => d.regionCode === dong.regionCode
      );

      if (existingIndex >= 0) {
        // 이미 존재하면 제거
        return prev.filter((_, index) => index !== existingIndex);
      } else {
        // 새로 추가
        const dongWithDisplay = {
          ...dong,
          displayName: `${dong.sido} ${dong.sigungu} ${dong.dong || ""}`.trim(),
          name: dong.dong || dong.sigungu, // 호환성 유지
          code: dong.regionCode, // 호환성 유지
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

  // 동이 이미 선택되었는지 확인하는 함수
  const isDongSelected = (dong) => {
    return selectedDongs.some((d) => d.regionCode === dong.regionCode);
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="md"
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

        {/* 현재 선택된 경로 표시 */}
        {selectedProvince && (
          <Box mb={2} display="flex" alignItems="center" gap={1}>
            <Typography variant="body2" color="primary">
              {selectedProvince}
            </Typography>
            {selectedDistrict && (
              <>
                <Typography variant="body2" color="text.secondary">
                  {" > "}
                </Typography>
                <Typography variant="body2" color="primary">
                  {selectedDistrict}
                </Typography>
              </>
            )}
          </Box>
        )}

        {/* 구/군 및 동 선택 테이블 - 가로 배치로 변경 */}
        {selectedProvince && (
          <Box
            display="flex"
            flexDirection={{ xs: "column", sm: "row" }}
            mb={4}
            sx={{
              border: "1px solid var(--bg-300)",
              borderRadius: 1,
              overflow: "hidden",
              height: { xs: "auto", sm: "300px" },
            }}
          >
            {/* 구/군 목록 */}
            <Box
              sx={{
                width: { xs: "100%", sm: "40%" },
                height: { xs: "150px", sm: "100%" },
                borderRight: { xs: "none", sm: "1px solid var(--bg-300)" },
                borderBottom: { xs: "1px solid var(--bg-300)", sm: "none" },
                overflowY: "auto",
              }}
            >
              <Typography
                sx={{
                  p: 1,
                  bgcolor: "var(--bg-200)",
                  fontWeight: 600,
                  position: "sticky",
                  top: 0,
                  zIndex: 1,
                }}
              >
                {selectedProvince} 시/군/구
              </Typography>
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
            <Box
              sx={{
                width: { xs: "100%", sm: "60%" },
                height: { xs: "150px", sm: "100%" },
                overflowY: "auto",
              }}
            >
              <Typography
                sx={{
                  p: 1,
                  bgcolor: "var(--bg-200)",
                  fontWeight: 600,
                  position: "sticky",
                  top: 0,
                  zIndex: 1,
                }}
              >
                {selectedDistrict ? `${selectedDistrict} 읍/면/동` : "읍/면/동"}
              </Typography>

              {selectedDistrict && uniqueDongs.length > 0 ? (
                uniqueDongs.map((dong) => (
                  <Box
                    key={`${dong.sido}-${dong.sigungu}-${dong.dong || "all"}`}
                    onClick={() => toggleDong(dong)}
                    sx={{
                      p: 2,
                      cursor: "pointer",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      borderBottom: "1px solid var(--bg-300)",
                      color: isDongSelected(dong)
                        ? "var(--primary-200)"
                        : "var(--text-300)",
                      fontWeight: isDongSelected(dong) ? 600 : 400,
                      bgcolor: isDongSelected(dong)
                        ? "var(--action-primary-bg)"
                        : "transparent",
                      "&:hover": {
                        bgcolor: isDongSelected(dong)
                          ? "var(--action-primary-bg)"
                          : "var(--bg-200)",
                      },
                    }}
                  >
                    <Typography>
                      {dong.dong || `${dong.sigungu} 전체`}
                    </Typography>
                    {isDongSelected(dong) && (
                      <CheckIcon
                        sx={{ fontSize: 20, color: "var(--primary-200)" }}
                      />
                    )}
                  </Box>
                ))
              ) : (
                <Box
                  sx={{ p: 2, textAlign: "center", color: "var(--text-300)" }}
                >
                  <Typography>
                    {loading
                      ? "불러오는 중..."
                      : selectedDistrict
                      ? "선택 가능한 동이 없습니다."
                      : "시/군/구를 선택해주세요."}
                  </Typography>
                </Box>
              )}
            </Box>
          </Box>
        )}

        <Divider sx={{ my: 2 }} />

        {/* 선택 항목 표시 */}
        <Typography variant="subtitle2" fontWeight={600} mb={2}>
          선택 항목 {selectedDongs.length}
        </Typography>

        {/* 선택된 지역 표시 */}
        <Box
          display="flex"
          gap={1}
          mb={4}
          flexWrap="wrap"
          sx={{ maxHeight: "100px", overflowY: "auto" }}
        >
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
              whiteSpace: "nowrap",
              minWidth: "100px",
            }}
          >
            초기화
          </Button>

          <GradientButton
            fullWidth
            onClick={handleSubmit}
            disabled={selectedDongs.length === 0}
            sx={{
              "&:disabled": {
                background: "var(--bg-300)",
                color: "var(--text-400)",
              },
            }}
          >
            선택 완료
          </GradientButton>
        </Box>
      </DialogContent>
    </Dialog>
  );
}
