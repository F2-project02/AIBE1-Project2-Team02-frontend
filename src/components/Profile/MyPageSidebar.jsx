// src/components/Profile/MyPageSidebar.jsx
import {
  Box,
  List,
  ListItem,
  Typography,
  Skeleton,
  useMediaQuery,
  useTheme,
} from "@mui/material";

import PersonIcon from "@mui/icons-material/Person";
import SchoolIcon from "@mui/icons-material/School";
import PersonOffIcon from "@mui/icons-material/PersonOff";

export default function MyPageSidebar({
  activeTab = "profile",
  onTabChange,
  isLoading = false,
}) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const tabItems = [
    { id: "profile", label: "내 정보 수정", icon: <PersonIcon /> },
    { id: "mentor", label: "멘토 프로필", icon: <SchoolIcon /> },
    { id: "delete", label: "회원탈퇴", icon: <PersonOffIcon /> },
  ];

  return (
    <Box
      sx={{
        width: isMobile ? "100%" : 240,
        mb: isMobile ? 3 : 0,
      }}
    >
      <List
        component="nav"
        aria-label="마이페이지 메뉴"
        sx={{
          display: "flex",
          flexDirection: isMobile ? "row" : "column",
          justifyContent: isMobile ? "space-between" : "flex-start",
          flexWrap: "wrap",
          gap: 1,
        }}
      >
        {tabItems.map((tab) => (
          <ListItem
            key={tab.id}
            disablePadding
            sx={{
              mb: isMobile ? 0 : 1,
              width: isMobile ? "auto" : "100%",
              flex: isMobile ? "1 1 0" : "auto",
            }}
            onClick={() => onTabChange && onTabChange(tab.id)}
          >
            {isLoading ? (
              <Skeleton
                variant="rectangular"
                width="100%"
                height={48}
                sx={{
                  borderRadius: "8px",
                  bgcolor: "var(--bg-200)",
                }}
              />
            ) : (
              <Box
                sx={{
                  width: "100%",
                  borderRadius: "8px",
                  bgcolor:
                    activeTab === tab.id
                      ? "var(--action-primary-bg)"
                      : "transparent",
                  py: isMobile ? 1 : 1.5,
                  px: 2,
                  cursor: "pointer",
                  display: "flex",
                  flexDirection: isMobile ? "column" : "row",
                  alignItems: "center",
                  justifyContent: isMobile ? "center" : "flex-start",
                  gap: isMobile ? 0.5 : 2,
                  "&:hover": {
                    bgcolor:
                      activeTab === tab.id
                        ? "var(--action-primary-bg)"
                        : "rgba(0, 0, 0, 0.04)",
                  },
                }}
              >
                <Box
                  sx={{
                    color:
                      activeTab === tab.id
                        ? "var(--primary-200)"
                        : "var(--text-300)",
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  {tab.icon}
                </Box>
                <Typography
                  sx={{
                    fontWeight: activeTab === tab.id ? 600 : 400,
                    color:
                      activeTab === tab.id
                        ? "var(--primary-200)"
                        : "var(--text-300)",
                    fontSize: isMobile ? "0.75rem" : "1rem",
                    textAlign: isMobile ? "center" : "left",
                  }}
                >
                  {tab.label}
                </Typography>
              </Box>
            )}
          </ListItem>
        ))}
      </List>
    </Box>
  );
}
