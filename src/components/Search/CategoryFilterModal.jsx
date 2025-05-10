// src/components/Search/CategoryFilterModal.jsx
import {
  Dialog,
  Box,
  Typography,
  IconButton,
  Chip,
  Button,
  InputBase,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import RestartAltIcon from "@mui/icons-material/RestartAlt";
import CheckIcon from "@mui/icons-material/Check";
import SearchIcon from "@mui/icons-material/Search";
import { useEffect, useState } from "react";
import { CategoryService } from "../../lib/api/categoryApi";
import GradientButton from "../Button/GradientButton";

export default function CategoryFilterModal({
  open,
  onClose,
  onSelect,
  selectedItems,
  setSelectedItems,
}) {
  // 카테고리 데이터
  const [parentCategories, setParentCategories] = useState([]);
  const [middleCategories, setMiddleCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const [loading, setLoading] = useState(false);

  // 내부 상태
  const [tempSelectedItems, setTempSelectedItems] = useState([]);
  const [selectedParent, setSelectedParent] = useState("");
  const [selectedMiddle, setSelectedMiddle] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  // 다이얼로그가 열릴 때 데이터 초기화
  useEffect(() => {
    if (open) {
      CategoryService.getParentCategories().then(setParentCategories);
      setTempSelectedItems(selectedItems ? [...selectedItems] : []);
      setSearchTerm("");
    }
  }, [open, selectedItems]);

  // 대분류 선택시 중분류 로드
  useEffect(() => {
    if (selectedParent) {
      CategoryService.getMiddleCategories(selectedParent).then(
        setMiddleCategories
      );
    } else {
      setMiddleCategories([]);
    }
    setSelectedMiddle("");
    setSubCategories([]);
  }, [selectedParent]);

  // 중분류 선택시 소분류 로드
  useEffect(() => {
    if (selectedMiddle) {
      CategoryService.getSubcategories(selectedParent, selectedMiddle).then(
        (subs) => {
          const parsedSubs =
            Array.isArray(subs) && typeof subs[0] === "object"
              ? subs.map((s) => s.subcategory)
              : subs;
          setSubCategories(parsedSubs || []);
        }
      );
    } else {
      setSubCategories([]);
    }
  }, [selectedMiddle, selectedParent]);

  // 대분류 선택 핸들러
  const handleParentClick = (parent) => {
    setSelectedParent(parent);

    setTempSelectedItems((prev) => {
      const newItems = [...prev];
      const parentPath = parent;

      if (newItems.includes(parentPath)) {
        // 선택 해제: 해당 대분류로 시작하는 모든 항목 제거
        return newItems.filter((item) => !item.startsWith(parent));
      } else {
        // 선택: 대분류만 추가
        return [...newItems, parentPath];
      }
    });
  };

  // 중분류 선택 핸들러
  const handleMiddleClick = (middle) => {
    setSelectedMiddle(middle);

    setTempSelectedItems((prev) => {
      const newItems = [...prev];
      const parentPath = selectedParent;
      const middlePath = `${selectedParent} > ${middle}`;

      // 중분류가 이미 선택되어 있는지 확인
      const middleIndex = newItems.findIndex((item) => item === middlePath);

      if (middleIndex !== -1) {
        // 중분류 선택 해제: 해당 중분류와 그 하위 소분류 제거
        return newItems.filter((item) => !item.startsWith(middlePath));
      } else {
        // 중분류 선택
        const parentOnlyIndex = newItems.indexOf(parentPath);

        if (parentOnlyIndex !== -1) {
          // 대분류만 있으면 중분류로 업데이트
          newItems[parentOnlyIndex] = middlePath;
        } else {
          // 대분류가 없으면 중분류 추가
          newItems.push(middlePath);
        }

        return newItems;
      }
    });
  };

  // 소분류 선택 핸들러
  const handleSubClick = (sub) => {
    setTempSelectedItems((prev) => {
      const newItems = [...prev];
      const middlePath = `${selectedParent} > ${selectedMiddle}`;
      const subPath = `${selectedParent} > ${selectedMiddle} > ${sub}`;

      // 소분류가 이미 선택되어 있는지 확인
      const subIndex = newItems.findIndex((item) => item === subPath);

      if (subIndex !== -1) {
        // 소분류 선택 해제
        return newItems.filter((item) => item !== subPath);
      } else {
        // 소분류 선택
        const middleOnlyIndex = newItems.findIndex(
          (item) => item === middlePath
        );

        if (middleOnlyIndex !== -1) {
          // 중분류만 있으면 소분류로 업데이트
          newItems[middleOnlyIndex] = subPath;
        } else {
          // 중분류가 없으면 소분류 추가
          newItems.push(subPath);
        }

        return newItems;
      }
    });
  };

  // 완료 핸들러
  const handleComplete = () => {
    onSelect(tempSelectedItems);
    setSelectedItems(tempSelectedItems);
    onClose();
  };

  // 초기화 핸들러
  const handleReset = () => {
    setTempSelectedItems([]);
    setSelectedParent("");
    setSelectedMiddle("");
    setSearchTerm("");
  };

  // 카테고리 선택 여부 확인 (상위 카테고리도 체크)
  const isSelected = (path, type) => {
    return tempSelectedItems.some((item) => {
      if (type === "parent") {
        // 대분류 체크: 해당 대분류로 시작하는 항목이 있는지 확인
        return item.startsWith(path);
      } else if (type === "middle") {
        // 중분류 체크: 정확히 매치하거나 해당 중분류로 시작하는 소분류가 있는지 확인
        return item === path || item.startsWith(path + " >");
      } else {
        // 소분류 체크: 정확히 매치하는지 확인
        return item === path;
      }
    });
  };

  // 검색 필터링
  const filterItems = (items) =>
    searchTerm.trim()
      ? items.filter((item) =>
          item.toLowerCase().includes(searchTerm.toLowerCase())
        )
      : items;

  // 카테고리 컬럼 렌더링
  const CategoryColumn = ({ label, items, selectedItems, onItemClick }) => (
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
          {label === "중분류"
            ? "대분류를 선택하세요"
            : label === "소분류"
            ? "중분류를 선택하세요"
            : ""}
        </Typography>
      ) : (
        filterItems(items).map((item) => {
          let selected = false;

          if (label === "대분류") {
            selected = isSelected(item, "parent");
          } else if (label === "중분류") {
            const path = `${selectedParent} > ${item}`;
            selected = isSelected(path, "middle");
          } else {
            const path = `${selectedParent} > ${selectedMiddle} > ${item}`;
            selected = isSelected(path, "sub");
          }

          return (
            <Box
              key={item}
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
              <Typography fontSize={14}>{item}</Typography>
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
              과목 필터
            </Typography>
          </Box>
        </Box>

        {/* 검색창 */}
        <Box
          display="flex"
          alignItems="center"
          px={2}
          py={1}
          bgcolor="var(--bg-200)"
          borderRadius="8px"
          mb={4}
        >
          <SearchIcon sx={{ color: "var(--text-400)", mr: 1 }} />
          <InputBase
            placeholder="과목명으로 검색"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            fullWidth
            sx={{
              color: "var(--text-100)",
              fontSize: 15,
              "& ::placeholder": {
                color: "var(--text-400)",
              },
            }}
          />
        </Box>

        {/* 3단 선택 영역 */}
        <Box display="flex" gap={3} mb={4}>
          <CategoryColumn
            label="대분류"
            items={parentCategories}
            selectedItems={tempSelectedItems}
            onItemClick={handleParentClick}
          />
          <CategoryColumn
            label="중분류"
            items={middleCategories}
            selectedItems={tempSelectedItems}
            onItemClick={handleMiddleClick}
          />
          <CategoryColumn
            label="소분류"
            items={subCategories}
            selectedItems={tempSelectedItems}
            onItemClick={handleSubClick}
          />
        </Box>

        {/* 선택된 항목 */}
        {tempSelectedItems.length > 0 && (
          <Box mt={4}>
            <Typography fontWeight={500} fontSize={16} mb={1}>
              선택 항목 {tempSelectedItems.length}
            </Typography>
            <Box display="flex" flexWrap="wrap" gap={1}>
              {tempSelectedItems.map((item) => (
                <Chip
                  key={item}
                  label={item}
                  onDelete={() =>
                    setTempSelectedItems((prev) =>
                      prev.filter((i) => i !== item)
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
