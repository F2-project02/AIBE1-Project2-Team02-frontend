// src/pages/Home.jsx

import { Box, Typography } from "@mui/material";
import HeroBanner from "../components/Home/HeroBanner/HeroBanner";

export default function Home() {
  return (
    <Box sx={{ mt: 4 }}>
      <HeroBanner />
    </Box>
  );
}