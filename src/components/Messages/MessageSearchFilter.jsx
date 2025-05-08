import {
  Box,
  MenuItem,
  Paper,
  IconButton,
  InputBase,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { useEffect, useState } from "react";
import { useMessageStore } from "../../store/useMessageStore";
import CustomSelect from "../common/CustomSelect";

export default function MessageSearchFilter({ onSearch }) {
  const { filter, setFilter } = useMessageStore();
  const [localKeyword, setLocalKeyword] = useState(filter.keyword);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  useEffect(() => {
    setLocalKeyword(filter.keyword);
  }, [filter.keyword]);

  const handleSearch = () => {
    onSearch({ filterBy: filter.filterBy, keyword: localKeyword });
  };

  return (
    <Box
      display="flex"
      alignItems="center"
      gap={1}
      mt={1.5}
      mb={1.5}
      flexWrap="wrap"
      justifyContent={{ xs: "flex-start", sm: "flex-end" }}
      width="100%"
    >
      {/* 필터 셀렉트 */}
      <CustomSelect
        value={filter.filterBy}
        onChange={(e) => setFilter({ ...filter, filterBy: e.target.value })}
        sx={{
          maxWidth: { xs: 100, sm: 120 },
          px: 1.5,
          py: 1,
          fontSize: 14,
          backgroundColor: "var(--bg-100)",
          border: "1px solid var(--bg-300)",
        }}
        MenuProps={{
          PaperProps: {
            sx: {
              "& .MuiMenuItem-root": {
                fontSize: "14px",
              },
            },
          },
        }}
      >
        <MenuItem value="nickname">닉네임</MenuItem>
        <MenuItem value="content">내용</MenuItem>
      </CustomSelect>

      {/* 검색창 */}
      <Paper
        elevation={0}
        sx={{
          px: 1.5,
          py: 1,
          display: "flex",
          alignItems: "center",
          borderRadius: "8px",
          backgroundColor: "var(--bg-100)",
          border: "1px solid var(--bg-300)",
          flexGrow: { xs: 1, sm: 0 },
          maxWidth: { xs: "100%", sm: "200px" },
        }}
      >
        <InputBase
          placeholder="검색"
          value={localKeyword}
          onChange={(e) => setLocalKeyword(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") handleSearch();
          }}
          sx={{
            fontSize: 14,
            flexGrow: 1,
            color: "var(--text-300)",
          }}
          inputProps={{ "aria-label": "쪽지 검색" }}
        />
        <IconButton
          size="small"
          onClick={handleSearch}
          aria-label="검색 실행"
          sx={{ color: "var(--text-300)" }}
        >
          <SearchIcon fontSize="small" />
        </IconButton>
      </Paper>
    </Box>
  );
}