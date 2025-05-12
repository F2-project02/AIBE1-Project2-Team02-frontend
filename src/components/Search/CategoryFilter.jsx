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
import { useEffect, useState, useRef, useMemo } from "react";
import { CategoryService } from "../../lib/api/categoryApi";
import GradientButton from "../Button/GradientButton";

export default function CategoryFilter({
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

  // 데이터 캐싱을 위한 상태
  const [dataCache, setDataCache] = useState({
    parents: [],
    middles: {},
    subs: {},
  });

  // 카테고리 데이터 상태
  const [parentCategories, setParentCategories] = useState([]);
  const [middleCategories, setMiddleCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const [backgroundLoading, setBackgroundLoading] = useState(false);

  // 선택 상태 (다이얼로그 내부에서만 사용)
  const [tempSelectedItems, setTempSelectedItems] = useState([]);
  const [selectedParent, setSelectedParent] = useState("");
  const [selectedMiddle, setSelectedMiddle] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  // 모바일용 탭 상태
  const [currentTab, setCurrentTab] = useState(0);

  // 스크롤 위치 참조 변수
  const parentScrollRef = useRef(null);
  const middleScrollRef = useRef(null);
  const subScrollRef = useRef(null);

  // 이전 open 상태 추적
  const prevOpenRef = useRef(false);

  // 최초 접속 시 대분류 데이터 로드
  useEffect(() => {
    const loadInitialData = async () => {
      try {
        if (dataCache.parents.length === 0) {
          const parentCats = await CategoryService.getParentCategories();
          setParentCategories(parentCats);
          setDataCache((prev) => ({ ...prev, parents: parentCats }));
        } else {
          setParentCategories(dataCache.parents);
        }
      } catch (error) {
        console.error("대분류 목록 로드 실패:", error);
        // 실패 시 빈 배열로 초기화
        setParentCategories([]);
      }
    };

    loadInitialData();
  }, [dataCache.parents.length]);

  // 다이얼로그가 열릴 때 데이터 초기화 및 이전 선택 상태 복원
  useEffect(() => {
    // 모달이 새로 열릴 때만 초기화 로직 실행
    if (open && !prevOpenRef.current) {
      // 부모로부터 받은 선택 항목 복원
      setTempSelectedItems(selectedCategories ? [...selectedCategories] : []);

      // 이전에 진행 중이던 상태 복원
      if (savedParent) {
        setSelectedParent(savedParent);
        loadMiddlesForParent(savedParent);

        if (savedMiddle) {
          setSelectedMiddle(savedMiddle);
          loadSubsForMiddle(savedParent, savedMiddle);
        }
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

  // 중분류 데이터 로드 함수 (캐싱 적용)
  const loadMiddlesForParent = async (parent) => {
    try {
      // 캐시에 이미 있는지 확인
      if (dataCache.middles[parent]) {
        setMiddleCategories(dataCache.middles[parent]);
      } else {
        setBackgroundLoading(true);
        const middles = await CategoryService.getMiddleCategories(parent);

        // 결과 저장 및 캐싱
        setMiddleCategories(middles);
        setDataCache((prev) => ({
          ...prev,
          middles: { ...prev.middles, [parent]: middles },
        }));
        setBackgroundLoading(false);
      }
    } catch (error) {
      console.error("중분류 로드 중 오류:", error);
      setMiddleCategories([]);
      setBackgroundLoading(false);
    }
  };

  // 대분류 선택 시 중분류 로드
  useEffect(() => {
    if (selectedParent) {
      loadMiddlesForParent(selectedParent);

      // 대분류가 변경되면 중분류 선택 초기화
      if (selectedParent !== savedParent) {
        setSelectedMiddle("");
        setSubCategories([]);
      }
    }
  }, [selectedParent, savedParent]);

  // 소분류 데이터 로드 함수 (캐싱 적용)
  const loadSubsForMiddle = async (parent, middle) => {
    try {
      const cacheKey = `${parent}-${middle}`;

      // 캐시에 이미 있는지 확인
      if (dataCache.subs[cacheKey]) {
        setSubCategories(dataCache.subs[cacheKey]);
      } else {
        setBackgroundLoading(true);
        const subs = await CategoryService.getSubcategories(parent, middle);

        // 응답 형식 처리 (객체 배열인 경우 문자열 추출)
        const parsedSubs =
          Array.isArray(subs) && subs.length > 0 && typeof subs[0] === "object"
            ? subs.map((s) => s.subcategory)
            : subs;

        // 결과 저장 및 캐싱
        setSubCategories(parsedSubs || []);
        setDataCache((prev) => ({
          ...prev,
          subs: { ...prev.subs, [cacheKey]: parsedSubs || [] },
        }));
        setBackgroundLoading(false);
      }
    } catch (error) {
      console.error("소분류 로드 중 오류:", error);
      setSubCategories([]);
      setBackgroundLoading(false);
    }
  };

  // 중분류 선택 시 소분류 로드
  useEffect(() => {
    if (selectedParent && selectedMiddle) {
      loadSubsForMiddle(selectedParent, selectedMiddle);
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
    // 스크롤 위치 유지를 위해 현재 스크롤 위치 저장
    if (subScrollRef.current) {
      subScrollRef.current.scrollTop = subScrollRef.current.scrollTop;
    }

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
              maxHeight: "calc(100vh - 340px)",
              scrollbarWidth: "none",
              "&::-webkit-scrollbar": {
                display: "none",
              },
            }}
          >
            {currentTab === 0 ? (
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
                      fontWeight: selected ? 600 : 400,
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
              })
            ) : currentTab === 1 ? (
              middleCategories.length > 0 ? (
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
                        fontWeight: selected ? 600 : 400,
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
                })
              ) : (
                <Typography
                  color="var(--text-300)"
                  textAlign="center"
                  px={3}
                  py={2}
                >
                  {backgroundLoading
                    ? "데이터를 불러오는 중입니다..."
                    : "중분류 데이터가 없습니다"}
                </Typography>
              )
            ) : subCategories.length > 0 ? (
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
                      fontWeight: selected ? 600 : 400,
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
              })
            ) : (
              <Typography
                color="var(--text-300)"
                textAlign="center"
                px={3}
                py={2}
              >
                {backgroundLoading
                  ? "데이터를 불러오는 중입니다..."
                  : "소분류 데이터가 없습니다"}
              </Typography>
            )}
          </Box>

          {/* 선택된 항목 */}
          {tempSelectedItems.length > 0 && (
            <Box mt={2} px={2}>
              <Typography fontSize={14} fontWeight={500} mb={1}>
                선택된 항목 ({tempSelectedItems.length})
              </Typography>
              <Box display="flex" flexWrap="wrap" gap={1}>
                {tempSelectedItems.map((item) => (
                  <Chip
                    key={item}
                    label={item}
                    onDelete={() => toggleItem(item)}
                    sx={{
                      fontSize: 13,
                      borderColor: "var(--primary-100)",
                      color: "var(--primary-100)",
                      "& .MuiChip-deleteIcon": {
                        color: "var(--primary-100)",
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
            <Button
              startIcon={<RestartAltIcon />}
              onClick={handleReset}
              variant="outlined"
              sx={{
                borderColor: "var(--text-300)",
                color: "var(--text-300)",
                flex: 1,
                height: 52,
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
                height: 52,
                borderRadius: "8px",
                fontWeight: 600,
                fontSize: 16,
                color: "var(--bg-100)",
              }}
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
      <Box p={4} height="100vh" bgcolor="#fefefe">
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
          <SearchIcon sx={{ color: "var(--text-400)" }} />
          <InputBase
            placeholder="과목명으로 검색"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            fullWidth
            sx={{ color: "var(--text-400)" }}
          />
        </Box>

        {/* 3단 선택 영역 - 높이 320px로 수정해 RegionFilter와 동일하게 */}
        <Box
          display={isMobile ? "block" : "flex"}
          height={isMobile ? "auto" : 300}
          gap={2}
        >
          {/* 대분류 */}
          <Box
            flex={1}
            display="flex"
            flexDirection="column"
            overflow="auto"
            ref={parentScrollRef}
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
            ref={middleScrollRef}
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
              middleCategories.length > 0 ? (
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
                  {backgroundLoading
                    ? "데이터를 불러오는 중입니다..."
                    : "중분류 데이터가 없습니다"}
                </Typography>
              )
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
            ref={subScrollRef}
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
              subCategories.length > 0 ? (
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
                  {backgroundLoading
                    ? "데이터를 불러오는 중입니다..."
                    : "소분류 데이터가 없습니다"}
                </Typography>
              )
            ) : (
              <Typography pl={3} color="var(--text-300)" fontSize={14}>
                중분류를 선택하세요
              </Typography>
            )}
          </Box>
        </Box>

        {/* 선택된 항목 - 높이를 RegionFilter와 동일하게 20%로 설정 */}
        <Box mt={4}>
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
                  onDelete={() => handleDelete(item)}
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
            <Typography color="var(--text-300)" fontSize={16}>
              선택된 항목이 없습니다
            </Typography>
          )}
        </Box>

        {/* 하단 버튼 - 데스크탑 뷰 */}
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
              color: "var(--bg-100)",
            }}
          >
            선택 완료
          </GradientButton>
        </Box>
      </Box>
    </Dialog>
  );
}
