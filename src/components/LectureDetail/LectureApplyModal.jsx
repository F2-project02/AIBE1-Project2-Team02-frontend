import {
  Modal,
  Box,
  Typography,
  Button,
  TextField,
  Stack,
  Avatar,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import ShieldIcon from "@mui/icons-material/VerifiedUser";
import StarIcon from "@mui/icons-material/Star";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import { useState, useRef, useEffect, useMemo } from "react";
import GradientButton from "../Button/GradientButton";
import { applyLecture, fetchLectureApplyForm } from "../../lib/api/lectureApi";
import FormFieldWrapper from "../CreateLecture/FormFieldWrapper";
import SelectableButtonGroup from "../common/SelectableButtonGroup";
import TimeSlotOptionItem from "../common/TimeSlotOptionItem";
import CustomToast from "../common/CustomToast";
import warnGif from "../../assets/warn.gif";
import heartsmileGif from "../../assets/heartsmile.gif";

export default function LectureApplyModal({ lectureId, onClose, open }) {
  const [reason, setReason] = useState("");
  const [formData, setFormData] = useState(null);
  const [selectedDay, setSelectedDay] = useState(null);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const textFieldRef = useRef(null);
  const [toastOpen, setToastOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastIcon, setToastIcon] = useState(null);
  const [toastType, setToastType] = useState("info");

  const showToast = (message, icon = null, type = "info") => {
    setToastMessage(message);
    setToastIcon(icon);
    setToastType(type);
    setToastOpen(true);
  };

  const [selectedSlotIndex, setSelectedSlotIndex] = useState(null);
  const isSlotSelected = (index) => selectedSlotIndex === index;

  const toggleSlot = (index) => {
    setSelectedSlotIndex((prev) => (prev === index ? null : index));
  };
  const selectDay = (day) => {
    setSelectedDay(selectedDay === day ? null : day);
  };

  useEffect(() => {
    if (!open) {
      setReason("");
      setSelectedDay(null);
      setSelectedSlotIndex(null);
      setFormData(null);
      return;
    }

    if (lectureId) {
      const fetchData = async () => {
        try {
          const data = await fetchLectureApplyForm(lectureId);
          setFormData(data);
        } catch (err) {
          console.error("신청 폼 데이터 조회 실패", err);
        }
      };
      fetchData();
    }
  }, [open, lectureId]);

  const availableDays = useMemo(() => {
    return [...new Set(formData?.availableTimeSlots?.map((s) => s.dayOfWeek))];
  }, [formData]);

  const selectedDaySlots = useMemo(() => {
    return (
      formData?.availableTimeSlots?.filter(
        (s) => s.dayOfWeek === selectedDay
      ) || []
    );
  }, [formData, selectedDay]);
  const selectedSlot = selectedDaySlots[selectedSlotIndex];

  const handleSubmit = async () => {
    if (selectedSlotIndex === null) {
      showToast("시간대를 선택해주세요.", warnGif, "error");
      return;
    }
    const payload = {
      lectureId,
      message: reason,
      requestedTimeSlots: [selectedSlot],
    };
    try {
      await applyLecture(payload);
      showToast("수업이 신청 되었어요!", heartsmileGif);
      setTimeout(() => {
        onClose();
      }, 2000);
    } catch (error) {
      const errorMessage = error?.response?.data?.message ?? "";

      const codeMatch = errorMessage.match(/\[(.*?)\]/);
      const errorCode = codeMatch?.[1];
      if (errorCode === "DUPLICATE_APPLICATION") {
        showToast("이미 신청한 과외입니다.", warnGif, "error");
      } else {
        showToast("이런, 과외 신청이 실패했어요.", warnGif, "error");
      }
    }
  };

  return (
    <>
      <Modal open={open} onClose={onClose}>
        <Box
          sx={{
            width: isMobile ? "100vw" : 500,
            height: isMobile ? "100dvh" : "auto",
            maxHeight: isMobile ? "100dvh" : "90vh",
            overflowY: "auto",
            bgcolor: "#fefefe",
            borderRadius: isMobile ? 0 : "16px",
            p: isMobile ? 2 : 4.5,
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            boxShadow: 6,
          }}
        >
          <Typography
            variant="h6"
            textAlign="center"
            fontWeight={600}
            fontSize="1.25rem"
            mb={4}
          >
            수업 신청폼
          </Typography>

          <Stack direction="row" spacing={2} mb={2}>
            <Typography fontWeight={600}>신청 과외명</Typography>
            <Typography fontWeight={500}>
              {formData?.lectureTitle || ""}
            </Typography>
          </Stack>

          <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 1 }}>
            <Avatar
              src={formData?.profileImage || ""}
              sx={{ width: 40, height: 40, bgcolor: "var(--bg-200)" }}
            />
            <Box>
              <Stack
                direction="row"
                alignItems="center"
                spacing={1}
                sx={{ whiteSpace: "nowrap" }}
              >
                <Typography
                  variant="subtitle1"
                  fontWeight={600}
                  color="var(--text-100)"
                >
                  {formData?.nickname}
                </Typography>
                {formData?.isCertified && (
                  <ShieldIcon
                    fontSize="small"
                    sx={{ color: "var(--primary-100)" }}
                  />
                )}
              </Stack>
              <Typography variant="body2" color="var(--text-400)">
                {formData?.education} {formData?.major}
              </Typography>
            </Box>
            <Stack direction="row" spacing={0.5} alignItems="center" ml="auto">
              <StarIcon sx={{ fontSize: 16, color: "#FFB400" }} />
              <Typography
                variant="body2"
                fontWeight={600}
                color="var(--text-100)"
              >
                {(formData?.averageRating ?? 0).toFixed(1)}
              </Typography>
            </Stack>
          </Stack>

          <FormFieldWrapper label="요일 선택" required>
            <Box sx={{ justifyContent: "flex-start", display: "flex" }}>
              <SelectableButtonGroup
                items={availableDays}
                selected={selectedDay}
                onSelect={selectDay}
              />
            </Box>
          </FormFieldWrapper>

          {/* 시간 설정 */}
          <FormFieldWrapper label="시간대 설정">
            <Typography variant="body2" color="var(--text-300)" sx={{ mb: 1 }}>
              요일을 선택하면 시간대를 설정할 수 있습니다.
            </Typography>

            {selectedDaySlots.map((slot, index) => (
              <Box key={index}>
                {index === 0 && (
                  <Box
                    display="flex"
                    alignItems="center"
                    gap={1}
                    mb={1.5}
                    sx={{ color: "var(--primary-300)", fontWeight: 600 }}
                  >
                    <AccessTimeIcon sx={{ fontSize: 20 }} />
                    <Typography variant="body2">
                      {slot.dayOfWeek}요일
                    </Typography>
                  </Box>
                )}

                <TimeSlotOptionItem
                  slot={{ ...slot, id: index }}
                  checked={isSlotSelected(index)}
                  onToggle={toggleSlot}
                />
              </Box>
            ))}
          </FormFieldWrapper>

          <Stack spacing={1} mb={2}>
            <Typography fontWeight={600} fontSize="14px">
              추가 문의 쪽지
            </Typography>
            <TextField
              multiline
              fullWidth
              minRows={11}
              maxRows={11}
              placeholder="문의 내용을 입력하세요..."
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              sx={{
                backgroundColor: "#fafafa",
                borderRadius: "12px",
                "& .MuiOutlinedInput-root": {
                  padding: "12px",
                  borderRadius: "12px",
                },
                "& textarea": {
                  fontSize: "15px",
                  fontWeight: 500,
                },
              }}
              inputRef={textFieldRef}
            />
          </Stack>

          <Box display="flex" gap={2} sx={{ flexShrink: 0 }}>
            <Box sx={{ width: "50%", height: "52px" }}>
              <Button
                onClick={onClose}
                variant="outlined"
                fullWidth
                sx={{
                  height: "100%",
                  backgroundColor: "var(--bg-100)",
                  borderRadius: "12px",
                  borderColor: "var(--bg-300)",
                  color: "var(--text-400)",
                  fontWeight: 600,
                  ":hover": {
                    backgroundColor: "var(--bg-200)",
                  },
                }}
              >
                닫기
              </Button>
            </Box>
            <Box sx={{ width: "50%", height: "52px" }}>
              <GradientButton
                fullWidth
                size="md"
                onClick={handleSubmit}
                sx={{ height: "100%", borderRadius: "12px", padding: 0 }}
              >
                보내기
              </GradientButton>
            </Box>
          </Box>
        </Box>
      </Modal>

      <CustomToast
        open={toastOpen}
        onClose={() => setToastOpen(false)}
        message={toastMessage}
        iconSrc={toastIcon}
        type={toastType}
      />
    </>
  );
}
