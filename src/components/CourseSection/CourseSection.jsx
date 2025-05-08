import { useEffect, useState } from "react";
import { Box, Typography } from "@mui/material";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import CourseTabs from "./CourseTabs";
import CourseList from "./CourseList";
import { useNavigate } from "react-router-dom";
import { getLectures } from "../../lib/api/lectureApi";

const CATEGORY_TABS = [
  { label: "전체", value: null },
  { label: "교육/입시", value: "교육/입시" },
  { label: "취업/N잡", value: "취업/N잡" },
  { label: "IT/개발", value: "IT/개발" },
  { label: "자격", value: "자격" },
  { label: "학위", value: "학위" },
  { label: "예체능", value: "예체능" },
  { label: "라이프스타일", value: "라이프스타일" },
];

export default function CourseSection() {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchCourses = async (category) => {
    setLoading(true);
    try {
      const params = {
        page: 0,
        size: 3,
        sort: "createdAt,desc",
      };
      if (category) params.category = category;

      const response = await getLectures(params);
      if (response.success && response.data) {
        setCourses(mapApiResponseToCards(response.data.content));
      } else {
        setCourses([]);
      }
    } catch (error) {
      console.error("과외 목록 조회 실패:", error);
      setCourses([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses(selectedCategory);
  }, [selectedCategory]);

  const mapApiResponseToCards = (lectures) => {
    return lectures.map((lecture) => {
      let regionList = [];

      if (lecture.regions) {
        if (Array.isArray(lecture.regions)) {
          regionList = lecture.regions;
        } else if (typeof lecture.regions === "string") {
          try {
            const parsed = JSON.parse(lecture.regions);
            regionList = Array.isArray(parsed) ? parsed : [parsed];
          } catch {
            regionList = [lecture.regions];
          }
        }
      }

      return {
        lectureId: lecture.lectureId,
        title: lecture.lectureTitle,
        price: lecture.price,
        mentorName: lecture.mentorNickname,
        profileImage: lecture.profileImage || "/images/default-profile.svg",
        isCertified: lecture.isCertified,
        rating: lecture.averageRating,
        subcategory: [lecture.subcategory || ""],
        region: regionList.length > 0 ? regionList : ["지역 정보 없음"],
      };
    });
  };

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
          onClick={() => navigate("/search")}
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
              transform: "translateX(2px)",
            },
          }}
        >
          전체보기
          <ArrowForwardIosIcon sx={{ fontSize: 12 }} />
        </Box>
      </Box>

      {/* 카테고리 탭 */}
      <CourseTabs
        tabs={CATEGORY_TABS}
        selected={selectedCategory}
        onSelect={setSelectedCategory}
      />

      {/* 과외 리스트 */}
      <CourseList courses={courses} loading={loading} />
    </Box>
  );
}
