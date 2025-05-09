// src/components/Profile/MyPageSidebar.jsx
import { Box, List, ListItem, Typography } from "@mui/material";

export default function MyPageSidebar() {
  return (
    <Box sx={{ width: 240 }}>
      <List component="nav" aria-label="마이페이지 메뉴">
        <ListItem disablePadding sx={{ mb: 1 }}>
          <Box
            sx={{
              width: "100%",
              borderRadius: "8px",
              bgcolor: "var(--action-primary-bg)",
              py: 1.5,
              px: 2,
            }}
          >
            <Typography
              sx={{
                fontWeight: 600,
                color: "var(--primary-200)",
              }}
            >
              내 정보 수정
            </Typography>
          </Box>
        </ListItem>

        <ListItem disablePadding sx={{ mb: 1 }}>
          <Box
            sx={{
              width: "100%",
              py: 1.5,
              px: 2,
              cursor: "pointer",
              "&:hover": {
                bgcolor: "rgba(0, 0, 0, 0.04)",
              },
            }}
          >
            <Typography>멘토 프로필</Typography>
          </Box>
        </ListItem>

        <ListItem disablePadding>
          <Box
            sx={{
              width: "100%",
              py: 1.5,
              px: 2,
              cursor: "pointer",
              "&:hover": {
                bgcolor: "rgba(0, 0, 0, 0.04)",
              },
            }}
          >
            <Typography>회원탈퇴</Typography>
          </Box>
        </ListItem>
      </List>
    </Box>
  );
}
