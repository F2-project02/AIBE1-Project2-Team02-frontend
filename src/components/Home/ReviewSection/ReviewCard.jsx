// src/components/Home/ReviewSection/ReviewCard.jsx

import { Box, Typography, Card, Avatar, Rating } from "@mui/material";
import { formatDistanceToNow } from "date-fns";
import { ko } from "date-fns/locale";

export default function ReviewCard({ data }) {
  const {
    profileImage,
    nickname,
    rating,
    createdAt,
    content,
    lectureTitle,
    mentorName,
  } = data;

  return (
    <Card
      sx={{
        width: 420,
        height: 230,
        backgroundColor: "#FEFEFE",
        borderRadius: "16px",
        boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
        outline: "1px solid var(--bg-200)",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        p: 3,
      }}
    >
      {/* 상단: 아바타, 이름, 날짜, 별점 */}
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Box display="flex" alignItems="center" gap={2}>
          <Avatar src={profileImage} sx={{ width: 36, height: 36 }} />
          <Box>
            <Typography fontWeight={600} fontSize={16} color="var(--text-100)">
              {nickname}
            </Typography>
            <Typography fontSize={12} fontWeight={500} color="var(--text-400)">
              {formatDistanceToNow(new Date(createdAt), {
                locale: ko,
                addSuffix: true,
              })}
            </Typography>
          </Box>
        </Box>
        <Rating
          value={rating}
          precision={0.5}
          readOnly
          size="small"
          sx={{
            "& .MuiRating-icon": {
              fontSize: 20,
            },
          }}
        />
      </Box>

      {/* 후기 본문 */}
      <Typography
        variant="body2"
        fontSize={15}
        fontWeight={500}
        color="var(--text-300)"
        sx={{
          overflow: "hidden",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap",
        }}
      >
        {content}
      </Typography>

      {/* 하단: 과외명 + 멘토명 */}
      <Box>
        <Typography
          variant="body2"
          fontSize={14}
          fontWeight={500}
          color="var(--text-200)"
        >
          {lectureTitle}
        </Typography>
        <Typography
          variant="body2"
          fontSize={12}
          fontWeight={500}
          color="var(--text-300)"
        >
          {mentorName} 멘토
        </Typography>
      </Box>
    </Card>
  );
}
