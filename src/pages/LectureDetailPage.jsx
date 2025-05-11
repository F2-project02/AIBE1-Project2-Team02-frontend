// 📄 src/pages/LectureDetailPage.jsx

import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Box, Stack, Typography, CircularProgress, Alert } from "@mui/material";
import { getLecture } from "../lib/api/lectureApi";
import { useUserStore } from "../store/useUserStore";

// Real components
import LectureHeader from "../components/LectureDetail/LectureHeader";
import LectureTabs from "../components/LectureDetail/LectureTabs";
import LectureInfoBox from "../components/LectureDetail/LectureInfoBox";

// Skeleton components
import LectureHeaderSkeleton from "../components/LectureDetail/skeleton/LectureHeaderSkeleton";
import LectureInfoBoxSkeleton from "../components/LectureDetail/skeleton/LectureInfoBoxSkeleton";

export default function LectureDetailPage() {
  const { lectureId } = useParams();
  const [lecture, setLecture] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { userId } = useUserStore();

  // 강의 데이터 가져오기
  useEffect(() => {
    const fetchLectureData = async () => {
      try {
        setLoading(true);
        setError(null);

        console.log(`Fetching lecture data for ID: ${lectureId}`);
        const response = await getLecture(lectureId);

        if (response.success && response.data) {
          console.log("Lecture data received:", response.data);

          // 백엔드 API에서 반환된 데이터를 프론트엔드 형식으로 변환
          const formattedLecture = formatLectureData(response.data);
          setLecture(formattedLecture);
        } else {
          throw new Error(
            response.message || "강의 정보를 불러오는데 실패했어요."
          );
        }
      } catch (err) {
        console.error("Error fetching lecture data:", err);
        setError(
          "강의 정보를 불러오는데 문제가 발생했어요. 잠시 후 다시 시도해주세요."
        );
      } finally {
        setLoading(false);
      }
    };

    if (lectureId) {
      fetchLectureData();
    }
  }, [lectureId]);

  // API에서 받은 데이터를 프론트엔드 형식으로 변환
  const formatLectureData = (data) => {
    // API 응답 로깅 (디버깅 용도)
    console.log("Raw API Response:", data);

    // timeSlots 처리 - 문자열이면 JSON으로 파싱
    let timeSlots = [];
    if (data.timeSlots) {
      try {
        if (typeof data.timeSlots === "string") {
          timeSlots = JSON.parse(data.timeSlots);
        } else {
          timeSlots = data.timeSlots;
        }
      } catch (e) {
        console.error("Error parsing timeSlots:", e);
      }
    }

    // regions 처리 - 문자열이면 JSON으로 파싱
    let regions = [];
    if (data.regions) {
      try {
        if (typeof data.regions === "string") {
          regions = JSON.parse(data.regions);
        } else {
          regions = data.regions;
        }
      } catch (e) {
        console.error("Error parsing regions:", e);
      }
    }

    // 카테고리 정보
    const category = {
      parent: data.parentCategory || "",
      middle: data.middleCategory || "",
      sub: data.subcategory || "",
    };

    // 멘토 정보 구성 (mentorInfo 객체가 존재하는 경우)
    const mentorInfo = data.mentorInfo || {};

    const mentor = {
      nickname: data.mentorNickname || "멘토",
      profileImage: mentorInfo.profileImage || "/images/default-profile.svg",
      isCertified: mentorInfo.isCertified || false,
      rating: data.averageRating || 0,
      education: mentorInfo.education || "",
      major: mentorInfo.major || "",
      sex: mentorInfo.sex || "",
      mbti: mentorInfo.mbti || "",
      content: mentorInfo.content || "",
      appealFileUrl: mentorInfo.appealFileUrl || "",
      tag: mentorInfo.tag || "",
    };

    // 변환된 데이터 반환
    return {
      lectureId: data.lectureId,
      title: data.lectureTitle,
      description: data.description,
      price: data.price,
      curriculum: data.curriculum,
      category,
      isClosed: data.isClosed,
      status: data.status,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
      availableTimeSlots: timeSlots,
      regions,
      mentor,
      reviews: [], // 리뷰는 별도 API에서 로드
      authorUserId: data.authorUserId,
      mentorId: data.mentorId,
    };
  };

  // 에러 발생 시 표시
  if (error) {
    return (
      <Box sx={{ mt: 8, p: 3, textAlign: "center" }}>
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
        <Typography variant="body1">
          강의 정보를 불러오는데 문제가 발생했어요. 잠시 후 다시 시도해주세요.
        </Typography>
      </Box>
    );
  }

  // 데이터 없이 로딩이 완료된 경우
  if (!lecture && !loading) {
    return (
      <Box sx={{ mt: 8, p: 3, textAlign: "center" }}>
        <Alert severity="warning" sx={{ mb: 2 }}>
          강의를 찾을 수 없어요.
        </Alert>
        <Typography variant="body1">
          해당 강의를 찾을 수 없어요. URL을 확인해주세요.
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ mt: 8, mb: 10, px: 2 }}>
      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", my: 8 }}>
          <CircularProgress size={60} />
        </Box>
      ) : (
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
      )}
    </Box>
  );
}
