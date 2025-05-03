// src/pages/Home.jsx

import { Box, Stack } from "@mui/material";
import HeroBanner from "../components/Home/HeroBanner/HeroBanner";
import SearchBar from "../components/Home/SearchBar";

export default function Home() {
  return (
    <Box sx={{ mt: 4 }}>
      <Stack spacing={{ xs: 3, sm: 4, md: 5 }} alignItems="center">
        <HeroBanner />
        <SearchBar />
      </Stack>
    </Box>
  );
}