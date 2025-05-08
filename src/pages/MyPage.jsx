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
  List,
  ListItem,
  ListItemText,
} from "@mui/material";

export default function MyPage() {
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [updating, setUpdating] = useState(false);

  // 파일 업로드 관련 상태
  const [profileImage, setProfileImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(
    profileData?.profileImage || "/images/default-profile.svg"
  );
  const [uploading, setUploading] = useState(false);

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
          // 프로필 데이터 설정 부분을 다음과 같이 수정
          setProfileData(result.data);

          // 편집을 위한 상태 초기화
          setNickname(result.data.nickname || "");
          setBirthDate(result.data.birthDate || "");
          setSex(result.data.sex || "남성");
          setMbti(result.data.mbti || "");

          // 프로필 이미지 초기화
          setImagePreview(
            result.data.profileImage || "/images/default-profile.svg"
          );
        }
      } catch (error) {
        console.error("프로필 조회 오류: ", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  useEffect(() => {
    // 사용자가 멘토인 경우에만 멘토 프로필 정보 요청
    if (
      profileData &&
      profileData.role === "MENTOR" &&
      !profileData.mentorProfile
    ) {
      const fetchMentorProfile = async () => {
        try {
          const token = localStorage.getItem("token");
          // 멘토 프로필 정보를 가져오는 API 호출 (올바른 엔드포인트 사용)
          const response = await fetch(
            "http://localhost:8081/api/account/mentor/profile",
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );

          if (response.ok) {
            const result = await response.json();
            console.log("멘토 프로필 응답:", result);

            if (result.success) {
              // 기존 프로필 데이터에 멘토 프로필 정보 추가
              setProfileData((prevData) => ({
                ...prevData,
                mentorProfile: result.data,
              }));
            }
          }
        } catch (error) {
          console.error("멘토 프로필 정보 조회 오류:", error);
        }
      };

      fetchMentorProfile();
    }
  }, [profileData?.role]);

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfileImage(file);

      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleImageUpload = async () => {
    if (!profileImage) return;

    setUploading(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("인증 토큰이 없습니다");
      }

      const formData = new FormData();
      formData.append("file", profileImage);

      const response = await fetch(
        "http://localhost:8081/api/account/profile/image",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        }
      );

      if (!response.ok) {
        throw new Error("이미지 업로드에 실패했습니다");
      }

      const result = await response.json();
      if (result.success) {
        setProfileData({ ...profileData, profileImage: result.data });
        alert("프로필 이미지가 성공적으로 업데이트되었습니다");
      } else {
        throw new Error(result.message || "이미지 업로드에 실패했습니다");
      }
    } catch (error) {
      console.error("이미지 업로드 오류: ", error);
      alert("이미지 업로드 중 오류가 발생했습니다: " + error.message);
    } finally {
      setUploading(false);
      setProfileImage(null);
    }
  };

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
      {/* 상단 프로필 카드 영역 */}
      <Box
        sx={{
          p: 3,
          mb: 3,
          borderRadius: "8px",
          position: "relative",
          display: "flex",
          alignItems: "center",
        }}
      >
        {/* 프로필 이미지 */}
        <Box
          component="div"
          sx={{
            width: 50,
            height: 50,
            mr: 2,
            borderRadius: "50%",
            bgcolor: "#f0f0f0",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            overflow: "hidden",
          }}
        >
          <img
            src={imagePreview}
            alt="프로필 이미지"
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        </Box>

        <Box>
          {/* 닉네임 */}
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Typography variant="body1" fontWeight={600}>
              {profileData?.nickname || "가나다라마바사아자차카타"}
            </Typography>

            {/* 인증 아이콘 (멘토 + 인증된 사용자만 표시) */}
            {profileData?.role === "MENTOR" &&
              profileData?.mentorProfile?.isCertified && (
                <Box
                  component="span"
                  sx={{
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    width: "18px",
                    height: "18px",
                    ml: 1,
                    borderRadius: "50%",
                    bgcolor: "var(--primary-100)",
                    color: "white",
                    fontSize: "12px",
                    fontWeight: "bold",
                  }}
                >
                  ✓
                </Box>
              )}
          </Box>

          {/* 학교/지역 - 멘토일 때만 표시 */}
          {profileData?.role === "MENTOR" && profileData?.mentorProfile && (
            <Typography
              variant="body2"
              color="text.secondary"
              fontSize="0.85rem"
            >
              {profileData.mentorProfile.education}{" "}
              {profileData.mentorProfile.major}
            </Typography>
          )}
        </Box>

        {/* 별점 (오른쪽에 표시) - 멘토일 때만 표시 */}
        {profileData?.role === "MENTOR" && (
          <Box
            sx={{
              ml: "auto",
              display: "flex",
              alignItems: "center",
            }}
          >
            <Box
              sx={{
                display: "inline-flex",
                color: "#FFC107",
                mr: 0.5,
                fontSize: "16px",
              }}
            >
              ★
            </Box>
            <Typography variant="body2" fontWeight={500}>
              {profileData?.rating || "4.9"}
            </Typography>
          </Box>
        )}
      </Box>

      {/* 하단 메뉴 및 폼 영역 - flex로 좌우 분리 */}
      <Box sx={{ display: "flex", gap: 4 }}>
        {/* 좌측 메뉴 영역 */}
        <Box sx={{ width: 240 }}>
          <List component="nav" aria-label="마이페이지 메뉴">
            <ListItem
              button
              selected
              sx={{
                borderRadius: "8px",
                bgcolor: "var(--action-primary-bg)", // 선택된 항목만 배경색 적용
                mb: 1,
              }}
            >
              <ListItemText
                primary="내 정보 수정"
                sx={{
                  "& .MuiListItemText-primary": {
                    fontWeight: 600,
                    color: "var(--primary-200)",
                  },
                }}
              />
            </ListItem>
            <ListItem button sx={{ mb: 1 }}>
              <ListItemText primary="멘토 프로필" />
            </ListItem>
            <ListItem button>
              <ListItemText primary="회원탈퇴" />
            </ListItem>
          </List>
        </Box>

        {/* 우측 프로필 수정 영역 */}
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
                overflow: "hidden",
              }}
            >
              <img
                src={imagePreview}
                alt="프로필 이미지"
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
            </Box>

            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <Typography variant="h6" fontWeight={600}>
                {profileData?.nickname || ""}
              </Typography>
            </Box>

            <input
              type="file"
              id="profile-image-upload"
              accept="image/*"
              style={{ display: "none" }}
              onChange={handleFileSelect}
            />

            <label htmlFor="profile-image-upload">
              <Button
                variant="outlined"
                component="span"
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
                이미지 선택
              </Button>
            </label>

            {/* 이미지 업로드 버튼 - 파일 선택 시에만 표시 */}
            {profileImage && (
              <Button
                variant="contained"
                size="small"
                onClick={handleImageUpload}
                disabled={uploading}
                sx={{
                  mt: 1,
                  fontSize: "0.8rem",
                  borderRadius: "20px",
                  background: "var(--primary-100)",
                  color: "white",
                  px: 2,
                }}
              >
                {uploading ? (
                  <CircularProgress size={16} color="inherit" />
                ) : (
                  "업로드"
                )}
              </Button>
            )}
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
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: "8px",
                    },
                  }}
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
                  background:
                    "linear-gradient(90deg, #ffbad0 0%, #5b8def 100%)",
                  borderRadius: "8px",
                  color: "white",
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
          )}
        </Box>
      </Box>
    </Box>
  );
}
