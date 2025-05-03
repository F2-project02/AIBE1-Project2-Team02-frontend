// src/components/Home/SearchBar.jsx

import { useState } from "react";
import { Box, InputBase } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";

export default function SearchBar() {
  const [keyword, setKeyword] = useState("");

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      if (keyword.trim()) {
        console.log("검색어:", keyword);
        // 추후 검색 결과 페이지로 이동 또는 API 호출 가능
        // navigate(`/search?keyword=${encodeURIComponent(keyword)}`);
      }
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        width: "100%",
        maxWidth: 727,
        mx: "auto",
        mt: { xs: 3, sm: 4 },
        px: 2,
        py: 1.5,
        borderRadius: "16px",
        backgroundColor: "var(--bg-100)",
        border: "2px solid transparent",
        backgroundClip: "padding-box",
        position: "relative",
        "&::before": {
          content: '""',
          position: "absolute",
          inset: 0,
          borderRadius: "16px",
          padding: "2px",
          background: "var(--primary-gradient)",
          WebkitMask:
            "linear-gradient(var(--bg-100) 0 0) content-box, linear-gradient(var(--bg-100) 0 0)",
          WebkitMaskComposite: "xor",
          pointerEvents: "none",
        },
      }}
    >
      <SearchIcon sx={{ color: "var(--text-400)", mr: 1.5, ml: 0.5 }} />
      <InputBase
        fullWidth
        value={keyword}
        onChange={(e) => setKeyword(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="나에게 필요한 멘토의 과외를 검색해보세요."
        sx={{
          fontSize: { xs: 14, sm: 15 },
          color: "var(--text-100)",
          "&::placeholder": {
            color: "var(--text-400)",
          },
        }}
        inputProps={{ "aria-label": "과외 검색 입력" }}
      />
    </Box>
  );
}
