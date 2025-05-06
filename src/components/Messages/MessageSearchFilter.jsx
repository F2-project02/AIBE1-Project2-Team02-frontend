import {
  Box,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  InputBase,
  Paper,
  IconButton,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { useState } from "react";

export default function MessageSearchFilter({ onSearch }) {
  const [filterBy, setFilterBy] = useState("nickname");
  const [keyword, setKeyword] = useState("");
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const handleSearch = () => {
    onSearch({ filterBy, keyword });
  };

  return (
    <Box
      display="flex"
      alignItems="center"
      gap={1}
      mb={1.5}
      flexWrap="wrap"
      justifyContent={{ xs: "flex-start", sm: "flex-end" }}
      width="100%"
    >
      {/* 셀렉트박스 */}
      <FormControl
        size="small"
        sx={{
          minWidth: { xs: 90, sm: 100 },
          backgroundColor: theme.palette.background.paper,
          borderRadius: "8px",
          "& .MuiOutlinedInput-root": {
            height: "38px",
            fontSize: "14px",
            paddingX: "10px",
            borderRadius: "8px",
          },
          "& .MuiSelect-select": {
            display: "flex",
            alignItems: "center",
            paddingY: 0.5,
          },
        }}
      >
        <Select
          value={filterBy}
          onChange={(e) => setFilterBy(e.target.value)}
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
        </Select>
      </FormControl>

      <Paper
        elevation={0}
        sx={{
          px: 1.5,
          py: 0.5,
          display: "flex",
          alignItems: "center",
          borderRadius: "8px",
          backgroundColor: theme.palette.background.paper,
          border: `1px solid ${theme.palette.divider}`,
          flexGrow: { xs: 1, sm: 0 },
          maxWidth: { xs: "100%", sm: "200px" },
        }}
      >
        <InputBase
          placeholder="검색"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") handleSearch();
          }}
          sx={{
            fontSize: "14px",
            flexGrow: 1,
          }}
          inputProps={{ "aria-label": "쪽지 검색" }}
        />
        <IconButton size="small" onClick={handleSearch} aria-label="검색 실행">
          <SearchIcon fontSize="small" />
        </IconButton>
      </Paper>
    </Box>
  );
}
