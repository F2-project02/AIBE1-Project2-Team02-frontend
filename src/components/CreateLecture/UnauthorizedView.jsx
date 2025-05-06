// src/components/CreateLecture/UnauthorizedView.jsx

import { Box, Typography, Button, IconButton } from "@mui/material";
import { useNavigate } from "react-router-dom";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import logo from "../../assets/navbar-logo.svg";
import GradientButton from "../Button/GradientButton";

export default function UnauthorizedView() {
  const navigate = useNavigate();

  return (
    <Box>
      {/* 뒤로가기 버튼 */}
      <Box sx={{ mb: 4 }}>
        <IconButton
          onClick={() => navigate("/")}
          sx={{
            p: 1,
            "&:hover": {
              backgroundColor: "rgba(0, 0, 0, 0.04)",
            },
          }}
        >
          <ArrowBackIcon />
        </IconButton>
      </Box>

      {/* 메인 컨텐츠 */}
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "300px",
          textAlign: "center",
          py: 5,
        }}
      >
        {/* 로고 이미지 */}
        <Box
          component="img"
          src={logo}
          alt="MEN:TOSS 로고"
          sx={{
            width: { xs: 80, sm: 100 },
            height: { xs: 80, sm: 100 },
            mb: 3,
          }}
        />

        <Typography
          variant="h5"
          fontWeight={600}
          color="text.primary"
          gutterBottom
        >
          이런, 아직 멘토 프로필이 없어요
        </Typography>

        <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
          멘토 프로필을 작성하고 과외를 등록해주세요.
        </Typography>

        <GradientButton
          onClick={() => navigate("/mentor/profile")}
          sx={{
            px: 4,
            py: 1.5,
          }}
        >
          빠르게 멘토되기 ⚡
        </GradientButton>
      </Box>
    </Box>
  );
}
