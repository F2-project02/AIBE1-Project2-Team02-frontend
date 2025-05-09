// src/pages/CourseSearchPage.jsx

import { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Pagination,
  useMediaQuery,
  useTheme,
  TextField,
  IconButton,
} from "@mui/material";

import FilterAltIcon from "@mui/icons-material/FilterAlt";

import { getLectures } from "../lib/api/lectureApi";
import CategoryFilterModal from "../components/Search/CategoryFilterModal";
import CategoryFilterMobile from "../components/Search/CategoryFilterMobile";
import PriceFilterModal from "../components/Search/PriceFilterModal";

import SearchLayout from "../components/Search/SearchLayout";
import SidebarFilters from "../components/Search/SidebarFilters";
import MobileFilterDrawer from "../components/Search/MobileFilterDrawer";
import CourseList from "../components/CourseSection/CourseList";

import RegionSelectionModal from "../components/Search/RegionSelectionModal";
import RegionSelectionMobile from "../components/Search/RegionSelectionMobile";

const TestCourseSearchPage = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  // 검색 & 필터 상태
  const [keyword, setKeyword] = useState("");
  const [search, setSearch] = useState("");
  const [filterDrawerOpen, setFilterDrawerOpen] = useState(false);
  const [categoryDialogOpen, setCategoryDialogOpen] = useState(false);
  const [regionDialogOpen, setRegionDialogOpen] = useState(false);

  const [selectedCategory, setSelectedCategory] = useState(null); // 최종 적용된 소분류만
  const [selectedRegions, setSelectedRegions] = useState([]);
  const [priceRange, setPriceRange] = useState([0, 300000]);
  const [ratingRange, setRatingRange] = useState(0);
  const [isCertified, setIsCertified] = useState(false);

  // 3단 카테고리 선택 상태
  const [selectedParent, setSelectedParent] = useState("");
  const [selectedMiddle, setSelectedMiddle] = useState("");
  const [selectedSubs, setSelectedSubs] = useState([]);

  // 강의 목록 상태
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalResults, setTotalResults] = useState(0);

  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);
  const [priceDialogOpen, setPriceDialogOpen] = useState(false);
  const [ratingDialogOpen, setRatingDialogOpen] = useState(false);
  const [certifiedDialogOpen, setCertifiedDialogOpen] = useState(false);

  useEffect(() => {
    const searchCourses = async () => {
      if (loading) return;
      setLoading(true);

      try {
        const params = {
          keyword: search,
          page: page - 1,
          size: 10,
        };

        if (selectedCategory) {
          params.category = selectedCategory;
        }

        if (selectedRegions && selectedRegions.length > 0) {
          params.regions = selectedRegions.map((region) => {
            if (region.dong?.trim()) return region.dong;
            if (region.sigungu) return region.sigungu;
            return region.sido || region.displayName;
          });
        }

        if (priceRange[0] > 0 || priceRange[1] < 300000) {
          params.minPrice = priceRange[0];
          params.maxPrice = priceRange[1];
        }

        if (ratingRange > 0) {
          params.minRating = ratingRange;
        }

        if (isCertified) {
          params.isCertified = true;
        }

        const response = await getLectures(params);

        if (response.success && response.data) {
          const lecturesData = response.data;
          setCourses(mapApiResponseToCards(lecturesData.content));
          setTotalPages(lecturesData.totalPages);
          setTotalResults(lecturesData.totalElements);
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

  const mapApiResponseToCards = (lectures) => {
    if (!lectures || !Array.isArray(lectures)) return [];
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

  // 검색 제출
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setSearch(keyword);
    setPage(1);
  };

  const handleRegionSelect = (selected) => {
    setSelectedRegions(selected);
    setRegionDialogOpen(false);
    setPage(1);
  };

  // 필터 초기화
  const handleResetFilters = () => {
    setSelectedCategory(null);
    setSelectedRegions([]);
    setPriceRange([0, 300000]);
    setRatingRange(0);
    setIsCertified(false);

    setSelectedParent("");
    setSelectedMiddle("");
    setSelectedSubs([]);
  };

  // 필터 적용
  const handleApplyFilters = () => {
    setPage(1);
    setFilterDrawerOpen(false);
  };

  return (
    <>
      {/* 모바일: 키워드 검색 + 필터 버튼 최상단 고정 */}
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
            onKeyDown={(e) => {
              if (e.key === "Enter") handleSearchSubmit(e);
            }}
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
                "& fieldset": {
                  border: "none",
                },
                "&:hover fieldset": {
                  border: "none",
                },
                "&.Mui-focused fieldset": {
                  border: "none",
                },
              },
              "& input": {
                color: "var(--text-100)",
              },
              "& input::placeholder": {
                color: "var(--text-300)",
                opacity: 1,
              },
            }}
          />

          <IconButton
            onClick={() => setMobileFilterOpen(true)}
            sx={{
              width: 44,
              height: 44,
              backgroundColor: "var(--bg-200)",
              borderRadius: "8px",
              "&:hover": {
                backgroundColor: "var(--bg-300)",
              },
            }}
          >
            <FilterAltIcon sx={{ color: "var(--text-300)" }} />
          </IconButton>
        </Box>
      )}

      {/* 공통 지역 필터 모달 */}
      {isMobile ? (
        <RegionSelectionMobile
          open={regionDialogOpen}
          onClose={() => setRegionDialogOpen(false)}
          onSubmit={handleRegionSelect}
          selectedRegions={selectedRegions}
        />
      ) : (
        <RegionSelectionModal
          open={regionDialogOpen}
          onClose={() => setRegionDialogOpen(false)}
          onSubmit={handleRegionSelect}
          selectedRegions={selectedRegions}
        />
      )}

      {/* 공통 카테고리 필터 모달 */}
      {isMobile ? (
        <CategoryFilterMobile
          open={categoryDialogOpen}
          onClose={() => setCategoryDialogOpen(false)}
          selectedParent={selectedParent}
          setSelectedParent={setSelectedParent}
          selectedMiddle={selectedMiddle}
          setSelectedMiddle={setSelectedMiddle}
          selectedSubs={selectedSubs}
          setSelectedSubs={setSelectedSubs}
          onSelect={(selectedList) => {
            if (selectedList.length > 0) {
              setSelectedCategory(selectedList);
            } else {
              setSelectedCategory(null);
            }
            setCategoryDialogOpen(false);
          }}
        />
      ) : (
        <CategoryFilterModal
          open={categoryDialogOpen}
          onClose={() => setCategoryDialogOpen(false)}
          selectedParent={selectedParent}
          setSelectedParent={setSelectedParent}
          selectedMiddle={selectedMiddle}
          setSelectedMiddle={setSelectedMiddle}
          selectedSubs={selectedSubs}
          setSelectedSubs={setSelectedSubs}
          onSelect={(selectedList) => {
            if (selectedList.length > 0) {
              setSelectedCategory(selectedList);
            } else {
              setSelectedCategory(null);
            }
            setCategoryDialogOpen(false);
          }}
        />
      )}

      <PriceFilterModal
        open={priceDialogOpen}
        onClose={() => setPriceDialogOpen(false)}
        initialRange={priceRange}
        onSubmit={(range) => {
          setPriceRange(range);
          setPage(1);
        }}
      />

      {/* 레이아웃 */}
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
            <Typography variant="body2" color="var(--text-300)" sx={{ mb: 2 }}>
              총 <strong>{totalResults}</strong>개의 과외가 있습니다
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

      {/* 모바일 Drawer에는 showKeyword false 고정 */}
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

export default TestCourseSearchPage;
