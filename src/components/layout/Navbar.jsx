// src/components/layout/Navbar.jsx

import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import {
  Box,
  IconButton,
  Typography,
  Avatar,
  Drawer,
  Menu,
  MenuItem,
  Snackbar,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import NotificationsIcon from "@mui/icons-material/Notifications";
import MenuTabs from "./MenuTabs";
import MobileMenu from "./MobileMenu";

import logo from "../../assets/navbar-logo.svg";
import byeGif from "../../assets/bye.gif";
import LogoutConfirmDialog from "../common/LogoutConfirmDialog";
import CustomToast from "../common/CustomToast";
import { useUserStore } from "../../store/useUserStore";
import { useLoginModalStore } from "../../store/useLoginModalStore";

import NotificationDropdown from "../Notifications/NotificationDropdown";
import Badge from "@mui/material/Badge";
import { getUnreadCount } from "../../lib/api/notificationApi";

export default function Navbar() {
  const { isLoggedIn, profileImage, logout } = useUserStore();
  const { open } = useLoginModalStore();
  const [mobileOpen, setMobileOpen] = useState(false);

  const [anchorEl, setAnchorEl] = useState(null);
  const menuOpen = Boolean(anchorEl);
  const [logoutDialogOpen, setLogoutDialogOpen] = useState(false);

  const [notificationAnchor, setNotificationAnchor] = useState(null);
  const [unreadCount, setUnreadCount] = useState(0);

  const [toastOpen, setToastOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastIcon, setToastIcon] = useState(null);
  const [toastType, setToastType] = useState("info");

  const location = useLocation();

  const showToast = (message, icon = null, type = "info") => {
    setToastMessage(message);
    setToastIcon(icon);
    setToastType(type);
    setToastOpen(true);
  };

  const navigate = useNavigate();

  const handleToggleMenu = () => setMobileOpen((prev) => !prev);
  const handleAvatarClick = (e) => setAnchorEl(e.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);

  const handleLogout = () => {
    logout();
    handleMenuClose();
    setLogoutDialogOpen(false);
    showToast("다음에 또 만나요! 안녕히가세요!", byeGif, "info");
    navigate("/");
  };

  const handleNotificationClick = (e) => {
    setNotificationAnchor(e.currentTarget);
  };

  const handleNotificationClose = () => {
    setNotificationAnchor(null);
    setUnreadCount(0);
  };

  useEffect(() => {
    if (isLoggedIn) {
      getUnreadCount().then(setUnreadCount);
    }
  }, [location.pathname, isLoggedIn]);

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

        <Box display="flex" alignItems="center" gap={2}>
          {/* 모바일 메뉴 버튼 */}
          <Box display={{ xs: "block", sm: "none" }}>
            <IconButton onClick={handleToggleMenu}>
              <MenuIcon sx={{ color: "var(--text-100)" }} />
            </IconButton>
          </Box>

          {/* 데스크탑 로그인 or 메뉴 */}
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
                <IconButton onClick={handleNotificationClick}>
                  <Badge badgeContent={unreadCount} color="error">
                    <NotificationsIcon sx={{ color: "var(--text-100)" }} />
                  </Badge>
                </IconButton>

                <NotificationDropdown
                  anchorEl={notificationAnchor}
                  open={Boolean(notificationAnchor)}
                  onClose={handleNotificationClose}
                />

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
                  <MenuItem
                    onClick={() => {
                      navigate("/mypage");
                      handleMenuClose();
                    }}
                  >
                    마이페이지
                  </MenuItem>
                  <MenuItem
                    onClick={() => {
                      handleMenuClose();
                      setLogoutDialogOpen(true);
                    }}
                    sx={{ color: "var(--action-red)" }}
                  >
                    로그아웃
                  </MenuItem>
                </Menu>
              </>
            )}
          </Box>
        </Box>
      </Box>

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
        <MobileMenu
          onClose={handleToggleMenu}
          onLogoutWithToast={(msg, icon, type) => {
            setToastMessage(msg);
            setToastIcon(icon);
            setToastType(type);
            setToastOpen(true);
          }}
        />
      </Drawer>

      {/* 로그아웃 확인 모달 */}
      <LogoutConfirmDialog
        open={logoutDialogOpen}
        onClose={() => setLogoutDialogOpen(false)}
        onConfirm={handleLogout}
      />

      {/* 토스트 알림 */}
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
