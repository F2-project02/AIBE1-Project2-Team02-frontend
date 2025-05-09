// 📄 src/components/CourseSection/CourseTabs.jsx
import { Tabs, Tab, Box } from "@mui/material";

const categories = [
  { label: "전체", value: null },
  { label: "교육/입시", value: "교육/입시" },
  { label: "취업/N잡", value: "취업/N잡" },
  { label: "IT/개발", value: "IT/개발" },
  { label: "자격", value: "자격" },
  { label: "학위", value: "학위" },
  { label: "예체능", value: "예체능" },
  { label: "라이프스타일", value: "라이프스타일" },
];

export default function CourseTabs({ selected, onSelect }) {
  const tabIndex = categories.findIndex((cat) => cat.value === selected);

  const handleChange = (_, newValue) => {
    const selectedCategory = categories[newValue].value;
    onSelect(selectedCategory);
  };

  return (
    <Box sx={{ width: "100%", borderBottom: "none" }}>
      <Tabs
        value={tabIndex === -1 ? 0 : tabIndex}
        onChange={handleChange}
        variant="scrollable"
        scrollButtons="auto"
        textColor="inherit"
        TabIndicatorProps={{ style: { backgroundColor: "var(--primary-200)" } }}
      >
        {categories.map((cat) => (
          <Tab
            key={cat.value}
            label={cat.label}
            sx={{
              fontWeight: 500,
              color: "var(--text-400)",
              "&.Mui-selected": { color: "var(--primary-200)" },
            }}
          />
        ))}
      </Tabs>
    </Box>
  );
}