// src/components/Search/RegionSelectionModal.jsx
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
import { useEffect, useState } from "react";
import { RegionApiService } from "./RegionApiService";
import GradientButton from "../Button/GradientButton";

export default function RegionSelectionModal({
  open,
  onClose,
  onSubmit,
  selectedDongs,
  setSelectedDongs,
}) {
  // 지역 데이터
  const [provinces, setProvinces] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [dongs, setDongs] = useState([]);
  const [loading, setLoading] = useState(false);

  // 내부 상태
  const [tempSelectedItems, setTempSelectedItems] = useState([]);
  const [selectedProvince, setSelectedProvince] = useState("");
  const [selectedDistrict, setSelectedDistrict] = useState("");

  // 다이얼로그가 열릴 때 데이터 초기화
  useEffect(() => {
    if (open) {
      RegionApiService.getSidos().then(setProvinces);
      setTempSelectedItems(selectedDongs ? [...selectedDongs] : []);
    }
  }, [open, selectedDongs]);

  // 시/도 선택시 시/군/구 로드
  useEffect(() => {
    if (selectedProvince) {
      RegionApiService.getSigungus(selectedProvince).then(setDistricts);
    } else {
      setDistricts([]);
    }
    setSelectedDistrict("");
    setDongs([]);
  }, [selectedProvince]);

  // 시/군/구 선택시 읍/면/동 로드
  useEffect(() => {
    if (selectedDistrict) {
      RegionApiService.getDongs(selectedProvince, selectedDistrict).then(
        setDongs
      );
    } else {
      setDongs([]);
    }
  }, [selectedDistrict, selectedProvince]);

  // 시/도 선택 핸들러
  const handleProvinceClick = (province) => {
    setSelectedProvince(province);

    setTempSelectedItems((prev) => {
      const newItems = [...prev];
      const provinceItem = {
        regionCode: `sido_${province}`,
        sido: province,
        sigungu: "",
        dong: "",
        displayName: province,
      };

      // 이미 선택되어 있는지 확인
      const existingIndex = newItems.findIndex(
        (item) => item.sido === province && !item.sigungu && !item.dong
      );

      if (existingIndex !== -1) {
        // 선택 해제: 해당 시/도로 시작하는 모든 항목 제거
        return newItems.filter((item) => item.sido !== province);
      } else {
        // 선택: 시/도만 추가
        return [...newItems, provinceItem];
      }
    });
  };

  // 시/군/구 선택 핸들러
  const handleDistrictClick = (district) => {
    setSelectedDistrict(district);

    setTempSelectedItems((prev) => {
      const newItems = [...prev];
      const districtItem = {
        regionCode: `sigungu_${selectedProvince}_${district}`,
        sido: selectedProvince,
        sigungu: district,
        dong: "",
        displayName: `${selectedProvince} ${district}`,
      };

      // 이미 선택되어 있는지 확인
      const existingIndex = newItems.findIndex(
        (item) =>
          item.sido === selectedProvince &&
          item.sigungu === district &&
          !item.dong
      );

      if (existingIndex !== -1) {
        // 선택 해제: 해당 시/군/구와 하위 읍/면/동 제거
        return newItems.filter(
          (item) =>
            !(item.sido === selectedProvince && item.sigungu === district)
        );
      } else {
        // 선택: 시/도만 있으면 시/군/구로 업데이트, 아니면 추가
        const provinceOnlyIndex = newItems.findIndex(
          (item) =>
            item.sido === selectedProvince && !item.sigungu && !item.dong
        );

        if (provinceOnlyIndex !== -1) {
          newItems[provinceOnlyIndex] = districtItem;
        } else {
          newItems.push(districtItem);
        }

        return newItems;
      }
    });
  };

  // 읍/면/동 선택 핸들러
  const handleDongClick = (dong) => {
    setTempSelectedItems((prev) => {
      const newItems = [...prev];
      const dongItem = {
        ...dong,
        displayName: `${dong.sido} ${dong.sigungu} ${dong.dong || ""}`.trim(),
      };

      // 이미 선택되어 있는지 확인
      const existingIndex = newItems.findIndex(
        (item) => item.regionCode === dong.regionCode
      );

      if (existingIndex !== -1) {
        // 선택 해제
        return newItems.filter((item) => item.regionCode !== dong.regionCode);
      } else {
        // 선택: 시/군/구만 있으면 읍/면/동으로 업데이트, 아니면 추가
        const districtOnlyIndex = newItems.findIndex(
          (item) =>
            item.sido === selectedProvince &&
            item.sigungu === selectedDistrict &&
            !item.dong
        );

        if (districtOnlyIndex !== -1) {
          newItems[districtOnlyIndex] = dongItem;
        } else {
          newItems.push(dongItem);
        }

        return newItems;
      }
    });
  };

  // 완료 핸들러
  const handleComplete = () => {
    onSubmit(tempSelectedItems);
    setSelectedDongs(tempSelectedItems);
    onClose();
  };

  // 초기화 핸들러
  const handleReset = () => {
    setTempSelectedItems([]);
    setSelectedProvince("");
    setSelectedDistrict("");
  };

  // 지역 선택 여부 확인 (상위 지역도 체크)
  const isSelected = (item, type) => {
    return tempSelectedItems.some((selected) => {
      if (type === "province") {
        // 시/도 체크: 해당 시/도를 포함하는 항목이 있는지 확인
        return selected.sido === item;
      } else if (type === "district") {
        // 시/군/구 체크: 해당 시/군/구를 포함하는 항목이 있는지 확인
        return selected.sido === selectedProvince && selected.sigungu === item;
      } else {
        // 읍/면/동 체크: 정확히 매치하는지 확인
        return selected.regionCode === item.regionCode;
      }
    });
  };

  // 지역 컬럼 렌더링
  const RegionColumn = ({ label, items, onItemClick, type }) => (
    <Box
      flex={1}
      display="flex"
      flexDirection="column"
      gap={1}
      overflow="auto"
      sx={{
        pr: 2,
        maxHeight: 400,
        // 스크롤바 숨기기
        scrollbarWidth: "none", // Firefox
        msOverflowStyle: "none", // IE, Edge
        "&::-webkit-scrollbar": {
          display: "none", // Chrome, Safari, Opera
        },
      }}
    >
      <Typography fontWeight={600} fontSize={16} mb={1} pl={1}>
        {label}
      </Typography>
      {items.length === 0 ? (
        <Typography pl={1} color="var(--text-300)" fontSize={14}>
          {label === "시/군/구"
            ? "시/도를 선택하세요"
            : label === "읍/면/동"
            ? "시/군/구를 선택하세요"
            : ""}
        </Typography>
      ) : (
        items.map((item) => {
          const itemName =
            type === "dong" ? item.dong || `${item.sigungu} 전체` : item;
          const selected = isSelected(item, type);

          return (
            <Box
              key={type === "dong" ? item.regionCode : item}
              onClick={() => onItemClick(item)}
              sx={{
                cursor: "pointer",
                px: 2,
                py: 1.5,
                borderRadius: "8px",
                backgroundColor: selected
                  ? "var(--action-primary-bg)"
                  : "transparent",
                color: selected ? "var(--primary-100)" : "var(--text-300)",
                fontWeight: selected ? 600 : 500,
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                transition: "all 0.2s ease",
                "&:hover": {
                  backgroundColor: selected
                    ? "var(--action-primary-bg)"
                    : "var(--bg-200)",
                },
              }}
            >
              <Typography fontSize={14}>{itemName}</Typography>
              {selected && <CheckIcon sx={{ fontSize: 18 }} />}
            </Box>
          );
        })
      )}
    </Box>
  );

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      <Box p={4} bgcolor="#fefefe">
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
        <Box display="flex" gap={3} mb={4}>
          <RegionColumn
            label="시/도"
            items={provinces}
            onItemClick={handleProvinceClick}
            type="province"
          />
          <RegionColumn
            label="시/군/구"
            items={districts}
            onItemClick={handleDistrictClick}
            type="district"
          />
          <RegionColumn
            label="읍/면/동"
            items={dongs}
            onItemClick={handleDongClick}
            type="dong"
          />
        </Box>

        {/* 선택된 항목 */}
        {tempSelectedItems.length > 0 && (
          <Box mt={4}>
            <Typography fontWeight={500} fontSize={16} mb={1}>
              선택 지역 {tempSelectedItems.length}
            </Typography>
            <Box display="flex" flexWrap="wrap" gap={1}>
              {tempSelectedItems.map((item) => (
                <Chip
                  key={item.regionCode}
                  label={item.displayName}
                  onDelete={() =>
                    setTempSelectedItems((prev) =>
                      prev.filter((i) => i.regionCode !== item.regionCode)
                    )
                  }
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
        )}

        {/* 하단 버튼 */}
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
              flexGrow: 1,
              height: 52,
              borderRadius: "8px",
              fontWeight: 600,
              fontSize: 16,
              color: "#fefefe",
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
