// 📄 src/components/Search/RegionSelectionModal.jsx
import {
  Dialog,
  Box,
  Typography,
  IconButton,
  Chip,
  Button,
  CircularProgress,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import RestartAltIcon from "@mui/icons-material/RestartAlt";
import CheckIcon from "@mui/icons-material/Check";
import { useEffect, useState, useMemo } from "react";
import { RegionApiService } from "./RegionApiService";
import GradientButton from "../Button/GradientButton";

export default function RegionSelectionModal({
  open,
  onClose,
  onSubmit,
  selectedRegions = [],
}) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const [provinces, setProvinces] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [dongs, setDongs] = useState([]);
  const [selectedProvince, setSelectedProvince] = useState("");
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [selectedDongs, setSelectedDongs] = useState([]);
  const [loading, setLoading] = useState(false);

  const uniqueDongs = useMemo(() => {
    const map = new Map();
    dongs.forEach((d) => {
      const name = `${d.sido} ${d.sigungu} ${d.dong || ""}`.trim();
      if (!map.has(name)) map.set(name, d);
    });
    return Array.from(map.values());
  }, [dongs]);

  useEffect(() => {
    if (open) {
      RegionApiService.getSidos().then(setProvinces);
      const valid = selectedRegions.map((r) => ({
        ...r,
        displayName:
          r.displayName || `${r.sido} ${r.sigungu} ${r.dong || ""}`.trim(),
      }));
      setSelectedDongs(valid);
    }
  }, [open]);

  const handleProvinceClick = async (sido) => {
    setSelectedProvince(sido);
    setSelectedDistrict("");
    setDongs([]);
    setLoading(true);
    const sigungus = await RegionApiService.getSigungus(sido);
    setDistricts(sigungus);
    setLoading(false);
  };

  const handleDistrictClick = async (sigungu) => {
    setSelectedDistrict(sigungu);
    setLoading(true);
    const dongList = await RegionApiService.getDongs(selectedProvince, sigungu);
    setDongs(dongList);
    setLoading(false);
  };

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

  const handleReset = () => {
    setSelectedProvince("");
    setSelectedDistrict("");
    setDongs([]);
    setSelectedDongs([]);
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      <Box p={4} height="100vh" bgcolor="#fefefe">
        {/* Header */}
        <Box
          position="relative"
          display="flex"
          alignItems="center"
          height={48}
          mb={3}
        >
          <IconButton
            onClick={onClose}
            sx={{ position: "absolute", right: 0, color: "var(--text-400)" }}
          >
            <CloseIcon />
          </IconButton>
          <Box flex={1} textAlign="center">
            <Typography fontSize={24} fontWeight={600} color="var(--text-100)">
              지역 필터
            </Typography>
          </Box>
        </Box>

        {/* 3단 선택 영역 */}
        <Box display="flex" height={300} gap={2}>
          <RegionColumn
            label="시/도"
            items={provinces}
            selected={selectedProvince}
            onClick={handleProvinceClick}
          />
          <RegionColumn
            label="시/군/구"
            items={districts}
            selected={selectedDistrict}
            onClick={handleDistrictClick}
            disabled={!selectedProvince}
          />
          <DongColumn
            label="읍/면/동"
            items={uniqueDongs}
            loading={loading}
            selectedList={selectedDongs}
            onClick={toggleDong}
          />
        </Box>

        {/* 선택된 지역 */}
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
                    "&:hover": {
                      color: "var(--primary-200)",
                    },
                  },
                }}
              />
            ))}
          </Box>
        </Box>

        {/* 하단 버튼 */}
        <Box display="flex" gap={2} mt={4}>
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
              "&:hover": {
                backgroundColor: "var(--bg-200)",
              },
            }}
          >
            초기화
          </Button>

          <GradientButton
            onClick={() => onSubmit(selectedDongs)}
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
    </Dialog>
  );
}

// 📦 공통 컴포넌트: RegionColumn
function RegionColumn({ label, items, selected, onClick, disabled }) {
  return (
    <Box
      flex={1}
      display="flex"
      flexDirection="column"
      overflow="auto"
      sx={{
        p: 1.5,
        borderRadius: 2,
        backgroundColor: "#fefefe",
        height: "100%",
        gap: 1,
        scrollbarWidth: "none",
        msOverflowStyle: "none",
        "&::-webkit-scrollbar": {
          display: "none",
        },
      }}
    >
      <Typography fontWeight={600} fontSize={16}>
        {label}
      </Typography>

      {items.length === 0 ? (
        <Typography color="var(--text-300)" fontSize={14}>
          이전 항목을 먼저 선택해주세요
        </Typography>
      ) : (
        items.map((item) => {
          const isSelected = selected === item;
          return (
            <Box
              key={item}
              onClick={() => onClick(item)}
              sx={{
                px: 3,
                py: 1.5,
                borderRadius: "8px",
                cursor: "pointer",
                backgroundColor: "transparent", // 선택 시에도 bg 없음
                color: isSelected ? "var(--primary-100)" : "var(--text-300)",
                fontWeight: 500,
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                "&:hover": {
                  backgroundColor: "var(--bg-200)",
                },
              }}
            >
              <Typography>{item}</Typography>
              {isSelected && <CheckIcon sx={{ fontSize: 16 }} />}
            </Box>
          );
        })
      )}
    </Box>
  );
}

// 📦 공통 컴포넌트: DongColumn
function DongColumn({ label, items, loading, selectedList, onClick }) {
  return (
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
        scrollbarWidth: "none",
        msOverflowStyle: "none",
        "&::-webkit-scrollbar": {
          display: "none",
        },
      }}
    >
      <Typography fontWeight={600} fontSize={16}>
        {label}
      </Typography>

      {loading ? (
        <Box py={4} textAlign="center">
          <CircularProgress size={20} />
        </Box>
      ) : items.length === 0 ? (
        <Typography color="var(--text-300)" fontSize={14}></Typography>
      ) : (
        items.map((dong) => {
          const isSelected = selectedList.some(
            (d) => d.regionCode === dong.regionCode
          );
          return (
            <Box
              key={dong.regionCode}
              onClick={() => onClick(dong)}
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
                "&:hover": {
                  backgroundColor: "var(--bg-200)",
                },
              }}
            >
              <Typography>{dong.dong || `${dong.sigungu} 전체`}</Typography>
              {isSelected && <CheckIcon sx={{ fontSize: 16 }} />}
            </Box>
          );
        })
      )}
    </Box>
  );
}