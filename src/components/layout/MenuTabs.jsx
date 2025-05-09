// src/components/layout/MenuTabs.jsx

import { Box, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import menuItems from "./menuItems";
import { useUserStore } from "../../store/useUserStore";
import CustomToast from "../common/CustomToast";
import warnGif from "../../assets/warn.gif";

export default function MenuTabs() {
  const { isLoggedIn, user } = useUserStore();
  const navigate = useNavigate();

  const [toastOpen, setToastOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastIcon, setToastIcon] = useState(null);
  const [toastType, setToastType] = useState("info");

  const showToast = (message, icon = null, type = "info") => {
    setToastMessage(message);
    setToastIcon(icon);
    setToastType(type);
    setToastOpen(true);
  };

  const checkAccessible = (item) => {
    if (item.requiresLogin && !isLoggedIn) return "로그인이 필요한 서비스예요!";
    return null;
  };

  return (
    <Box
      component="nav"
      sx={{
        display: { xs: "none", sm: "flex" },
        justifyContent: "flex-start",
        gap: 4,
        backgroundColor: "var(--bg-100)",
        py: 2,
        px: { xs: 2, sm: 3, md: 4 },
        maxWidth: "1040px",
        mx: "auto",
      }}
    >
      {menuItems.map(({ label, path, ...item }) => {
        const restrictionMsg = checkAccessible(item);
        const accessible = !restrictionMsg;

        const handleClick = () => {
          if (!accessible) {
            showToast(restrictionMsg, warnGif, "info");
          } else {
            navigate(path);
          }
        };

        return (
          <Box
            key={path}
            onClick={handleClick}
            sx={{
              cursor: "pointer",
            }}
          >
            <Typography
              variant="body2"
              sx={{
                fontWeight: 500,
                color: accessible ? "var(--text-300)" : "var(--text-300)",
                opacity: accessible ? 1 : 0.5,
                transition: "all 0.2s ease",
                "&:hover": {
                  color: accessible ? "var(--text-200)" : "var(--text-300)",
                  fontWeight: 600,
                },
              }}
            >
              {label}
            </Typography>
          </Box>
        );
      })}

      {/* 토스트 메시지 출력 */}
      <CustomToast
        open={toastOpen}
        onClose={() => setToastOpen(false)}
        message={toastMessage}
        iconSrc={toastIcon}
        type={toastType}
      />
    </Box>
  );
}