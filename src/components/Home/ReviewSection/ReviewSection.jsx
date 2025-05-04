// src/components/Home/ReviewSection/ReviewSection.jsx

import { Box, Typography } from "@mui/material";
import ReviewCard from "./ReviewCard";
import ReviewCardSkeleton from "./ReviewCardSkeleton";
import { dummyReviews } from "../../../constants/mock/dummyReviews";
import { useEffect, useState } from "react";

export default function ReviewSection() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 1초 후 더미 데이터 로딩 완료 시뮬레이션
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <Box sx={{ width: "100%", mt: 8, position: "relative" }}>
      <Typography variant="h6" fontWeight={600} mb={4}>
        멘티들의 생생한 후기
      </Typography>

      {/* 롤링 박스 */}
      <Box
        sx={{
          width: "100%",
          overflowX: "clip",
          overflowY: "visible",
          position: "relative",
        }}
      >
        <Box
          className="marquee-track"
          sx={{
            display: "flex",
            flexWrap: "nowrap",
            animation: loading ? "none" : "marquee 30s linear infinite",
            gap: 2,
            width: "fit-content",
            minWidth: loading ? "auto" : "200%",
            "& > *": {
              flexShrink: 0,
            },
          }}
        >
          {loading
            ? Array.from({ length: 5 }).map((_, idx) => (
                <ReviewCardSkeleton key={idx} />
              ))
            : [...dummyReviews, ...dummyReviews].map((review, idx) => (
                <ReviewCard data={review} key={idx} />
              ))}
        </Box>
      </Box>
    </Box>
  );
}
