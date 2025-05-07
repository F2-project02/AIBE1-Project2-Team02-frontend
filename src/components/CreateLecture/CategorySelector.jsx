// 📄 src/components/CreateLecturCategorySelector.jsx
import CustomSelect from "../common/CustomSelect";
import { Box, MenuItem, CircularProgress } from "@mui/material";

export default function CategorySelector({
  categoryTree,
  parentCategories,
  middleCategories,
  subCategories,
  formData,
  setFormField,
  loading,
}) {
  if (loading) return <CircularProgress size={24} />;

  return (
    <Box
      display="flex"
      flexDirection={{ xs: "column", sm: "row" }}
      gap={{ xs: 1.5, sm: 1 }}
    >
      {/* 대분류 */}
      <CustomSelect
        value={formData.category || ""}
        onChange={(e) => setFormField("category", e.target.value)}
      >
        <MenuItem value="">대분류</MenuItem>
        {parentCategories.map((category) => (
          <MenuItem key={category} value={category}>
            {category}
          </MenuItem>
        ))}
      </CustomSelect>

      {/* 중분류 */}
      <CustomSelect
        value={formData.middleCategory || ""}
        onChange={(e) => setFormField("middleCategory", e.target.value)}
        disabled={!formData.category}
      >
        <MenuItem value="">중분류</MenuItem>
        {middleCategories.map((middle) => (
          <MenuItem key={middle} value={middle}>
            {middle}
          </MenuItem>
        ))}
      </CustomSelect>

      {/* 소분류 */}
      <CustomSelect
        value={formData.subCategory || ""}
        onChange={(e) => setFormField("subCategory", e.target.value)}
        disabled={!formData.middleCategory}
      >
        <MenuItem value="">소분류</MenuItem>
        {subCategories.map((sub) => (
          <MenuItem key={sub} value={sub}>
            {sub}
          </MenuItem>
        ))}
      </CustomSelect>
    </Box>
  );
}