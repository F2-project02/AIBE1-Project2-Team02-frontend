// src/components/Search/CategoryFilterMobile.jsx
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
import { useEffect, useState, useRef } from "react";
import { CategoryService } from "../../lib/api/categoryApi";

export default function CategoryFilterMobile({
  open,
  onClose,
  onSelect,
  selectedItems = [],
  setSelectedItems,
  selectedParent = "",
  setSelectedParent,
  selectedMiddle = "",
  setSelectedMiddle,
}) {
  const [tab, setTab] = useState(0); // 0: 대, 1: 중, 2: 소
  const [parentCategories, setParentCategories] = useState([]);
  const [middleCategories, setMiddleCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);

  // 내부 임시 상태 추가
  const [tempSelectedItems, setTempSelectedItems] = useState([]);
  const [tempSelectedParent, setTempSelectedParent] = useState("");
  const [tempSelectedMiddle, setTempSelectedMiddle] = useState("");

  // 이전 open 상태 추적
  const prevOpenRef = useRef(false);

  // 모달이 열릴 때 데이터 초기화 및 이전 선택 상태 복원
  useEffect(() => {
    // 모달이 새로 열릴 때만 초기화 로직 실행
    if (open && !prevOpenRef.current) {
      // 부모 컴포넌트에서 받은 상태로 초기화
      setTempSelectedItems(selectedItems ? [...selectedItems] : []);
      setTempSelectedParent(selectedParent || "");
      setTempSelectedMiddle(selectedMiddle || "");

      // 대분류 카테고리 로드
      CategoryService.getParentCategories().then(setParentCategories);

      // 이미 선택된 상위 카테고리가 있다면 하위 카테고리 로드
      if (selectedParent) {
        CategoryService.getMiddleCategories(selectedParent).then(
          setMiddleCategories
        );

        if (selectedMiddle) {
          CategoryService.getSubcategories(selectedParent, selectedMiddle).then(
            (subs) => {
              const parsed =
                Array.isArray(subs) && typeof subs[0] === "object"
                  ? subs.map((s) => s.subcategory)
                  : subs;
              setSubCategories(parsed || []);
            }
          );
          setTab(2); // 소분류 탭으로 초기화
        } else {
          setTab(1); // 중분류 탭으로 초기화
        }
      } else {
        setTab(0); // 대분류 탭으로 초기화
      }
    }

    // open 상태 업데이트
    prevOpenRef.current = open;
  }, [open, selectedItems, selectedParent, selectedMiddle]);

  // 대분류 선택 시 중분류 로드
  useEffect(() => {
    if (tempSelectedParent) {
      CategoryService.getMiddleCategories(tempSelectedParent).then(
        setMiddleCategories
      );
    }
  }, [tempSelectedParent]);

  // 중분류 선택 시 소분류 로드
  useEffect(() => {
    if (tempSelectedMiddle && tempSelectedParent) {
      CategoryService.getSubcategories(
        tempSelectedParent,
        tempSelectedMiddle
      ).then((subs) => {
        const parsed =
          Array.isArray(subs) && typeof subs[0] === "object"
            ? subs.map((s) => s.subcategory)
            : subs;
        setSubCategories(parsed || []);
      });
    }
  }, [tempSelectedMiddle, tempSelectedParent]);

  const handleTabChange = (_, newValue) => setTab(newValue);

  const handleItemClick = (item) => {
    if (tab === 0) {
      // 대분류 선택
      setTempSelectedParent(item);
      setTab(1);

      setTempSelectedItems((prev) => {
        const newItems = [...prev];

        if (newItems.includes(item)) {
          // 선택 해제: 해당 대분류로 시작하는 모든 항목 제거
          return newItems.filter((i) => !i.startsWith(item));
        } else {
          // 선택: 대분류만 추가
          return [...newItems, item];
        }
      });
    } else if (tab === 1) {
      // 중분류 선택
      setTempSelectedMiddle(item);
      setTab(2);

      setTempSelectedItems((prev) => {
        const newItems = [...prev];
        const parentPath = tempSelectedParent;
        const middlePath = `${tempSelectedParent} > ${item}`;

        const middleIndex = newItems.findIndex((i) => i === middlePath);

        if (middleIndex !== -1) {
          // 중분류 선택 해제
          return newItems.filter((i) => !i.startsWith(middlePath));
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
    } else {
      // 소분류 선택
      setTempSelectedItems((prev) => {
        const newItems = [...prev];
        const middlePath = `${tempSelectedParent} > ${tempSelectedMiddle}`;
        const subPath = `${tempSelectedParent} > ${tempSelectedMiddle} > ${item}`;

        const subIndex = newItems.findIndex((i) => i === subPath);

        if (subIndex !== -1) {
          // 소분류 선택 해제
          return newItems.filter((i) => i !== subPath);
        } else {
          // 소분류 선택
          const middleOnlyIndex = newItems.findIndex((i) => i === middlePath);

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
    }
  };

  const handleComplete = () => {
    // 부모 컴포넌트의 상태 업데이트
    setSelectedItems(tempSelectedItems);
    setSelectedParent(tempSelectedParent);
    setSelectedMiddle(tempSelectedMiddle);

    // 검색 실행
    onSelect(tempSelectedItems);
    onClose();
  };

  const handleReset = () => {
    setTempSelectedItems([]);
    setTempSelectedParent("");
    setTempSelectedMiddle("");
    setTab(0);
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

  const items =
    tab === 0 ? parentCategories : tab === 1 ? middleCategories : subCategories;

  return (
    <Dialog open={open} onClose={onClose} fullScreen>
      <Box
        height="100vh"
        bgcolor="#fefefe"
        display="flex"
        flexDirection="column"
        px={1.5}
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
            카테고리 선택
          </Typography>
          <Box width={40} />
        </Box>

        <Tabs value={tab} onChange={handleTabChange} variant="fullWidth">
          <Tab label="대분류" />
          <Tab label="중분류" disabled={!tempSelectedParent} />
          <Tab label="소분류" disabled={!tempSelectedMiddle} />
        </Tabs>

        {/* 리스트 */}
        <Box
          flex={1}
          overflow="auto"
          py={2}
          sx={{
            maxHeight: "calc(100vh - 280px)",
            // 스크롤바 숨기기
            scrollbarWidth: "thin", // Firefox
            msOverflowStyle: "none", // IE, Edge
            "&::-webkit-scrollbar": {
              display: "none", // Chrome, Safari, Opera
            },
          }}
        >
          {items.map((item) => {
            let selected = false;

            if (tab === 0) {
              selected = isSelected(item, "parent");
            } else if (tab === 1) {
              const path = `${tempSelectedParent} > ${item}`;
              selected = isSelected(path, "middle");
            } else {
              const path = `${tempSelectedParent} > ${tempSelectedMiddle} > ${item}`;
              selected = isSelected(path, "sub");
            }

            return (
              <Box
                key={item}
                onClick={() => handleItemClick(item)}
                sx={{
                  cursor: "pointer",
                  px: 3,
                  py: 1.5,
                  mb: 1,
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
                <Typography fontSize={15}>{item}</Typography>
                {selected && <CheckIcon sx={{ fontSize: 18 }} />}
              </Box>
            );
          })}
        </Box>

        {/* 선택된 항목 */}
        {tempSelectedItems.length > 0 && (
          <Box mt={2} px={2}>
            <Typography fontSize={14} fontWeight={500} mb={1}>
              선택된 항목
            </Typography>
            <Box
              display="flex"
              flexWrap="wrap"
              gap={0.5}
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
                  key={item}
                  label={item}
                  onDelete={() => {
                    setTempSelectedItems((prev) =>
                      prev.filter((i) => i !== item)
                    );
                  }}
                  sx={{
                    fontSize: 12,
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
        <Box px={2} display="flex" gap={1} mt={3}>
          <Chip
            icon={<RestartAltIcon sx={{ fontSize: 18 }} />}
            label="초기화"
            onClick={handleReset}
            sx={{
              borderColor: "var(--text-300)",
              color: "var(--text-300)",
              flex: 1,
              height: 48,
              borderRadius: "8px",
              fontWeight: 500,
            }}
            variant="outlined"
          />
          <GradientButton
            onClick={handleComplete}
            sx={{
              flex: 2,
              height: 48,
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
