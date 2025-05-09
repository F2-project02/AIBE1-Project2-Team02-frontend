// src/components/CreateLecture/ScheduleAndLocationForm.jsx

import { useState } from "react";
import { Box, Typography, Button, CircularProgress } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import RegionSelectionModal from "./RegionSelectionModal";
import GradientButton from "../Button/GradientButton";
import SelectableButtonGroup from "../common/SelectableButtonGroup";
import FormFieldWrapper from "./FormFieldWrapper";
import TimeSlotItem from "../common/TimeSlotItem";
import RegionSelectButton from "../common/RegionSelectButton";
import RegionChipList from "../common/RegionChipList";
import { useLectureStore } from "../../store/useLectureStore";

const DAYS = ["월", "화", "수", "목", "금", "토", "일"];

export default function ScheduleAndLocationForm({ onSubmit, isLoading,  showToast }) {
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
      showToast("요일을 먼저 선택해주세요.");
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
      showToast("최소 하나의 시간대를 입력해주세요.");
      return;
    }
    if (formData.regions.length === 0) {
      showToast("최소 하나의 지역을 선택해주세요.");
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
      <FormFieldWrapper label="요일 선택" required>
        <SelectableButtonGroup
          items={DAYS}
          selected={selectedDay}
          onSelect={selectDay}
        />
      </FormFieldWrapper>

      {/* 시간대 설정 */}
      <FormFieldWrapper label="시간대 설정">
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          먼저 요일을 선택한 후 시간대를 추가하세요.
        </Typography>

        {formData.timeSlots?.map((slot) => (
          <TimeSlotItem
            key={slot.id}
            slot={slot}
            onChange={updateTimeSlot}
            onDelete={removeTimeSlot}
          />
        ))}

        <Button
          variant="outlined"
          startIcon={<AddIcon />}
          onClick={addTimeSlot}
          sx={{
            borderColor: "var(--bg-300)",
            borderRadius: "8px",
            color: "var(--text-400)",
            mt: 1,
          }}
          disabled={!selectedDay}
        >
          {selectedDay
            ? `${selectedDay}요일 시간대 추가하기`
            : "시간대 추가하기"}
        </Button>
      </FormFieldWrapper>

      {/* 과외 지역 섹션 */}
      <Typography variant="h6" fontWeight={600} gutterBottom>
        과외 지역
      </Typography>

      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        과외가 진행될 지역을 선택해주세요.
      </Typography>

      {/* 지역 선택/표시 */}
      <FormFieldWrapper label="과외 지역" required>
        <RegionSelectButton
          onClick={() => setShowRegionModal(true)}
          sx={{
            width: {
              xs: "100%",
              md: "240px",
            },
          }}
        />
        <Box mt={2}>
          <RegionChipList regions={formData.regions} onDelete={removeRegion} />
        </Box>
      </FormFieldWrapper>

      {/* 과외 등록하기 버튼 */}
      <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
        <GradientButton
          fullWidth
          size="md"
          onClick={handleSubmit}
          disabled={isLoading}
          sx={{
            width: {
              xs: "100%",
              md: "240px",
            },
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
      </Box>

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
