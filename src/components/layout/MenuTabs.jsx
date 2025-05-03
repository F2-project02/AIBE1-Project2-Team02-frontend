// src/components/layout/MenuTabs.jsx 데스크탑 하단 탭

import { Box, Typography } from "@mui/material";
import { NavLink } from "react-router-dom";
import menuItems from "./menuItems";

export default function MenuTabs() {
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
      {menuItems.map(({ label, path }) => (
        <NavLink
          key={path}
          to={path}
          style={({ isActive }) => ({
            color: isActive ? "var(--text-100)" : "var(--text-300)",
            fontWeight: isActive ? 700 : 400,
            textDecoration: "none",
          })}
        >
          <Typography variant="body2">{label}</Typography>
        </NavLink>
      ))}
    </Box>
  );
}