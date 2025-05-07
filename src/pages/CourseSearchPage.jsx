// src/pages/CourseSearchPage.jsx
import { useState, useEffect } from "react";
import {
  Box,
  Typography,
  TextField,
  Grid,
  InputAdornment,
  CircularProgress,
  Drawer,
  IconButton,
  Divider,
  Pagination,
  Slider,
  Stack,
  FormControlLabel,
  Checkbox,
  Button,
  Dialog,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import FilterListIcon from "@mui/icons-material/FilterList";
import CloseIcon from "@mui/icons-material/Close";
import GradientButton from "../components/Button/GradientButton";
import CourseCard from "../components/CourseSection/CourseCard";
import CourseCardSkeleton from "../components/CourseSection/CourseCardSkeleton";
import { getLectures } from "../lib/api/lectureApi";
import { categoryApi } from "../lib/api/categoryApi";
import { regionApi } from "../lib/api/regionApi";
import RegionSelectionModal from "../components/CreateLecture/RegionSelectionModal";
import CategoryFilterDialog from "../components/Search/CategoryFilterDialog";

const CourseSearchPage = () => {
  // State for search and filtering
  const [keyword, setKeyword] = useState("");
  const [search, setSearch] = useState("");
  const [filterDrawerOpen, setFilterDrawerOpen] = useState(false);
  const [categoryDialogOpen, setCategoryDialogOpen] = useState(false);
  const [regionDialogOpen, setRegionDialogOpen] = useState(false);

  // State for filtering criteria
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedRegions, setSelectedRegions] = useState([]);
  const [priceRange, setPriceRange] = useState([0, 300000]);
  const [ratingRange, setRatingRange] = useState(0);
  const [isCertified, setIsCertified] = useState(false);

  // State for results
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalResults, setTotalResults] = useState(0);

  // Effect to search for courses when filters change
  useEffect(() => {
    const searchCourses = async () => {
      if (loading) return;

      setLoading(true);

      try {
        // Prepare parameters for API call
        const params = {
          keyword: search,
          page: page - 1, // API uses 0-based indexing
          size: 10,
        };

        // 카테고리 처리 - 수정된 부분
        if (selectedCategory) {
          // 카테고리가 계층 구조로 선택된 경우 (대분류 > 중분류 > 소분류)
          const categoryParts = selectedCategory.split(" > ");

          // 마지막 부분(가장 구체적인 카테고리)을 category 매개변수로 사용
          // 이는 서버에서 부모/중간/소분류 중 어느 것과도 매칭될 수 있도록 함
          const lastCategory = categoryParts[categoryParts.length - 1];

          // 선택된 카테고리 중에서 가장 구체적인 것을 사용
          params.category = lastCategory;

          console.log("검색에 사용되는 카테고리:", lastCategory);
        }

        // 지역 처리
        if (selectedRegions && selectedRegions.length > 0) {
          // 지역 정보 처리 방식은 그대로 유지
          params.region =
            selectedRegions[0].displayName ||
            `${selectedRegions[0].sido} ${selectedRegions[0].sigungu} ${
              selectedRegions[0].dong || ""
            }`.trim();
        }

        // 가격 범위
        if (priceRange[0] > 0 || priceRange[1] < 300000) {
          params.minPrice = priceRange[0];
          params.maxPrice = priceRange[1];
        }

        // 최소 평점
        if (ratingRange > 0) {
          params.minRating = ratingRange;
        }

        // 인증 멘토만
        if (isCertified) {
          params.isCertified = true;
        }

        console.log("검색 매개변수:", params);

        // 실제 API 호출
        const response = await getLectures(params);

        if (response.success && response.data) {
          const lecturesData = response.data;

          setCourses(mapApiResponseToCards(lecturesData.content));
          setTotalPages(lecturesData.totalPages);
          setTotalResults(lecturesData.totalElements);
        } else {
          // 에러 핸들링
          console.error("강의 검색 결과가 성공적이지 않습니다:", response);
          setCourses([]);
          setTotalPages(1);
          setTotalResults(0);
        }
      } catch (error) {
        console.error("강의 검색 중 오류 발생:", error);
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

  // API 응답을 CourseCard 컴포넌트에 맞게 변환
  const mapApiResponseToCards = (lectures) => {
    if (!lectures || !Array.isArray(lectures)) return [];

    return lectures.map((lecture) => ({
      lectureId: lecture.lectureId,
      title: lecture.lectureTitle,
      price: lecture.price,
      mentorName: lecture.mentorNickname,
      profileImage: lecture.profileImage,
      isCertified: lecture.isCertified,
      rating: lecture.averageRating,
      subcategory: [lecture.subcategory || ""],
      region: [lecture.regions ? JSON.parse(lecture.regions)[0] : "서울"], // 지역 정보는 JSON 문자열로 받을 수 있음
    }));
  };

  // Handle search submission
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setSearch(keyword);
    setPage(1);
  };

  // Handle category selection
  const handleCategorySelect = (categoryString) => {
    setSelectedCategory(categoryString);
    setCategoryDialogOpen(false);
  };

  // Handle region selection
  const handleRegionSelect = (selectedRegions) => {
    setSelectedRegions(selectedRegions);
    setRegionDialogOpen(false);
  };

  // Reset all filters
  const handleResetFilters = () => {
    setSelectedCategory(null);
    setSelectedRegions([]);
    setPriceRange([0, 300000]);
    setRatingRange(0);
    setIsCertified(false);
  };

  // Apply filters and close drawer
  const handleApplyFilters = () => {
    setPage(1); // Reset to first page when filters change
    setFilterDrawerOpen(false);
  };

  // Format price display
  const formatPrice = (value) => {
    return `${value.toLocaleString()}원`;
  };

  return (
    <Box sx={{ mt: 4, mb: 8 }}>
      {/* 페이지 제목 */}
      <Typography variant="h5" fontWeight={600} gutterBottom>
        과외 찾기
      </Typography>

      {/* 검색바 */}
      <Box
        component="form"
        onSubmit={handleSearchSubmit}
        sx={{
          display: "flex",
          alignItems: "center",
          mt: 3,
          mb: 4,
        }}
      >
        <TextField
          fullWidth
          placeholder="과외 키워드를 검색해보세요"
          variant="outlined"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon color="action" />
              </InputAdornment>
            ),
            sx: {
              borderRadius: "16px",
              backgroundColor: "white",
            },
          }}
        />

        <Button
          variant="contained"
          onClick={() => setFilterDrawerOpen(true)}
          sx={{
            ml: 2,
            borderRadius: "16px",
            height: 56,
            minWidth: 56,
            backgroundColor: "var(--bg-200)",
            color: "var(--text-300)",
            "&:hover": {
              backgroundColor: "var(--bg-300)",
            },
          }}
        >
          <FilterListIcon />
        </Button>
      </Box>

      {/* 현재 적용된 필터 표시 */}
      <Box
        sx={{
          display: "flex",
          flexWrap: "wrap",
          gap: 1,
          mb: 3,
          visibility:
            selectedCategory ||
            selectedRegions.length > 0 ||
            priceRange[0] > 0 ||
            priceRange[1] < 300000 ||
            ratingRange > 0 ||
            isCertified
              ? "visible"
              : "hidden",
        }}
      >
        {selectedCategory && (
          <Box
            sx={{
              backgroundColor: "var(--action-primary-bg)",
              color: "var(--primary-200)",
              px: 2,
              py: 0.5,
              borderRadius: "20px",
              fontSize: 14,
              display: "flex",
              alignItems: "center",
            }}
          >
            {selectedCategory}
            <CloseIcon
              sx={{ ml: 0.5, fontSize: 16, cursor: "pointer" }}
              onClick={() => setSelectedCategory(null)}
            />
          </Box>
        )}

        {selectedRegions.length > 0 && (
          <Box
            sx={{
              backgroundColor: "var(--action-yellow-bg)",
              color: "var(--action-yellow)",
              px: 2,
              py: 0.5,
              borderRadius: "20px",
              fontSize: 14,
              display: "flex",
              alignItems: "center",
            }}
          >
            {selectedRegions.length > 1
              ? `${selectedRegions[0].displayName} 외 ${
                  selectedRegions.length - 1
                }개`
              : selectedRegions[0].displayName}
            <CloseIcon
              sx={{ ml: 0.5, fontSize: 16, cursor: "pointer" }}
              onClick={() => setSelectedRegions([])}
            />
          </Box>
        )}

        {(priceRange[0] > 0 || priceRange[1] < 300000) && (
          <Box
            sx={{
              backgroundColor: "var(--action-green-bg)",
              color: "var(--action-green)",
              px: 2,
              py: 0.5,
              borderRadius: "20px",
              fontSize: 14,
              display: "flex",
              alignItems: "center",
            }}
          >
            {`${formatPrice(priceRange[0])} ~ ${formatPrice(priceRange[1])}`}
            <CloseIcon
              sx={{ ml: 0.5, fontSize: 16, cursor: "pointer" }}
              onClick={() => setPriceRange([0, 300000])}
            />
          </Box>
        )}

        {ratingRange > 0 && (
          <Box
            sx={{
              backgroundColor: "var(--action-primary-bg)",
              color: "var(--primary-200)",
              px: 2,
              py: 0.5,
              borderRadius: "20px",
              fontSize: 14,
              display: "flex",
              alignItems: "center",
            }}
          >
            {`${ratingRange}점 이상`}
            <CloseIcon
              sx={{ ml: 0.5, fontSize: 16, cursor: "pointer" }}
              onClick={() => setRatingRange(0)}
            />
          </Box>
        )}

        {isCertified && (
          <Box
            sx={{
              backgroundColor: "var(--action-red-bg)",
              color: "var(--action-red)",
              px: 2,
              py: 0.5,
              borderRadius: "20px",
              fontSize: 14,
              display: "flex",
              alignItems: "center",
            }}
          >
            인증 멘토만
            <CloseIcon
              sx={{ ml: 0.5, fontSize: 16, cursor: "pointer" }}
              onClick={() => setIsCertified(false)}
            />
          </Box>
        )}
      </Box>

      {/* 검색 결과 정보 */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 3,
        }}
      >
        <Typography variant="body2" color="var(--text-300)">
          총 <strong>{totalResults.toLocaleString()}</strong>개의 과외가
          있습니다
        </Typography>

        {/* 여기에 정렬 옵션을 추가할 수 있습니다 */}
      </Box>

      {/* 검색 결과 */}
      {loading ? (
        <Grid container spacing={3}>
          {Array(10)
            .fill(null)
            .map((_, idx) => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={`skeleton-${idx}`}>
                <CourseCardSkeleton />
              </Grid>
            ))}
        </Grid>
      ) : courses.length > 0 ? (
        <Grid container spacing={3}>
          {courses.map((course) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={course.lectureId}>
              <CourseCard data={course} />
            </Grid>
          ))}
        </Grid>
      ) : (
        <Box
          sx={{
            py: 10,
            textAlign: "center",
            backgroundColor: "var(--bg-200)",
            borderRadius: 2,
          }}
        >
          <Typography variant="h6" color="var(--text-300)">
            검색 결과가 없습니다
          </Typography>
          <Typography variant="body2" color="var(--text-400)" sx={{ mt: 1 }}>
            다른 검색어나 필터를 사용해보세요
          </Typography>
        </Box>
      )}

      {/* 페이지네이션 */}
      {totalPages > 1 && (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 6 }}>
          <Pagination
            count={totalPages}
            page={page}
            onChange={(_, newPage) => setPage(newPage)}
            color="primary"
            shape="rounded"
          />
        </Box>
      )}

      {/* 필터 드로어 */}
      <Drawer
        anchor="right"
        open={filterDrawerOpen}
        onClose={() => setFilterDrawerOpen(false)}
        PaperProps={{
          sx: {
            width: { xs: "100%", sm: 400 },
            p: 3,
          },
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 3,
          }}
        >
          <Typography variant="h6" fontWeight={600}>
            상세 필터
          </Typography>
          <IconButton onClick={() => setFilterDrawerOpen(false)}>
            <CloseIcon />
          </IconButton>
        </Box>

        <Divider sx={{ mb: 3 }} />

        {/* 카테고리 필터 */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="subtitle1" fontWeight={600} gutterBottom>
            과목 카테고리
          </Typography>

          <Button
            variant="outlined"
            fullWidth
            onClick={() => setCategoryDialogOpen(true)}
            sx={{
              justifyContent: "flex-start",
              textTransform: "none",
              py: 1.5,
              borderColor: "var(--bg-300)",
              color: selectedCategory ? "var(--text-100)" : "var(--text-400)",
              fontWeight: selectedCategory ? 600 : 400,
              "&:hover": {
                borderColor: "var(--primary-100)",
                backgroundColor: "var(--bg-100)",
              },
            }}
          >
            {selectedCategory || "과목을 선택해주세요"}
          </Button>
        </Box>

        {/* 지역 필터 */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="subtitle1" fontWeight={600} gutterBottom>
            지역 선택
          </Typography>

          <Button
            variant="outlined"
            fullWidth
            onClick={() => setRegionDialogOpen(true)}
            sx={{
              justifyContent: "flex-start",
              textTransform: "none",
              py: 1.5,
              borderColor: "var(--bg-300)",
              color:
                selectedRegions.length > 0
                  ? "var(--text-100)"
                  : "var(--text-400)",
              fontWeight: selectedRegions.length > 0 ? 600 : 400,
              "&:hover": {
                borderColor: "var(--primary-100)",
                backgroundColor: "var(--bg-100)",
              },
            }}
          >
            {selectedRegions.length > 0
              ? selectedRegions.length > 1
                ? `${selectedRegions[0].displayName} 외 ${
                    selectedRegions.length - 1
                  }개`
                : selectedRegions[0].displayName
              : "지역을 선택해주세요"}
          </Button>
        </Box>

        {/* 가격 범위 필터 */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="subtitle1" fontWeight={600} gutterBottom>
            수업료 범위
          </Typography>

          <Box sx={{ px: 2 }}>
            <Slider
              value={priceRange}
              onChange={(e, newValue) => setPriceRange(newValue)}
              valueLabelDisplay="auto"
              valueLabelFormat={formatPrice}
              min={0}
              max={300000}
              step={10000}
              sx={{
                color: "var(--primary-100)",
                "& .MuiSlider-thumb": {
                  "&:hover, &.Mui-focusVisible": {
                    boxShadow: "0px 0px 0px 8px var(--action-primary-bg)",
                  },
                },
              }}
            />

            <Box
              sx={{ display: "flex", justifyContent: "space-between", mt: 1 }}
            >
              <Typography variant="body2" color="var(--text-300)">
                {formatPrice(priceRange[0])}
              </Typography>
              <Typography variant="body2" color="var(--text-300)">
                {formatPrice(priceRange[1])}
              </Typography>
            </Box>
          </Box>
        </Box>

        {/* 평점 필터 */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="subtitle1" fontWeight={600} gutterBottom>
            최소 평점
          </Typography>

          <Box sx={{ px: 2 }}>
            <Slider
              value={ratingRange}
              onChange={(e, newValue) => setRatingRange(newValue)}
              valueLabelDisplay="auto"
              min={0}
              max={5}
              step={0.5}
              marks={[
                { value: 0, label: "0" },
                { value: 1, label: "1" },
                { value: 2, label: "2" },
                { value: 3, label: "3" },
                { value: 4, label: "4" },
                { value: 5, label: "5" },
              ]}
              sx={{
                color: "var(--primary-100)",
                "& .MuiSlider-thumb": {
                  "&:hover, &.Mui-focusVisible": {
                    boxShadow: "0px 0px 0px 8px var(--action-primary-bg)",
                  },
                },
              }}
            />
          </Box>
        </Box>

        {/* 인증 멘토 필터 */}
        <Box sx={{ mb: 5 }}>
          <Typography variant="subtitle1" fontWeight={600} gutterBottom>
            멘토 인증
          </Typography>

          <FormControlLabel
            control={
              <Checkbox
                checked={isCertified}
                onChange={(e) => setIsCertified(e.target.checked)}
                sx={{
                  color: "var(--primary-100)",
                  "&.Mui-checked": {
                    color: "var(--primary-100)",
                  },
                }}
              />
            }
            label="인증된 멘토만 보기"
          />
        </Box>

        {/* 필터 버튼 영역 */}
        <Box sx={{ display: "flex", gap: 2, mt: "auto" }}>
          <Button
            variant="outlined"
            fullWidth
            onClick={handleResetFilters}
            sx={{
              py: 1.5,
              borderColor: "var(--bg-300)",
              color: "var(--text-300)",
              "&:hover": {
                borderColor: "var(--bg-300)",
                backgroundColor: "var(--bg-200)",
              },
            }}
          >
            초기화
          </Button>

          <GradientButton
            fullWidth
            onClick={handleApplyFilters}
            sx={{ py: 1.5 }}
          >
            필터 적용
          </GradientButton>
        </Box>
      </Drawer>

      {/* 카테고리 선택 모달 */}
      <CategoryFilterDialog
        open={categoryDialogOpen}
        onClose={() => setCategoryDialogOpen(false)}
        initialSelection={selectedCategory}
        onSelect={handleCategorySelect}
      />

      {/* 지역 선택 모달 */}
      <RegionSelectionModal
        open={regionDialogOpen}
        onClose={() => setRegionDialogOpen(false)}
        onSubmit={handleRegionSelect}
        selectedRegions={selectedRegions}
      />
    </Box>
  );
};

export default CourseSearchPage;
