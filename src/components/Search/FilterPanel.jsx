// src/components/Search/FilterPanel.jsx
import { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  FormGroup,
  FormControlLabel,
  Checkbox,
  RadioGroup,
  Radio,
  Slider,
  TextField,
  Stack,
  Chip,
  Button,
  Divider,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import StarIcon from "@mui/icons-material/Star";
import VerifiedUserIcon from "@mui/icons-material/VerifiedUser";
import GradientButton from "../Button/GradientButton";
import { categoryApi } from "../../lib/api/categoryApi";
import { regionApi } from "../../lib/api/regionApi";

export default function FilterPanel({
  categories = [],
  regions = [],
  filters,
  onFilterChange,
  isMobile = false,
}) {
  // Advanced filter states
  const [selectedParentCategory, setSelectedParentCategory] = useState(null);
  const [middleCategories, setMiddleCategories] = useState([]);
  const [selectedMiddleCategory, setSelectedMiddleCategory] = useState(null);
  const [subCategories, setSubCategories] = useState([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState(null);

  const [selectedSido, setSelectedSido] = useState(null);
  const [sigungus, setSigungus] = useState([]);
  const [selectedSigungu, setSelectedSigungu] = useState(null);
  const [dongs, setDongs] = useState([]);

  const [priceRange, setPriceRange] = useState([10000, 100000]);
  const [ratingFilter, setRatingFilter] = useState(null);
  const [mentorVerifiedOnly, setMentorVerifiedOnly] = useState(false);

  // Initialize filter states from provided filters prop
  useEffect(() => {
    if (filters) {
      // Initialize price range from filters (if provided)
      if (filters.minPrice !== undefined || filters.maxPrice !== undefined) {
        const min = filters.minPrice !== undefined ? filters.minPrice : 10000;
        const max = filters.maxPrice !== undefined ? filters.maxPrice : 100000;
        setPriceRange([min, max]);
      }

      // Initialize rating filter
      if (filters.minRating !== undefined) {
        setRatingFilter(filters.minRating);
      }

      // Initialize verified mentor filter
      if (filters.isCertified !== undefined) {
        setMentorVerifiedOnly(filters.isCertified);
      }
    }
  }, []);

  // Handle price range change
  const handlePriceRangeChange = (event, newValue) => {
    setPriceRange(newValue);
  };

  const handlePriceRangeChangeCommitted = () => {
    onFilterChange({
      minPrice: priceRange[0],
      maxPrice: priceRange[1],
    });
  };

  // Handle parent category selection
  useEffect(() => {
    if (selectedParentCategory) {
      const fetchMiddleCategories = async () => {
        try {
          const data = await categoryApi.getMiddleCategories(
            selectedParentCategory
          );
          setMiddleCategories(data || []);
          setSelectedMiddleCategory(null);
          setSubCategories([]);
          setSelectedCategoryId(null);

          // Find the category ID that matches both parentCategory and reset filters
          onFilterChange({
            category: selectedParentCategory,
            categoryId: null,
          });
        } catch (error) {
          console.error("Error fetching middle categories:", error);
        }
      };

      fetchMiddleCategories();
    }
  }, [selectedParentCategory]);

  // Handle middle category selection
  useEffect(() => {
    if (selectedParentCategory && selectedMiddleCategory) {
      const fetchSubCategories = async () => {
        try {
          const data = await categoryApi.getSubcategories(
            selectedParentCategory,
            selectedMiddleCategory
          );
          setSubCategories(data || []);

          // Update categoryId in filters when middle category changes
          onFilterChange({
            category: `${selectedParentCategory} > ${selectedMiddleCategory}`,
          });
        } catch (error) {
          console.error("Error fetching subcategories:", error);
        }
      };

      fetchSubCategories();
    }
  }, [selectedMiddleCategory]);

  // Handle subcategory selection
  const handleSubCategorySelect = (subcategory, categoryId) => {
    setSelectedCategoryId(categoryId);
    onFilterChange({
      category: `${selectedParentCategory} > ${selectedMiddleCategory} > ${subcategory}`,
      categoryId: categoryId,
    });
  };

  // Handle sido selection
  useEffect(() => {
    if (selectedSido) {
      const fetchSigungus = async () => {
        try {
          const data = await regionApi.getSigungus(selectedSido);
          setSigungus(data || []);
          setSelectedSigungu(null);
          setDongs([]);

          onFilterChange({ region: selectedSido });
        } catch (error) {
          console.error("Error fetching sigungus:", error);
        }
      };

      fetchSigungus();
    }
  }, [selectedSido]);

  // Handle sigungu selection
  useEffect(() => {
    if (selectedSido && selectedSigungu) {
      const fetchDongs = async () => {
        try {
          const data = await regionApi.getDongs(selectedSido, selectedSigungu);
          setDongs(data || []);

          onFilterChange({
            region: `${selectedSido} ${selectedSigungu}`,
          });
        } catch (error) {
          console.error("Error fetching dongs:", error);
        }
      };

      fetchDongs();
    }
  }, [selectedSigungu]);

  // Handle dong selection
  const handleDongSelect = (dong, regionCode) => {
    onFilterChange({
      region: `${selectedSido} ${selectedSigungu} ${dong}`,
      regionCode: regionCode,
    });
  };

  // Handle mentor rating filter
  const handleRatingChange = (value) => {
    setRatingFilter(value);
    onFilterChange({ minRating: value });
  };

  // Handle mentor verification filter
  const handleVerifiedChange = (event) => {
    setMentorVerifiedOnly(event.target.checked);
    onFilterChange({ isCertified: event.target.checked });
  };

  // Reset all filters
  const handleResetFilters = () => {
    setSelectedParentCategory(null);
    setMiddleCategories([]);
    setSelectedMiddleCategory(null);
    setSubCategories([]);
    setSelectedCategoryId(null);

    setSelectedSido(null);
    setSigungus([]);
    setSelectedSigungu(null);
    setDongs([]);

    setPriceRange([10000, 100000]);
    setRatingFilter(null);
    setMentorVerifiedOnly(false);

    onFilterChange({
      category: null,
      categoryId: null,
      region: null,
      regionCode: null,
      minPrice: null,
      maxPrice: null,
      minRating: null,
      isCertified: null,
    });
  };

  // Format price for display
  const formatPrice = (value) => {
    return `${Math.floor(value / 10000)}만원`;
  };

  return (
    <Box
      sx={{
        bgcolor: "var(--bg-100)",
        borderRadius: "16px",
        p: 0,
        height: isMobile ? "auto" : "calc(100vh - 150px)",
        overflowY: isMobile ? "auto" : "scroll",
        "&::-webkit-scrollbar": {
          width: "8px",
        },
        "&::-webkit-scrollbar-thumb": {
          backgroundColor: "var(--bg-300)",
          borderRadius: "4px",
        },
      }}
    >
      {/* Reset Filters Button */}
      <Box
        sx={{
          p: 2,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Typography variant="subtitle1" fontWeight={600}>
          필터 검색
        </Typography>
        <Button
          variant="text"
          size="small"
          onClick={handleResetFilters}
          sx={{
            color: "var(--text-300)",
            textTransform: "none",
            fontSize: "0.875rem",
          }}
        >
          필터 초기화
        </Button>
      </Box>

      <Divider />

      {/* Category Filter */}
      <Accordion defaultExpanded disableGutters elevation={0}>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant="subtitle2" fontWeight={600}>
            과목
          </Typography>
        </AccordionSummary>
        <AccordionDetails sx={{ pt: 0 }}>
          {/* Parent Categories */}
          <RadioGroup
            value={selectedParentCategory || ""}
            onChange={(e) => setSelectedParentCategory(e.target.value)}
          >
            {categories.map((category) => (
              <FormControlLabel
                key={category}
                value={category}
                control={<Radio size="small" />}
                label={<Typography variant="body2">{category}</Typography>}
              />
            ))}
          </RadioGroup>

          {/* Middle Categories */}
          {middleCategories.length > 0 && (
            <Box mt={2}>
              <Typography variant="body2" fontWeight={600} mb={1}>
                중분류
              </Typography>
              <RadioGroup
                value={selectedMiddleCategory || ""}
                onChange={(e) => setSelectedMiddleCategory(e.target.value)}
              >
                {middleCategories.map((category) => (
                  <FormControlLabel
                    key={category}
                    value={category}
                    control={<Radio size="small" />}
                    label={<Typography variant="body2">{category}</Typography>}
                  />
                ))}
              </RadioGroup>
            </Box>
          )}

          {/* Subcategories */}
          {subCategories.length > 0 && (
            <Box mt={2}>
              <Typography variant="body2" fontWeight={600} mb={1}>
                세부 과목
              </Typography>
              <Stack direction="row" flexWrap="wrap" gap={1}>
                {subCategories.map((category) => (
                  <Chip
                    key={category.id || category.name}
                    label={category.name}
                    variant={
                      selectedCategoryId === (category.id || category.name)
                        ? "filled"
                        : "outlined"
                    }
                    onClick={() =>
                      handleSubCategorySelect(
                        category.name,
                        category.id || category.name
                      )
                    }
                    sx={{
                      borderRadius: "16px",
                      backgroundColor:
                        selectedCategoryId === (category.id || category.name)
                          ? "var(--action-primary-bg)"
                          : "transparent",
                      color:
                        selectedCategoryId === (category.id || category.name)
                          ? "var(--primary-200)"
                          : "var(--text-300)",
                      borderColor: "var(--bg-300)",
                      "&:hover": {
                        backgroundColor: "var(--action-primary-bg)",
                        color: "var(--primary-200)",
                      },
                    }}
                  />
                ))}
              </Stack>
            </Box>
          )}
        </AccordionDetails>
      </Accordion>

      <Divider />

      {/* Region Filter */}
      <Accordion defaultExpanded disableGutters elevation={0}>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant="subtitle2" fontWeight={600}>
            지역
          </Typography>
        </AccordionSummary>
        <AccordionDetails sx={{ pt: 0 }}>
          {/* Sido Selection */}
          <RadioGroup
            value={selectedSido || ""}
            onChange={(e) => setSelectedSido(e.target.value)}
          >
            {regions.map((region) => (
              <FormControlLabel
                key={region}
                value={region}
                control={<Radio size="small" />}
                label={<Typography variant="body2">{region}</Typography>}
              />
            ))}
          </RadioGroup>

          {/* Sigungu Selection */}
          {sigungus.length > 0 && (
            <Box mt={2}>
              <Typography variant="body2" fontWeight={600} mb={1}>
                시/군/구
              </Typography>
              <RadioGroup
                value={selectedSigungu || ""}
                onChange={(e) => setSelectedSigungu(e.target.value)}
              >
                {sigungus.map((sigungu) => (
                  <FormControlLabel
                    key={sigungu}
                    value={sigungu}
                    control={<Radio size="small" />}
                    label={<Typography variant="body2">{sigungu}</Typography>}
                  />
                ))}
              </RadioGroup>
            </Box>
          )}

          {/* Dong Selection */}
          {dongs.length > 0 && (
            <Box mt={2}>
              <Typography variant="body2" fontWeight={600} mb={1}>
                읍/면/동
              </Typography>
              <Stack direction="row" flexWrap="wrap" gap={1}>
                {dongs.map((dong) => (
                  <Chip
                    key={dong.regionCode}
                    label={dong.dong}
                    variant={
                      filters.regionCode === dong.regionCode
                        ? "filled"
                        : "outlined"
                    }
                    onClick={() => handleDongSelect(dong.dong, dong.regionCode)}
                    sx={{
                      borderRadius: "16px",
                      backgroundColor:
                        filters.regionCode === dong.regionCode
                          ? "var(--action-yellow-bg)"
                          : "transparent",
                      color:
                        filters.regionCode === dong.regionCode
                          ? "var(--action-yellow)"
                          : "var(--text-300)",
                      borderColor: "var(--bg-300)",
                      "&:hover": {
                        backgroundColor: "var(--action-yellow-bg)",
                        color: "var(--action-yellow)",
                      },
                    }}
                  />
                ))}
              </Stack>
            </Box>
          )}
        </AccordionDetails>
      </Accordion>

      <Divider />

      {/* Price Filter */}
      <Accordion defaultExpanded disableGutters elevation={0}>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant="subtitle2" fontWeight={600}>
            수업료
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Box px={1}>
            <Slider
              value={priceRange}
              onChange={handlePriceRangeChange}
              onChangeCommitted={handlePriceRangeChangeCommitted}
              valueLabelDisplay="auto"
              valueLabelFormat={formatPrice}
              min={10000}
              max={100000}
              step={5000}
              sx={{
                color: "var(--primary-100)",
                "& .MuiSlider-valueLabel": {
                  backgroundColor: "var(--primary-100)",
                },
              }}
            />

            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                mt: 2,
              }}
            >
              <TextField
                size="small"
                value={priceRange[0]}
                onChange={(e) => {
                  const value = Number(e.target.value);
                  if (
                    !isNaN(value) &&
                    value >= 10000 &&
                    value <= priceRange[1]
                  ) {
                    setPriceRange([value, priceRange[1]]);
                  }
                }}
                onBlur={handlePriceRangeChangeCommitted}
                InputProps={{
                  endAdornment: <Typography variant="caption">원</Typography>,
                  sx: { maxWidth: 100 },
                }}
              />
              <Typography variant="body2" alignSelf="center">
                ~
              </Typography>
              <TextField
                size="small"
                value={priceRange[1]}
                onChange={(e) => {
                  const value = Number(e.target.value);
                  if (
                    !isNaN(value) &&
                    value <= 100000 &&
                    value >= priceRange[0]
                  ) {
                    setPriceRange([priceRange[0], value]);
                  }
                }}
                onBlur={handlePriceRangeChangeCommitted}
                InputProps={{
                  endAdornment: <Typography variant="caption">원</Typography>,
                  sx: { maxWidth: 100 },
                }}
              />
            </Box>
          </Box>
        </AccordionDetails>
      </Accordion>

      <Divider />

      {/* Rating and Verification Filters */}
      <Accordion defaultExpanded disableGutters elevation={0}>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant="subtitle2" fontWeight={600}>
            멘토 평점
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <RadioGroup
            value={ratingFilter || ""}
            onChange={(e) => handleRatingChange(Number(e.target.value))}
          >
            {[4.5, 4.0, 3.5].map((rating) => (
              <FormControlLabel
                key={rating}
                value={rating}
                control={<Radio size="small" />}
                label={
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    <StarIcon
                      sx={{ color: "#FFC107", fontSize: 16, mr: 0.5 }}
                    />
                    <Typography variant="body2">{rating} 이상</Typography>
                  </Box>
                }
              />
            ))}
          </RadioGroup>

          <Box mt={2}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={mentorVerifiedOnly}
                  onChange={handleVerifiedChange}
                  size="small"
                />
              }
              label={
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <VerifiedUserIcon
                    sx={{ color: "var(--primary-100)", fontSize: 16, mr: 0.5 }}
                  />
                  <Typography variant="body2">인증된 멘토만</Typography>
                </Box>
              }
            />
          </Box>
        </AccordionDetails>
      </Accordion>

      {/* Apply Filters Button for Desktop */}
      {!isMobile && (
        <Box sx={{ p: 2, mt: 2 }}>
          <GradientButton
            fullWidth
            onClick={() => {
              /* Filters are already applied on change */
            }}
          >
            필터 적용하기
          </GradientButton>
        </Box>
      )}
    </Box>
  );
}
