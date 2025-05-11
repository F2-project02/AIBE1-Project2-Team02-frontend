// src/components/LectureDetail/LectureHeader.jsx

import { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Chip,
  Stack,
  Avatar,
  Breadcrumbs,
  Link,
  Divider,
  Switch,
  FormControlLabel,
  Tooltip,
} from "@mui/material";
import ShieldIcon from "@mui/icons-material/VerifiedUser";
import StarIcon from "@mui/icons-material/Star";
import LectureEditControls from "./LectureEditControls";
import useLecturePermission from "../../hooks/useLecturePermission";
import { useUserStore } from "../../store/useUserStore";
import { getRatingByMentor } from "../../lib/api/reviewApi";
import {
  getLectureReviews,
  updateLectureStatus,
} from "../../lib/api/lectureApi";

export default function LectureHeader({ lecture }) {
  const { hasPermission } = useLecturePermission(lecture);
  const { profileImage: userProfileImage } = useUserStore();
  const [averageRating, setAverageRating] = useState(0);
  const [reviewCount, setReviewCount] = useState(0);
  const [isClosedState, setIsClosedState] = useState(
    lecture?.isClosed || false
  );
  const [isUpdating, setIsUpdating] = useState(false);
  const [statusError, setStatusError] = useState("");

  // 리뷰 데이터를 가져와 평점 정보 업데이트
  useEffect(() => {
    const fetchRatingData = async () => {
      const mentorId = lecture?.mentorId;
      if (!mentorId) return;

      try {
        const response = await getRatingByMentor({ id: mentorId });
        if (response.success && response.data) {
          setAverageRating(response.data.averageRating ?? 0);
          setReviewCount(response.data.count ?? 0);
          console.log("멘토 평점 데이터:", response.data);
        }
      } catch (error) {
        console.log("멘토 평점 조회 에러:", error);
      }
    };

    fetchRatingData();
  }, [lecture?.mentorId]);

  // lecture prop이 변경될 때 isClosedState 상태 업데이트
  useEffect(() => {
    if (lecture) {
      setIsClosedState(lecture.isClosed || false);
    }
  }, [lecture]);

  // 상태 변경 핸들러
  const handleStatusChange = async (event) => {
    const newStatus = event.target.checked;
    setIsUpdating(true);
    setStatusError("");

    try {
      const response = await updateLectureStatus(lecture.lectureId, newStatus);

      if (response.success) {
        setIsClosedState(newStatus);
        console.log(
          `강의 상태가 ${newStatus ? "마감됨" : "모집중"}으로 변경됐어요.`
        );
      } else {
        // 에러 처리
        setStatusError(response.message || "상태 변경에 실패했어요.");
        // 상태 롤백
        setIsClosedState(isClosedState);
      }
    } catch (error) {
      console.error("상태 변경 오류:", error);
      setStatusError("상태 변경 중 오류가 발생했어요.");
      // 상태 롤백
      setIsClosedState(isClosedState);
    } finally {
      setIsUpdating(false);
    }
  };

  if (!lecture) {
    return null;
  }

  // 안전하게 데이터 추출
  const categorySubject = lecture?.category?.sub || "기타";
  const categoryParent = lecture?.category?.parent || "교육";
  const categoryMiddle = lecture?.category?.middle || "일반";
  const lectureTitle = lecture?.title || "강의 제목";

  // 멘토 정보 추출
  const mentorNickname = lecture?.mentor?.nickname || "멘토";
  const mentorEducation = lecture?.mentor?.education || "";
  const mentorMajor = lecture?.mentor?.major || "";
  const mentorProfileImage =
    lecture?.mentor?.profileImage || "/images/default-profile.svg";
  const mentorIsCertified = lecture?.mentor?.isCertified || false;
  const mentorSex = lecture?.mentor?.sex || "";
  const mentorMbti = lecture?.mentor?.mbti || "";
  const isClosed = lecture?.isClosed || false;

  // 추가 멘토 정보 표시 여부
  const hasAdditionalInfo = mentorSex || mentorMbti;

  // CourseCard와 동일한 방식으로 별점 표시
  const ratingValue = parseFloat(averageRating).toFixed(1);

  return (
    <Box sx={{ mb: 6 }}>
      {/* 상단 태그 + 수정/삭제 버튼 */}
      <Stack
        direction="row"
        alignItems="center"
        spacing={2}
        mb={1.5}
        justifyContent="space-between"
      >
        <Stack direction="row" spacing={1}>
          <Chip
            label={categorySubject}
            size="small"
            sx={{
              backgroundColor: "var(--action-primary-bg)",
              color: "var(--primary-300)",
              borderRadius: "8px",
              fontWeight: 500,
              fontSize: "0.75rem",
              px: 1,
            }}
          />
          <Chip
            label={isClosedState ? "마감됨" : "모집중"}
            size="small"
            sx={{
              backgroundColor: isClosedState
                ? "var(--action-red-bg)"
                : "var(--action-green-bg)",
              color: isClosedState
                ? "var(--action-red)"
                : "var(--action-green)",
              borderRadius: "8px",
              fontWeight: 500,
              fontSize: "0.75rem",
              px: 1,
            }}
          />

          {/* 상태 변경 토글 - 권한이 있는 경우에만 표시 */}
          {hasPermission && (
            <Tooltip
              title={
                isUpdating
                  ? "변경 중..."
                  : isClosedState
                  ? "모집중으로 변경"
                  : "마감으로 변경"
              }
            >
              <FormControlLabel
                control={
                  <Switch
                    checked={isClosedState}
                    onChange={handleStatusChange}
                    disabled={isUpdating}
                    size="small"
                    color="primary"
                  />
                }
                label={
                  <Typography variant="caption" color="var(--text-300)">
                    {isClosedState ? "마감" : "모집중"}
                  </Typography>
                }
                sx={{ ml: 0 }}
              />
            </Tooltip>
          )}
        </Stack>

        {/* 수정/삭제 버튼 (권한이 있을 때만 표시) */}
        {hasPermission && <LectureEditControls lecture={lecture} />}
      </Stack>

      {/* 과외 제목 */}
      <Typography variant="h5" fontWeight={600} color="var(--text-100)" mb={1}>
        {lectureTitle}
      </Typography>

      {/* 브레드크럼 */}
      <Breadcrumbs separator="›" sx={{ mb: 3 }}>
        <Link
          underline="hover"
          color="var(--text-300)"
          component="button"
          onClick={() => console.log(`카테고리 ${categoryParent} 클릭`)}
        >
          {categoryParent}
        </Link>
        <Link
          underline="hover"
          color="var(--text-300)"
          component="button"
          onClick={() => console.log(`카테고리 ${categoryMiddle} 클릭`)}
        >
          {categoryMiddle}
        </Link>
        <Typography color="var(--text-100)">{categorySubject}</Typography>
      </Breadcrumbs>

      {/* 멘토 정보 + 평점 */}
      <Stack direction="row" alignItems="center" spacing={2} mb={3}>
        <Avatar
          src={mentorProfileImage || userProfileImage}
          sx={{ width: 50, height: 50, bgcolor: "var(--bg-200)" }}
          alt={mentorNickname}
        />
        <Box>
          <Stack
            direction="row"
            alignItems="center"
            spacing={1}
            sx={{
              flexWrap: "nowrap",
              minWidth: 0,
              overflow: "hidden",
              whiteSpace: "nowrap",
            }}
          >
            <Typography
              variant="subtitle1"
              fontWeight={600}
              color="var(--text-100)"
            >
              {mentorNickname}
            </Typography>
            {mentorIsCertified && (
              <ShieldIcon
                fontSize="small"
                sx={{ color: "var(--primary-100)" }}
              />
            )}
          </Stack>
          <Typography variant="body2" color="var(--text-400)">
            {mentorEducation}
            {mentorMajor ? ` ${mentorMajor}` : ""}
          </Typography>

          {/* 추가 정보 - 성별, MBTI */}
          {hasAdditionalInfo && (
            <Typography
              variant="body2"
              color="var(--text-400)"
              sx={{ mt: 0.5 }}
            >
              {mentorSex ? `성별:${mentorSex},` : ""}
              {mentorSex && mentorMbti ? "" : ""}
              {mentorMbti ? `MBTI: ${mentorMbti}` : ""}
            </Typography>
          )}
        </Box>

        {/* 별점 - CourseCard와 동일한 스타일 */}
        <Stack direction="row" spacing={0.5} alignItems="center" ml="auto">
          <StarIcon sx={{ fontSize: 18, color: "#FFB400" }} />
          <Typography variant="body2" fontWeight={600} color="var(--text-100)">
            {ratingValue}
          </Typography>
          {reviewCount > 0 && (
            <Typography
              variant="body2"
              color="var(--text-300)"
              sx={{ ml: 0.5 }}
            >
              ({reviewCount})
            </Typography>
          )}
        </Stack>
      </Stack>

      <Divider sx={{ mt: 2, mb: 3 }} />
    </Box>
  );
}
