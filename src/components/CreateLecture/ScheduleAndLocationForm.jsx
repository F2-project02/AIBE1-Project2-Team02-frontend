// src/components/CreateLecture/ScheduleAndLocationForm.jsx

import { useState } from "react";
import {
  Box,
  Typography,
  Button,
  TextField,
  IconButton,
  Chip,
  CircularProgress,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import RegionSelectionModal from "./RegionSelectionModal";
import GradientButton from "../Button/GradientButton";
import { useLectureStore } from "../../store/useLectureStore";

const DAYS = ["월", "화", "수", "목", "금", "토", "일"];

export default function ScheduleAndLocationForm({ onSubmit, isLoading }) {
  const { formData, setTimeSlots, setRegions } = useLectureStore();
  const [selectedDay, setSelectedDay] = useState(null);
  const [showRegionModal, setShowRegionModal] = useState(false);

  // 요일 선택
  const selectDay = (day) => {
    setSelectedDay(selectedDay === day ? null : day);
  };

  // 시간대 추가
  const addTimeSlot = () => {
    if (!selectedDay) {
      alert("요일을 먼저 선택해주세요.");
      return;
    }

    const newTimeSlot = {
      id: Date.now(),
      dayOfWeek: selectedDay,
      startTime: "09:00",
      endTime: "11:00",
    };

    setTimeSlots([...formData.timeSlots, newTimeSlot]);
    setSelectedDay(null);
  };

  // 시간대 삭제
  const removeTimeSlot = (id) => {
    setTimeSlots(formData.timeSlots.filter((slot) => slot.id !== id));
  };

  // 시간대 업데이트
  const updateTimeSlot = (id, field, value) => {
    setTimeSlots(
      formData.timeSlots.map((slot) =>
        slot.id === id ? { ...slot, [field]: value } : slot
      )
    );
  };

  // 지역 추가
  const handleAddRegions = (regions) => {
    // 중복 체크 로직
    const currentCodes = new Set(formData.regions.map((r) => r.regionCode));
    const newRegions = regions.filter(
      (region) => !currentCodes.has(region.regionCode)
    );

    // 새로운 지역만 추가
    const mappedRegions = newRegions.map((region) => ({
      name: region.name,
      displayName: region.displayName,
      regionCode: region.regionCode || region.code, // 둘 다 지원
      dong: region.dong || null,
      sido: region.sido || null,
      sigungu: region.sigungu || null,
    }));

    setRegions([...formData.regions, ...mappedRegions]);
    setShowRegionModal(false);
  };

  // 지역 삭제
  const removeRegion = (index) => {
    setRegions(formData.regions.filter((_, i) => i !== index));
  };

  // 제출 핸들러
  const handleSubmit = () => {
    // 유효성 검사
    if (formData.timeSlots.length === 0) {
      alert("최소 하나의 시간대를 입력해주세요.");
      return;
    }
    if (formData.regions.length === 0) {
      alert("최소 하나의 지역을 선택해주세요.");
      return;
    }

    onSubmit();
  };

  return (
    <Box>
      {/* 과외 일정 섹션 */}
      <Typography variant="h6" fontWeight={600} gutterBottom>
        과외 일정
      </Typography>

      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        과외가 가능한 요일과 시간을 선택해주세요.
      </Typography>

      {/* 요일 선택 */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="subtitle2" fontWeight={600} gutterBottom>
          요일 선택 *
        </Typography>
        <Box display="flex" gap={1}>
          {DAYS.map((day) => (
            <Button
              key={day}
              variant={selectedDay === day ? "contained" : "outlined"}
              onClick={() => selectDay(day)}
              sx={{
                minWidth: 40,
                border:
                  selectedDay === day ? "none" : "1px solid var(--bg-300)",
                color: selectedDay === day ? "white" : "var(--text-300)",
                bgcolor:
                  selectedDay === day ? "var(--primary-200)" : "transparent",
                "&:hover": {
                  bgcolor:
                    selectedDay === day
                      ? "var(--primary-100)"
                      : "var(--action-hover)",
                },
              }}
            >
              {day}
            </Button>
          ))}
        </Box>
      </Box>

      {/* 시간대 설정 */}
      <Box sx={{ mb: 5 }}>
        <Typography variant="subtitle2" fontWeight={600} gutterBottom>
          시간대 설정
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          먼저 요일을 선택한 후 시간대를 추가하세요.
        </Typography>

        {/* 시간대 목록 */}
        {formData.timeSlots?.map((slot) => (
          <Box key={slot.id} display="flex" gap={2} mb={2} alignItems="center">
            <Box
              display="flex"
              alignItems="center"
              gap={1}
              sx={{
                backgroundColor: "var(--action-primary-bg)",
                color: "var(--primary-200)",
                px: 2,
                py: 1,
                borderRadius: 2,
                minWidth: 100,
              }}
            >
              <AccessTimeIcon size="small" />
              <Typography variant="body2" fontWeight={600}>
                {slot.dayOfWeek}요일
              </Typography>
            </Box>

            <TextField
              type="time"
              value={slot.startTime}
              onChange={(e) =>
                updateTimeSlot(slot.id, "startTime", e.target.value)
              }
              size="small"
              InputLabelProps={{ shrink: true }}
            />

            <Typography variant="body2">~</Typography>

            <TextField
              type="time"
              value={slot.endTime}
              onChange={(e) =>
                updateTimeSlot(slot.id, "endTime", e.target.value)
              }
              size="small"
              InputLabelProps={{ shrink: true }}
            />

            <IconButton
              color="error"
              onClick={() => removeTimeSlot(slot.id)}
              sx={{ ml: 1 }}
            >
              <DeleteIcon />
            </IconButton>
          </Box>
        ))}

        {/* 시간대 추가 버튼 */}
        <Button
          variant="outlined"
          startIcon={<AddIcon />}
          onClick={addTimeSlot}
          sx={{
            borderColor: "var(--bg-300)",
            color: "var(--text-300)",
            mt: 1,
          }}
          disabled={!selectedDay}
        >
          {selectedDay
            ? `${selectedDay}요일 시간대 추가하기`
            : "시간대 추가하기"}
        </Button>
      </Box>

      {/* 과외 지역 섹션 */}
      <Typography variant="h6" fontWeight={600} gutterBottom>
        과외 지역
      </Typography>

      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        과외가 진행될 지역을 선택해주세요.
      </Typography>

      {/* 지역 선택/표시 */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="subtitle2" fontWeight={600} gutterBottom>
          과외 지역 *
        </Typography>

        <Box display="flex" alignItems="center" gap={2}>
          <Button
            variant="outlined"
            onClick={() => setShowRegionModal(true)}
            fullWidth
            sx={{
              height: 56,
              borderColor: "var(--bg-300)",
              color: "var(--text-300)",
              justifyContent: "flex-start",
              px: 2,
            }}
          >
            지역
          </Button>
        </Box>

        {/* 선택된 지역 표시 */}
        {formData.regions?.length > 0 && (
          <Box mt={2} display="flex" flexWrap="wrap" gap={1}>
            {formData.regions.map((region, index) => (
              <Chip
                key={index}
                label={region.displayName || region.name}
                onDelete={() => removeRegion(index)}
                sx={{
                  backgroundColor: "var(--action-primary-bg)",
                  color: "var(--primary-200)",
                  "& .MuiChip-deleteIcon": {
                    color: "var(--primary-200)",
                  },
                }}
              />
            ))}
          </Box>
        )}
      </Box>

      {/* 과외 등록하기 버튼 */}
      <GradientButton
        fullWidth
        size="md"
        onClick={handleSubmit}
        disabled={isLoading}
        sx={{
          py: 1.5,
          position: "relative",
        }}
      >
        {isLoading ? (
          <CircularProgress size={24} color="inherit" />
        ) : (
          "과외 등록하기"
        )}
      </GradientButton>

      {/* 지역 선택 모달 */}
      <RegionSelectionModal
        open={showRegionModal}
        onClose={() => setShowRegionModal(false)}
        onSubmit={handleAddRegions}
        selectedRegions={formData.regions?.map((r) => r.name) || []}
      />
    </Box>
  );
}
