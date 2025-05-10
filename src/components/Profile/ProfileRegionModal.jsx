// src/components/Profile/ProfileRegionModal.jsx
import { useState, useEffect, useMemo } from "react";
import {
  Dialog,
  Box,
  Typography,
  IconButton,
  Chip,
  Button,
  useMediaQuery,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import CloseIcon from "@mui/icons-material/Close";
import RestartAltIcon from "@mui/icons-material/RestartAlt";
import CheckIcon from "@mui/icons-material/Check";
import { RegionApiService } from "../../components/Search/RegionApiService";
import GradientButton from "../../components/Button/GradientButton";

export default function ProfileRegionModal({
  open,
  onClose,
  onSubmit,
  selectedRegions = [],
  setSelectedRegions,
}) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const [provinces, setProvinces] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [dongs, setDongs] = useState([]);
  const [loading, setLoading] = useState(false);

  const [selectedProvince, setSelectedProvince] = useState("");
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [selectedDongs, setSelectedDongs] = useState(selectedRegions);

  // 컴포넌트가 마운트되거나 selectedRegions가 변경될 때 selectedDongs 동기화
  useEffect(() => {
    setSelectedDongs(selectedRegions);
  }, [selectedRegions]);

  // 모달이, 열릴 때 시/도 목록 로드
  useEffect(() => {
    if (open) RegionApiService.getSidos().then(setProvinces);
  }, [open]);

  // 중복 없는 동 목록 생성
  const uniqueDongs = useMemo(() => {
    const map = new Map();
    dongs.forEach((d) => {
      const name = `${d.sido} ${d.sigungu} ${d.dong || ""}`.trim();
      if (!map.has(name)) map.set(name, d);
    });
    return Array.from(map.values());
  }, [dongs]);

  // 시/도 선택 처리
  const handleProvinceClick = async (sido) => {
    setSelectedProvince(sido);
    setSelectedDistrict("");
    setDongs([]);
    setLoading(true);
    const res = await RegionApiService.getSigungus(sido);
    setDistricts(res);
    setLoading(false);
  };

  // 시/군/구 선택 처리
  const handleDistrictClick = async (sigungu) => {
    setSelectedDistrict(sigungu);
    setLoading(true);
    const res = await RegionApiService.getDongs(selectedProvince, sigungu);
    setDongs(res);
    setLoading(false);
  };

  // 동 선택/해제 처리
  const toggleDong = (dong) => {
    const code = dong.regionCode;
    setSelectedDongs((prev) =>
      prev.some((d) => d.regionCode === code)
        ? prev.filter((d) => d.regionCode !== code)
        : [
            ...prev,
            {
              ...dong,
              displayName: `${dong.sido} ${dong.sigungu} ${
                dong.dong || ""
              }`.trim(),
            },
          ]
    );
  };

  // 초기화 처리
  const handleReset = () => {
    setSelectedProvince("");
    setSelectedDistrict("");
    setDongs([]);
    setSelectedDongs([]);
  };

  // 완료 처리
  const handleComplete = () => {
    onSubmit(selectedDongs);
    onClose();
  };

  // 모바일 버전 UI
  const renderMobileUI = () => (
    <Box p={2}>
      <Box position="relative" display="flex" alignItems="center" mb={2}>
        <IconButton onClick={onClose} sx={{ position: "absolute", left: 0 }}>
          <CloseIcon />
        </IconButton>
        <Box flex={1} textAlign="center">
          <Typography fontSize={18} fontWeight={600}>
            지역 선택
          </Typography>
        </Box>
      </Box>

      {/* 모바일에 맞게 최적화된 UI */}
      <Box display="flex" flexDirection="column" gap={2}>
        {/* 시/도 목록 */}
        <Box>
          <Typography fontWeight={600} mb={1}>
            시/도
          </Typography>
          <Box display="flex" flexWrap="wrap" gap={1}>
            {provinces.map((province) => (
              <Chip
                key={province}
                label={province}
                onClick={() => handleProvinceClick(province)}
                variant={selectedProvince === province ? "filled" : "outlined"}
                sx={{
                  backgroundColor:
                    selectedProvince === province
                      ? "var(--primary-100)"
                      : "transparent",
                  color:
                    selectedProvince === province ? "white" : "var(--text-300)",
                }}
              />
            ))}
          </Box>
        </Box>

        {/* 시/군/구 목록 */}
        {selectedProvince && (
          <Box>
            <Typography fontWeight={600} mb={1}>
              시/군/구
            </Typography>
            <Box display="flex" flexWrap="wrap" gap={1}>
              {districts.map((district) => (
                <Chip
                  key={district}
                  label={district}
                  onClick={() => handleDistrictClick(district)}
                  variant={
                    selectedDistrict === district ? "filled" : "outlined"
                  }
                  sx={{
                    backgroundColor:
                      selectedDistrict === district
                        ? "var(--primary-100)"
                        : "transparent",
                    color:
                      selectedDistrict === district
                        ? "white"
                        : "var(--text-300)",
                  }}
                />
              ))}
            </Box>
          </Box>
        )}

        {/* 읍/면/동 목록 */}
        {selectedDistrict && (
          <Box>
            <Typography fontWeight={600} mb={1}>
              읍/면/동
            </Typography>
            <Box display="flex" flexWrap="wrap" gap={1}>
              {uniqueDongs.map((dong) => {
                const isSelected = selectedDongs.some(
                  (d) => d.regionCode === dong.regionCode
                );
                return (
                  <Chip
                    key={dong.regionCode}
                    label={dong.dong || `${dong.sigungu} 전체`}
                    onClick={() => toggleDong(dong)}
                    variant={isSelected ? "filled" : "outlined"}
                    sx={{
                      backgroundColor: isSelected
                        ? "var(--primary-100)"
                        : "transparent",
                      color: isSelected ? "white" : "var(--text-300)",
                    }}
                  />
                );
              })}
            </Box>
          </Box>
        )}
      </Box>

      {/* 선택된 지역 표시 */}
      <Box mt={3}>
        <Typography fontWeight={500} fontSize={14} mb={1}>
          선택된 지역 ({selectedDongs.length})
        </Typography>
        <Box display="flex" flexWrap="wrap" gap={1}>
          {selectedDongs.map((item) => (
            <Chip
              key={item.regionCode}
              label={item.displayName}
              onDelete={() => toggleDong(item)}
              variant="outlined"
              sx={{
                borderColor: "var(--primary-100)",
                color: "var(--primary-100)",
                fontSize: 12,
              }}
            />
          ))}
        </Box>
      </Box>

      {/* 버튼 그룹 */}
      <Box display="flex" gap={2} mt={4}>
        <Button
          startIcon={<RestartAltIcon />}
          onClick={handleReset}
          fullWidth
          sx={{
            border: "1px solid var(--bg-300)",
            height: 48,
            borderRadius: "8px",
            color: "var(--text-300)",
          }}
        >
          초기화
        </Button>
        <GradientButton
          onClick={handleComplete}
          sx={{
            flexGrow: 1,
            height: 48,
            borderRadius: "8px",
            fontWeight: 600,
          }}
          disabled={selectedDongs.length === 0}
        >
          선택 완료
        </GradientButton>
      </Box>
    </Box>
  );

  // 데스크톱 버전 UI
  const renderDesktopUI = () => (
    <Box p={4} bgcolor="#fefefe">
      <Box position="relative" display="flex" alignItems="center" mb={3}>
        <IconButton onClick={onClose} sx={{ position: "absolute", right: 0 }}>
          <CloseIcon />
        </IconButton>
        <Box flex={1} textAlign="center">
          <Typography fontSize={24} fontWeight={600}>
            지역 선택
          </Typography>
        </Box>
      </Box>

      <Box display="flex" height={320} gap={2}>
        {/* 시/도 컬럼 */}
        <Box
          flex={1}
          display="flex"
          flexDirection="column"
          sx={{
            p: 1.5,
            borderRadius: 2,
            backgroundColor: "#fefefe",
            height: "100%",
            gap: 1,
            overflowY: "auto",
          }}
        >
          <Typography fontWeight={600} fontSize={16}>
            시/도
          </Typography>
          {provinces.map((province) => {
            const isSelected = selectedProvince === province;
            return (
              <Box
                key={province}
                onClick={() => handleProvinceClick(province)}
                sx={{
                  px: 3,
                  py: 1.5,
                  borderRadius: "8px",
                  cursor: "pointer",
                  backgroundColor: "transparent",
                  color: isSelected ? "var(--primary-100)" : "var(--text-300)",
                  fontWeight: 500,
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  "&:hover": { backgroundColor: "var(--bg-200)" },
                }}
              >
                <Typography>{province}</Typography>
                {isSelected && <CheckIcon sx={{ fontSize: 16 }} />}
              </Box>
            );
          })}
        </Box>

        {/* 시/군/구 컬럼 */}
        <Box
          flex={1}
          display="flex"
          flexDirection="column"
          sx={{
            p: 1.5,
            borderRadius: 2,
            backgroundColor: "#fefefe",
            height: "100%",
            gap: 1,
            overflowY: "auto",
          }}
        >
          <Typography fontWeight={600} fontSize={16}>
            시/군/구
          </Typography>
          {districts.length === 0 ? (
            <Typography color="var(--text-300)" fontSize={14}>
              이전 항목을 먼저 선택해주세요
            </Typography>
          ) : (
            districts.map((district) => {
              const isSelected = selectedDistrict === district;
              return (
                <Box
                  key={district}
                  onClick={() => handleDistrictClick(district)}
                  sx={{
                    px: 3,
                    py: 1.5,
                    borderRadius: "8px",
                    cursor: "pointer",
                    backgroundColor: "transparent",
                    color: isSelected
                      ? "var(--primary-100)"
                      : "var(--text-300)",
                    fontWeight: 500,
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    "&:hover": { backgroundColor: "var(--bg-200)" },
                  }}
                >
                  <Typography>{district}</Typography>
                  {isSelected && <CheckIcon sx={{ fontSize: 16 }} />}
                </Box>
              );
            })
          )}
        </Box>

        {/* 읍/면/동 컬럼 */}
        <Box
          flex={1}
          display="flex"
          flexDirection="column"
          sx={{
            p: 1.5,
            borderRadius: 2,
            backgroundColor: "#fefefe",
            height: "100%",
            gap: 1,
            overflowY: "auto",
          }}
        >
          <Typography fontWeight={600} fontSize={16}>
            읍/면/동
          </Typography>
          {loading ? (
            <Typography fontSize={14}>로딩 중...</Typography>
          ) : uniqueDongs.length === 0 ? (
            <Typography color="var(--text-300)" fontSize={14}>
              이전 항목을 먼저 선택해주세요
            </Typography>
          ) : (
            uniqueDongs.map((dong) => {
              const isSelected = selectedDongs.some(
                (d) => d.regionCode === dong.regionCode
              );
              return (
                <Box
                  key={dong.regionCode}
                  onClick={() => toggleDong(dong)}
                  sx={{
                    px: 3,
                    py: 1.5,
                    borderRadius: "8px",
                    cursor: "pointer",
                    backgroundColor: "transparent",
                    color: isSelected
                      ? "var(--primary-100)"
                      : "var(--text-300)",
                    fontWeight: 500,
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    "&:hover": { backgroundColor: "var(--bg-200)" },
                  }}
                >
                  <Typography>{dong.dong || `${dong.sigungu} 전체`}</Typography>
                  {isSelected && <CheckIcon sx={{ fontSize: 16 }} />}
                </Box>
              );
            })
          )}
        </Box>
      </Box>

      <Box mt={4}>
        <Typography fontWeight={500} fontSize={16} mb={1}>
          선택 지역 {selectedDongs.length}
        </Typography>
        <Box display="flex" flexWrap="wrap" gap={1}>
          {selectedDongs.map((item) => (
            <Chip
              key={item.regionCode}
              label={item.displayName}
              onDelete={() => toggleDong(item)}
              variant="outlined"
              sx={{
                borderColor: "var(--primary-100)",
                color: "var(--primary-100)",
                fontSize: 13,
                "& .MuiChip-deleteIcon": {
                  color: "var(--primary-100)",
                  "&:hover": { color: "var(--primary-200)" },
                },
              }}
            />
          ))}
        </Box>
      </Box>

      <Box display="flex" gap={2} mt={6}>
        <Button
          startIcon={<RestartAltIcon />}
          onClick={handleReset}
          sx={{
            border: "1px solid var(--bg-300)",
            height: 52,
            borderRadius: "8px",
            px: 2,
            color: "var(--text-300)",
            whiteSpace: "nowrap",
            "&:hover": { backgroundColor: "var(--bg-200)" },
          }}
        >
          초기화
        </Button>
        <GradientButton
          onClick={handleComplete}
          sx={{
            flexGrow: 1,
            height: 52,
            borderRadius: "8px",
            fontWeight: 600,
            fontSize: 16,
            color: "#fefefe",
          }}
          disabled={selectedDongs.length === 0}
        >
          선택 완료
        </GradientButton>
      </Box>
    </Box>
  );

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth={isMobile ? "sm" : "md"}
      fullScreen={isMobile}
    >
      {isMobile ? renderMobileUI() : renderDesktopUI()}
    </Dialog>
  );
}
