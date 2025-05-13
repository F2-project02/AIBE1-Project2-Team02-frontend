// MentorCtaCard.jsx

import { Card, Box, Typography } from "@mui/material";
import GradientButton from "../../Button/GradientButton";
import { useNavigate } from "react-router-dom";
import { useUserStore } from "../../../store/useUserStore";
import { useState, useEffect } from "react";
import CustomToast from "../../common/CustomToast";
import warn from "../../../assets/warn.gif";
import eyes from "../../../assets/eyes.gif";
import { motion, AnimatePresence } from "framer-motion";

const phrases = [
  "1분이면 누구나 멘토가 될 수 있어요!",
  "지식을 나누고 보람을 느껴보세요.",
  "여러분의 경험이 누군가에겐 길잡이예요.",
];

export default function MentorCtaCard() {
  const { isLoggedIn } = useUserStore();
  const navigate = useNavigate();

  const [toastOpen, setToastOpen] = useState(false);
  const [currentPhraseIndex, setCurrentPhraseIndex] = useState(0);

  const handleClick = () => {
    if (!isLoggedIn) {
      setToastOpen(true);
      return;
    }
    navigate("/mypage?tab=mentor");
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentPhraseIndex((prev) => (prev + 1) % phrases.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <Card
        sx={{
          width: "100%",
          height: "100%",
          minHeight: 250,
          px: 3,
          py: 4,
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          position: "relative",
          overflow: "hidden",
          borderRadius: "16px",
          background:
            "linear-gradient(225deg, rgba(91, 141, 239, 0.10) 0%, rgba(91, 141, 239, 0.02) 100%)",
          boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.04)",
          transition: "all 0.2s ease",
          "&:hover": {
            transform: "translateY(-4px)",
            boxShadow: "0px 8px 20px rgba(0, 0, 0, 0.08)",
          },
        }}
      >
        {/* 👁 눈 gif 정중앙 배치 */}
        <Box
          component="img"
          src={eyes}
          alt="눈 gif"
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            width: 80,
            height: 80,
            transform: "translate(-50%, -80%)",
            opacity: 0.08,
            zIndex: 1,
            pointerEvents: "none",
            userSelect: "none",
          }}
        />

        {/* 💬 문구 애니메이션 */}
        <Box
          sx={{
            flexGrow: 1,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "flex-start",
            gap: 1,
            minHeight: 64,
            position: "relative",
            zIndex: 2,
          }}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={currentPhraseIndex}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.5 }}
              style={{ position: "absolute" }}
            >
              <Typography
                sx={{
                  fontSize: 16,
                  fontWeight: 600,
                  color: "var(--text-200)",
                }}
              >
                {phrases[currentPhraseIndex]}
              </Typography>
            </motion.div>
          </AnimatePresence>
        </Box>

        {/* CTA 버튼 */}
        <Box mt={2} sx={{ zIndex: 2 }}>
          <GradientButton
            size="xs"
            fullWidth
            onClick={handleClick}
            sx={{
              borderRadius: "8px",
              px: 2,
              py: 1,
              fontSize: 13,
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
