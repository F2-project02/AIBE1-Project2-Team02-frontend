import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import {
  Box,
  Typography,
  Pagination,
  useMediaQuery,
  useTheme,
  TextField,
  IconButton,
  Button,
  Chip,
  Collapse,
} from "@mui/material";
import FilterAltIcon from "@mui/icons-material/FilterAlt";
import { getLectures } from "../lib/api/lectureApi";

// 🔍 모달 및 필터 컴포넌트
import CategoryFilter from "../components/Search/CategoryFilter";
import PriceFilterModal from "../components/Search/PriceFilterModal";
import RatingFilterModal from "../components/Search/RatingFilterModal";
import CertifiedMentorFilterModal from "../components/Search/CertifiedMentorFilterModal";
import RegionFilter from "../components/Search/RegionFilter";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";

// 🔍 레이아웃 및 목록
import SearchLayout from "../components/Search/SearchLayout";
import SidebarFilters from "../components/Search/SidebarFilters";
import MobileFilterDrawer from "../components/Search/MobileFilterDrawer";
import CourseList from "../components/CourseSection/CourseList";

const CourseSearchPage = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const initialKeyword = queryParams.get("keyword") || "";
  const initialParent = queryParams.get("parent") || "";

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [isPriceFilterSet, setIsPriceFilterSet] = useState(false);

  // 📌 필터 상태 관리
  const [selectedCategory, setSelectedCategory] = useState(
    initialParent ? [initialParent] : []
  );
  const [selectedRegions, setSelectedRegions] = useState([]);
  const [priceRange, setPriceRange] = useState([0, 300000]);
  const [ratingRange, setRatingRange] = useState(0);
  const [isCertified, setIsCertified] = useState(false);

  // 🗺️ 지역 필터 상세 상태 및 선택 진행 상태를 저장하기 위한 변수
  const [selectedDongs, setSelectedDongs] = useState([]);
  const [savedRegionProvince, setSavedRegionProvince] = useState("");
  const [savedRegionDistrict, setSavedRegionDistrict] = useState("");
  const [savedRegionTab, setSavedRegionTab] = useState(0);

  // 📂 카테고리 필터 선택 진행 상태를 저장하기 위한 변수
  const [savedCategoryParent, setSavedCategoryParent] = useState(
    initialParent || ""
  );
  const [savedCategoryMiddle, setSavedCategoryMiddle] = useState("");
  const [savedCategoryTab, setSavedCategoryTab] = useState(0);

  // 🔍 검색 상태
  const [keyword, setKeyword] = useState(initialKeyword);
  const [search, setSearch] = useState(initialKeyword);

  // 📦 강의 데이터
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalResults, setTotalResults] = useState(0);

  // 📱 모달/Drawer 열림 여부
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);
  const [categoryDialogOpen, setCategoryDialogOpen] = useState(false);
  const [regionDialogOpen, setRegionDialogOpen] = useState(false);
  const [priceDialogOpen, setPriceDialogOpen] = useState(false);
  const [ratingDialogOpen, setRatingDialogOpen] = useState(false);
  const [certifiedDialogOpen, setCertifiedDialogOpen] = useState(false);

  // 📡 강의 목록 요청
  useEffect(() => {
    const searchCourses = async () => {
      if (loading) return;
      setLoading(true);

      try {
        const params = {
          keyword: search,
          page: page - 1,
          size: 10,
          isOpen: false,
        };

        // 카테고리 필터
        if (selectedCategory && selectedCategory.length > 0) {
          // 선택된 카테고리에서 가장 구체적인 카테고리만 추출
          const specificCategories = selectedCategory.map((category) => {
            // "부모 > 자식" 형식인 경우 가장 마지막 부분만 사용
            const parts = category.split(" > ");
            // 가장 구체적인 부분(마지막 부분)만 반환
            return parts[parts.length - 1];
          });

          // 중복 제거
          params.categories = [...new Set(specificCategories)].filter(Boolean);
        }

        // 지역 필터
        if (selectedRegions.length > 0) {
          const regionsToSearch = [];

          selectedDongs.forEach((region) => {
            // 동 레벨인 경우에만 특별 처리
            if (region.dong) {
              // 동과 상위 시군구 추가
              regionsToSearch.push(
                `${region.sido} ${region.sigungu} ${region.dong}`
              );
              regionsToSearch.push(`${region.sido} ${region.sigungu}`);
            } else {
              // 시도나 시군구 레벨은 그대로 추가 (백엔드가 하위 포함 검색)
              const regionStr = region.sigungu
                ? `${region.sido} ${region.sigungu}`
                : region.sido;
              regionsToSearch.push(regionStr);
            }
          });

          // 중복 제거
          params.regions = [...new Set(regionsToSearch)];
        }

        // 가격 필터 - 명시적으로 설정된 경우 항상 적용
        if (isPriceFilterSet) {
          params.minPrice = priceRange[0];
          params.maxPrice = priceRange[1];
        }

        if (priceRange[0] > 0 || priceRange[1] < 300000) {
          params.minPrice = priceRange[0];
          params.maxPrice = priceRange[1];
        }

        if (ratingRange > 0) params.minRating = ratingRange;
        if (isCertified) params.isCertified = true;

        const response = await getLectures(params);

        if (response.success && response.data) {
          const { content, totalPages, totalElements } = response.data;
          setCourses(mapApiResponseToCards(content));
          setTotalPages(totalPages);
          setTotalResults(totalElements);
        } else {
          setCourses([]);
          setTotalPages(1);
          setTotalResults(0);
        }
      } catch (error) {
        console.error("강의 검색 오류:", error);
        setCourses([]);
        setTotalPages(1);
        setTotalResults(0);
      } finally {
        setLoading(false);
      }
    };

    searchCourses();
  }, [
    page,
    search,
    selectedCategory,
    selectedRegions,
    priceRange,
    ratingRange,
    isCertified,
  ]);

  // API 응답 → 카드 데이터 매핑
  const mapApiResponseToCards = (lectures) => {
    if (!Array.isArray(lectures)) return [];

    return lectures.map((lecture) => {
      let regionList = [];
      if (lecture.regions) {
        if (Array.isArray(lecture.regions)) {
          regionList = lecture.regions;
        } else if (typeof lecture.regions === "string") {
          try {
            const parsed = JSON.parse(lecture.regions);
            regionList = Array.isArray(parsed) ? parsed : [parsed];
          } catch {
            regionList = [lecture.regions];
          }
        }
      }

      return {
        lectureId: lecture.lectureId,
        title: lecture.lectureTitle,
        price: lecture.price,
        mentorName: lecture.mentorNickname,
        profileImage: lecture.profileImage || "/images/default-profile.svg",
        isCertified: lecture.isCertified,
        rating: lecture.averageRating,
        subcategory: [lecture.subcategory || ""],
        region: regionList.length > 0 ? regionList : ["지역 정보 없음"],
      };
    });
  };

  // 🔎 검색 제출
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setSearch(keyword);
    setPage(1);
  };

  // 📍 지역 선택 핸들러
  const handleRegionSelect = (selected) => {
    const formattedRegions = selected.map((region) => {
      if (typeof region === "object") {
        if (region.displayName) return region.displayName;

        // 지역 문자열 생성
        return `${region.sido || ""} ${region.sigungu || ""} ${
          region.dong || ""
        }`.trim();
      }
      return String(region);
    });

    setSelectedRegions(formattedRegions);
    setSelectedDongs(selected); // 원본 객체 형태도 저장
    setRegionDialogOpen(false);
    setPage(1);
  };

  // 🔄 필터 초기화
  const handleResetFilters = () => {
    setSelectedCategory([]);
    setSelectedRegions([]);
    setSelectedDongs([]);
    setPriceRange([0, 300000]);
    setRatingRange(0);
    setIsCertified(false);

    // 지역 필터 상태 초기화
    setSavedRegionProvince("");
    setSavedRegionDistrict("");
    setSavedRegionTab(0);

    // 카테고리 필터 상태도 초기화
    setSavedCategoryParent("");
    setSavedCategoryMiddle("");
    setSavedCategoryTab(0);
  };

  // 필터 섹션 컴포넌트 (아코디언 형태)
  const FilterSection = ({ title, children, defaultExpanded = true }) => {
    const [expanded, setExpanded] = useState(defaultExpanded);

    return (
      <Box sx={{ mb: 1, borderRadius: "8px", overflow: "hidden" }}>
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          onClick={() => setExpanded(!expanded)}
          sx={{
            py: 0.75,
            px: 1,
            bgcolor: "var(--bg-200)",
            borderRadius: "8px",
            cursor: "pointer",
            "&:hover": { bgcolor: "var(--bg-300)" },
          }}
        >
          <Typography
            variant="caption"
            fontWeight={500}
            color="var(--text-300)"
          >
            {title}
          </Typography>
          <IconButton
            size="small"
            sx={{ p: 0, color: "var(--text-300)" }}
            onClick={(e) => {
              e.stopPropagation();
              setExpanded(!expanded);
            }}
          >
            {expanded ? (
              <KeyboardArrowUpIcon fontSize="small" />
            ) : (
              <KeyboardArrowDownIcon fontSize="small" />
            )}
          </IconButton>
        </Box>

        <Collapse in={expanded} timeout="auto">
          <Box sx={{ pt: 1, pb: 0.5, px: 0.5 }}>{children}</Box>
        </Collapse>
      </Box>
    );
  };

  // 적용된 필터 표시 컴포넌트
  const ActiveFilters = ({ filters, onRemove, onClear }) => {
    // 아코디언 상태 관리
    const [expanded, setExpanded] = useState(true); // 기본적으로 펼쳐진 상태

    // 필터가 비어있는지 확인
    const hasFilters =
      (filters.categories && filters.categories.length > 0) ||
      (filters.regions && filters.regions.length > 0) ||
      filters.priceSet ||
      filters.rating > 0 ||
      filters.certified;

    if (!hasFilters) return null;

    // 필터 개수 계산
    const filterCount =
      (filters.categories?.length || 0) +
      (filters.regions?.length || 0) +
      (filters.priceSet ? 1 : 0) +
      (filters.rating > 0 ? 1 : 0) +
      (filters.certified ? 1 : 0);

    return (
      <Box sx={{ mt: 2, mb: 3 }}>
        {/* 아코디언 헤더 */}
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          onClick={() => setExpanded(!expanded)}
          sx={{
            py: 1,
            px: 1.5,
            bgcolor: "var(--bg-200)",
            borderRadius: "8px",
            cursor: "pointer",
            mb: expanded ? 1 : 0,
            "&:hover": { bgcolor: "var(--bg-300)" },
          }}
        >
          <Box display="flex" alignItems="center">
            <Typography variant="subtitle2" fontWeight={600} mr={1}>
              적용된 필터
            </Typography>
            <Typography
              variant="caption"
              sx={{
                color: "var(--text-300)",
                bgcolor: "var(--bg-300)",
                px: 1,
                py: 0.2,
                borderRadius: 5,
                fontWeight: 500,
              }}
            >
              {filterCount}
            </Typography>
          </Box>

          <Box display="flex" alignItems="center">
            <Button
              size="small"
              onClick={(e) => {
                e.stopPropagation(); // 버블링 방지
                onClear();
              }}
              sx={{ color: "var(--text-300)", fontSize: 13, mr: 1 }}
            >
              초기화
            </Button>
            <IconButton
              size="small"
              sx={{ p: 0, color: "var(--text-300)" }}
              onClick={(e) => {
                e.stopPropagation();
                setExpanded(!expanded);
              }}
            >
              {expanded ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
            </IconButton>
          </Box>
        </Box>

        {/* 펼쳐지는 필터 내용 */}
        <Collapse in={expanded} timeout="auto">
          <Box sx={{ pt: 1, pb: 1 }}>
            {/* 카테고리 필터 */}
            {filters.categories && filters.categories.length > 0 && (
              <Box mb={1}>
                <Typography
                  variant="caption"
                  color="var(--text-300)"
                  sx={{ mb: 0.5, display: "block" }}
                >
                  카테고리
                </Typography>
                <Box display="flex" flexWrap="wrap" gap={0.5}>
                  {filters.categories.map((cat) => (
                    <Chip
                      key={`cat-${cat}`}
                      label={cat}
                      size="small"
                      onDelete={() => onRemove("category", cat)}
                      sx={{
                        bgcolor: "var(--action-primary-bg)",
                        color: "var(--primary-200)",
                        fontSize: 12,
                      }}
                    />
                  ))}
                </Box>
              </Box>
            )}

            {/* 지역 필터 */}
            {filters.regions && filters.regions.length > 0 && (
              <Box mb={1}>
                <Typography
                  variant="caption"
                  color="var(--text-300)"
                  sx={{ mb: 0.5, display: "block" }}
                >
                  지역
                </Typography>
                <Box display="flex" flexWrap="wrap" gap={0.5}>
                  {filters.regions.map((region) => (
                    <Chip
                      key={`region-${region}`}
                      label={region}
                      size="small"
                      onDelete={() => onRemove("region", region)}
                      sx={{
                        bgcolor: "var(--action-yellow-bg)",
                        color: "var(--action-yellow)",
                        fontSize: 12,
                      }}
                    />
                  ))}
                </Box>
              </Box>
            )}

            {/* 기타 필터(가격, 평점, 인증) */}
            {(filters.priceSet || filters.rating > 0 || filters.certified) && (
              <Box>
                <Typography
                  variant="caption"
                  color="var(--text-300)"
                  sx={{ mb: 0.5, display: "block" }}
                >
                  기타 조건
                </Typography>
                <Box display="flex" flexWrap="wrap" gap={0.5}>
                  {filters.priceSet && (
                    <Chip
                      label={`${filters.price[0].toLocaleString()}원-${filters.price[1].toLocaleString()}원`}
                      size="small"
                      onDelete={() => onRemove("price")}
                      sx={{ fontSize: 12 }}
                    />
                  )}

                  {filters.rating > 0 && (
                    <Chip
                      label={`${filters.rating}점 이상`}
                      size="small"
                      onDelete={() => onRemove("rating")}
                      sx={{ fontSize: 12 }}
                    />
                  )}

                  {filters.certified && (
                    <Chip
                      label="인증 멘토만"
                      size="small"
                      onDelete={() => onRemove("certified")}
                      sx={{ fontSize: 12 }}
                    />
                  )}
                </Box>
              </Box>
            )}
          </Box>
        </Collapse>
      </Box>
    );
  };

  // 필터 제거 핸들러
  const handleRemoveFilter = (type, value) => {
    switch (type) {
      case "category":
        setSelectedCategory((prev) =>
          Array.isArray(prev) ? prev.filter((item) => item !== value) : []
        );

        // 카테고리가 삭제될 때 관련된 상태도 초기화
        if (
          value === savedCategoryParent ||
          value.startsWith(`${savedCategoryParent} >`)
        ) {
          setSavedCategoryParent("");
          setSavedCategoryMiddle("");
        }
        break;
      case "region":
        setSelectedRegions((prev) => prev.filter((item) => item !== value));
        setSelectedDongs((prev) =>
          prev.filter(
            (item) =>
              item.displayName !== value &&
              `${item.sido} ${item.sigungu} ${item.dong || ""}`.trim() !== value
          )
        );
        break;
      case "price":
        setPriceRange([0, 300000]);
        setIsPriceFilterSet(false);
        break;
      case "rating":
        setRatingRange(0);
        break;
      case "certified":
        setIsCertified(false);
        break;
      default:
        break;
    }
    setPage(1);
  };

  // 모든 필터 초기화 핸들러
  const handleClearAllFilters = () => {
    setSelectedCategory([]);
    setSelectedRegions([]);
    setSelectedDongs([]);
    setPriceRange([0, 300000]);
    setIsPriceFilterSet(false);
    setRatingRange(0);
    setIsCertified(false);

    // 지역 필터 상태 초기화
    setSavedRegionProvince("");
    setSavedRegionDistrict("");
    setSavedRegionTab(0);

    // 카테고리 필터 상태도 초기화
    setSavedCategoryParent("");
    setSavedCategoryMiddle("");
    setSavedCategoryTab(0);

    setPage(1);
  };

  return (
    <>
      {/* 📱 모바일 상단: 검색창 + 필터 버튼 */}
      {isMobile && (
        <Box
          position="sticky"
          top={0}
          zIndex={100}
          bgcolor="var(--bg-100)"
          py={1.5}
          display="flex"
          justifyContent="space-between"
          alignItems="center"
        >
          <TextField
            fullWidth
            placeholder="키워드 검색"
            variant="outlined"
            size="small"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearchSubmit(e)}
            sx={{
              flex: 1,
              mr: 2,
              bgcolor: "var(--bg-200)",
              borderRadius: "8px",
              height: 44,
              "& .MuiOutlinedInput-root": {
                height: "100%",
                borderRadius: "8px",
                fontSize: "0.95rem",
                "& fieldset": { border: "none" },
              },
              "& input": {
                color: "var(--text-100)",
                "&::placeholder": { color: "var(--text-300)", opacity: 1 },
              },
            }}
          />
          <IconButton
            onClick={() => setMobileFilterOpen(true)}
            sx={{
              width: 44,
              height: 44,
              bgcolor: "var(--bg-200)",
              borderRadius: "8px",
              "&:hover": { bgcolor: "var(--bg-300)" },
            }}
          >
            <FilterAltIcon sx={{ color: "var(--text-300)" }} />
          </IconButton>
        </Box>
      )}

      {/* 모달들 */}
      <CategoryFilter
        open={categoryDialogOpen}
        onClose={() => setCategoryDialogOpen(false)}
        selectedCategories={selectedCategory}
        // 진행 중인 선택 상태를 외부에서 관리하기 위한 props 전달
        savedParent={savedCategoryParent}
        setSavedParent={setSavedCategoryParent}
        savedMiddle={savedCategoryMiddle}
        setSavedMiddle={setSavedCategoryMiddle}
        savedTab={savedCategoryTab}
        setSavedTab={setSavedCategoryTab}
        onSelect={(selected) => {
          setSelectedCategory(selected);
          setCategoryDialogOpen(false);
          setPage(1);
        }}
      />

      <RegionFilter
        open={regionDialogOpen}
        onClose={() => setRegionDialogOpen(false)}
        selectedDongs={selectedDongs}
        setSelectedDongs={setSelectedDongs}
        // 지역 선택 진행 상태를 외부에서 관리하기 위한 props 전달
        savedProvince={savedRegionProvince}
        setSavedProvince={setSavedRegionProvince}
        savedDistrict={savedRegionDistrict}
        setSavedDistrict={setSavedRegionDistrict}
        savedTab={savedRegionTab}
        setSavedTab={setSavedRegionTab}
        onSubmit={handleRegionSelect}
      />

      <PriceFilterModal
        open={priceDialogOpen}
        onClose={() => setPriceDialogOpen(false)}
        initialRange={priceRange}
        onSubmit={(range) => {
          setPriceRange(range);
          setIsPriceFilterSet(true);
          setPage(1);
        }}
      />

      <RatingFilterModal
        open={ratingDialogOpen}
        onClose={() => setRatingDialogOpen(false)}
        initialRating={ratingRange}
        onSubmit={(val) => {
          setRatingRange(val);
          setPage(1);
        }}
      />

      <CertifiedMentorFilterModal
        open={certifiedDialogOpen}
        onClose={() => setCertifiedDialogOpen(false)}
        initialChecked={isCertified}
        onSubmit={(checked) => {
          setIsCertified(checked);
          setPage(1);
        }}
      />

      {/* 데스크탑 레이아웃 */}
      <SearchLayout
        sidebar={
          <SidebarFilters
            showKeyword={!isMobile}
            onKeywordChange={(val) => setKeyword(val)}
            onKeywordSubmit={(val) => {
              setSearch(val);
              setPage(1);
            }}
            onOpenCategory={() => setCategoryDialogOpen(true)}
            onOpenRegion={() => setRegionDialogOpen(true)}
            onOpenPrice={() => setPriceDialogOpen(true)}
            onOpenRating={() => setRatingDialogOpen(true)}
            onOpenCertified={() => setCertifiedDialogOpen(true)}
          />
        }
        content={
          <>
            <ActiveFilters
              filters={{
                categories: selectedCategory,
                regions: selectedRegions,
                price: priceRange,
                priceSet: isPriceFilterSet,
                rating: ratingRange,
                certified: isCertified,
              }}
              onRemove={handleRemoveFilter}
              onClear={handleClearAllFilters}
            />

            <Typography variant="body2" color="var(--text-300)" sx={{ mb: 2 }}>
              총 <strong>{totalResults}</strong>개의 과외가 있어요
            </Typography>

            <CourseList courses={courses} loading={loading} />

            {totalPages > 1 && (
              <Box sx={{ display: "flex", justifyContent: "center", mt: 6 }}>
                <Pagination
                  count={totalPages}
                  page={page}
                  onChange={(_, newPage) => setPage(newPage)}
                  shape="rounded"
                />
              </Box>
            )}
          </>
        }
      />

      {/* 모바일 필터 Drawer */}
      {isMobile && (
        <MobileFilterDrawer
          open={mobileFilterOpen}
          onClose={() => setMobileFilterOpen(false)}
        >
          <SidebarFilters
            showKeyword={false}
            onKeywordChange={(val) => setKeyword(val)}
            onOpenCategory={() => {
              setCategoryDialogOpen(true);
              setMobileFilterOpen(false);
            }}
            onOpenRegion={() => {
              setRegionDialogOpen(true);
              setMobileFilterOpen(false);
            }}
            onOpenPrice={() => {
              setPriceDialogOpen(true);
              setMobileFilterOpen(false);
            }}
            onOpenRating={() => {
              setRatingDialogOpen(true);
              setMobileFilterOpen(false);
            }}
            onOpenCertified={() => {
              setCertifiedDialogOpen(true);
              setMobileFilterOpen(false);
            }}
          />
        </MobileFilterDrawer>
      )}
    </>
  );
};

export default CourseSearchPage;
