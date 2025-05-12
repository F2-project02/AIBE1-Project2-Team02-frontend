// 📄 src/components/LectureDetail/ReviewSection.jsx

import { useState, useEffect } from "react";
import { Box, Typography, Alert, Rating, Stack, Divider } from "@mui/material";
import CustomToast from "../../components/common/CustomToast";
import ReviewCard from "./ReviewCard";
import ReviewForm from "./ReviewForm";
import { useUserStore } from "../../store/useUserStore";
import axiosInstance from "../../lib/axiosInstance";
import ReviewSectionSkeleton from "./skeleton/ReviewSectionSkeleton";
import heartsmile from "../../assets/heartsmile.gif";
import warn from "../../assets/warn.gif";

export default function ReviewSection({ lecture }) {
  const [toast, setToast] = useState({
    open: false,
    message: "",
    iconSrc: null,
    type: "info",
  });

  const showToast = ({ message, type = "info", iconSrc = null }) => {
    setToast({ open: true, message, type, iconSrc });
  };

  const showSuccessToast = (message) =>
    showToast({ message, type: "info", iconSrc: heartsmile });

  const showErrorToast = (message) =>
    showToast({ message, type: "error", iconSrc: warn });

  const [reviews, setReviews] = useState([]);
  const [averageRating, setAverageRating] = useState(0);
  const [reviewCount, setReviewCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userHasReviewed, setUserHasReviewed] = useState(false);
  const { isLoggedIn, myLectureIds = [], userId } = useUserStore();

  // 로그인한 사용자가 해당 강의에 대한 리뷰를 작성했는지 확인
  useEffect(() => {
    if (!userId || !lecture?.lectureId) return;

    axiosInstance
      .get(`/api/review/check/${lecture.lectureId}`)
      .then((res) => setUserHasReviewed(res.data.data.hasReview))
      .catch(console.error);
  }, [userId, lecture?.lectureId]);

  // 리뷰 데이터 로드
  useEffect(() => {
    const fetchReviews = async () => {
      if (!userId || !lecture?.lectureId) return;

      try {
        setLoading(true);
        setError(null);

        console.log(`Fetching reviews for lecture ID: ${lecture.lectureId}`);
        const response = await axiosInstance.get(
          `/api/lectures/${lecture.lectureId}/reviews`
        );
        const responseData = response.data;

        const responseLec = await axiosInstance.get(
          `/api/review/lecture/${lecture.lectureId}`
        );
        const responseLecData = responseLec.data;

        if (
          responseData.success &&
          responseData.data &&
          responseLecData.success
        ) {
          console.log("Reviews data received:", responseData.data);
          console.log("Lecture reviews data received:", responseLecData.data);
          setAverageRating(responseData.data.averageRating || 0);
          setReviewCount(responseData.data.reviewCount || 0);
          const userReview = responseLecData.data.filter(
            (r) => r.writerId === userId
          ); // 내 리뷰를 제일 위로
          const otherReviews = responseLecData.data.filter(
            (r) => r.writerId !== userId
          );
          setReviews([...userReview, ...otherReviews]);
        } else {
          console.warn("No reviews data in response:", response);
          // 리뷰가 없는 것은 오류가 아닐 수 있음
          setReviews([]);
          setAverageRating(0);
          setReviewCount(0);
          setUserHasReviewed(false);
        }
      } catch (err) {
        console.error("Error loading reviews:", err);
        setError("리뷰를 불러오는데 문제가 발생했어요.");
      } finally {
        setLoading(false);
      }
    };

    if (lecture?.lectureId) {
      fetchReviews();
    }
  }, [lecture]);

  // 로그인한 사용자가 해당 강의를 수강 중인지 확인
  const canWriteReview =
    isLoggedIn &&
    Array.isArray(myLectureIds) &&
    myLectureIds.includes(lecture?.lectureId) &&
    !userHasReviewed;

  // 리뷰 업데이트/삭제 후 목록 새로고침
  const handleReviewUpdated = async () => {
    if (!lecture?.lectureId) return;

    try {
      setLoading(true);
      const response = await axiosInstance.get(
        `/api/lectures/${lecture.lectureId}/reviews`
      );
      const responseData = response.data;

      const responseLec = await axiosInstance.get(
        `/api/review/lecture/${lecture.lectureId}`
      );
      const responseLecData = responseLec.data;

      if (
        responseData.success &&
        responseData.data &&
        responseLecData.success
      ) {
        setAverageRating(responseData.data.averageRating || 0);
        setReviewCount(responseData.data.reviewCount || 0);

        const userReview = responseLecData.data.filter(
          (r) => r.writerId === userId
        );
        const otherReviews = responseLecData.data.filter(
          (r) => r.writerId !== userId
        );
        setReviews([...userReview, ...otherReviews]);
        setUserHasReviewed(userReview.length > 0);
      }
    } catch (err) {
      console.error("Error refreshing reviews:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box>
      <Typography variant="h6" fontWeight={700} gutterBottom>
        수강 후기
      </Typography>

      {/* 평균 평점 */}
      <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 3 }}>
        <Rating
          value={averageRating}
          precision={0.5}
          readOnly
          size="small"
          sx={{ color: "#FFB400" }}
        />
        <Typography variant="body2" fontWeight={600} color="var(--text-100)">
          {parseFloat(averageRating).toFixed(1)}
        </Typography>
        <Typography variant="body2" color="var(--text-300)">
          ({reviewCount}개의 리뷰)
        </Typography>
      </Stack>

      {/* 로딩 상태 */}
      {loading && (
        <Box sx={{ display: "flex", justifyContent: "center", my: 4 }}>
          <ReviewSectionSkeleton />
        </Box>
      )}

      {/* 에러 상태 */}
      {error && !loading && (
        <Alert severity="error" sx={{ my: 2 }}>
          {error}
        </Alert>
      )}

      {/* 리뷰 작성 폼 */}
      {canWriteReview && (
        <Box
          sx={{
            mb: 4,
            mt: 4,
            border: "none",
            borderRadius: "16px",
            backgroundColor: "var(--bg-100)",
          }}
        >
          <ReviewForm
            lectureId={lecture?.lectureId}
            mentorId={lecture?.mentorId}
            onReviewSubmitted={handleReviewUpdated}
            showToast={showSuccessToast}
            showErrorToast={showErrorToast}
          />
        </Box>
      )}

      <Divider sx={{ my: 3 }} />

      {/* 리뷰 목록 */}
      {!loading && !error && (
        <Box>
          {reviews && reviews.length > 0 ? (
            reviews.map((review, index) => (
              <ReviewCard
                key={review.reviewId || index}
                review={review}
                onReviewUpdated={handleReviewUpdated}
                showToast={showSuccessToast}
                showErrorToast={showErrorToast}
              />
            ))
          ) : (
            <Box
              sx={{
                textAlign: "center",
                py: 6,
                color: "var(--text-300)",
              }}
            >
              <Typography>아직 등록된 후기가 없어요.</Typography>
              {canWriteReview && (
                <Typography sx={{ mt: 1 }}>
                  첫 번째 후기를 작성해보세요!
                </Typography>
              )}
            </Box>
          )}
        </Box>
      )}
      <CustomToast
        open={toast.open}
        onClose={() => setToast((prev) => ({ ...prev, open: false }))}
        message={toast.message}
        iconSrc={toast.iconSrc}
        type={toast.type}
      />
    </Box>
  );
}
