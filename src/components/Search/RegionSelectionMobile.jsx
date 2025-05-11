// src/components/Search/RegionSelectionMobile.jsx
import {
  Dialog,
  Box,
  Typography,
  IconButton,
  Chip,
  Tabs,
  Tab,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import CheckIcon from "@mui/icons-material/Check";
import RestartAltIcon from "@mui/icons-material/RestartAlt";
import GradientButton from "../Button/GradientButton";
import { useEffect, useState } from "react";
import { RegionApiService } from "./RegionApiService";

export default function RegionSelectionMobile({
  open,
  onClose,
  onSubmit,
  selectedDongs,
  setSelectedDongs,
}) {
  const [tab, setTab] = useState(0); // 0: 시/도, 1: 시/군/구, 2: 읍/면/동
  const [provinces, setProvinces] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [dongs, setDongs] = useState([]);
  const [tempSelectedItems, setTempSelectedItems] = useState([]);
  const [selectedProvince, setSelectedProvince] = useState("");
  const [selectedDistrict, setSelectedDistrict] = useState("");

  useEffect(() => {
    if (open) {
      RegionApiService.getSidos().then(setProvinces);
      setTempSelectedItems(selectedDongs ? [...selectedDongs] : []);
      setTab(0);
    }
  }, [open, selectedDongs]);

  useEffect(() => {
    if (selectedProvince) {
      RegionApiService.getSigungus(selectedProvince).then(setDistricts);
    }
  }, [selectedProvince]);

  useEffect(() => {
    if (selectedDistrict) {
      RegionApiService.getDongs(selectedProvince, selectedDistrict).then(
        setDongs
      );
    }
  }, [selectedDistrict, selectedProvince]);

  const handleTabChange = (_, newValue) => setTab(newValue);

  const handleItemClick = async (item) => {
    if (tab === 0) {
      // 시/도 선택
      setSelectedProvince(item);
      setTab(1);

      setTempSelectedItems((prev) => {
        const newItems = [...prev];
        const provinceItem = {
          regionCode: `sido_${item}`,
          sido: item,
          sigungu: "",
          dong: "",
          displayName: item,
        };

        const existingIndex = newItems.findIndex(
          (i) => i.sido === item && !i.sigungu && !i.dong
        );

        if (existingIndex !== -1) {
          // 선택 해제: 해당 시/도로 시작하는 모든 항목 제거
          return newItems.filter((i) => i.sido !== item);
        } else {
          // 선택: 시/도만 추가
          return [...newItems, provinceItem];
        }
      });
    } else if (tab === 1) {
      // 시/군/구 선택
      setSelectedDistrict(item);
      setTab(2);

      setTempSelectedItems((prev) => {
        const newItems = [...prev];
        const districtItem = {
          regionCode: `sigungu_${selectedProvince}_${item}`,
          sido: selectedProvince,
          sigungu: item,
          dong: "",
          displayName: `${selectedProvince} ${item}`,
        };

        const existingIndex = newItems.findIndex(
          (i) => i.sido === selectedProvince && i.sigungu === item && !i.dong
        );

        if (existingIndex !== -1) {
          // 선택 해제
          return newItems.filter(
            (i) => !(i.sido === selectedProvince && i.sigungu === item)
          );
        } else {
          // 선택
          const provinceOnlyIndex = newItems.findIndex(
            (i) => i.sido === selectedProvince && !i.sigungu && !i.dong
          );

          if (provinceOnlyIndex !== -1) {
            // 시/도만 있으면 시/군/구로 업데이트
            newItems[provinceOnlyIndex] = districtItem;
          } else {
            // 시/도가 없으면 시/군/구 추가
            newItems.push(districtItem);
          }

          return newItems;
        }
      });
    } else {
      // 읍/면/동 선택
      setTempSelectedItems((prev) => {
        const newItems = [...prev];
        const dongItem = {
          ...item,
          displayName: `${item.sido} ${item.sigungu} ${item.dong || ""}`.trim(),
        };

        const existingIndex = newItems.findIndex(
          (i) => i.regionCode === item.regionCode
        );

        if (existingIndex !== -1) {
          // 선택 해제
          return newItems.filter((i) => i.regionCode !== item.regionCode);
        } else {
          // 선택
          const districtOnlyIndex = newItems.findIndex(
            (i) =>
              i.sido === selectedProvince &&
              i.sigungu === selectedDistrict &&
              !i.dong
          );

          if (districtOnlyIndex !== -1) {
            // 시/군/구만 있으면 읍/면/동으로 업데이트
            newItems[districtOnlyIndex] = dongItem;
          } else {
            // 시/군/구가 없으면 읍/면/동 추가
            newItems.push(dongItem);
          }

          return newItems;
        }
      });
    }
  };

  const handleComplete = () => {
    onSubmit(tempSelectedItems);
    setSelectedDongs(tempSelectedItems);
    onClose();
  };

  const handleReset = () => {
    setTempSelectedItems([]);
    setSelectedProvince("");
    setSelectedDistrict("");
    setTab(0);
  };

  // 지역 선택 여부 확인 (상위 지역도 체크)
  const isSelected = (item, type) => {
    return tempSelectedItems.some((selected) => {
      if (type === "province") {
        return selected.sido === item;
      } else if (type === "district") {
        return selected.sido === selectedProvince && selected.sigungu === item;
      } else {
        return selected.regionCode === item.regionCode;
      }
    });
  };

  const currentItems = tab === 0 ? provinces : tab === 1 ? districts : dongs;

  return (
    <Dialog open={open} onClose={onClose} fullScreen>
      <Box
        height="100%"
        bgcolor="#fefefe"
        display="block"
        flexDirection="column"
        pt={3}
        pb={2}
      >
        {/* 상단 바 */}
        <Box
          display="flex"
          alignItems="center"
          justifyContent="space-between"
          px={2}
          py={1}
          mb={2}
        >
          <IconButton onClick={onClose}>
            <CloseIcon />
          </IconButton>
          <Typography fontSize={18} fontWeight={600}>
            지역 선택
          </Typography>
          <Box width={40} />
        </Box>

        <Tabs
          value={tab}
          onChange={handleTabChange}
          variant="fullWidth"
          sx={{
            borderBottom: 1,
            borderColor: "divider",
            "& .MuiTab-root": {
              fontSize: 15,
              fontWeight: 500,
              color: "var(--text-300)",
              "&.Mui-selected": {
                color: "var(--primary-100)",
                fontWeight: 600,
              },
            },
          }}
        >
          <Tab label="시/도" />
          <Tab label="시/군/구" disabled={!selectedProvince} />
          <Tab label="읍/면/동" disabled={!selectedDistrict} />
        </Tabs>

        {/* 리스트 */}
        <Box
          flex={1}
          overflow="auto"
          py={2}
          sx={{
            maxHeight: "calc(100vh - 280px)",
            // 스크롤바 숨기기
            scrollbarWidth: "none", // Firefox
            msOverflowStyle: "none", // IE, Edge
            "&::-webkit-scrollbar": {
              display: "none", // Chrome, Safari, Opera
            },
          }}
        >
          {currentItems.map((item) => {
            const type =
              tab === 0 ? "province" : tab === 1 ? "district" : "dong";
            const itemName =
              type === "dong" ? item.dong || `${item.sigungu} 전체` : item;
            const selected = isSelected(item, type);

            return (
              <Box
                key={type === "dong" ? item.regionCode : item}
                onClick={() => handleItemClick(item)}
                sx={{
                  cursor: "pointer",
                  px: 3,
                  py: 1.5,
                  mb: 0.5,
                  borderRadius: "8px",
                  backgroundColor: selected
                    ? "var(--action-primary-bg)"
                    : "transparent",
                  color: selected ? "var(--primary-100)" : "var(--text-300)",
                  fontWeight: selected ? 600 : 500,
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  "&:hover": {
                    backgroundColor: selected
                      ? "var(--action-primary-bg)"
                      : "var(--bg-200)",
                  },
                }}
              >
                <Typography fontSize={15}>{itemName}</Typography>
                {selected && <CheckIcon sx={{ fontSize: 18 }} />}
              </Box>
            );
          })}
        </Box>

        {/* 선택된 항목 */}
        {tempSelectedItems.length > 0 && (
          <Box mt={2} px={2}>
            <Typography fontSize={14} fontWeight={500} mb={1}>
              선택된 지역
            </Typography>
            <Box
              display="flex"
              flexWrap="wrap"
              gap={1}
              maxHeight={100}
              overflow="auto"
              sx={{
                // 스크롤바 숨기기
                scrollbarWidth: "none", // Firefox
                msOverflowStyle: "none", // IE, Edge
                "&::-webkit-scrollbar": {
                  display: "none", // Chrome, Safari, Opera
                },
              }}
            >
              {tempSelectedItems.map((item) => (
                <Chip
                  key={item.regionCode}
                  label={item.displayName}
                  onDelete={() => {
                    setTempSelectedItems((prev) =>
                      prev.filter((i) => i.regionCode !== item.regionCode)
                    );
                  }}
                  sx={{
                    fontSize: 13,
                    height: 28,
                    borderColor: "var(--primary-100)",
                    color: "var(--primary-100)",
                    "& .MuiChip-deleteIcon": {
                      color: "var(--primary-100)",
                      fontSize: 16,
                      "&:hover": {
                        color: "var(--primary-200)",
                      },
                    },
                  }}
                  variant="outlined"
                />
              ))}
            </Box>
          </Box>
        )}

        {/* 하단 버튼 */}
        <Box px={2} display="flex" gap={1} mt={3} mb={8}>
          <Chip
            icon={<RestartAltIcon sx={{ fontSize: 18 }} />}
            label="초기화"
            onClick={handleReset}
            sx={{
              borderColor: "var(--text-300)",
              color: "var(--text-300)",
              flex: 1,
              height: 52,
              borderRadius: "8px",
              fontWeight: 500,
            }}
            variant="outlined"
          />
          <GradientButton
            onClick={handleComplete}
            sx={{
              flex: 2,
              height: 52,
              borderRadius: "8px",
              fontWeight: 600,
              fontSize: 16,
              color: "var(--bg-100)",
            }}
            disabled={tempSelectedItems.length === 0}
          >
            선택 완료
          </GradientButton>
        </Box>
      </Box>
    </Dialog>
  );
}
