// 📄 src/pages/LectureDetailPage.jsx

import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Box, Stack, Button } from "@mui/material";
import { getLectureDetail } from "../lib/api/lecture";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

// 실제 컴포넌트
import LectureHeader from "../components/LectureDetail/LectureHeader";
import LectureTabs from "../components/LectureDetail/LectureTabs";
import LectureInfoBox from "../components/LectureDetail/LectureInfoBox";

// 스켈레톤 컴포넌트
import LectureHeaderSkeleton from "../components/LectureDetail/skeleton/LectureHeaderSkeleton";
import LectureInfoBoxSkeleton from "../components/LectureDetail/skeleton/LectureInfoBoxSkeleton";

// 더미 데이터 - API 연결 전까지 사용
import { dummyLectures } from "../constants/mock/dummyLectures";

export default function LectureDetailPage() {
  const { lectureId } = useParams();
  const [lecture, setLecture] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchLectureData = async () => {
      try {
        setLoading(true);

        // 1. 세션 스토리지에서 데이터 확인
        const sessionData = sessionStorage.getItem(`lecture_${lectureId}`);

        if (sessionData) {
          // 세션에 저장된 데이터가 있으면 사용
          const parsedData = JSON.parse(sessionData);

          // 더미 형태로 변환 (실제 API 연동 전까지)
          const formattedLecture = formatToDetailStructure(parsedData);
          setLecture(formattedLecture);
          setLoading(false);
          return;
        }

        // 2. 세션 스토리지에 없으면 API 시도
        try {
          const apiData = await getLectureDetail(lectureId);
          setLecture(apiData);
        } catch (apiError) {
          console.log("API 호출 실패, 더미 데이터로 대체:", apiError);

          // 3. API 실패 시 더미 데이터에서 찾기
          const dummyLecture = dummyLectures.find(
            (lecture) => lecture.lectureId === Number(lectureId)
          );

          if (dummyLecture) {
            setLecture(dummyLecture);
          } else {
            console.error("강의 데이터를 찾을 수 없습니다:", lectureId);
            setLecture(null);
          }
        }
      } catch (e) {
        console.error("강의 데이터를 불러오는 중 오류 발생:", e);
        setLecture(null);
      } finally {
        setLoading(false);
      }
    };

    fetchLectureData();
  }, [lectureId]);

  // 검색 결과 형식을 상세 페이지 형식으로 변환
  const formatToDetailStructure = (courseCardData) => {
    // 검색 결과 카드 데이터를 상세 페이지에 맞게 구조화
    return {
      lectureId: courseCardData.lectureId,
      title: courseCardData.title,
      description:
        courseCardData.description ||
        "이 강의에 대한 상세한 설명입니다. 보다 자세한 내용은 강의 페이지에서 확인하세요.",
      curriculum:
        courseCardData.curriculum ||
        "1. 강의 소개\n2. 기초 개념 학습\n3. 실습 및 과제\n4. 마무리 및 피드백",
      price: courseCardData.price,
      category: {
        parent: "교육/입시",
        middle: "IT/개발",
        sub: Array.isArray(courseCardData.subcategory)
          ? courseCardData.subcategory[0]
          : courseCardData.subcategory,
      },
      regions: Array.isArray(courseCardData.region)
        ? courseCardData.region.map((r) => ({
            sido: r.split(" ")[0] || "서울",
            sigungu: r.split(" ")[1] || "강남구",
          }))
        : [{ sido: "서울", sigungu: "강남구" }],
      availableTimeSlots: [
        { day: "월", time: "14:00-16:00" },
        { day: "수", time: "19:00-21:00" },
      ],
      mentor: {
        nickname: courseCardData.mentorName,
        profileImage: courseCardData.profileImage,
        isCertified: courseCardData.isCertified,
        rating: courseCardData.rating || 4.5,
        education: "서울대학교",
        major: "컴퓨터공학과",
        content:
          "안녕하세요! 열정적인 멘토입니다. 학생 여러분의 성장을 위해 최선을 다하겠습니다.",
        regions: Array.isArray(courseCardData.region)
          ? courseCardData.region
          : ["서울 강남구"],
        mbti: "ENFJ",
      },
      reviews: [
        {
          reviewId: 1,
          content:
            "정말 좋은 강의였습니다. 명확한 설명과 친절한 지도로 많은 도움이 되었어요!",
          rating: 5,
          createdAt: new Date().toISOString(),
          writer: {
            userId: 101,
            nickname: "행복한학생",
            profileImage: "/images/default-profile.svg",
          },
        },
      ],
    };
  };

  if (!lecture && !loading) {
    return (
      <Box sx={{ textAlign: "center", mt: 10 }}>
        <Box sx={{ mb: 3 }}>강의를 찾을 수 없습니다.</Box>
        <Button
          variant="outlined"
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate("/search")}
        >
          강의 목록으로 돌아가기
        </Button>
      </Box>
    );
  }

  return (
    <Box sx={{ mt: 3, mb: 10 }}>
      {/* 뒤로가기 버튼 */}
      <Button
        variant="text"
        startIcon={<ArrowBackIcon />}
        onClick={() => navigate("/search")}
        sx={{
          mb: 3,
          color: "var(--text-300)",
          "&:hover": {
            backgroundColor: "var(--bg-200)",
          },
        }}
      >
        강의 목록으로 돌아가기
      </Button>

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
