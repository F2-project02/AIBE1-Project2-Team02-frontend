// src/components/Search/NoResults.jsx
import { Box, Typography, Button } from "@mui/material";
import SearchOffIcon from "@mui/icons-material/SearchOff";

export default function NoResults({ searchQuery }) {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        py: 8,
        px: 2,
        textAlign: "center",
      }}
    >
      <SearchOffIcon
        sx={{
          fontSize: 64,
          color: "var(--text-400)",
          mb: 2,
        }}
      />
      <Typography variant="h6" fontWeight={600} color="var(--text-200)" mb={1}>
        검색 결과가 없습니다
      </Typography>
      <Typography variant="body1" color="var(--text-300)" mb={3}>
        {searchQuery ? (
          <>
            <strong>"{searchQuery}"</strong>에 대한 검색 결과가 없습니다.
            <br />
            다른 검색어나 필터를 사용해 보세요.
          </>
        ) : (
          <>
            현재 필터 조건에 맞는 과외가 없습니다.
            <br />
            필터를 변경하여 다시 검색해보세요.
          </>
        )}
      </Typography>
      <Button
        variant="outlined"
        sx={{
          borderRadius: "16px",
          textTransform: "none",
          borderColor: "var(--primary-100)",
          color: "var(--primary-100)",
          px: 3,
          py: 1,
          fontWeight: 500,
          "&:hover": {
            borderColor: "var(--primary-200)",
            backgroundColor: "var(--action-primary-bg)",
          },
        }}
        onClick={() => window.location.reload()}
      >
        필터 초기화하기
      </Button>
    </Box>
  );
}
