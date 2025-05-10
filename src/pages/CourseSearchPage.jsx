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

// 🔍 모달 및 필터 컴포넌트
import CategoryFilterModal from "../components/Search/CategoryFilterModal";
import CategoryFilterMobile from "../components/Search/CategoryFilterMobile";
import PriceFilterModal from "../components/Search/PriceFilterModal";
import RatingFilterModal from "../components/Search/RatingFilterModal";
import CertifiedMentorFilterModal from "../components/Search/CertifiedMentorFilterModal";
import RegionSelectionModal from "../components/Search/RegionSelectionModal";
import RegionSelectionMobile from "../components/Search/RegionSelectionMobile";

// 🔍 레이아웃 및 목록
import SearchLayout from "../components/Search/SearchLayout";
import SidebarFilters from "../components/Search/SidebarFilters";
import MobileFilterDrawer from "../components/Search/MobileFilterDrawer";
import CourseList from "../components/CourseSection/CourseList";

const CourseSearchPage = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  // 📌 필터 상태 관리
  const [selectedItems, setSelectedItems] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState([]);
  const [selectedRegions, setSelectedRegions] = useState([]);
  const [priceRange, setPriceRange] = useState([0, 300000]);
  const [ratingRange, setRatingRange] = useState(0);
  const [isCertified, setIsCertified] = useState(false);

  // 🗺️ 지역 필터 상세
  const [selectedDongs, setSelectedDongs] = useState([]);
  const [selectedProvince, setSelectedProvince] = useState("");
  const [selectedDistrict, setSelectedDistrict] = useState("");

  // 📂 3단 카테고리
  const [selectedParent, setSelectedParent] = useState("");
  const [selectedMiddle, setSelectedMiddle] = useState("");
  const [selectedSubs, setSelectedSubs] = useState([]);

  // 🔍 검색 상태
  const [keyword, setKeyword] = useState("");
  const [search, setSearch] = useState("");

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
        };

        //카테고리 필터
        if (selectedCategory && selectedCategory.length > 0) {
          // 배열이 아니면 배열로 변환하고, 빈 값은 필터링
          params.categories = Array.isArray(selectedCategory)
            ? selectedCategory.filter(Boolean)
            : [selectedCategory].filter(Boolean);

          // 디버깅을 위한 로그
        }

        // 지역 필터
        if (selectedRegions.length > 0) {
          // 문자열 배열 형태로 확실하게 변환
          params.regions = selectedRegions.map((region) => {
            if (typeof region === "object") {
              if (region.displayName) return region.displayName;
              return `${region.sido || ""} ${region.sigungu || ""} ${
                region.dong || ""
              }`.trim();
            }
            return String(region);
          });
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
    console.log("선택된 지역 객체:", selected);

    const formattedRegions = selected.map((region) => {
      if (typeof region === "object") {
        if (region.displayName) return region.displayName;

        if (region.sido && !region.sigungu && !region.dong) {
          return region.sido;
        }

        if (region.sido && region.sigungu && !region.dong) {
          return `${region.sido} ${region.sigungu}`;
        }

        return `${region.sido || ""} ${region.sigungu || ""} ${
          region.dong || ""
        }`.trim();
      }
      return String(region);
    });

    console.log("변환된 지역 리스트:", formattedRegions);
    setSelectedRegions(formattedRegions);
    setRegionDialogOpen(false);
    setPage(1);
  };

  // 🔄 필터 초기화
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
      {isMobile ? (
        <CategoryFilterMobile
          open={categoryDialogOpen}
          onClose={() => setCategoryDialogOpen(false)}
          selectedItems={selectedItems}
          setSelectedItems={setSelectedItems}
          selectedParent={selectedParent}
          setSelectedParent={setSelectedParent}
          selectedMiddle={selectedMiddle}
          setSelectedMiddle={setSelectedMiddle}
          onSelect={(list) => {
            setSelectedCategory(list);
            setCategoryDialogOpen(false);
          }}
        />
      ) : (
        <CategoryFilterModal
          open={categoryDialogOpen}
          onClose={() => setCategoryDialogOpen(false)}
          selectedItems={selectedItems}
          setSelectedItems={setSelectedItems}
          selectedParent={selectedParent}
          setSelectedParent={setSelectedParent}
          selectedMiddle={selectedMiddle}
          setSelectedMiddle={setSelectedMiddle}
          onSelect={(list) => {
            const categoryArray = Array.isArray(list) ? list : [list];
            setSelectedCategory(categoryArray.filter(Boolean));
            setCategoryDialogOpen(false);
          }}
        />
      )}

      {isMobile ? (
        <RegionSelectionMobile
          open={regionDialogOpen}
          onClose={() => setRegionDialogOpen(false)}
          selectedDongs={selectedDongs}
          setSelectedDongs={setSelectedDongs}
          selectedProvince={selectedProvince}
          setSelectedProvince={setSelectedProvince}
          selectedDistrict={selectedDistrict}
          setSelectedDistrict={setSelectedDistrict}
          onSubmit={handleRegionSelect}
        />
      ) : (
        <RegionSelectionModal
          open={regionDialogOpen}
          onClose={() => setRegionDialogOpen(false)}
          selectedDongs={selectedDongs}
          setSelectedDongs={setSelectedDongs}
          selectedProvince={selectedProvince}
          setSelectedProvince={setSelectedProvince}
          selectedDistrict={selectedDistrict}
          setSelectedDistrict={setSelectedDistrict}
          onSubmit={handleRegionSelect}
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
