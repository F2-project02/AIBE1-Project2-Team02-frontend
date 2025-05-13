import { useState } from "react";
import { Box, Typography, Stack, Button } from "@mui/material";
import EventIcon from "@mui/icons-material/Event";
import ScheduleIcon from "@mui/icons-material/Schedule";
import RoomIcon from "@mui/icons-material/Room";
import { useUserStore } from "../../store/useUserStore";
import useLecturePermission from "../../hooks/useLecturePermission";
import LectureApplyModal from "./LectureApplyModal";
import CustomToast from "../common/CustomToast";
import warnGif from "../../assets/warn.gif";
import smileGif from "../../assets/heartsmile.gif";

export default function LectureInfoBox({ lecture }) {
  const { isLoggedIn } = useUserStore();
  const { isOwner } = useLecturePermission(lecture);
  const [openApply, setOpenApply] = useState(false);

  const [toast, setToast] = useState({
    open: false,
    message: "",
    severity: "info",
    icon: null,
  });

  const handleCloseToast = () => {
    setToast((prev) => ({ ...prev, open: false }));
  };

  const handleApplyClick = () => {
    if (lecture.isClosed) {
      setToast({
        open: true,
        message: "이런, 이미 마감된 강의예요",
        severity: "error",
        icon: warnGif,
      });
    } else {
      setOpenApply(true);
    }
  };

  const handleLikeClick = () => {
    setToast({
      open: true,
      message: "찜하기는 곧 구현될 기능이에요!",
      severity: "info",
      icon: smileGif,
    });
  };

  const getDaysOfWeek = () => {
    const timeSlots = lecture.availableTimeSlots || [];
    if (timeSlots.length === 0) return "요일 정보 없음";

    const days = timeSlots
      .map((slot) => slot.dayOfWeek || slot.day || "")
      .filter(Boolean);

    return [...new Set(days)].join(", ") || "요일 정보 없음";
  };

  const lecturePrice = lecture.price || 0;
  const timeSlots = lecture.availableTimeSlots || [];
  const regions = lecture.regions || [];

  if (!lecture) {
    return (
      <>
        <Box
          sx={{
            p: 3,
            borderRadius: 1,
            boxShadow: "0 4px 16px rgba(0,0,0,0.06)",
            backgroundColor: "var(--bg-100)",
            minWidth: 280,
            width: "100%",
          }}
        />
        <CustomToast
          open={true}
          onClose={() => {}}
          message="강의 정보를 불러올 수 없어요."
          type="error"
          duration={4000}
          iconSrc={warnGif}
        />
      </>
    );
  }

  return (
    <>
      <Box
        sx={{
          p: 3,
          borderRadius: 1,
          boxShadow: "0 4px 16px rgba(0,0,0,0.06)",
          backgroundColor: "var(--bg-100)",
          minWidth: 280,
          width: "100%",
        }}
      >
        {/* 가격 */}
        <Typography
          variant="h6"
          fontWeight={700}
          color="var(--text-100)"
          mb={1}
        >
          {lecturePrice.toLocaleString()}원{" "}
          <Typography component="span" variant="body2" color="var(--text-300)">
            / 회
          </Typography>
        </Typography>

        {/* 수업 요일 */}
        <Stack direction="row" alignItems="center" spacing={1} mt={2}>
          <EventIcon sx={{ color: "var(--text-300)", fontSize: 20 }} />
          <Typography variant="body2" color="var(--text-200)">
            수업 요일
          </Typography>
        </Stack>
        <Typography variant="body2" color="var(--text-100)" ml={3} mt={0.5}>
          {getDaysOfWeek()}
        </Typography>

        {/* 수업 시간 */}
        <Stack direction="row" alignItems="center" spacing={1} mt={2}>
          <ScheduleIcon sx={{ color: "var(--text-300)", fontSize: 20 }} />
          <Typography variant="body2" color="var(--text-200)">
            수업 시간
          </Typography>
        </Stack>
        <Stack spacing={0.5} ml={3} mt={0.5}>
          {timeSlots.length > 0 ? (
            timeSlots.map((slot, i) => (
              <Typography key={i} variant="body2" color="var(--text-100)">
                {slot.dayOfWeek || slot.day || ""} |{" "}
                {slot.time ||
                  (slot.startTime && slot.endTime
                    ? `${slot.startTime} - ${slot.endTime}`
                    : "")}
              </Typography>
            ))
          ) : (
            <Typography variant="body2" color="var(--text-100)">
              시간 정보 없음
            </Typography>
          )}
        </Stack>

        {/* 과외 지역 */}
        <Stack direction="row" alignItems="center" spacing={1} mt={2}>
          <RoomIcon sx={{ color: "var(--text-300)", fontSize: 20 }} />
          <Typography variant="body2" color="var(--text-200)">
            과외 지역
          </Typography>
        </Stack>
        <Stack spacing={0.5} ml={3} mt={0.5}>
          {regions.length > 0 ? (
            regions.map((r, i) => (
              <Typography key={i} variant="body2" color="var(--text-100)">
                {typeof r === "string"
                  ? r
                  : [r.sido, r.sigungu, r.dong].filter(Boolean).join(" ")}
              </Typography>
            ))
          ) : (
            <Typography variant="body2" color="var(--text-100)">
              지역 정보 없음
            </Typography>
          )}
        </Stack>

        {/* 액션 버튼 */}
        {isLoggedIn && !isOwner && (
          <Stack spacing={1.5} mt={4}>
            {!lecture.isClosed && (
              <Button
                fullWidth
                variant="contained"
                onClick={handleApplyClick}
                sx={{
                  background: "linear-gradient(90deg, #FFBAD0, #5B8DEF)",
                  color: "var(--bg-100)",
                  fontWeight: 600,
                  borderRadius: "12px",
                  py: 1.5,
                  ":hover": {
                    background: "linear-gradient(90deg, #F7A8C3, #4E79DA)",
                  },
                }}
              >
                수업 신청하기
              </Button>
            )}
            <Button
              fullWidth
              variant="outlined"
              onClick={handleLikeClick}
              sx={{
                borderRadius: "12px",
                color: "var(--text-300)",
                borderColor: "var(--bg-300)",
                fontWeight: 600,
                py: 1.5,
                ":hover": {
                  backgroundColor: "var(--bg-200)",
                },
              }}
            >
              찜하기
            </Button>
          </Stack>
        )}

        {/* 토스트 알림 */}
        <CustomToast
          open={toast.open}
          onClose={handleCloseToast}
          message={toast.message}
          type={toast.severity}
          duration={4000}
          iconSrc={toast.icon}
        />
      </Box>

      <LectureApplyModal
        lectureId={lecture.lectureId}
        open={openApply}
        onClose={() => setOpenApply(false)}
      />
    </>
  );
}
