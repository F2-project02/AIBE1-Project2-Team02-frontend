// src/pages/Home.jsx

import { Box, Stack } from "@mui/material";
import HeroBanner from "../components/Home/HeroBanner/HeroBanner";
import SearchBar from "../components/Home/SearchBar";
import PopularMentorList from "../components/Home/PopularMentorList/PopularMentorList";
import TestCors from "../components/TestCors";

export default function Home() {
  return (
    <Box sx={{ mt: 4 }}>
      <Stack spacing={{ xs: 3, sm: 4, md: 5 }} alignItems="center">
        <HeroBanner />
        <SearchBar />
        <PopularMentorList />
        <TestCors />
      </Stack>
    </Box>
  );
}