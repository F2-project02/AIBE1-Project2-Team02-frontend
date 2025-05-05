// src/components/CategoryBar/CategoryBar.jsx

import { Box, Typography, useMediaQuery } from "@mui/material";
import { useTheme } from "@mui/material/styles";

const categories = [
  { label: "전체보기", icon: "/icons/categories/all.png" },
  { label: "교육/입시", icon: "/icons/categories/education.png" },
  { label: "취업/N잡", icon: "/icons/categories/job.png" },
  { label: "IT/개발", icon: "/icons/categories/it.png" },
  { label: "자격", icon: "/icons/categories/license.png" },
  { label: "학위", icon: "/icons/categories/degree.png" },
  { label: "예체능", icon: "/icons/categories/art.png" },
  { label: "라이프스타일", icon: "/icons/categories/lifestyle.png" },
];

export default function CategoryBar() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <Box
      sx={{
        display: "flex",
        flexWrap: "wrap",
        justifyContent: isMobile ? "center" : "space-between",
        gap: isMobile ? 2 : 4,
        px: { xs: 2, sm: 4 },
        py: 3,
        backgroundColor: "var(--bg-100)",
      }}
    >
      {categories.map(({ label, icon }) => (
        <Box
          key={label}
          display="flex"
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
          sx={{
            width: isMobile ? "22%" : "auto",
            minWidth: 64,
            cursor: "pointer",
            p: 1,
            borderRadius: "8px",
            transition: "all 0.2s ease",
            ":hover": {
              backgroundColor: "rgba(91, 141, 239, 0.08)",
            },
            ":active": {
              transform: "scale(0.96)",
            },
          }}
        >
          <Box
            component="img"
            src={icon}
            alt={label}
            sx={{
              width: isMobile ? 28 : 32,
              height: isMobile ? 28 : 32,
              mb: 1.5,
            }}
          />
          <Typography
            variant="caption"
            fontWeight={500}
            color="var(--text-300)"
            sx={{
              fontSize: isMobile ? 12 : 13,
              textAlign: "center",
              wordBreak: "keep-all",
            }}
          >
            {label}
          </Typography>
        </Box>
      ))}
    </Box>
  );
}
