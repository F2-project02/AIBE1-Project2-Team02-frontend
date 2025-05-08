// import React from 'react';
// import { Box, Typography } from "@mui/material";
//
// export default function MyPage() {
//     return (
//         <Box sx={{ width: '100%', maxWidth: '1040px', margin: '0 auto', padding: '2rem'}}>
//             <Typography variant="h5" fontWeight={600} sx={{ mb: 4 }}>
//                 마이페이지 - 내 정보 수정
//             </Typography>
//
//             {/*여기에 페이지 내용을 추가할 예정입니다*/}
//             <Typography>마이페이지 내용이 여기에 표시됩니다</Typography>
//         </Box>
//     );
// }

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
} from "@mui/material";

export default function MyPage() {
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(false);

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
          throw new Error("프로필 정보는 가져오는데 실패했습니다");
        }

        const result = await response.json();
        if (result.success) {
          setProfileData(result.data);
        }
      } catch (error) {
        console.error("프로필 조회 오류: ", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="50vh"
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ mt: 4, mb: 8 }}>
      <Typography variant="h5" fontWeight={600} sx={{ mb: 4 }}>
        마이페이지 - 내 정보 수정
      </Typography>

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

        <Box display="flex" alignItems="center" gap={1}>
          <Typography variant="h6" fontWeight={600}>
            {profileData?.nickname || ""}
          </Typography>
        </Box>

        <Button variant="outlined" size="small">
          프로필 이미지 변경
        </Button>
      </Box>

      {/* 프로필 정보 폼 (읽기 전용) */}
      {profileData && (
        <Box>
          {/* 닉네임 필드 */}
          <Box mb={3}>
            <Typography fontWeight={600} mb={1}>
              닉네임{" "}
              <Box component="span" color="red">
                *
              </Box>
            </Typography>
            <TextField
              fullWidth
              value={profileData.nickname || ""}
              disabled
              placeholder="닉네임을 입력하세요."
            />
          </Box>

          {/* 생년월일 필드 */}
          <Box mb={3}>
            <Typography fontWeight={600} mb={1}>
              생년월일
            </Typography>
            <TextField
              fullWidth
              value={profileData.birthDate || ""}
              disabled
              placeholder="생년월일을 입력하세요."
            />
          </Box>

          {/* 성별 필드 */}
          <Box mb={3}>
            <Typography fontWeight={600} mb={1}>
              성별{" "}
              <Box component="span" color="red">
                *
              </Box>
            </Typography>
            <RadioGroup row value={profileData.sex || "남성"}>
              <FormControlLabel
                value="남성"
                control={<Radio disabled />}
                label="남성"
              />
              <FormControlLabel
                value="여성"
                control={<Radio disabled />}
                label="여성"
              />
            </RadioGroup>
          </Box>

          {/* 지역 필드 */}
          <Box mb={3}>
            <Typography fontWeight={600} mb={1}>
              지역{" "}
              <Box component="span" color="red">
                *
              </Box>
            </Typography>
            <TextField fullWidth value="지역 정보 표시 예정" disabled />
          </Box>

          {/* MBTI 필드 */}
          <Box mb={4}>
            <Typography fontWeight={600} mb={1}>
              MBTI
            </Typography>
            <TextField fullWidth value={profileData.mbti || ""} disabled />
          </Box>

          {/* 등록 버튼 */}
          <Button fullWidth variant="contained">
            등록하기
          </Button>
        </Box>
      )}
    </Box>
  );
}
