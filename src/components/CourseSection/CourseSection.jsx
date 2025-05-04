import { Box, Typography } from "@mui/material";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import CourseTabs from "./CourseTabs";
import CourseList from "./CourseList";
import { useNavigate } from "react-router-dom";

export default function CourseSection() {
  const navigate = useNavigate();

  return (
    <Box sx={{ width: "100%", mt: 4 }}>
      {/* 제목 + 전체보기 */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 4,
        }}
      >
        <Typography variant="h6" fontWeight={600}>
          따끈따끈한 최신 과외
        </Typography>

        <Box
          onClick={() => navigate("/courses")}
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 0.5,
            cursor: "pointer",
            color: "var(--primary-100)",
            fontWeight: 500,
            fontSize: 14,
            transition: "all 0.2s ease",
            "&:hover": {
              textDecoration: "none",
              transform: "translateX(2px)", // 약간 움직임 추가
            },
          }}
        >
          전체보기
          <ArrowForwardIosIcon sx={{ fontSize: 12 }} />
        </Box>
      </Box>

      {/* 탭 + 리스트 */}
      <CourseTabs />
      <CourseList />
    </Box>
  );
}
