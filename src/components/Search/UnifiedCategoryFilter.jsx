// src/components/Search/UnifiedCategoryFilter.jsx
import {
  Dialog,
  Box,
  Typography,
  IconButton,
  Chip,
  Button,
  InputBase,
  Tabs,
  Tab,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import RestartAltIcon from "@mui/icons-material/RestartAlt";
import CheckIcon from "@mui/icons-material/Check";
import SearchIcon from "@mui/icons-material/Search";
import { useEffect, useState, useRef } from "react";
import { CategoryService } from "../../lib/api/categoryApi";
import GradientButton from "../Button/GradientButton";

export default function UnifiedCategoryFilter({
  open,
  onClose,
  onSelect,
  selectedCategories = [],
  // 진행 중이던 상태를 외부에서 관리하기 위한 props 추가
  savedParent = "",
  setSavedParent,
  savedMiddle = "",
  setSavedMiddle,
  savedTab = 0,
  setSavedTab,
}) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  // 카테고리 데이터 상태
  const [parentCategories, setParentCategories] = useState([]);
  const [middleCategories, setMiddleCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);

  // 선택 상태 (다이얼로그 내부에서만 사용)
  const [tempSelectedItems, setTempSelectedItems] = useState([]);
  const [selectedParent, setSelectedParent] = useState("");
  const [selectedMiddle, setSelectedMiddle] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  // 모바일용 탭 상태
  const [currentTab, setCurrentTab] = useState(0);

  // 이전 open 상태 추적
  const prevOpenRef = useRef(false);

  // 다이얼로그가 열릴 때 데이터 초기화 및 이전 선택 상태 복원
  useEffect(() => {
    // 모달이 새로 열릴 때만 초기화 로직 실행
    if (open && !prevOpenRef.current) {
      // 부모로부터 받은 선택 항목 복원
      setTempSelectedItems(selectedCategories ? [...selectedCategories] : []);

      // 이전에 진행 중이던 상태 복원
      if (savedParent) {
        setSelectedParent(savedParent);

        // 대분류에 해당하는 중분류 데이터 로드
        CategoryService.getMiddleCategories(savedParent).then((middles) => {
          setMiddleCategories(middles);

          if (savedMiddle) {
            setSelectedMiddle(savedMiddle);

            // 중분류에 해당하는 소분류 데이터 로드
            CategoryService.getSubcategories(savedParent, savedMiddle).then(
              (subs) => {
                const parsedSubs =
                  Array.isArray(subs) && typeof subs[0] === "object"
                    ? subs.map((s) => s.subcategory)
                    : subs;
                setSubCategories(parsedSubs || []);
              }
            );
          }
        });
      } else {
        // 저장된 상태가 없으면 처음부터 시작
        // 대분류 데이터 로드
        CategoryService.getParentCategories().then(setParentCategories);
      }

      // 저장된 탭 상태 복원 (모바일)
      if (isMobile && savedTab !== undefined) {
        setCurrentTab(savedTab);
      }

      // 검색어 초기화
      setSearchTerm("");
    }

    // 다이얼로그가 닫힐 때 현재 진행 상태 저장
    if (!open && prevOpenRef.current) {
      if (setSavedParent) setSavedParent(selectedParent);
      if (setSavedMiddle) setSavedMiddle(selectedMiddle);
      if (setSavedTab) setSavedTab(currentTab);
    }

    // open 상태 업데이트
    prevOpenRef.current = open;
  }, [
    open,
    selectedCategories,
    savedParent,
    savedMiddle,
    savedTab,
    isMobile,
    setSavedParent,
    setSavedMiddle,
    setSavedTab,
  ]);

  // 대분류 선택 시 중분류 로드
  useEffect(() => {
    if (selectedParent) {
      CategoryService.getMiddleCategories(selectedParent).then(
        setMiddleCategories
      );
      if (selectedParent !== savedParent) {
        setSelectedMiddle("");
        setSubCategories([]);
      }
    }
  }, [selectedParent, savedParent]);

  // 중분류 선택 시 소분류 로드
  useEffect(() => {
    if (selectedParent && selectedMiddle) {
      CategoryService.getSubcategories(selectedParent, selectedMiddle).then(
        (subs) => {
          const parsedSubs =
            Array.isArray(subs) && typeof subs[0] === "object"
              ? subs.map((s) => s.subcategory)
              : subs;
          setSubCategories(parsedSubs || []);
        }
      );
    }
  }, [selectedParent, selectedMiddle]);

  // 대분류 선택 핸들러
  const handleParentClick = (parent) => {
    setSelectedParent(parent);
    if (setSavedParent) setSavedParent(parent);

    if (isMobile) {
      setCurrentTab(1); // 모바일에서 중분류 탭으로 이동
      if (setSavedTab) setSavedTab(1);
    }

    setTempSelectedItems((prev) => {
      const newItems = [...prev];
      const parentPath = parent;

      // 이미 선택된 대분류를 클릭하면 제거
      if (newItems.includes(parentPath)) {
        return newItems.filter((item) => !item.startsWith(parent));
      } else {
        // 선택되지 않은 대분류를 클릭하면 추가
        return [...newItems, parentPath];
      }
    });
  };

  // 중분류 선택 핸들러
  const handleMiddleClick = (middle) => {
    setSelectedMiddle(middle);
    if (setSavedMiddle) setSavedMiddle(middle);

    if (isMobile) {
      setCurrentTab(2); // 모바일에서 소분류 탭으로 이동
      if (setSavedTab) setSavedTab(2);
    }

    setTempSelectedItems((prev) => {
      const newItems = [...prev];
      const parentPath = selectedParent;
      const middlePath = `${selectedParent} > ${middle}`;

      // 이미 선택된 중분류를 클릭하면 제거
      const middleIndex = newItems.findIndex((item) => item === middlePath);
      if (middleIndex !== -1) {
        return newItems.filter((item) => !item.startsWith(middlePath));
      } else {
        // 선택되지 않은 중분류를 클릭하면 추가
        const parentOnlyIndex = newItems.indexOf(parentPath);
        if (parentOnlyIndex !== -1) {
          // 대분류만 있으면 업데이트
          newItems[parentOnlyIndex] = middlePath;
        } else {
          // 대분류가 없으면 추가
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

      // 이미 선택된 소분류를 클릭하면 제거
      const subIndex = newItems.findIndex((item) => item === subPath);
      if (subIndex !== -1) {
        return newItems.filter((item) => item !== subPath);
      } else {
        // 선택되지 않은 소분류를 클릭하면 추가
        const middleOnlyIndex = newItems.findIndex(
          (item) => item === middlePath
        );
        if (middleOnlyIndex !== -1) {
          // 중분류만 있으면 업데이트
          newItems[middleOnlyIndex] = subPath;
        } else {
          // 중분류가 없으면 추가
          newItems.push(subPath);
        }
        return newItems;
      }
    });
  };

  // 초기화 핸들러
  const handleReset = () => {
    setTempSelectedItems([]);
    setSelectedParent("");
    setSelectedMiddle("");
    setSearchTerm("");
    if (isMobile) {
      setCurrentTab(0);
    }

    // 외부 상태도 초기화
    if (setSavedParent) setSavedParent("");
    if (setSavedMiddle) setSavedMiddle("");
    if (setSavedTab) setSavedTab(0);
  };

  // 완료 핸들러
  const handleComplete = () => {
    onSelect(tempSelectedItems);
    onClose();
  };

  // 카테고리 선택 여부 확인
  const isSelected = (path, type) => {
    return tempSelectedItems.some((item) => {
      if (type === "parent") {
        // 대분류 체크: 정확히 일치하거나 하위 경로의 시작
        return item === path || item.startsWith(path + " >");
      } else if (type === "middle") {
        // 중분류 체크: 정확히 일치하거나 하위 경로의 시작
        return item === path || item.startsWith(path + " >");
      } else {
        // 소분류 체크: 정확히 일치
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

  // 이 항목 선택 삭제
  const handleDeleteItem = (item) => {
    setTempSelectedItems((prev) => prev.filter((i) => i !== item));
  };

  // 모바일 뷰
  if (isMobile) {
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

          {/* 검색창 */}
          <Box
            display="flex"
            alignItems="center"
            px={1.5}
            py={1}
            mb={2}
            bgcolor="var(--bg-200)"
            borderRadius="8px"
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
              }}
            />
          </Box>

          {/* 탭 */}
          <Tabs
            value={currentTab}
            onChange={(_, newValue) => setCurrentTab(newValue)}
            variant="fullWidth"
          >
            <Tab label="대분류" />
            <Tab label="중분류" disabled={!selectedParent} />
            <Tab label="소분류" disabled={!selectedMiddle} />
          </Tabs>

          {/* 리스트 영역 */}
          <Box
            flex={1}
            overflow="auto"
            py={2}
            sx={{
              maxHeight: "calc(100vh - 300px)",
              scrollbarWidth: "none",
              "&::-webkit-scrollbar": {
                display: "none",
              },
            }}
          >
            {currentTab === 0 &&
              filterItems(parentCategories).map((item) => {
                const selected = isSelected(item, "parent");
                return (
                  <Box
                    key={item}
                    onClick={() => handleParentClick(item)}
                    sx={{
                      cursor: "pointer",
                      px: 3,
                      py: 1.5,
                      mb: 1,
                      borderRadius: "8px",
                      backgroundColor: selected
                        ? "var(--action-primary-bg)"
                        : "transparent",
                      color: selected
                        ? "var(--primary-100)"
                        : "var(--text-300)",
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

            {currentTab === 1 &&
              filterItems(middleCategories).map((item) => {
                const path = `${selectedParent} > ${item}`;
                const selected = isSelected(path, "middle");
                return (
                  <Box
                    key={item}
                    onClick={() => handleMiddleClick(item)}
                    sx={{
                      cursor: "pointer",
                      px: 3,
                      py: 1.5,
                      mb: 1,
                      borderRadius: "8px",
                      backgroundColor: selected
                        ? "var(--action-primary-bg)"
                        : "transparent",
                      color: selected
                        ? "var(--primary-100)"
                        : "var(--text-300)",
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

            {currentTab === 2 &&
              filterItems(subCategories).map((item) => {
                const path = `${selectedParent} > ${selectedMiddle} > ${item}`;
                const selected = isSelected(path, "sub");
                return (
                  <Box
                    key={item}
                    onClick={() => handleSubClick(item)}
                    sx={{
                      cursor: "pointer",
                      px: 3,
                      py: 1.5,
                      mb: 1,
                      borderRadius: "8px",
                      backgroundColor: selected
                        ? "var(--action-primary-bg)"
                        : "transparent",
                      color: selected
                        ? "var(--primary-100)"
                        : "var(--text-300)",
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
                선택된 항목 ({tempSelectedItems.length})
              </Typography>
              <Box display="flex" flexWrap="wrap" gap={0.5} mb={2}>
                {tempSelectedItems.map((item) => (
                  <Chip
                    key={item}
                    label={item}
                    onDelete={() => handleDeleteItem(item)}
                    sx={{
                      fontSize: 12,
                      height: 28,
                      borderColor: "var(--primary-100)",
                      color: "var(--primary-100)",
                      "& .MuiChip-deleteIcon": {
                        color: "var(--primary-100)",
                        fontSize: 16,
                      },
                    }}
                    variant="outlined"
                  />
                ))}
              </Box>
            </Box>
          )}

          {/* 하단 버튼 */}
          <Box px={2} display="flex" gap={1} mt="auto" pt={2}>
            <Button
              startIcon={<RestartAltIcon />}
              onClick={handleReset}
              variant="outlined"
              sx={{
                borderColor: "var(--text-300)",
                color: "var(--text-300)",
                flex: 1,
                height: 48,
                borderRadius: "8px",
                fontWeight: 500,
              }}
            >
              초기화
            </Button>
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

  // 데스크탑 뷰
  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      <Box p={4} height="90vh" maxHeight="900px" bgcolor="#fefefe">
        {/* 헤더 */}
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
          px={1.5}
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
            }}
          />
        </Box>

        {/* 3단 선택 영역 */}
        <Box display="flex" gap={3} height="45%" mb={3}>
          {/* 대분류 */}
          <Box
            flex={1}
            display="flex"
            flexDirection="column"
            overflow="auto"
            sx={{
              px: 2,
              scrollbarWidth: "none",
              "&::-webkit-scrollbar": {
                display: "none",
              },
            }}
          >
            <Typography fontWeight={600} fontSize={16} mb={1}>
              대분류
            </Typography>
            {filterItems(parentCategories).map((item) => {
              const selected = isSelected(item, "parent");
              return (
                <Box
                  key={item}
                  onClick={() => handleParentClick(item)}
                  sx={{
                    cursor: "pointer",
                    px: 3,
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
                    mb: 1,
                    transition: "all 0.2s ease",
                    "&:hover": {
                      backgroundColor: selected
                        ? "var(--action-primary-bg)"
                        : "var(--bg-200)",
                    },
                  }}
                >
                  <Typography fontSize={16}>{item}</Typography>
                  {selected && <CheckIcon sx={{ fontSize: 18 }} />}
                </Box>
              );
            })}
          </Box>

          {/* 중분류 */}
          <Box
            flex={1}
            display="flex"
            flexDirection="column"
            overflow="auto"
            sx={{
              px: 2,
              scrollbarWidth: "none",
              "&::-webkit-scrollbar": {
                display: "none",
              },
            }}
          >
            <Typography fontWeight={600} fontSize={16} mb={1}>
              중분류
            </Typography>
            {selectedParent ? (
              filterItems(middleCategories).map((item) => {
                const path = `${selectedParent} > ${item}`;
                const selected = isSelected(path, "middle");
                return (
                  <Box
                    key={item}
                    onClick={() => handleMiddleClick(item)}
                    sx={{
                      cursor: "pointer",
                      px: 3,
                      py: 1.5,
                      mb: 1,
                      borderRadius: "8px",
                      backgroundColor: selected
                        ? "var(--action-primary-bg)"
                        : "transparent",
                      color: selected
                        ? "var(--primary-100)"
                        : "var(--text-300)",
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
                    <Typography fontSize={16}>{item}</Typography>
                    {selected && <CheckIcon sx={{ fontSize: 18 }} />}
                  </Box>
                );
              })
            ) : (
              <Typography pl={3} color="var(--text-300)" fontSize={14}>
                대분류를 선택하세요
              </Typography>
            )}
          </Box>

          {/* 소분류 */}
          <Box
            flex={1}
            display="flex"
            flexDirection="column"
            overflow="auto"
            sx={{
              px: 2,
              scrollbarWidth: "none",
              "&::-webkit-scrollbar": {
                display: "none",
              },
            }}
          >
            <Typography fontWeight={600} fontSize={16} mb={1}>
              소분류
            </Typography>
            {selectedMiddle ? (
              filterItems(subCategories).map((item) => {
                const path = `${selectedParent} > ${selectedMiddle} > ${item}`;
                const selected = isSelected(path, "sub");
                return (
                  <Box
                    key={item}
                    onClick={() => handleSubClick(item)}
                    sx={{
                      cursor: "pointer",
                      px: 3,
                      py: 1.5,
                      mb: 1,
                      borderRadius: "8px",
                      backgroundColor: selected
                        ? "var(--action-primary-bg)"
                        : "transparent",
                      color: selected
                        ? "var(--primary-100)"
                        : "var(--text-300)",
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
                    <Typography fontSize={16}>{item}</Typography>
                    {selected && <CheckIcon sx={{ fontSize: 18 }} />}
                  </Box>
                );
              })
            ) : (
              <Typography pl={3} color="var(--text-300)" fontSize={14}>
                중분류를 선택하세요
              </Typography>
            )}
          </Box>
        </Box>

        {/* 선택된 항목 */}
        <Box sx={{ mb: 4, height: "20%", overflow: "auto" }}>
          <Typography fontWeight={500} fontSize={16} mb={1}>
            선택 항목{" "}
            {tempSelectedItems.length > 0
              ? `(${tempSelectedItems.length})`
              : ""}
          </Typography>
          {tempSelectedItems.length > 0 ? (
            <Box display="flex" flexWrap="wrap" gap={1}>
              {tempSelectedItems.map((item) => (
                <Chip
                  key={item}
                  label={item}
                  onDelete={() => handleDeleteItem(item)}
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
          ) : (
            <Typography color="var(--text-300)" fontSize={14}>
              선택된 항목이 없습니다
            </Typography>
          )}
        </Box>

        {/* 하단 버튼 */}
        <Box display="flex" gap={2} mt="auto">
          <Button
            startIcon={<RestartAltIcon />}
            onClick={handleReset}
            sx={{
              border: "1px solid var(--bg-300)",
              height: 52,
              borderRadius: "8px",
              fontWeight: 600,
              fontSize: 16,
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
              color: "#var(--bg-100)",
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
