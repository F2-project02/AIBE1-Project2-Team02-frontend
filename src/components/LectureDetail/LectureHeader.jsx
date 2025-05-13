import { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Chip,
  Stack,
  Avatar,
  Breadcrumbs,
  Divider,
  Switch,
  FormControlLabel,
  Tooltip,
} from "@mui/material";
import SecurityIcon from "@mui/icons-material/Security";
import StarIcon from "@mui/icons-material/Star";
import LectureEditControls from "./LectureEditControls";
import useLecturePermission from "../../hooks/useLecturePermission";
import { useUserStore } from "../../store/useUserStore";
import { getRatingByMentor } from "../../lib/api/reviewApi";
import { updateLectureStatus } from "../../lib/api/lectureApi";

export default function LectureHeader({ lecture }) {
  const { hasPermission } = useLecturePermission(lecture);
  const { profileImage: userProfileImage } = useUserStore();
  const [averageRating, setAverageRating] = useState(0);
  const [reviewCount, setReviewCount] = useState(0);
  const [isClosedState, setIsClosedState] = useState(
    lecture?.isClosed || false
  );
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    const fetchRatingData = async () => {
      const mentorId = lecture?.mentorId;
      if (!mentorId) return;

      try {
        const response = await getRatingByMentor({ id: mentorId });
        if (response.success && response.data) {
          setAverageRating(response.data.averageRating ?? 0);
          setReviewCount(response.data.count ?? 0);
        }
      } catch (error) {
        // console.error("평점 불러오기 실패:", error);
      }
    };

    fetchRatingData();
  }, [lecture?.mentorId]);

  useEffect(() => {
    if (lecture) {
      setIsClosedState(lecture.isClosed || false);
    }
  }, [lecture]);

  const handleStatusChange = async (event) => {
    const newStatus = event.target.checked;
    setIsUpdating(true);

    try {
      const response = await updateLectureStatus(lecture.lectureId, newStatus);
      if (response.success) {
        setIsClosedState(newStatus);
      } else {
        setIsClosedState(isClosedState); // rollback
      }
    } catch (error) {
      console.error("상태 변경 오류:", error);
      setIsClosedState(isClosedState); // rollback
    } finally {
      setIsUpdating(false);
    }
  };

  if (!lecture) return null;

  const {
    category: { parent = "교육", middle = "일반", sub: subject = "기타" } = {},
    title: lectureTitle = "강의 제목",
    mentor = {},
    isClosed,
  } = lecture;

  const {
    nickname = "멘토",
    education = "",
    major = "",
    profileImage = "/images/default-profile.svg",
    isCertified = false,
  } = mentor;

  const ratingValue = parseFloat(averageRating).toFixed(1);

  return (
    <Box sx={{ mb: 6 }}>
      {/* 태그 및 상태 변경 토글 */}
      <Box
        display="flex"
        flexWrap="wrap"
        justifyContent="space-between"
        alignItems="flex-start"
        gap={1}
        mb={1.5}
      >
        {/* 수정/삭제 버튼 - 모바일에서는 맨 위 우측 */}
        {hasPermission && (
          <Box
            sx={{
              order: { xs: -1, sm: 1 },
              ml: "auto",
              mb: { xs: 1, sm: 0 },
            }}
          >
            <LectureEditControls lecture={lecture} />
          </Box>
        )}

        {/* 칩 + 토글 그룹 - 모바일에서는 제목 위에 붙음 */}
        <Stack
          direction="row"
          spacing={1}
          flexWrap="wrap"
          alignItems="center"
          flexShrink={1}
          sx={{ flexGrow: 1 }}
        >
          <Chip
            label={subject}
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
            label={isClosedState ? "마감" : "모집중"}
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
          {hasPermission && (
            <Tooltip
              title={
                isUpdating
                  ? "변경 중..."
                  : "토글을 눌러 모집 상태를 변경할 수 있어요"
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
      </Box>

      {/* 과외 제목 */}
      <Typography
        variant="h5"
        fontWeight={600}
        color="var(--text-100)"
        mb={1}
        sx={{ wordBreak: "keep-all" }}
      >
        {lectureTitle}
      </Typography>

      {/* 브레드크럼 */}
      <Breadcrumbs separator="›" sx={{ mb: 3 }}>
        <Typography
          fontSize={14}
          color="var(--text-300)"
          sx={{ cursor: "default" }}
        >
          {parent}
        </Typography>
        <Typography
          fontSize={14}
          color="var(--text-300)"
          sx={{ cursor: "default" }}
        >
          {middle}
        </Typography>
        <Typography fontSize={14} color="var(--text-100)">
          {subject}
        </Typography>
      </Breadcrumbs>

      {/* 멘토 정보 + 평점 */}
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        spacing={2}
        mb={3}
      >
        <Stack direction="row" alignItems="center" spacing={2}>
          <Avatar
            src={profileImage || userProfileImage}
            sx={{ width: 50, height: 50, bgcolor: "var(--bg-200)" }}
            alt={nickname}
          />
          <Box>
            <Stack direction="row" alignItems="center" spacing={1}>
              <Typography
                variant="subtitle1"
                fontWeight={600}
                color="var(--text-100)"
              >
                {nickname}
              </Typography>
              {isCertified && (
                <SecurityIcon
                  sx={{ fontSize: 16, fill: "url(#shield-gradient)" }}
                />
              )}
            </Stack>
            <Typography variant="body2" color="var(--text-400)">
              {education}
              {major ? ` ${major}` : ""}
            </Typography>
          </Box>
        </Stack>

        <Stack direction="row" spacing={0.5} alignItems="center">
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
