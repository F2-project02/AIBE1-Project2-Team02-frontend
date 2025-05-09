// src/components/Profile/ProfileForm.jsx
import { useState, useEffect } from "react";
import {
  Box,
  Typography,
  TextField,
  Radio,
  RadioGroup,
  FormControlLabel,
  Button,
  CircularProgress,
  MenuItem,
} from "@mui/material";
import { updateProfile, checkNickname } from "../../lib/api/profileApi";

// MBTI 목록
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

export default function ProfileForm({ profileData, onProfileUpdate }) {
  // 편집을 위한 상태 변수들
  const [nickname, setNickname] = useState("");
  const [originalNickname, setOriginalNickname] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [sex, setSex] = useState("남성");
  const [mbti, setMbti] = useState("");
  const [updating, setUpdating] = useState(false);

  // 닉네임 중복 확인 관련 상태
  const [isNicknameChecked, setIsNicknameChecked] = useState(false);
  const [isNicknameAvailable, setIsNicknameAvailable] = useState(false);
  const [checkingNickname, setCheckingNickname] = useState(false);
  const [birthDateError, setBirthDateError] = useState("");

  // 프로필 데이터 로드 시 초기화
  useEffect(() => {
    if (profileData) {
      setNickname(profileData.nickname || "");
      setOriginalNickname(profileData.nickname || "");
      setBirthDate(profileData.birthDate || "");
      setSex(profileData.sex || "남성");
      setMbti(profileData.mbti || "");

      // 같은 닉네임이면 중복 확인 상태 초기화
      setIsNicknameChecked(true);
      setIsNicknameAvailable(true);
    }
  }, [profileData]);

  // 닉네임 변경 시 중복확인 상태 초기화
  const handleNicknameChange = (e) => {
    const newNickname = e.target.value;
    setNickname(newNickname);

    // 원래 닉네임과 같다면 검사 필요 없음
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
      alert("닉네임을 입력해주세요.");
      return;
    }

    setCheckingNickname(true);

    try {
      const isAvailable = await checkNickname(nickname);
      setIsNicknameChecked(true);
      setIsNicknameAvailable(isAvailable);

      if (isAvailable) {
        alert("사용 가능한 닉네임입니다.");
      } else {
        alert("이미 사용 중인 닉네임입니다. 다른 닉네임을 입력해주세요.");
      }
    } catch (error) {
      console.error("닉네임 중복 확인 오류:", error);
      alert("닉네임 확인 중 오류가 발생했습니다: " + error.message);
    } finally {
      setCheckingNickname(false);
    }
  };

  // 유효한 날짜인지 확인하는 함수
  const isValidDate = (dateString) => {
    // 길이가 8자가 아니면 유효하지 않음
    if (dateString.length !== 8) return false;

    // YYYY, MM, DD로 분리
    const year = parseInt(dateString.substring(0, 4), 10);
    const month = parseInt(dateString.substring(4, 6), 10);
    const day = parseInt(dateString.substring(6, 8), 10);

    // 현재 연도 구하기
    const currentYear = new Date().getFullYear();

    // 연도 범위 체크 (예: 1900년부터 현재 연도까지)
    if (year < 1900 || year > currentYear) return false;

    // 월 체크 (1-12)
    if (month < 1 || month > 12) return false;

    // 각 월의 마지막 날짜
    const lastDayOfMonth = new Date(year, month, 0).getDate();

    // 일 체크 (1부터 해당 월의 마지막 날짜까지)
    if (day < 1 || day > lastDayOfMonth) return false;

    return true;
  };

  // 생년월일 변경 핸들러
  const handleBirthDateChange = (e) => {
    const value = e.target.value;

    // 숫자만 입력 가능하도록 함
    if (value && !/^\d*$/.test(value)) {
      setBirthDateError("숫자만 입력 가능합니다");
      return;
    }

    if (value.length > 8) {
      setBirthDateError("YYYYMMDD 형식의 8자리로 입력해주세요");
      return;
    }

    setBirthDate(value);

    // 비어있을 때는 에러 메시지 없음
    if (value.length === 0) {
      setBirthDateError("");
      return;
    }

    // 8자리일 때는 유효한 날짜인지 확인
    if (value.length === 8) {
      if (!isValidDate(value)) {
        setBirthDateError("유효하지 않은 날짜입니다.");
      } else {
        setBirthDateError("");
      }
    } else {
      // 8자리가 아닐 때는 입력 중인 상태로 간주
      setBirthDateError("YYYYMMDD 형식의 8자리로 입력해주세요");
    }
  };

  // 프로필 업데이트
  const handleSubmit = async (e) => {
    e.preventDefault();

    // 닉네임이 변경되었는데 중복 체크를 하지 않은 경우
    if (nickname !== originalNickname && !isNicknameChecked) {
      alert("닉네임 중복 확인을 해주세요.");
      return;
    }

    // 닉네임이 중복인 경우
    if (nickname !== originalNickname && !isNicknameAvailable) {
      alert("이미 사용 중인 닉네임입니다. 다른 닉네임을 입력해주세요.");
      return;
    }

    // 생년월일 유효성 검사
    if (!birthDate || birthDate.trim() === "") {
      alert("생년월일을 입력해주세요.");
      return;
    }

    if (birthDate.length !== 8) {
      alert("생년월일을 YYYYMMDD 형식의 8자리로 입력해주세요.");
      return;
    }

    if (!isValidDate(birthDate)) {
      alert("유효하지 않은 생년월일입니다. 올바른 날짜를 입력해주세요.");
      return;
    }

    setUpdating(true);

    try {
      // 업데이트 요청 데이터
      const updateData = {
        nickname,
        birthDate,
        sex,
        mbti,
      };

      await updateProfile(updateData);

      // 부모 컴포넌트에 업데이트 알림
      onProfileUpdate(updateData);

      // 원래 닉네임 업데이트
      setOriginalNickname(nickname);

      // 중복 확인 상태 초기화
      setIsNicknameChecked(true);
      setIsNicknameAvailable(true);

      alert("프로필이 성공적으로 업데이트되었습니다.");
    } catch (error) {
      console.error("프로필 업데이트 오류: ", error);
      alert("프로필 업데이트 중 오류가 발생했습니다: " + error.message);
    } finally {
      setUpdating(false);
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit}>
      {/* 닉네임 필드 */}
      <Box sx={{ mb: 3 }}>
        <Typography fontWeight={600} sx={{ mb: 1 }}>
          닉네임{" "}
          <Box component="span" sx={{ color: "red" }}>
            *
          </Box>
        </Typography>

        {/* 텍스트 필드와 버튼 배치 - 가로 배열 */}
        <Box sx={{ display: "flex", gap: 1 }}>
          <TextField
            fullWidth
            value={nickname}
            onChange={handleNicknameChange}
            placeholder="닉네임을 입력해주세요."
            required
            error={
              nickname !== originalNickname &&
              !isNicknameAvailable &&
              isNicknameChecked
            }
            helperText={
              nickname !== originalNickname &&
              !isNicknameAvailable &&
              isNicknameChecked
                ? "이미 사용 중인 닉네임입니다"
                : ""
            }
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: "8px",
              },
            }}
          />

          {/* 중복 확인 버튼 */}
          <Button
            variant="contained"
            onClick={checkNicknameDuplicate}
            disabled={checkingNickname || !nickname.trim()}
            sx={{
              height: "56px",
              minWidth: "100px",
              bgcolor: "var(--primary-200)",
              "&:hover": {
                bgcolor: "var(--primary-300)",
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
      </Box>

      {/* 생년월일 필드 */}
      <Box sx={{ mb: 3 }}>
        <Typography fontWeight={600} sx={{ mb: 1 }}>
          생년월일
          <Box component="span" sx={{ color: "red" }}>
            *
          </Box>
        </Typography>
        <TextField
          fullWidth
          value={birthDate}
          onChange={handleBirthDateChange}
          placeholder="생년월일을 입력하세요. (YYYYMMDD)"
          error={!!birthDateError}
          helperText={birthDateError}
          inputProps={{ maxLength: 8 }}
          sx={{
            "& .MuiOutlinedInput-root": {
              borderRadius: "8px",
            },
          }}
        />
      </Box>

      {/* 성별 필드 */}
      <Box sx={{ mb: 3 }}>
        <Typography fontWeight={600} sx={{ mb: 1 }}>
          성별{" "}
          <Box component="span" sx={{ color: "red" }}>
            *
          </Box>
        </Typography>
        <RadioGroup row value={sex} onChange={(e) => setSex(e.target.value)}>
          <FormControlLabel value="남성" control={<Radio />} label="남성" />
          <FormControlLabel value="여성" control={<Radio />} label="여성" />
        </RadioGroup>
      </Box>

      {/* 지역 필드 */}
      <Box sx={{ mb: 3 }}>
        <Typography fontWeight={600} sx={{ mb: 1 }}>
          지역{" "}
          <Box component="span" sx={{ color: "red" }}>
            *
          </Box>
        </Typography>
        <TextField
          fullWidth
          value="지역 정보 표시 예정"
          disabled
          sx={{
            "& .MuiOutlinedInput-root": {
              borderRadius: "8px",
            },
          }}
        />
      </Box>

      {/* MBTI 필드 */}
      <Box sx={{ mb: 4 }}>
        <Typography fontWeight={600} sx={{ mb: 1 }}>
          MBTI
        </Typography>
        <TextField
          fullWidth
          select
          value={mbti}
          onChange={(e) => setMbti(e.target.value)}
          SelectProps={{
            displayEmpty: true,
          }}
          sx={{
            "& .MuiOutlinedInput-root": {
              borderRadius: "8px",
            },
          }}
        >
          <MenuItem value="">
            <em>MBTI를 선택하세요</em>
          </MenuItem>
          {mbtiOptions.map((option) => (
            <MenuItem key={option} value={option}>
              {option}
            </MenuItem>
          ))}
        </TextField>
      </Box>

      {/* 등록 버튼 */}
      <Button
        fullWidth
        type="submit"
        variant="contained"
        disabled={updating}
        sx={{
          py: 1.5,
          background: "linear-gradient(90deg, #ffbad0 0%, #5b8def 100%)",
          borderRadius: "8px",
          color: "white",
          fontWeight: 600,
        }}
      >
        {updating ? <CircularProgress size={24} color="inherit" /> : "등록하기"}
      </Button>
    </Box>
  );
}
