// src/components/Profile/skeletons/MyPageSidebarSkeleton.jsx
import { Box, List, ListItem, Skeleton } from "@mui/material";

export default function MyPageSidebarSkeleton() {
  const menuItems = [1, 2, 3, 4];

  return (
    <Box sx={{ width: 240 }}>
      <List component="nav" aria-label="마이페이지 메뉴 로딩 중">
        {menuItems.map((item) => (
          <ListItem key={item} disablePadding sx={{ mb: 1 }}>
            <Box
              sx={{
                width: "100%",
                borderRadius: "8px",
                bgcolor: "var(--bg-200)",
                py: 1.5,
                px: 2,
              }}
            >
              <Skeleton
                variant="text"
                width={Math.floor(Math.random() * 40) + 80}
                height={24}
                animation="wave"
                sx={{ bgcolor: "var(--bg-300)" }}
              />
            </Box>
          </ListItem>
        ))}
      </List>
    </Box>
  );
}
