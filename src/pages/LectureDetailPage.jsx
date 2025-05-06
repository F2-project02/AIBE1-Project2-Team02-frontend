// 📄 src/pages/LectureDetailPage.jsx

import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Box, Stack, CircularProgress } from "@mui/material";
import { getLectureDetail } from "../lib/api/lecture";
import LectureHeader from "../components/LectureDetail/LectureHeader";
import LectureTabs from "../components/LectureDetail/LectureTabs";
import LectureInfoBox from "../components/LectureDetail/LectureInfoBox";

export default function LectureDetailPage() {
  const { lectureId } = useParams();
  const [lecture, setLecture] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const data = await getLectureDetail(lectureId);
      setLecture(data);
      setLoading(false);
    })();
  }, [lectureId]);

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 10 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!lecture) return <div>강의를 찾을 수 없습니다.</div>;

  return (
    <Box sx={{ mt: 8, mb: 10 }}>
      <Stack
        direction={{ xs: "column", md: "row" }}
        spacing={6}
        justifyContent="space-between"
      >
        <Box flex={1}>
          <LectureHeader lecture={lecture} />
          <LectureTabs lecture={lecture} />
        </Box>
        <Box sx={{ width: { xs: "100%", md: 300 } }}>
          <LectureInfoBox lecture={lecture} />
        </Box>
      </Stack>
    </Box>
  );
}