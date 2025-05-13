// src/components/Home/PopularMentorList/MentorCtaCard.jsx
import { Card, Box, Typography } from "@mui/material";
import GradientButton from "../../Button/GradientButton";
import { useNavigate } from "react-router-dom";
import { useUserStore } from "../../../store/useUserStore";
import { useState } from "react";
import CustomToast from "../../common/CustomToast";
import warn from "../../../assets/warn.gif";

export default function MentorCtaCard() {
  const { isLoggedIn } = useUserStore();
  const navigate = useNavigate();

  const [toastOpen, setToastOpen] = useState(false);

  const handleClick = () => {
    if (!isLoggedIn) {
      setToastOpen(true);
      return;
    }

    // 멘토 탭으로 이동
    navigate("/mypage?tab=mentor");
  };

  return (
    <>
      <Card
        sx={{
          width: "100%",
          height: "100%",
          minHeight: 250,
          px: 2,
          py: 3,
          display: "flex",
          flex: 1,
          flexDirection: "column",
          justifyContent: "space-between",
          background:
            "linear-gradient(225deg, rgba(91, 141, 239, 0.10) 0%, rgba(91, 141, 239, 0.02) 100%)",
          boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.05)",
          borderRadius: 1,
          transition: "transform 0.2s ease, box-shadow 0.2s ease",
          "&:hover": {
            transform: "translateY(-4px)",
            boxShadow: "0px 6px 16px rgba(0, 0, 0, 0.1)",
          },
        }}
      >
        <Box
          sx={{
            flexGrow: 1,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            gap: 0.5,
          }}
        >
          <Typography
            sx={{
              fontSize: 16,
              fontWeight: 600,
              color: "var(--text-200)",
              letterSpacing: 0.46,
            }}
          >
            누구나 멘토가 될 수 있어요.
          </Typography>
          <Typography
            sx={{
              fontSize: 14,
              fontWeight: 500,
              color: "var(--text-300)",
              letterSpacing: 0.46,
            }}
          >
            지식과 경험을 나누고, 의미 있는 인사이트를 전해주세요!
          </Typography>
        </Box>

        <Box>
          <GradientButton
            size="xs"
            fullWidth
            onClick={handleClick}
            sx={{
              borderRadius: "8px",
              px: 2,
              py: 1,
              fontSize: 12,
            }}
          >
            멘토 되기
          </GradientButton>
        </Box>
      </Card>

      <CustomToast
        open={toastOpen}
        onClose={() => setToastOpen(false)}
        message="로그인이 필요한 서비스예요!"
        type="info"
        iconSrc={warn}
      />
    </>
  );
}
