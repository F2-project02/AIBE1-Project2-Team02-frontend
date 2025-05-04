// src/pages/Home.jsx

import { Box, Stack } from "@mui/material";
import HeroBanner from "../components/Home/HeroBanner/HeroBanner";
import SearchBar from "../components/Home/SearchBar";
import PopularMentorList from "../components/Home/PopularMentorList/PopularMentorList";
import CourseSection from "../components/CourseSection/CourseSection";
import ReviewSection from "../components/Home/ReviewSection/ReviewSection";

export default function Home() {
  return (
    <Box sx={{ mt: { xs: 4, md: 8 }, mb: { xs: 6, md: 10 } }}>
      {/* 상단 배너 + 검색바 */}
      <Stack spacing={{ xs: 4, sm: 5, md: 6 }} alignItems="center">
        <HeroBanner />
        <SearchBar />
      </Stack>

      {/* 메인 콘텐츠 영역 */}
      <Stack spacing={{ xs: 8, sm: 10, md: 12 }} sx={{ mt: { xs: 10, sm: 12, md: 16 } }}>
        <PopularMentorList />
        <CourseSection />
        <ReviewSection />
      </Stack>
    </Box>
  );
}