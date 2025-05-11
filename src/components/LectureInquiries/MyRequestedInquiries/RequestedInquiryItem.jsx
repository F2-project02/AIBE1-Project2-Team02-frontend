import {
  Box,
  Typography,
  Avatar,
  Chip,
  Stack,
  Card,
  Tooltip,
} from "@mui/material";
import StarIcon from "@mui/icons-material/Star";
import ShieldIcon from "@mui/icons-material/VerifiedUser";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import { useNavigate } from "react-router-dom";

export default function RequestedInquiryItem({ data }) {
  const navigate = useNavigate();

  const {
    lectureId,
    nickname,
    profile_image,
    isCertified,
    averageRating,
    subcategory,
    preferredRegions,
    lectureTitle,
    price,
    status,
  } = data;

  // Chip 배열 구성
  const sortedChips = [];

  if (subcategory) {
    sortedChips.push({ label: subcategory, type: "category" });
  }

  if (preferredRegions) {
    preferredRegions
      .split(",")
      .forEach((region) => sortedChips.push({ label: region, type: "region" }));
  }

  const visibleChips = sortedChips.slice(0, 3);
  const hiddenChips = sortedChips.slice(3);

  // 가격을 만원 단위로 포맷 그 이하면 원
  function formatPriceKRW(price) {
    if (price === 0) return "무료";
    return price < 10000
      ? `${price.toLocaleString()}원`
      : `${Math.floor(price / 10000).toLocaleString()}만원`;
  }

  const statusMap = {
    PENDING: {
      label: "매칭 대기",
      bg: "var(--action-green-bg)",
      color: "var(--action-green)",
    },
    APPROVED: {
      label: "매칭 성공",
      bg: "var(--action-primary-bg)",
      color: "var(--primary-200)",
    },
    REJECTED: {
      label: "매칭 실패",
      bg: "var(--action-red-bg)",
      color: "var(--action-red)",
    },
  };

  const handleCardClick = () => {
    navigate(`/lectures/${lectureId}`);
  };

  return (
    <Card
      onClick={handleCardClick}
      sx={{
        width: 400,
        minHeight: 220,
        px: 2,
        py: 3,
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        flexShrink: 0,
        borderRadius: 0,
        backgroundColor: "unset",
        boxShadow: "none",
        cursor: "pointer",
      }}
    >
      {/* 프로필 정보 */}
      <Stack direction="row" alignItems="center" spacing={1} mb={1}>
        <Avatar
          src={profile_image || "/images/default-profile.svg"}
          sx={{ width: 32, height: 32 }}
        />
        <Typography variant="subtitle2" fontWeight={600}>
          {nickname}
        </Typography>
        {isCertified && (
          <ShieldIcon sx={{ fontSize: 16, color: "var(--primary-100)" }} />
        )}
        <StarIcon sx={{ fontSize: 16, color: "#FFC107" }} />
        <Typography variant="body2" fontWeight={500}>
          {averageRating?.toFixed(1)}
        </Typography>
      </Stack>

      {/* 뱃지 */}
      <Box display="flex" gap={1} flexWrap="wrap" mb={1}>
        {visibleChips.map((chip, i) => (
          <Chip
            key={`chip-${i}`}
            label={chip.label}
            icon={
              chip.type === "region" ? (
                <LocationOnIcon
                  sx={{ fontSize: 14, color: "var(--action-yellow)" }}
                />
              ) : undefined
            }
            size="small"
            sx={{
              backgroundColor:
                chip.type === "region"
                  ? "var(--action-yellow-bg)"
                  : "var(--action-primary-bg)",
              color:
                chip.type === "region"
                  ? "var(--action-yellow)"
                  : "var(--primary-200)",
              fontWeight: 500,
              borderRadius: "8px",
              fontSize: 12,
            }}
          />
        ))}

        {hiddenChips.length > 0 && (
          <Tooltip
            title={
              <Box display="flex" flexDirection="column">
                {hiddenChips.map((chip, i) => (
                  <Typography key={`hidden-${i}`} variant="body2">
                    {chip.label}
                  </Typography>
                ))}
              </Box>
            }
            arrow
          >
            <Chip
              label={`+${hiddenChips.length}`}
              size="small"
              sx={{
                backgroundColor: "var(--bg-200)",
                color: "var(--text-300)",
                fontWeight: 500,
                borderRadius: "8px",
                fontSize: 12,
              }}
            />
          </Tooltip>
        )}
      </Box>

      {/* 제목 + 상태 Chip */}
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        mb={1}
      >
        <Typography
          variant="body1"
          fontWeight={600}
          sx={{
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
            textOverflow: "ellipsis",
            height: "3rem",
          }}
        >
          {lectureTitle}
        </Typography>

        {status && statusMap[status] && (
          <Chip
            label={statusMap[status].label}
            size="small"
            sx={{
              bgcolor: statusMap[status].bg,
              color: statusMap[status].color,
              fontWeight: 600,
              fontSize: 13,
              borderRadius: "8px",
              px: 1.5,
              height: 30,
            }}
          />
        )}
      </Stack>

      {/* 수업료 */}
      <Typography variant="body2" color="var(--text-300)">
        수업료 | {formatPriceKRW(price)}
      </Typography>
    </Card>
  );
}
