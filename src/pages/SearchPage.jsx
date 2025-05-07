// src/pages/SearchPage.jsx
import { useState, useEffect } from "react";
import {
  Box,
  Typography,
  TextField,
  InputAdornment,
  Grid,
  Pagination,
  CircularProgress,
  Drawer,
  useMediaQuery,
  IconButton,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import TuneIcon from "@mui/icons-material/Tune";
import CloseIcon from "@mui/icons-material/Close";
import { useTheme } from "@mui/material/styles";

// Import components
import CourseCard from "../components/CourseSection/CourseCard";
import CourseCardSkeleton from "../components/CourseSection/CourseCardSkeleton";
import FilterPanel from "../components/Search/FilterPanel";
import NoResults from "../components/Search/NoResults";
import GradientButton from "../components/Button/GradientButton";

// Import API utilities
import { getLectures } from "../lib/api/lectureApi";
import { regionApi } from "../lib/api/regionApi";
import { categoryApi } from "../lib/api/categoryApi";

// Import utility functions
import { mapLectureToCard } from "../utils/LectureMapper";

export default function SearchPage() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  // States
  const [searchQuery, setSearchQuery] = useState("");
  const [lectures, setLectures] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [filterOpen, setFilterOpen] = useState(false);

  // Filter states
  const [categories, setCategories] = useState([]);
  const [regions, setRegions] = useState([]);
  const [filters, setFilters] = useState({
    keyword: "",
    category: null,
    region: null,
    minPrice: null,
    maxPrice: null,
    minRating: null,
    isCertified: null,
    isOpen: true,
  });

  // Load initial data
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        // Fetch categories and regions for filters
        const [categoriesData, regionsData] = await Promise.all([
          categoryApi.getParentCategories(),
          regionApi.getSidos(),
        ]);

        setCategories(categoriesData || []);
        setRegions(regionsData || []);

        // Fetch initial lectures
        searchLectures();
      } catch (error) {
        console.error("Error fetching initial data:", error);
      }
    };

    fetchInitialData();
  }, []);

  // Search lectures with current filters and pagination
  const searchLectures = async (pageNum = 1) => {
    setLoading(true);

    try {
      const params = {
        keyword: filters.keyword || searchQuery,
        category: filters.category,
        region: filters.region,
        minPrice: filters.minPrice,
        maxPrice: filters.maxPrice,
        minRating: filters.minRating,
        isCertified: filters.isCertified,
        isOpen: filters.isOpen,
        page: pageNum - 1, // API uses 0-based indexing
        size: 12,
      };

      // Clean undefined and null values
      Object.keys(params).forEach(
        (key) =>
          (params[key] === undefined || params[key] === null) &&
          delete params[key]
      );

      const response = await getLectures(params);

      if (response.success) {
        const data = response.data;
        setLectures(data.content || []);
        setTotalPages(data.totalPages || 1);
        setTotalCount(data.totalElements || 0);
        setPage(pageNum);
      } else {
        console.error("Error searching lectures:", response.message);
        setLectures([]);
        setTotalCount(0);
      }
    } catch (error) {
      console.error("Error searching lectures:", error);
      setLectures([]);
      setTotalCount(0);
    } finally {
      setLoading(false);
    }
  };

  // Handle search form submission
  const handleSearch = (e) => {
    e.preventDefault();
    setFilters({ ...filters, keyword: searchQuery });
    searchLectures(1);
  };

  // Handle filter changes
  const handleFilterChange = (newFilters) => {
    setFilters({ ...filters, ...newFilters });
    searchLectures(1);
    if (isMobile) {
      setFilterOpen(false);
    }
  };

  // Handle pagination change
  const handlePageChange = (event, value) => {
    setPage(value);
    searchLectures(value);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Toggle filter panel on mobile
  const toggleFilterPanel = () => {
    setFilterOpen(!filterOpen);
  };

  return (
    <Box sx={{ mt: 4, mb: 8 }}>
      {/* Header */}
      <Typography variant="h5" fontWeight={600} mb={4}>
        과외 찾기
      </Typography>

      {/* Search bar */}
      <Box component="form" onSubmit={handleSearch} sx={{ mb: 4 }}>
        <TextField
          fullWidth
          placeholder="나에게 필요한 멘토의 과외를 검색해보세요"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon color="action" />
              </InputAdornment>
            ),
            endAdornment: isMobile && (
              <InputAdornment position="end">
                <IconButton onClick={toggleFilterPanel}>
                  <TuneIcon />
                </IconButton>
              </InputAdornment>
            ),
            sx: {
              borderRadius: "16px",
              backgroundColor: "var(--bg-100)",
              "& fieldset": {
                borderColor: "var(--primary-100)",
                borderWidth: "1px",
              },
              "&:hover fieldset": {
                borderColor: "var(--primary-200) !important",
              },
            },
          }}
        />
      </Box>

      {/* Main content with filters and results */}
      <Box sx={{ display: "flex", gap: 4 }}>
        {/* Desktop Filter Panel */}
        {!isMobile && (
          <Box sx={{ width: 280, flexShrink: 0 }}>
            <FilterPanel
              categories={categories}
              regions={regions}
              filters={filters}
              onFilterChange={handleFilterChange}
            />
          </Box>
        )}

        {/* Mobile Filter Panel (Drawer) */}
        <Drawer
          anchor="right"
          open={filterOpen}
          onClose={() => setFilterOpen(false)}
          sx={{
            display: { xs: "block", md: "none" },
            "& .MuiDrawer-paper": {
              width: "85%",
              maxWidth: 320,
              px: 2,
              py: 2,
            },
          }}
        >
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 2,
            }}
          >
            <Typography variant="h6" fontWeight={600}>
              필터
            </Typography>
            <IconButton onClick={() => setFilterOpen(false)}>
              <CloseIcon />
            </IconButton>
          </Box>
          <FilterPanel
            categories={categories}
            regions={regions}
            filters={filters}
            onFilterChange={handleFilterChange}
            isMobile={true}
          />
          <Box sx={{ mt: 2 }}>
            <GradientButton fullWidth onClick={() => setFilterOpen(false)}>
              필터 적용하기
            </GradientButton>
          </Box>
        </Drawer>

        {/* Results Area */}
        <Box sx={{ flexGrow: 1 }}>
          {/* Results Count & Sorting (can be added later) */}
          {!loading && (
            <Box
              sx={{ mb: 2, display: "flex", justifyContent: "space-between" }}
            >
              <Typography variant="body1" color="text.secondary">
                총 {totalCount > 0 ? `${totalCount}개의 과외` : "0개의 결과"}
              </Typography>
              {/* Sorting options can be added here */}
            </Box>
          )}

          {/* Results Grid */}
          {loading ? (
            <Grid container spacing={3}>
              {Array(12)
                .fill(null)
                .map((_, index) => (
                  <Grid item xs={12} sm={6} md={4} key={`skeleton-${index}`}>
                    <CourseCardSkeleton />
                  </Grid>
                ))}
            </Grid>
          ) : lectures.length > 0 ? (
            <Grid container spacing={3}>
              {lectures.map((lecture) => (
                <Grid item xs={12} sm={6} md={4} key={lecture.lectureId}>
                  <CourseCard data={mapLectureToCard(lecture)} />
                </Grid>
              ))}
            </Grid>
          ) : (
            <NoResults searchQuery={filters.keyword || searchQuery} />
          )}

          {/* Pagination */}
          {!loading && lectures.length > 0 && totalPages > 1 && (
            <Box sx={{ display: "flex", justifyContent: "center", mt: 6 }}>
              <Pagination
                count={totalPages}
                page={page}
                onChange={handlePageChange}
                color="primary"
                showFirstButton
                showLastButton
              />
            </Box>
          )}
        </Box>
      </Box>
    </Box>
  );
}
