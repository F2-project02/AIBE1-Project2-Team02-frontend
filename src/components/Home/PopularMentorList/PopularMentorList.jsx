// src/components/Home/PopularMentorList/PopularMentorList.jsx

import { Box, Grid, Typography } from "@mui/material";
import MentorCard from "./MentorCard";
import MentorCtaCard from "./MentorCtaCard";
import MentorCardSkeleton from "./MentorCardSkeleton";
import MentorCtaCardSkeleton from "./MentorCtaCardSkeleton";
import { dummyMentors } from "../../../constants/mock/dummyMentors"; // 일단은 더미데이터로
import { useEffect, useState } from "react";

export default function PopularMentorList() {
  // 상태 정의
  const [loading, setLoading] = useState(true); // 로딩 상태
  const [mentors, setMentors] = useState([]);   // 멘토 데이터 상태

  // 마운트 시 1초 후 더미 데이터 세팅
  useEffect(() => {
    const timer = setTimeout(() => {
      setMentors(dummyMentors.slice(0, 3)); // 상위 3명의 멘토만 표시
      setLoading(false); // 로딩 종료
    }, 1000); // 1초 지연 (API 응답 시뮬레이션)

    return () => clearTimeout(timer); // 언마운트 시 타이머 제거
  }, []);

  // 카드 요소 렌더링 함수 (멘토 카드 또는 CTA 카드)
  const renderCardItem = (Component, SkeletonComponent, props, key) => (
    <Grid key={key} size={{ xs: 12, sm: 6, md: 3 }}>
      <Box sx={{ height: "100%", width: "100%" }}>
        {loading ? <SkeletonComponent /> : <Component {...props} />}
      </Box>
    </Grid>
  );

  return (
    <Box sx={{ mt: 6, width: "100%" }}>
      {/* 섹션 제목 */}
      <Typography variant="h6" fontWeight={600} mb={4}>
        지금 인기 있는 멘토
      </Typography>

      {/* 카드 리스트 (멘토 카드 3개 + CTA 카드 1개) */}
      <Grid
        container
        spacing={2}
        sx={{
          opacity: loading ? 0.4 : 1, // 로딩 중에는 흐릿하게
          pointerEvents: loading ? "none" : "auto", // 로딩 중 클릭 비활성화
          transition: "opacity 0.4s ease", // 부드러운 페이드 전환
        }}
      >
        {/* 멘토 카드 목록 */}
        {(loading ? Array(3).fill(null) : mentors).map((mentor, idx) =>
          renderCardItem(MentorCard, MentorCardSkeleton, mentor, idx)
        )}

        {/* 마지막에 CTA 카드 추가 */}
        {renderCardItem(MentorCtaCard, MentorCtaCardSkeleton, {}, "cta")}
      </Grid>
    </Box>
  );
}
