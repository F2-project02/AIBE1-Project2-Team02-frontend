// 📄 src/components/LectureDetail/LectureInfoBox.jsx

import { Box, Typography, Stack, Button } from "@mui/material";
import EventIcon from "@mui/icons-material/Event";
import ScheduleIcon from "@mui/icons-material/Schedule";
import RoomIcon from "@mui/icons-material/Room";
import { useUserStore } from "../../store/useUserStore";
import GradientButton from "../Button/GradientButton";

export default function LectureInfoBox({ lecture }) {
  const { role, myLectureIds } = useUserStore();
  const isMentor = role === "MENTOR";
  const isOwner = myLectureIds.includes(lecture.lectureId);

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
      {/* 가격 */}
      <Typography variant="h6" fontWeight={700} color="var(--text-100)" mb={1}>
        {lecture.price.toLocaleString()}원{" "}
        <Typography component="span" variant="body2" color="var(--text-300)">
          / 회
        </Typography>
      </Typography>

      {/* 수업 요일 */}
      <Stack direction="row" alignItems="center" spacing={1} mt={2}>
        <EventIcon sx={{ color: "var(--primary-100)", fontSize: 20 }} />
        <Typography variant="body2" color="var(--text-200)">
          수업 요일
        </Typography>
      </Stack>
      <Typography variant="body2" color="var(--text-100)" ml={3} mt={0.5}>
        {lecture.availableTimeSlots.map((slot) => slot.day).join(", ")}
      </Typography>

      {/* 수업 시간 */}
      <Stack direction="row" alignItems="center" spacing={1} mt={2}>
        <ScheduleIcon sx={{ color: "var(--primary-100)", fontSize: 20 }} />
        <Typography variant="body2" color="var(--text-200)">
          수업 시간
        </Typography>
      </Stack>
      <Stack spacing={0.5} ml={3} mt={0.5}>
        {lecture.availableTimeSlots.map((slot, i) => (
          <Typography key={i} variant="body2" color="var(--text-100)">
            {slot.day} | {slot.time}
          </Typography>
        ))}
      </Stack>

      {/* 지역 */}
      <Stack direction="row" alignItems="center" spacing={1} mt={2}>
        <RoomIcon sx={{ color: "var(--primary-100)", fontSize: 20 }} />
        <Typography variant="body2" color="var(--text-200)">
          과외 지역
        </Typography>
      </Stack>
      <Typography variant="body2" color="var(--text-100)" ml={3} mt={0.5}>
        {lecture.regions.map((r) => `${r.sido} ${r.sigungu}`).join(", ")}
      </Typography>

      {/* 버튼 (멘토 본인이 아니어야 보임) */}
      {!isMentor || !isOwner ? (
        <Stack spacing={1.5} mt={4}>
          <GradientButton fullWidth size="md">
            수업 신청하기
          </GradientButton>
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
      ) : null}
    </Box>
  );
}
