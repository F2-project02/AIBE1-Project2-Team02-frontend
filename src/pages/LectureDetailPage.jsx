// 📄 src/pages/LectureDetailPage.jsx

import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Box, Stack } from "@mui/material";
import { getLectureDetail } from "../lib/api/lecture";

// 실제 컴포넌트
import LectureHeader from "../components/LectureDetail/LectureHeader";
import LectureTabs from "../components/LectureDetail/LectureTabs";
import LectureInfoBox from "../components/LectureDetail/LectureInfoBox";

// 스켈레톤 컴포넌트
import LectureHeaderSkeleton from "../components/LectureDetail/skeleton/LectureHeaderSkeleton";
import LectureInfoBoxSkeleton from "../components/LectureDetail/skeleton/LectureInfoBoxSkeleton";

export default function LectureDetailPage() {
  const { lectureId } = useParams();
  const [lecture, setLecture] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const data = await getLectureDetail(lectureId);
        setLecture(data);
      } catch (e) {
        console.error("강의 데이터를 불러오는 중 오류 발생:", e);
      } finally {
        setLoading(false);
      }
    })();
  }, [lectureId]);

  if (!lecture && !loading) {
    return (
      <Box sx={{ textAlign: "center", mt: 10 }}>강의를 찾을 수 없습니다.</Box>
    );
  }

  return (
    <Box sx={{ mt: 8, mb: 10 }}>
      <Stack
        direction={{ xs: "column", md: "row" }}
        spacing={6}
        justifyContent="space-between"
      >
        {/* 좌측 섹션 */}
        <Box flex={1}>
          {loading ? (
            <>
              <LectureHeaderSkeleton />
              <Box mt={6}>
                <LectureTabs loading={true} />
              </Box>
            </>
          ) : (
            <>
              <LectureHeader lecture={lecture} />
              <Box mt={6}>
                <LectureTabs lecture={lecture} loading={false} />
              </Box>
            </>
          )}
        </Box>

        {/* 우측 정보 박스 */}
        <Box sx={{ width: { xs: "100%", md: 300 } }}>
          {loading ? (
            <LectureInfoBoxSkeleton />
          ) : (
            <LectureInfoBox lecture={lecture} />
          )}
        </Box>
      </Stack>
    </Box>
  );
}