// src/components/Profile/ProfileForm.jsx
import { useState, useEffect } from "react";
import {
  Box,
  TextField,
  Radio,
  RadioGroup,
  FormControlLabel,
  Button,
  CircularProgress,
  MenuItem,
  Chip,
} from "@mui/material";
import { updateProfile, checkNickname } from "../../lib/api/profileApi";
import UnifiedRegionFilter from "../Search/RegionFilter";
import FormFieldWrapper from "../CreateLecture/FormFieldWrapper";
import warnGif from "../../assets/warn.gif";
import successGif from "../../assets/party.gif";
import CustomTextField from "../common/CustomTextField";
import CustomSelect from "../common/CustomSelect";

const mbtiOptions = [
  "ISTJ",
  "ISFJ",
  "INFJ",
  "INTJ",
  "ISTP",
  "ISFP",
  "INFP",
  "INTP",
  "ESTP",
  "ESFP",
  "ENFP",
  "ENTP",
  "ESTJ",
  "ESFJ",
  "ENFJ",
  "ENTJ",
];

export default function ProfileForm({
  profileData,
  onProfileUpdate,
  showToast,
}) {
  // 편집을 위한 상태 변수들
  const [nickname, setNickname] = useState("");
  const [originalNickname, setOriginalNickname] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [sex, setSex] = useState("남성");
  const [mbti, setMbti] = useState("");
  const [updating, setUpdating] = useState(false);

  // 닉네임 중복 확인, 생년월일, 지역 관련 상태
  const [isNicknameChecked, setIsNicknameChecked] = useState(false);
  const [isNicknameAvailable, setIsNicknameAvailable] = useState(false);
  const [checkingNickname, setCheckingNickname] = useState(false);
  const [birthDateError, setBirthDateError] = useState("");
  const [selectedRegions, setSelectedRegions] = useState([]);
  const [regionModalOpen, setRegionModalOpen] = useState(false);
  const [savedProvince, setSavedProvince] = useState("");
  const [savedDistrict, setSavedDistrict] = useState("");
  const [savedTab, setSavedTab] = useState(0);

  // 프로필 데이터 로드 시 초기화
  useEffect(() => {
    if (profileData) {
      setNickname(profileData.nickname || "");
      setOriginalNickname(profileData.nickname || "");
      setBirthDate(profileData.birthDate || "");
      setSex(profileData.sex || "남성");
      setMbti(profileData.mbti || "");

      if (profileData.regions && profileData.regions.length > 0) {
        setSelectedRegions(profileData.regions);
      }

      setIsNicknameChecked(true);
      setIsNicknameAvailable(true);
    }
  }, [profileData]);

  const handleRegionSelect = (regions) => {
    setSelectedRegions(regions);
    setRegionModalOpen(false);
  };

  // 닉네임 변경 시 중복확인 상태 초기화
  const handleNicknameChange = (e) => {
    const newNickname = e.target.value;
    setNickname(newNickname);

    if (newNickname === originalNickname) {
      setIsNicknameChecked(true);
      setIsNicknameAvailable(true);
    } else {
      setIsNicknameChecked(false);
      setIsNicknameAvailable(false);
    }
  };

  // 닉네임 중복 확인 함수
  const checkNicknameDuplicate = async () => {
    if (!nickname.trim()) {
      showToast("닉네임을 입력해주세요.", warnGif, "error");
      return;
    }

    setCheckingNickname(true);

    try {
      const isAvailable = await checkNickname(nickname);
      setIsNicknameChecked(true);
      setIsNicknameAvailable(isAvailable);

      if (isAvailable) {
        showToast("사용 가능한 닉네임이에요.", successGif, "info");
      } else {
        showToast(
          "이미 사용 중인 닉네임이네요. 다른 닉네임을 입력해주세요.",
          warnGif,
          "error"
        );
      }
    } catch (error) {
      console.error("닉네임 중복 확인 오류:", error);
      showToast(
        "닉네임 확인 중 오류가 발생했어요: " + error.message,
        warnGif,
        "error"
      );
    } finally {
      setCheckingNickname(false);
    }
  };

  // 유효한 날짜인지 확인하는 함수
  const isValidDate = (dateString) => {
    if (dateString.length !== 8) return false;

    const year = parseInt(dateString.substring(0, 4), 10);
    const month = parseInt(dateString.substring(4, 6), 10);
    const day = parseInt(dateString.substring(6, 8), 10);
    const currentYear = new Date().getFullYear();

    if (year < 1900 || year > currentYear) return false;
    if (month < 1 || month > 12) return false;

    const lastDayOfMonth = new Date(year, month, 0).getDate();

    if (day < 1 || day > lastDayOfMonth) return false;

    return true;
  };

  // 생년월일 변경 핸들러
  const handleBirthDateChange = (e) => {
    const value = e.target.value;

    if (value && !/^\d*$/.test(value)) {
      setBirthDateError("숫자만 입력 가능합니다");
      return;
    }

    if (value.length > 8) {
      setBirthDateError("YYYYMMDD 형식의 8자리로 입력해주세요");
      return;
    }

    setBirthDate(value);

    if (value.length === 0) {
      setBirthDateError("");
      return;
    }

    if (value.length === 8) {
      if (!isValidDate(value)) {
        setBirthDateError("유효하지 않은 날짜입니다.");
      } else {
        setBirthDateError("");
      }
    } else {
      setBirthDateError("YYYYMMDD 형식의 8자리로 입력해주세요");
    }
  };

  // 프로필 업데이트
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (nickname.length > 12) {
      showToast("닉네임은 12자 이하로 입력해주세요.", warnGif, "error");
      return;
    }

    if (nickname !== originalNickname && !isNicknameChecked) {
      showToast("닉네임 중복 확인을 해주세요.", warnGif, "error");
      return;
    }

    if (nickname !== originalNickname && !isNicknameAvailable) {
      showToast(
        "이미 사용 중인 닉네임이네요. 다른 닉네임을 입력해주세요.",
        warnGif,
        "error"
      );
      return;
    }

    if (!birthDate || birthDate.trim() === "") {
      showToast("생년월일을 입력해주세요.", warnGif, "error");
      return;
    }

    if (birthDate.length !== 8) {
      showToast(
        "생년월일을 YYYYMMDD 형식의 8자리로 입력해주세요.",
        warnGif,
        "error"
      );
      return;
    }

    if (!isValidDate(birthDate)) {
      showToast(
        "유효하지 않은 생년월일이에요. 올바른 날짜를 입력해주세요.",
        warnGif,
        "error"
      );
      return;
    }

    if (selectedRegions.length === 0) {
      showToast("최소 한 개 이상의 지역을 선택해주세요.", warnGif, "error");
      return;
    }

    setUpdating(true);

    try {
      const updateData = {
        nickname,
        birthDate,
        sex,
        mbti,
        regionCodes: selectedRegions.map((region) => region.regionCode),
      };

      await updateProfile(updateData);

      onProfileUpdate({
        ...updateData,
        regions: selectedRegions,
      });

      setOriginalNickname(nickname);
      setIsNicknameChecked(true);
      setIsNicknameAvailable(true);

      showToast("프로필이 성공적으로 업데이트됐어요!", successGif, "info");
    } catch (error) {
      showToast(
        "프로필 업데이트 중 오류가 발생했어요: " + error.message,
        warnGif,
        "error"
      );
    } finally {
      setUpdating(false);
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit}>
      {/* 닉네임 필드 */}
      <FormFieldWrapper label="닉네임" required>
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", sm: "row" },
            gap: { xs: 1.5, sm: 1 },
          }}
        >
          <CustomTextField
            value={nickname}
            onChange={handleNicknameChange}
            placeholder="닉네임을 입력해주세요."
            error={
              nickname.length > 12 ||
              (nickname !== originalNickname &&
                !isNicknameAvailable &&
                isNicknameChecked)
            }
            helperText={
              nickname.length > 12
                ? "닉네임은 최대 12자까지 입력 가능합니다."
                : nickname !== originalNickname &&
                  !isNicknameAvailable &&
                  isNicknameChecked
                ? "이미 사용 중인 닉네임입니다"
                : ""
            }
            inputProps={{ maxLength: 12 }}
          />

          <Button
            variant="contained"
            onClick={checkNicknameDuplicate}
            disabled={checkingNickname || !nickname.trim()}
            sx={{
              height: 48,
              minWidth: { xs: "100%", sm: "120px" },
              bgcolor: "var(--primary-100)",
              borderRadius: "8px",
              fontWeight: 600,
              boxShadow: "none",
              "&:hover": {
                bgcolor: "var(--primary-200)",
                boxShadow: "none",
              },
            }}
          >
            {checkingNickname ? (
              <CircularProgress size={20} color="inherit" />
            ) : (
              "중복 확인"
            )}
          </Button>
        </Box>
      </FormFieldWrapper>

      {/* 생년월일 필드 */}
      <FormFieldWrapper label="생년월일" required>
        <CustomTextField
          value={birthDate}
          onChange={handleBirthDateChange}
          placeholder="YYYYMMDD"
          error={!!birthDateError}
          helperText={birthDateError}
          inputProps={{ maxLength: 8 }}
        />
      </FormFieldWrapper>

      {/* 성별 필드 */}
      <FormFieldWrapper label="성별" required>
        <RadioGroup
          row
          value={sex}
          onChange={(e) => setSex(e.target.value)}
          sx={{
            flexWrap: "wrap",
            justifyContent: { xs: "space-around", sm: "flex-start" },
            maxWidth: "640px",
          }}
        >
          <FormControlLabel
            value="남성"
            control={
              <Radio
                sx={{
                  color: "var(--primary-100)",
                  "&.Mui-checked": {
                    color: "var(--primary-100)",
                  },
                }}
              />
            }
            label="남성"
          />
          <FormControlLabel
            value="여성"
            control={
              <Radio
                sx={{
                  color: "var(--primary-100)",
                  "&.Mui-checked": {
                    color: "var(--primary-100)",
                  },
                }}
              />
            }
            label="여성"
          />
        </RadioGroup>
      </FormFieldWrapper>

      {/* 지역 필드 */}
      <FormFieldWrapper label="거주 지역" required>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
          <Box
            onClick={() => setRegionModalOpen(true)}
            sx={{
              height: 48,
              px: 2,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              width: { xs: "100%", sm: "180px" },
              bgcolor: "var(--bg-200)",
              borderRadius: "8px",
              cursor: "pointer",
              color: "var(--text-300)",
              border: "1px solid var(--bg-200)",
              fontSize: 14,
              fontWeight: 500,
            }}
          >
            <Box>지역 선택</Box>
          </Box>

          {/* 선택된 지역 표시 */}
          <Box display="flex" flexWrap="wrap" gap={1} mt={1}>
            {selectedRegions.map((item) => (
              <Chip
                key={item.regionCode}
                label={item.displayName}
                onDelete={() =>
                  setSelectedRegions((prev) =>
                    prev.filter((r) => r.regionCode !== item.regionCode)
                  )
                }
                variant="outlined"
                sx={{
                  borderColor: "var(--primary-100)",
                  color: "var(--primary-100)",
                  fontSize: 13,
                  "& .MuiChip-deleteIcon": {
                    color: "var(--primary-100)",
                    "&:hover": { color: "var(--primary-200)" },
                  },
                }}
              />
            ))}
          </Box>
        </Box>

        {/* 지역 선택 모달 */}
        <UnifiedRegionFilter
          open={regionModalOpen}
          onClose={() => setRegionModalOpen(false)}
          onSubmit={(items) => setSelectedRegions(items)}
          selectedDongs={selectedRegions}
          setSelectedDongs={setSelectedRegions}
          savedProvince={savedProvince}
          setSavedProvince={setSavedProvince}
          savedDistrict={savedDistrict}
          setSavedDistrict={setSavedDistrict}
          savedTab={savedTab}
          setSavedTab={setSavedTab}
        />
      </FormFieldWrapper>

      {/* MBTI 필드 */}
      <FormFieldWrapper label="MBTI">
        <Box sx={{ width: { xs: "100%", sm: "180px" } }}>
          <CustomSelect
            value={mbti}
            onChange={(e) => setMbti(e.target.value)}
            sx={{
              bgcolor: "var(--bg-200)",
              borderRadius: "8px",
              fontSize: 14,
              fontWeight: 500,
              color: "var(--text-300)",
              px: 2,
              height: 48,
            }}
          >
            <MenuItem value="" disabled>
              MBTI를 선택하세요
            </MenuItem>
            {mbtiOptions.map((option) => (
              <MenuItem key={option} value={option}>
                {option}
              </MenuItem>
            ))}
          </CustomSelect>
        </Box>
      </FormFieldWrapper>

      {/* 제출 버튼 */}
      <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
        <Button
          type="submit"
          disabled={updating}
          sx={{
            mt: 4,
            py: 1.5,
            width: { xs: "100%", md: "240px" },
            background: "var(--primary-gradient)",
            borderRadius: "8px",
            color: "var(--bg-100)",
            fontWeight: 600,
          }}
        >
          {updating ? (
            <CircularProgress size={24} color="inherit" />
          ) : (
            "등록하기"
          )}
        </Button>
      </Box>
    </Box>
  );
}
