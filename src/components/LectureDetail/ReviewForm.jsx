// 📄 src/components/LectureDetail/ReviewForm.jsx

import {
  Box,
  TextField,
  Button,
  Rating,
  Stack,
  Avatar,
  Typography,
} from "@mui/material";
import { useState } from "react";
import { useUserStore } from "../../store/useUserStore";

export default function ReviewForm() {
  const [rating, setRating] = useState(5);
  const [content, setContent] = useState("");

  const { nickname, profileImage } = useUserStore();

  const handleSubmit = () => {
    console.log("작성한 후기:", { rating, content });
    setContent("");
    setRating(5);
  };

  return (
    <Box>
      {/* 유저 정보 + 별점 */}
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        mb={2}
      >
        <Stack direction="row" spacing={2} alignItems="center">
          <Avatar src={profileImage} sx={{ width: 40, height: 40 }} />
          <Typography
            fontWeight={600}
            fontSize="0.95rem"
            color="var(--text-100)"
          >
            {nickname}
          </Typography>
        </Stack>

        <Rating
          value={rating}
          onChange={(e, newValue) => setRating(newValue)}
          sx={{
            "& .MuiRating-iconFilled": { color: "#FFB400" },
            fontSize: "1.25rem",
          }}
        />
      </Stack>

      {/* 후기 입력창 */}
      <TextField
        fullWidth
        multiline
        minRows={3}
        placeholder="여러분의 수업 후기를 남겨주세요!"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        sx={{
          backgroundColor: "#fefefe",
          borderColor: "var(--bg-200)",
          borderRadius: "8px",
          "& .MuiOutlinedInput-root": {
            borderRadius: "8px",
          },
        }}
      />

      {/* 등록 버튼 */}
      <Box display="flex" justifyContent="flex-end" mt={2}>
        <Button
          variant="contained"
          onClick={handleSubmit}
          disabled={!content.trim()}
          sx={{
            backgroundColor: "var(--primary-100)",
            borderRadius: "8px",
            color: "var(--bg-100)",
            px: 3,
            py: 1,
            fontWeight: 600,
            ":hover": {
              backgroundColor: "var(--primary-200)",
            },
          }}
        >
          등록하기
        </Button>
      </Box>
    </Box>
  );
}