// src/pages/MyPage.jsx

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

export default function MyPage() {
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [updating, setUpdating] = useState(false);

  // 편집을 위한 상태 변수들
  const [nickname, setNickname] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [sex, setSex] = useState("남성");
  const [mbti, setMbti] = useState("");

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

  // 프로필 데이터 불러오기
  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);

      try {
        const token = localStorage.getItem("token");
        if (!token) {
          console.error("인증 토큰이 없습니다");
          setLoading(false);
          return;
        }

        const response = await fetch(
          "http://localhost:8081/api/account/profile",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error("프로필 정보를 가져오는데 실패했습니다");
        }

        const result = await response.json();
        if (result.success) {
          setProfileData(result.data);

          // 편집을 위한 상태 초기화
          setNickname(result.data.nickname || "");
          setBirthDate(result.data.birthDate || "");
          setSex(result.data.sex || "남성");
          setMbti(result.data.mbti || "");
        }
      } catch (error) {
        console.error("프로필 조회 오류: ", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  // 프로필 업데이트
  const handleSubmit = async (e) => {
    e.preventDefault();
    setUpdating(true);

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("인증 토큰이 없습니다");
        setUpdating(false);
        return;
      }

      // 업데이트 요청 데이터
      const updateData = {
        nickname,
        birthDate,
        sex,
        mbti,
      };

      const response = await fetch(
        "http://localhost:8081/api/account/profile",
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updateData),
        }
      );

      if (!response.ok) {
        throw new Error("프로필 정보 업데이트에 실패했습니다");
      }

      const result = await response.json();
      if (result.success) {
        // 업데이트된 데이터로 상태 갱신
        setProfileData({ ...profileData, ...updateData });
        alert("프로필이 성공적으로 업데이트되었습니다.");
      } else {
        throw new Error(
          result.message || "프로필 정보 업데이트에 실패했습니다"
        );
      }
    } catch (error) {
      console.error("프로필 업데이트 오류: ", error);
      alert("프로필 업데이트 중 오류가 발생했습니다: " + error.message);
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "50vh",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ mt: 4, mb: 8 }}>
      <Box sx={{ flex: 1 }}>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            flexDirection: "column",
            mb: 6,
          }}
        >
          {/* 프로필 이미지 */}
          <Box
            component="div"
            sx={{
              width: 80,
              height: 80,
              borderRadius: "50%",
              bgcolor: "#f0f0f0",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              mb: 2,
            }}
          >
            <img
              src="/images/default-profile.svg"
              alt="프로필 이미지"
              style={{ width: "100%", height: "100%", borderRadius: "50%" }}
            />
          </Box>

          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Typography variant="h6" fontWeight={600}>
              {profileData?.nickname || ""}
            </Typography>
          </Box>

          <Button
            variant="outlined"
            size="small"
            sx={{
              mt: 2,
              fontSize: "0.8rem",
              borderRadius: "20px",
              borderColor: "var(--bg-300)",
              color: "var(--text-300)",
              px: 2,
            }}
          >
            프로필 이미지 변경
          </Button>
        </Box>

        {/* 프로필 정보 폼 - 바로 편집 가능 */}
        {profileData && (
          <Box component="form" onSubmit={handleSubmit}>
            {/* 닉네임 필드 */}
            <Box sx={{ mb: 3 }}>
              <Typography fontWeight={600} sx={{ mb: 1 }}>
                닉네임{" "}
                <Box component="span" sx={{ color: "red" }}>
                  *
                </Box>
              </Typography>
              <TextField
                fullWidth
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
                placeholder="닉네임을 입력하세요."
                required
              />
            </Box>

            {/* 생년월일 필드 */}
            <Box sx={{ mb: 3 }}>
              <Typography fontWeight={600} sx={{ mb: 1 }}>
                생년월일
              </Typography>
              <TextField
                fullWidth
                value={birthDate}
                onChange={(e) => setBirthDate(e.target.value)}
                placeholder="생년월일을 입력하세요. (YYYYMMDD)"
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
              <RadioGroup
                row
                value={sex}
                onChange={(e) => setSex(e.target.value)}
              >
                <FormControlLabel
                  value="남성"
                  control={<Radio />}
                  label="남성"
                />
                <FormControlLabel
                  value="여성"
                  control={<Radio />}
                  label="여성"
                />
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
              <TextField fullWidth value="지역 정보 표시 예정" disabled />
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
            >
              {updating ? (
                <CircularProgress size={24} color="inherit" />
              ) : (
                "등록하기"
              )}
            </Button>
          </Box>
        )}
      </Box>
    </Box>
  );
}
