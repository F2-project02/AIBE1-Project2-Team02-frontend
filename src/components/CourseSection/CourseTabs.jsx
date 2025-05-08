// 📄 src/components/CourseSection/CourseTabs.jsx
import { Tabs, Tab, Box } from "@mui/material";
import { useCourseStore } from "../../store/useCourseStore";
import { useEffect, useState } from "react";
import { dummyLectures } from "../../constants/mock/dummyLectures";
import { mapLecturesToCourseCards } from "../../utils/mapLecturesToCourseCards";

const categories = [
  "교육/입시",
  "IT/개발",
  "취업/N잡",
  "자격",
  "학위",
  "예체능",
  "라이프스타일",
];

export default function CourseTabs() {
  const { selectedCategory, setSelectedCategory, setLoading, setCourses } =
    useCourseStore();

  const [tabIndex, setTabIndex] = useState(
    categories.indexOf(selectedCategory)
  );

  const handleChange = async (event, newValue) => {
    const selected = categories[newValue];
    setTabIndex(newValue);
    setSelectedCategory(selected);
    setLoading(true);

    setTimeout(() => {
      const filtered = dummyLectures.filter(
        (lecture) => lecture.category.parent === selected
      );

      setCourses(mapLecturesToCourseCards(filtered.slice(0, 3)));
      setLoading(false);
    }, 1000);
  };

  useEffect(() => {
    handleChange(null, tabIndex);
    // eslint-disable-next-line
  }, []);

  return (
    <Box sx={{ width: "100%", borderBottom: "none" }}>
      <Tabs
        value={tabIndex}
        onChange={handleChange}
        variant="scrollable"
        scrollButtons="auto"
        textColor="inherit"
        TabIndicatorProps={{ style: { backgroundColor: "var(--primary-200)" } }}
      >
        {categories.map((label) => (
          <Tab
            key={label}
            label={label}
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
