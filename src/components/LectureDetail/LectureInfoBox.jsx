// 📄 src/components/LectureDetail/LectureInfoBox.jsx

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
} from "@mui/material";
import EventIcon from "@mui/icons-material/Event";
import ScheduleIcon from "@mui/icons-material/Schedule";
import RoomIcon from "@mui/icons-material/Room";
import { useState } from "react";
import { useUserStore } from "../../store/useUserStore";
import axiosInstance from "../../lib/axiosInstance";

export default function LectureInfoBox({ lecture }) {
  const { role, myLectureIds = [] } = useUserStore();
  const [isClosed, setIsClosed] = useState(lecture?.isClosed || false);
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "info",
  });

  // 로그인한 사용자가 멘토인지 확인
  const isMentor = role === "MENTOR";

  // 로그인한 사용자가 강의 작성자인지 확인 (강의 ID 기준)
  const isOwner =
    Array.isArray(myLectureIds) &&
    lecture?.lectureId &&
    myLectureIds.includes(lecture.lectureId);

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

  // 강의 상태 변경 핸들러
  const handleStatusChange = async (event) => {
    const newStatus = event.target.checked;

    try {
      setUpdatingStatus(true);

      // API 호출하여 강의 상태 변경
      const response = await axiosInstance.patch(
        `/api/lectures/${lecture.lectureId}/status`,
        null, // body는 비어있음
        { params: { isClosed: newStatus } } // 쿼리 파라미터로 전달
      );

      if (response.data?.success) {
        // 상태 업데이트
        setIsClosed(newStatus);

        // 성공 메시지
        setSnackbar({
          open: true,
          message: newStatus
            ? "강의가 마감되었습니다."
            : "강의가 오픈되었습니다.",
          severity: "success",
        });
      } else {
        throw new Error(response.data?.message || "상태 변경에 실패했습니다.");
      }
    } catch (err) {
      console.error("강의 상태 변경 오류:", err);

      // 에러 메시지
      setSnackbar({
        open: true,
        message: err.message || "상태 변경 중 문제가 발생했습니다.",
        severity: "error",
      });

      // 실패 시 원래 상태로 복원
      setIsClosed(!newStatus);
    } finally {
      setUpdatingStatus(false);
    }
  };

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
      {/* 상태 표시 (멘토 본인만 보임) */}
      {isMentor && isOwner && (
        <Box sx={{ mb: 2 }}>
          <FormControlLabel
            control={
              <Switch
                checked={isClosed}
                onChange={handleStatusChange}
                disabled={updatingStatus}
              />
            }
            label={
              <Typography variant="body2" color="var(--text-300)">
                {isClosed ? "마감됨" : "모집중"}
                {updatingStatus && (
                  <CircularProgress
                    size={16}
                    sx={{ ml: 1, verticalAlign: "middle" }}
                  />
                )}
              </Typography>
            }
          />
        </Box>
      )}

      {/* 가격 */}
      <Typography variant="h6" fontWeight={700} color="var(--text-100)" mb={1}>
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
      <Typography variant="body2" color="var(--text-100)" ml={3} mt={0.5}>
        {regions && regions.length > 0
          ? regions
              .map((r) => {
                if (typeof r === "string") return r;
                return [r.sido, r.sigungu, r.dong].filter(Boolean).join(" ");
              })
              .join(", ")
          : "지역 정보 없음"}
      </Typography>

      {/* 버튼 (멘토 본인이 아니어야 보임) */}
      {(!isMentor || !isOwner) && (
        <Stack spacing={1.5} mt={4}>
          <Button
            fullWidth
            variant="contained"
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
  );
}
