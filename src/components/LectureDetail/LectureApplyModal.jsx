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
  Dialog,
  DialogActions,
  DialogTitle,
  DialogContent,
} from "@mui/material";
import SecurityIcon from "@mui/icons-material/Security";
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
import thinking from "../../assets/thinking.gif";
import heartsmileGif from "../../assets/heartsmile.gif";
import LectureApplyModalSkeleton from "./skeleton/LectureApplyModalSkeleton";

export default function LectureApplyModal({ lectureId, onClose, open }) {
  const [reason, setReason] = useState("");
  const [formData, setFormData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedDay, setSelectedDay] = useState(null);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const textFieldRef = useRef(null);
  const [toastOpen, setToastOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastIcon, setToastIcon] = useState(null);
  const [toastType, setToastType] = useState("info");
  const [confirmOpen, setConfirmOpen] = useState(false);

  const showToast = (message, icon = null, type = "info") => {
    setToastMessage(message);
    setToastIcon(icon);
    setToastType(type);
    setToastOpen(true);
  };

  const [selectedSlotIndex, setSelectedSlotIndex] = useState(null);
  const isSlotSelected = (index) => selectedSlotIndex === index;
  const toggleSlot = (index) =>
    setSelectedSlotIndex((prev) => (prev === index ? null : index));
  const selectDay = (day) => setSelectedDay(selectedDay === day ? null : day);

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
        setLoading(true);
        try {
          const data = await fetchLectureApplyForm(lectureId);
          setFormData(data);
        } catch (err) {
          console.error("Failed to fetch lecture apply form:", err);
        } finally {
          setLoading(false);
        }
      };
      fetchData();
    }
  }, [open, lectureId]);

  const availableDays = useMemo(
    () => [...new Set(formData?.availableTimeSlots?.map((s) => s.dayOfWeek))],
    [formData]
  );
  const selectedDaySlots = useMemo(
    () =>
      formData?.availableTimeSlots?.filter(
        (s) => s.dayOfWeek === selectedDay
      ) || [],
    [formData, selectedDay]
  );
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
      showToast("수업이 신청됐어요! 당신의 도전을 응원해요!", heartsmileGif);
      setTimeout(() => {
        onClose();
      }, 3000);
    } catch (error) {
      const errorMessage = error?.response?.data?.message ?? "";
      const codeMatch = errorMessage.match(/\[(.*?)\]/);
      const errorCode = codeMatch?.[1];
      if (errorCode === "DUPLICATE_APPLICATION") {
        showToast("이미 신청한 과외는 또 신청할 수 없어요.", warnGif, "error");
      } else {
        showToast("이런, 과외 신청이 실패했어요.", warnGif, "error");
      }
    }
  };

  return (
    <>
      {loading || !formData ? (
        <LectureApplyModalSkeleton open={open} onClose={onClose} />
      ) : (
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

            <Stack direction="row" spacing={2} mb={2} alignItems="flex-start">
              <Typography
                fontWeight={600}
                sx={{ whiteSpace: "pre-line", minWidth: "64px" }}
              >
                신청{"\n"}과외명
              </Typography>
              <Typography
                fontWeight={500}
                sx={{
                  wordBreak: "break-word",
                  overflowWrap: "break-word",
                  flex: 1,
                }}
              >
                {formData?.lectureTitle || ""}
              </Typography>
            </Stack>

            <Stack
              direction="row"
              alignItems="center"
              justifyContent="space-between"
              spacing={2}
              mb={2}
            >
              <Stack direction="row" alignItems="center" spacing={2}>
                <Avatar
                  src={formData?.profileImage || ""}
                  sx={{ width: 40, height: 40, bgcolor: "var(--bg-200)" }}
                />
                <Box>
                  <Stack direction="row" alignItems="center" spacing={1}>
                    <Typography
                      variant="subtitle1"
                      fontWeight={600}
                      color="var(--text-100)"
                    >
                      {formData?.nickname}
                    </Typography>
                    {formData?.isCertified && (
                      <SecurityIcon
                        sx={{ fontSize: 14, fill: "url(#shield-gradient)" }}
                      />
                    )}
                  </Stack>
                  <Typography variant="body2" color="var(--text-400)">
                    {formData?.education} {formData?.major}
                  </Typography>
                </Box>
              </Stack>

              {/* 오른쪽 평점 */}
              <Stack direction="row" spacing={0.5} alignItems="center">
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

            <FormFieldWrapper label="시간대 설정">
              <Typography
                variant="body2"
                color="var(--text-300)"
                sx={{ mb: 1 }}
              >
                요일을 선택하면 시간대를 설정할 수 있어요.
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
                inputRef={textFieldRef}
                inputProps={{ maxLength: 200 }}
                sx={{
                  borderRadius: "12px",
                  "& .MuiOutlinedInput-root": {
                    borderRadius: "12px",
                    "& .MuiOutlinedInput-notchedOutline": {
                      borderColor: "var(--bg-300)",
                    },
                    "&:hover .MuiOutlinedInput-notchedOutline": {
                      borderColor: "var(--primary-100)",
                    },
                    "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                      borderColor: "var(--primary-100)",
                    },
                  },
                  "& textarea": {
                    fontSize: "15px",
                    color: "var(--text-200)",
                    fontWeight: 500,
                  },
                }}
              />
              <Typography
                textAlign="right"
                fontSize="13px"
                color="var(--text-400)"
                mt={2}
              >
                {reason.length} / 200자
              </Typography>
            </Stack>

            <Box display="flex" gap={2}>
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
                    ":hover": { backgroundColor: "var(--bg-200)" },
                  }}
                >
                  닫기
                </Button>
              </Box>
              <Box sx={{ width: "50%", height: "52px" }}>
                <GradientButton
                  fullWidth
                  size="md"
                  onClick={() => setConfirmOpen(true)}
                  sx={{ height: "100%", borderRadius: "12px", padding: 0 }}
                >
                  보내기
                </GradientButton>
              </Box>
            </Box>
          </Box>
        </Modal>
      )}

      <Dialog
        open={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        PaperProps={{
          sx: {
            borderRadius: "16px",
            px: 4,
            py: 3,
            backgroundColor: "var(--bg-100)",
          },
        }}
      >
        <DialogTitle
          sx={{ fontWeight: 600, fontSize: "1.1rem", textAlign: "center" }}
        >
          정말 신청하시겠어요?
        </DialogTitle>
        <DialogContent>
          <Box
            component="img"
            src={thinking}
            alt="생각 중"
            sx={{
              display: "block",
              mx: "auto",
              my: 2,
              width: 80,
              height: 80,
              borderRadius: "8px",
            }}
          />
        </DialogContent>
        <DialogActions sx={{ justifyContent: "center", gap: 2 }}>
          <Button
            onClick={() => setConfirmOpen(false)}
            sx={{
              color: "var(--text-300)",
              fontWeight: 600,
              px: 3,
              borderRadius: "8px",
              "&:hover": { backgroundColor: "var(--bg-200)" },
            }}
          >
            취소
          </Button>
          <Button
            onClick={() => {
              handleSubmit();
              setConfirmOpen(false);
            }}
            variant="contained"
            sx={{
              background: "linear-gradient(90deg, #FFBAD0, #5B8DEF)",
              boxShadow: "none",
              fontWeight: 500,
              px: 3,
              borderRadius: "8px",
              color: "var(--bg-100)",
              "&:hover": {
                background: "linear-gradient(90deg, #F7A8C3, #4E79DA)",
              },
            }}
          >
            신청하기
          </Button>
        </DialogActions>
      </Dialog>

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
