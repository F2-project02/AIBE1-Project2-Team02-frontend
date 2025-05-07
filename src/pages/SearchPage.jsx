// src/pages/SearchPage.jsx

import { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Grid,
  Stack,
  Pagination,
  Divider,
  Button,
  CircularProgress,
  Chip,
} from "@mui/material";
import FilterAltIcon from "@mui/icons-material/FilterAlt";
import SearchIcon from "@mui/icons-material/Search";
import CourseCard from "../components/CourseSection/CourseCard";
import CourseCardSkeleton from "../components/CourseSection/CourseCardSkeleton";
import GradientButton from "../components/Button/GradientButton";
import { dummyLectures } from "../constants/mock/dummyLectures";
import { mapLecturesToCourseCards } from "../utils/mapLecturesToCourseCards";

// Filter dialogs
import CategoryFilterDialog from "../components/Search/CategoryFilterDialog";
import RegionFilterDialog from "../components/Search/RegionFilterDialog";
import PriceFilterDialog from "../components/Search/PriceFilterDialog";
import MentorFilterDialog from "../components/Search/MentorFilterDialog";

export default function SearchPage() {
  // State for courses and pagination
  const [courses, setCourses] = useState([]);
  const [filteredCourses, setFilteredCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const coursesPerPage = 9;

  // State for filter dialogs
  const [categoryDialogOpen, setCategoryDialogOpen] = useState(false);
  const [regionDialogOpen, setRegionDialogOpen] = useState(false);
  const [priceDialogOpen, setPriceDialogOpen] = useState(false);
  const [mentorDialogOpen, setMentorDialogOpen] = useState(false);

  // Filter states
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedRegions, setSelectedRegions] = useState([]);
  const [priceRange, setPriceRange] = useState({ min: 0, max: 100000 });
  const [certifiedOnly, setCertifiedOnly] = useState(false);
  const [searchKeyword, setSearchKeyword] = useState("");

  // Load course data
  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      const mappedCourses = mapLecturesToCourseCards(dummyLectures);
      setCourses(mappedCourses);
      setFilteredCourses(mappedCourses);
      setLoading(false);
    }, 1000);
  }, []);

  // Apply filters
  useEffect(() => {
    if (courses.length === 0) return;

    let filtered = [...courses];

    // Filter by search keyword
    if (searchKeyword) {
      filtered = filtered.filter(
        (course) =>
          course.title.toLowerCase().includes(searchKeyword.toLowerCase()) ||
          course.mentorName.toLowerCase().includes(searchKeyword.toLowerCase())
      );
    }

    // Filter by category
    if (selectedCategories.length > 0) {
      filtered = filtered.filter((course) =>
        course.subcategory.some((cat) => selectedCategories.includes(cat))
      );
    }

    // Filter by region
    if (selectedRegions.length > 0) {
      filtered = filtered.filter((course) =>
        course.region.some((reg) => selectedRegions.includes(reg))
      );
    }

    // Filter by price
    filtered = filtered.filter(
      (course) =>
        course.price >= priceRange.min && course.price <= priceRange.max
    );

    // Filter by certified mentors only
    if (certifiedOnly) {
      filtered = filtered.filter((course) => course.isCertified);
    }

    setFilteredCourses(filtered);
    setPage(1); // Reset to first page when filters change
  }, [
    courses,
    selectedCategories,
    selectedRegions,
    priceRange,
    certifiedOnly,
    searchKeyword,
  ]);

  // Handle pagination change
  const handlePageChange = (event, value) => {
    setPage(value);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Calculate pagination
  const totalPages = Math.ceil(filteredCourses.length / coursesPerPage);
  const currentCourses = filteredCourses.slice(
    (page - 1) * coursesPerPage,
    page * coursesPerPage
  );

  // Clear all filters
  const handleClearFilters = () => {
    setSelectedCategories([]);
    setSelectedRegions([]);
    setPriceRange({ min: 0, max: 100000 });
    setCertifiedOnly(false);
    setSearchKeyword("");
  };

  // Filter chips
  const filterChips = [
    ...selectedCategories.map((cat) => ({
      label: cat,
      onDelete: () =>
        setSelectedCategories((prev) => prev.filter((c) => c !== cat)),
      type: "category",
    })),
    ...selectedRegions.map((reg) => ({
      label: reg,
      onDelete: () =>
        setSelectedRegions((prev) => prev.filter((r) => r !== reg)),
      type: "region",
    })),
    ...(priceRange.min > 0 || priceRange.max < 100000
      ? [
          {
            label: `${priceRange.min / 10000}만원 ~ ${
              priceRange.max / 10000
            }만원`,
            onDelete: () => setPriceRange({ min: 0, max: 100000 }),
            type: "price",
          },
        ]
      : []),
    ...(certifiedOnly
      ? [
          {
            label: "인증 멘토만",
            onDelete: () => setCertifiedOnly(false),
            type: "mentor",
          },
        ]
      : []),
  ];

  return (
    <Box sx={{ mt: 4, mb: 10 }}>
      {/* 검색 헤더 */}
      <Typography variant="h5" fontWeight={600} gutterBottom>
        과외 찾기
      </Typography>

      {/* 검색창 */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          mb: 3,
          backgroundColor: "var(--bg-200)",
          borderRadius: "12px",
          py: 1,
          px: 2,
        }}
      >
        <SearchIcon sx={{ color: "var(--text-400)", mr: 1 }} />
        <input
          type="text"
          value={searchKeyword}
          onChange={(e) => setSearchKeyword(e.target.value)}
          placeholder="멘토 이름 또는 과외 제목으로 검색"
          style={{
            flex: 1,
            border: "none",
            background: "transparent",
            outline: "none",
            fontSize: "16px",
            color: "var(--text-200)",
          }}
        />
      </Box>

      {/* 필터 버튼들 */}
      <Stack
        direction="row"
        spacing={1}
        sx={{ mb: 2, overflowX: "auto", py: 1 }}
      >
        <Button
          variant="outlined"
          startIcon={<FilterAltIcon />}
          onClick={() => setCategoryDialogOpen(true)}
          sx={{
            borderRadius: "20px",
            borderColor: selectedCategories.length
              ? "var(--primary-100)"
              : "var(--bg-300)",
            color: selectedCategories.length
              ? "var(--primary-100)"
              : "var(--text-300)",
            backgroundColor: selectedCategories.length
              ? "var(--action-primary-bg)"
              : "transparent",
            textTransform: "none",
            whiteSpace: "nowrap",
            fontWeight: 500,
            "&:hover": {
              backgroundColor: "var(--action-primary-bg)",
              borderColor: "var(--primary-100)",
            },
          }}
        >
          과목
          {selectedCategories.length > 0 && (
            <Box
              component="span"
              sx={{
                ml: 0.5,
                backgroundColor: "var(--primary-100)",
                color: "white",
                width: 20,
                height: 20,
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 12,
              }}
            >
              {selectedCategories.length}
            </Box>
          )}
        </Button>

        <Button
          variant="outlined"
          startIcon={<FilterAltIcon />}
          onClick={() => setRegionDialogOpen(true)}
          sx={{
            borderRadius: "20px",
            borderColor: selectedRegions.length
              ? "var(--primary-100)"
              : "var(--bg-300)",
            color: selectedRegions.length
              ? "var(--primary-100)"
              : "var(--text-300)",
            backgroundColor: selectedRegions.length
              ? "var(--action-primary-bg)"
              : "transparent",
            textTransform: "none",
            whiteSpace: "nowrap",
            fontWeight: 500,
            "&:hover": {
              backgroundColor: "var(--action-primary-bg)",
              borderColor: "var(--primary-100)",
            },
          }}
        >
          지역
          {selectedRegions.length > 0 && (
            <Box
              component="span"
              sx={{
                ml: 0.5,
                backgroundColor: "var(--primary-100)",
                color: "white",
                width: 20,
                height: 20,
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 12,
              }}
            >
              {selectedRegions.length}
            </Box>
          )}
        </Button>

        <Button
          variant="outlined"
          startIcon={<FilterAltIcon />}
          onClick={() => setPriceDialogOpen(true)}
          sx={{
            borderRadius: "20px",
            borderColor:
              priceRange.min > 0 || priceRange.max < 100000
                ? "var(--primary-100)"
                : "var(--bg-300)",
            color:
              priceRange.min > 0 || priceRange.max < 100000
                ? "var(--primary-100)"
                : "var(--text-300)",
            backgroundColor:
              priceRange.min > 0 || priceRange.max < 100000
                ? "var(--action-primary-bg)"
                : "transparent",
            textTransform: "none",
            whiteSpace: "nowrap",
            fontWeight: 500,
            "&:hover": {
              backgroundColor: "var(--action-primary-bg)",
              borderColor: "var(--primary-100)",
            },
          }}
        >
          수업료
        </Button>

        <Button
          variant="outlined"
          startIcon={<FilterAltIcon />}
          onClick={() => setMentorDialogOpen(true)}
          sx={{
            borderRadius: "20px",
            borderColor: certifiedOnly ? "var(--primary-100)" : "var(--bg-300)",
            color: certifiedOnly ? "var(--primary-100)" : "var(--text-300)",
            backgroundColor: certifiedOnly
              ? "var(--action-primary-bg)"
              : "transparent",
            textTransform: "none",
            whiteSpace: "nowrap",
            fontWeight: 500,
            "&:hover": {
              backgroundColor: "var(--action-primary-bg)",
              borderColor: "var(--primary-100)",
            },
          }}
        >
          인증 여부
        </Button>
      </Stack>

      {/* 활성화된 필터 칩 */}
      {filterChips.length > 0 && (
        <Box sx={{ mb: 2, display: "flex", flexWrap: "wrap", gap: 1 }}>
          {filterChips.map((chip, index) => (
            <Chip
              key={`${chip.type}-${index}`}
              label={chip.label}
              onDelete={chip.onDelete}
              sx={{
                backgroundColor:
                  chip.type === "category"
                    ? "var(--action-primary-bg)"
                    : chip.type === "region"
                    ? "var(--action-yellow-bg)"
                    : chip.type === "mentor"
                    ? "var(--action-green-bg)"
                    : "var(--bg-200)",
                color:
                  chip.type === "category"
                    ? "var(--primary-200)"
                    : chip.type === "region"
                    ? "var(--action-yellow)"
                    : chip.type === "mentor"
                    ? "var(--action-green)"
                    : "var(--text-300)",
                fontWeight: 500,
                borderRadius: "8px",
              }}
            />
          ))}

          {filterChips.length > 1 && (
            <Button
              variant="text"
              size="small"
              onClick={handleClearFilters}
              sx={{
                color: "var(--text-400)",
                textTransform: "none",
                fontSize: "12px",
              }}
            >
              필터 초기화
            </Button>
          )}
        </Box>
      )}

      <Divider sx={{ mb: 3 }} />

      {/* 검색 결과 수 */}
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 3 }}>
        <Typography variant="body1" color="var(--text-300)">
          검색 결과: <strong>{filteredCourses.length}</strong>개의 과외
        </Typography>

        {/* 정렬 드롭다운 (추후 구현) */}
      </Box>

      {/* 강의 리스트 */}
      {loading ? (
        <Grid container spacing={3}>
          {Array(6)
            .fill(null)
            .map((_, index) => (
              <Grid item xs={12} sm={6} md={4} key={`skeleton-${index}`}>
                <CourseCardSkeleton />
              </Grid>
            ))}
        </Grid>
      ) : filteredCourses.length === 0 ? (
        <Box
          sx={{
            minHeight: "300px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Typography variant="h6" color="var(--text-300)" gutterBottom>
            검색 결과가 없습니다
          </Typography>
          <Typography
            variant="body2"
            color="var(--text-400)"
            align="center"
            sx={{ mb: 3 }}
          >
            필터를 조정하거나 다른 키워드로 검색해보세요
          </Typography>
          <GradientButton onClick={handleClearFilters}>
            필터 초기화
          </GradientButton>
        </Box>
      ) : (
        <Grid container spacing={3}>
          {currentCourses.map((course, index) => (
            <Grid item xs={12} sm={6} md={4} key={`course-${index}`}>
              <CourseCard data={course} />
            </Grid>
          ))}
        </Grid>
      )}

      {/* 페이지네이션 */}
      {!loading && filteredCourses.length > 0 && (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 5 }}>
          <Pagination
            count={totalPages}
            page={page}
            onChange={handlePageChange}
            color="primary"
            shape="rounded"
            showFirstButton
            showLastButton
          />
        </Box>
      )}

      {/* 필터 다이얼로그 */}
      <CategoryFilterDialog
        open={categoryDialogOpen}
        onClose={() => setCategoryDialogOpen(false)}
        selectedCategories={selectedCategories}
        setSelectedCategories={setSelectedCategories}
      />

      <RegionFilterDialog
        open={regionDialogOpen}
        onClose={() => setRegionDialogOpen(false)}
        selectedRegions={selectedRegions}
        setSelectedRegions={setSelectedRegions}
      />

      <PriceFilterDialog
        open={priceDialogOpen}
        onClose={() => setPriceDialogOpen(false)}
        priceRange={priceRange}
        setPriceRange={setPriceRange}
      />

      <MentorFilterDialog
        open={mentorDialogOpen}
        onClose={() => setMentorDialogOpen(false)}
        certifiedOnly={certifiedOnly}
        setCertifiedOnly={setCertifiedOnly}
      />
    </Box>
  );
}
