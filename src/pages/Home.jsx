// src/pages/Home.jsx

import { Box, Stack } from "@mui/material";
import HeroBanner from "../components/Home/HeroBanner/HeroBanner";
import CategoryBar from "../components/Home/CategoryBar/CategoryBar";
import SearchBar from "../components/Home/SearchBar";
import PopularMentorList from "../components/Home/PopularMentorList/PopularMentorList";
import UserProfileModal from "../components/ProfileModal/UserProfileModal";
import CourseSection from "../components/CourseSection/CourseSection";
import ReviewSection from "../components/Home/ReviewSection/ReviewSection";

export default function Home() {
  return (
    <Box sx={{ mt: { xs: 4, md: 8 }, mb: { xs: 4, md: 6 } }}>
      {/* 상단 배너 + 검색바 */}
      <Stack spacing={{ xs: 2, sm: 2, md: 3 }} alignItems="center">
        <HeroBanner />
        <CategoryBar />
        <SearchBar />
      </Stack>

      <UserProfileModal />

      {/* 메인 콘텐츠 영역 */}
      <Stack spacing={{ xs: 10, sm: 12, md: 16 }} sx={{ mt: { xs: 8, sm: 10, md: 14 } }}>
        <PopularMentorList />
        <CourseSection />
        <ReviewSection />
      </Stack>
    </Box>
  );
}