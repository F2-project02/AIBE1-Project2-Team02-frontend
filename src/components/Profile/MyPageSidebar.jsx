// src/components/Profile/MyPageSidebar.jsx
import { Box, List, ListItem, Typography, Skeleton } from "@mui/material";

export default function MyPageSidebar({
  activeTab = "profile",
  onTabChange,
  isLoading = false,
}) {
  const tabItems = [
    { id: "profile", label: "내 정보 수정" },
    { id: "mentor", label: "멘토 프로필" },
    { id: "delete", label: "회원탈퇴" },
  ];

  return (
    <Box sx={{ width: 240 }}>
      <List component="nav" aria-label="마이페이지 메뉴">
        {tabItems.map((tab) => (
          <ListItem
            key={tab.id}
            disablePadding
            sx={{ mb: 1 }}
            onClick={() => onTabChange && onTabChange(tab.id)}
          >
            {isLoading ? (
              // 로딩 중일 때 스켈레톤 표시
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
                  py: 1.5,
                  px: 2,
                  cursor: "pointer",
                  "&:hover": {
                    bgcolor:
                      activeTab === tab.id
                        ? "var(--action-primary-bg)"
                        : "rgba(0, 0, 0, 0.04)",
                  },
                }}
              >
                <Typography
                  sx={{
                    fontWeight: activeTab === tab.id ? 600 : 400,
                    color:
                      activeTab === tab.id
                        ? "var(--primary-200)"
                        : "var(--text-300)",
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
