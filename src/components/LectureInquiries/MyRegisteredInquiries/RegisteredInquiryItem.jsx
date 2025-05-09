import {
  Box,
  Typography,
  Avatar,
  Chip,
  Stack,
  Card,
  Tooltip,
  Switch,
} from "@mui/material";
import StarIcon from "@mui/icons-material/Star";
import ShieldIcon from "@mui/icons-material/VerifiedUser";
import LocationOnIcon from "@mui/icons-material/LocationOn";

export default function MyRegisteredLectureItem({
  data,
  isSelected,
  onToggle,
}) {
  const {
    lectureId,
    lectureTitle,
    price,
    averageRating,
    preferredRegions,
    subcategory,
    profile_image,
    nickname,
    isCertified,
  } = data;

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

  function formatPriceKRW(price) {
    if (price === 0) return "무료";
    return price < 10000
      ? `${price.toLocaleString()}원`
      : `${Math.floor(price / 10000).toLocaleString()}만원`;
  }

  const handleToggle = () => {
    onToggle(lectureId);
  };

  return (
    <Card
      sx={{
        width: "100%",
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
        mb: 2,
      }}
    >
      {/* 프로필 */}
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

      {/* 제목 + 스위치 */}
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

        <Switch
          checked={isSelected}
          onChange={handleToggle}
          color="primary"
          sx={{ ml: 2 }}
        />
      </Stack>

      {/* 수업료 */}
      <Typography variant="body2" color="var(--text-300)">
        수업료 | {formatPriceKRW(price)}
      </Typography>
    </Card>
  );
}
