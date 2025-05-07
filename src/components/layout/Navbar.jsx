// src/components/layout/Navbar.jsx

import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Box,
  IconButton,
  Typography,
  Avatar,
  Drawer,
  Menu,
  MenuItem,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import NotificationsIcon from "@mui/icons-material/Notifications";
import MenuTabs from "./MenuTabs";

import logo from "../../assets/navbar-logo.svg";
import { useUserStore } from "../../store/useUserStore";
import { useLoginModalStore } from "../../store/useLoginModalStore";
import MobileMenu from "./MobileMenu";

export default function Navbar() {
  const { isLoggedIn, profileImage } = useUserStore();
  const { open } = useLoginModalStore();
  const [mobileOpen, setMobileOpen] = useState(false);

  const [anchorEl, setAnchorEl] = useState(null);
  const menuOpen = Boolean(anchorEl);
  const navigate = useNavigate();

  const handleToggleMenu = () => setMobileOpen((prev) => !prev);

  const handleAvatarClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleGoToMypage = () => {
    navigate("/mypage");
    handleMenuClose();
  };

  const handleLogout = () => {
    alert("로그아웃 로직 필요!");
    handleMenuClose();
  };

  return (
    <Box
      component="nav"
      sx={{
        width: "100%",
        backgroundColor: "var(--bg-100)",
        position: "static",
        top: 0,
        zIndex: 1000,
      }}
    >
      {/* 내부 너비 제한 + 중앙 정렬 컨테이너 */}
      <Box
        sx={{
          width: "100%",
          maxWidth: "1040px",
          mx: "auto",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          px: { xs: 2, sm: 3, md: 4 },
          py: { xs: 2.5, sm: 4, md: 4.5 },
        }}
      >
        {/* 왼쪽 로고 */}
        <Link to="/" style={{ textDecoration: "none" }}>
          <Box
            component="img"
            src={logo}
            alt="MEN:TOSS"
            sx={{
              height: { xs: 24, sm: 28, md: 32 },
              transition: "height 0.3s ease",
              cursor: "pointer",
            }}
          />
        </Link>

        {/* 오른쪽 영역 */}
        <Box display="flex" alignItems="center" gap={2}>
          {/* 모바일: 햄버거 메뉴 */}
          <Box display={{ xs: "block", sm: "none" }}>
            <IconButton onClick={handleToggleMenu}>
              <MenuIcon sx={{ color: "var(--text-100)" }} />
            </IconButton>
          </Box>

          {/* 데스크탑: 로그인 or 알람/프로필 */}
          <Box display={{ xs: "none", sm: "flex" }} alignItems="center" gap={2}>
            {!isLoggedIn ? (
              <Typography
                onClick={open}
                variant="body2"
                sx={{
                  color: "var(--text-200)",
                  fontWeight: 500,
                  cursor: "pointer",
                }}
              >
                로그인/회원가입
              </Typography>
            ) : (
              <>
                <IconButton>
                  <NotificationsIcon sx={{ color: "var(--text-100)" }} />
                </IconButton>

                <IconButton onClick={handleAvatarClick}>
                  <Avatar
                    src={profileImage}
                    alt="사용자 프로필"
                    sx={{ width: 32, height: 32 }}
                  />
                </IconButton>

                {/* 프로필 드롭다운 메뉴 */}
                <Menu
                  anchorEl={anchorEl}
                  open={menuOpen}
                  onClose={handleMenuClose}
                  PaperProps={{
                    elevation: 3,
                    sx: {
                      mt: 1,
                      borderRadius: "8px",
                      minWidth: 140,
                      backgroundColor: "#fefefe",
                      boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
                    },
                  }}
                >
                  <MenuItem onClick={handleGoToMypage} sx={{color: "var(--text-100)"}}>마이페이지</MenuItem>
                  <MenuItem onClick={handleLogout} sx={{color: "var(--action-red)"}}>로그아웃</MenuItem>
                </Menu>
              </>
            )}
          </Box>
        </Box>
      </Box>

      {/* 하단 탭 메뉴 */}
      <MenuTabs />

      {/* 모바일 드로어 메뉴 */}
      <Drawer
        anchor="right"
        open={mobileOpen}
        onClose={handleToggleMenu}
        slotProps={{
          paper: {
            sx: {
              backgroundColor: "var(--bg-100)",
              borderTopLeftRadius: "16px",
              borderBottomLeftRadius: "16px",
              width: 260,
              boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.1)",
            },
          },
        }}
      >
        <MobileMenu onClose={handleToggleMenu} />
      </Drawer>
    </Box>
  );
}