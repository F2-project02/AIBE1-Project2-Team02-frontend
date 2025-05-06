// 📄 src/components/LectureDetail/MentorProfile.jsx

import {
  Box,
  Typography,
  Chip,
  Stack,
  Avatar,
  Divider,
  Link,
  ListItem,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import ShieldIcon from "@mui/icons-material/VerifiedUser";
import StarIcon from "@mui/icons-material/Star";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";

export default function MentorProfile({ mentor }) {
  return (
    <Box>
      <Typography variant="h6" fontWeight={700} gutterBottom>
        멘토 정보
      </Typography>

      {/* 프로필 이미지 */}
      <Box display="flex" justifyContent="center" mt={2} mb={1}>
        <Avatar
          src={"/images/default-profile.svg"}
          sx={{ width: 80, height: 80 }}
        />
      </Box>

      {/* 닉네임 + 인증 */}
      <Box display="flex" justifyContent="center" alignItems="center" gap={1}>
        <Typography fontWeight={700} fontSize="1rem" color="var(--text-100)">
          {mentor.nickname}
        </Typography>
        {mentor.isCertified && (
          <ShieldIcon fontSize="small" sx={{ color: "var(--primary-100)" }} />
        )}
      </Box>

      {/* 별점 + MBTI */}
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        gap={1}
        mt={1}
      >
        <Box display="flex" alignItems="center" gap={0.5}>
          <StarIcon sx={{ fontSize: 16, color: "#FFC107" }} />
          <Typography fontSize="0.85rem">
            {mentor.rating?.toFixed(1)}
          </Typography>
        </Box>
        <Chip
          label={mentor.mbti || "MBTI"}
          size="small"
          sx={{
            backgroundColor: "var(--action-green-bg)",
            color: "var(--action-green)",
            fontWeight: 600,
            borderRadius: "8px",
          }}
        />
      </Box>

      {/* 학력 */}
      <Typography
        variant="body2"
        textAlign="center"
        mt={1}
        color="var(--text-300)"
      >
        {mentor.education} {mentor.major && `· ${mentor.major}`}
      </Typography>

      {/* 지역 */}
      {mentor.regions && mentor.regions.length > 0 && (
        <Box
          display="flex"
          justifyContent="center"
          flexWrap="wrap"
          gap={1}
          mt={1}
        >
          {mentor.regions.map((r) => (
            <Chip
              key={r}
              label={r}
              size="small"
              sx={{
                backgroundColor: "var(--action-primary-bg)",
                color: "var(--primary-200)",
                fontWeight: 500,
                borderRadius: "8px",
              }}
            />
          ))}
        </Box>
      )}

      {/* AI 멘토 분석 */}
      {mentor.analysisComment && (
        <Box
          mt={3}
          p={2}
          borderRadius="8px"
          sx={{
            background:
              "linear-gradient(90deg, rgba(255, 186, 208, 0.2) 0%, rgba(91, 141, 239, 0.2) 100%)",
            color: "var(--text-200)",
          }}
        >
          <Box display="flex" alignItems="center" gap={1} mb={0.5}>
            <InfoOutlinedIcon fontSize="small" />
            <Typography fontWeight={600} fontSize={14}>
              AI 멘토 분석
            </Typography>
          </Box>
          <Typography fontSize={13} fontWeight={400}>
            {mentor.analysisComment}
          </Typography>
        </Box>
      )}

      {/* 멘토 소개 */}
      <Divider sx={{ my: 3 }} />
      <Typography color="var(--text-100)" variant="subtitle2" fontWeight={600}>
        멘토 소개
      </Typography>
      <Box
        sx={{
          mt: 1,
          backgroundColor: "var(--bg-100)",
          borderRadius: "12px",
          border: "1px solid var(--bg-300)",
          p: 2,
        }}
      >
        <Typography
          variant="body2"
          sx={{ whiteSpace: "pre-line", color: "var(--text-200)" }}
        >
          {mentor.content}
        </Typography>
      </Box>

      {/* 첨부파일 */}
      {mentor.appealFileUrl && (
        <Box mt={2}>
          <ListItem
            component="a"
            href={mentor.appealFileUrl}
            target="_blank"
            sx={{
              border: "1px solid var(--bg-200)",
              borderRadius: 1,
              px: 2,
              py: 1,
              backgroundColor: "#fefefe",
              boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
            }}
          >
            <ListItemIcon>
              <InsertDriveFileIcon sx={{ color: "var(--primary-300)" }} />
            </ListItemIcon>
            <ListItemText
              primary="document_file_name.pdf"
              secondary="100kb · Complete"
              primaryTypographyProps={{ fontWeight: 500 }}
            />
          </ListItem>
        </Box>
      )}
    </Box>
  );
}