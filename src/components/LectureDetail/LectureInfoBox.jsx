// 📄 src/components/LectureDetail/LectureInfoBox.jsx

import { useState } from "react";
import {
  Box,
  Typography,
  Stack,
  Button,
  FormControlLabel,
  Switch,
  Snackbar,
  Alert,
  CircularProgress,
  Tooltip,
} from "@mui/material";
import EventIcon from "@mui/icons-material/Event";
import ScheduleIcon from "@mui/icons-material/Schedule";
import RoomIcon from "@mui/icons-material/Room";
import { useUserStore } from "../../store/useUserStore";
import LectureApplyModal from "./LectureApplyModal";
import useLecturePermission from "../../hooks/useLecturePermission";

export default function LectureInfoBox({ lecture }) {
  const { isLoggedIn } = useUserStore();
  const { hasPermission, isOwner } = useLecturePermission(lecture);
  const [openApply, setOpenApply] = useState(false);
  const [isClosed, setIsClosed] = useState(lecture?.isClosed || false);
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "info",
  });

  // 디버깅용 로그
  console.log("작성자 여부(isOwner):", isOwner);
  console.log("강의 마감 여부(isClosed):", lecture?.isClosed);

  // 안전 확인 및 기본값 설정
  if (!lecture) {
    return (
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
        <Alert severity="warning">강의 정보를 불러올 수 없습니다.</Alert>
      </Box>
    );
  }

  // 스낵바 닫기
  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  // 데이터 안전하게 가져오기
  const lecturePrice = lecture.price || 0;
  const timeSlots = lecture.availableTimeSlots || [];
  const regions = lecture.regions || [];

  // 요일 추출하기
  const getDaysOfWeek = () => {
    if (!timeSlots || timeSlots.length === 0) return "요일 정보 없음";

    // 타입 체크 후 데이터 추출
    const days = timeSlots
      .map((slot) => slot.dayOfWeek || slot.day || "")
      .filter(Boolean);

    // 중복 제거 후 문자열로 변환
    return [...new Set(days)].join(", ") || "요일 정보 없음";
  };

  // 신청하기 버튼 클릭 핸들러
  const handleApplyClick = () => {
    if (lecture.isClosed) {
      setSnackbar({
        open: true,
        message: "이미 마감된 강의입니다.",
        severity: "warning",
      });
    } else {
      setOpenApply(true);
    }
  };

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

        {/* 지역 */}
        <Stack direction="row" alignItems="center" spacing={1} mt={2}>
          <RoomIcon sx={{ color: "var(--text-300)", fontSize: 20 }} />
          <Typography variant="body2" color="var(--text-200)">
            과외 지역
          </Typography>
        </Stack>
        <Stack spacing={0.5} ml={3} mt={0.5}>
          {regions && regions.length > 0 ? (
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

        {/* 액션 버튼 - 작성자가 아닌 경우에만 버튼들 표시 */}
        {isLoggedIn && !isOwner && (
          <Stack spacing={1.5} mt={4}>
            {/* 모집중인 경우에만 신청하기 버튼 표시 */}
            {!lecture.isClosed && (
              <Button
                fullWidth
                variant="contained"
                onClick={handleApplyClick}
                sx={{
                  background: "linear-gradient(90deg, #FFBAD0, #5B8DEF)",
                  color: "#fff",
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

            {/* 찜하기 버튼은 항상 표시 */}
            <Button
              fullWidth
              variant="outlined"
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
        {/* 스낵바 메시지 */}
        <Snackbar
          open={snackbar.open}
          autoHideDuration={6000}
          onClose={handleCloseSnackbar}
          anchorOrigin={{ vertical: "top", horizontal: "center" }}
        >
          <Alert
            onClose={handleCloseSnackbar}
            severity={snackbar.severity}
            sx={{ width: "100%" }}
          >
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Box>
      <LectureApplyModal
        lectureId={lecture.lectureId}
        onClose={() => setOpenApply(false)}
        open={openApply}
      />
    </>
  );
}
