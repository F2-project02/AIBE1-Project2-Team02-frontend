import { Box, Stack } from "@mui/material";
import LectureHeader from "../components/LectureDetail/LectureHeader";
import LectureTabs from "../components/LectureDetail/LectureTabs";
import LectureInfoBox from "../components/LectureDetail/LectureInfoBox";
import { dummyLecture } from "../constants/mock/dummyLecture";

export default function LectureDetailPage() {
  return (
    <Box sx={{ mt: 8, mb: 10 }}>
      <Stack
        direction={{ xs: "column", md: "row" }}
        spacing={6}
        justifyContent="space-between"
      >
        <Box flex={1}>
          <LectureHeader lecture={dummyLecture} />
          <LectureTabs lecture={dummyLecture} />
        </Box>
        <Box sx={{ width: { xs: "100%", md: 300 } }}>
          <LectureInfoBox lecture={dummyLecture} />
        </Box>
      </Stack>
    </Box>
  );
}