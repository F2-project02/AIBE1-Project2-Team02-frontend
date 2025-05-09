// src/components/CreateLecture/RegionSelectionModal.jsx

import {
  Dialog,
  Box,
  Typography,
  IconButton,
  Chip,
  Button,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import RestartAltIcon from "@mui/icons-material/RestartAlt";
import CheckIcon from "@mui/icons-material/Check";
import { useEffect, useState, useMemo } from "react";
import { RegionApiService } from "../Search/RegionApiService";
import GradientButton from "../Button/GradientButton";

export default function RegionSelectionModal({
  open,
  onClose,
  onSubmit,
  selectedDongs,
  setSelectedDongs,
  selectedProvince,
  setSelectedProvince,
  selectedDistrict,
  setSelectedDistrict,
}) {
  const [provinces, setProvinces] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [dongs, setDongs] = useState([]);
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
    if (open) RegionApiService.getSidos().then(setProvinces);
  }, [open]);

  const handleProvinceClick = async (sido) => {
    setSelectedProvince(sido);
    setSelectedDistrict("");
    setDongs([]);
    setLoading(true);
    const res = await RegionApiService.getSigungus(sido);
    setDistricts(res);
    setLoading(false);
  };

  const handleDistrictClick = async (sigungu) => {
    setSelectedDistrict(sigungu);
    setLoading(true);
    const res = await RegionApiService.getDongs(selectedProvince, sigungu);
    setDongs(res);
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

  const handleComplete = () => {
    onSubmit(selectedDongs);
    onClose();
  };

  const isDongSelected = (dong) =>
    selectedDongs.some((d) => d.regionCode === dong.regionCode);

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
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
    </Dialog>
  );
}

function RegionColumn({ label, items, selected, onClick }) {
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
        "&::-webkit-scrollbar": { display: "none" },
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
                backgroundColor: "transparent",
                color: isSelected ? "var(--primary-100)" : "var(--text-300)",
                fontWeight: 500,
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                "&:hover": { backgroundColor: "var(--bg-200)" },
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
        "&::-webkit-scrollbar": { display: "none" },
      }}
    >
      <Typography fontWeight={600} fontSize={16}>
        {label}
      </Typography>
      {loading ? (
        <Typography fontSize={14}>불러오는 중...</Typography>
      ) : items.length === 0 ? (
        <Typography color="var(--text-300)" fontSize={14}>
          선택 가능한 항목이 없습니다
        </Typography>
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
  );
}