// 📄 src/components/CourseSection/CourseList.jsx

import { Grid, Box } from "@mui/material";
import { useCourseStore } from "../../store/useCourseStore";
import CourseCard from "./CourseCard";
import CourseCardSkeleton from "./CourseCardSkeleton";

export default function CourseList() {
  const { courses, loading } = useCourseStore();

  const renderCourse = (course, idx) => (
    <Grid size={{xs: 12, sm: 6, md: 4}} key={idx}>
      <Box sx={{ width: "100%" }}>
        <CourseCard data={course} />
      </Box>
    </Grid>
  );

  const renderSkeleton = (_, idx) => (
    <Grid size={{xs: 12, sm: 6, md: 4}} key={`skeleton-${idx}`}>
      <Box sx={{ width: "100%" }}>
        <CourseCardSkeleton />
      </Box>
    </Grid>
  );

  return (
    <Grid
      container
      columns={{ xs: 12, sm: 12, md: 12 }}
      spacing={2}
      sx={{
        mt: 2,
        opacity: loading ? 0.5 : 1,
        pointerEvents: loading ? "none" : "auto",
        transition: "opacity 0.4s ease",
      }}
    >
      {loading
        ? Array(3).fill(null).map(renderSkeleton)
        : courses.map(renderCourse)}
    </Grid>
  );
}
