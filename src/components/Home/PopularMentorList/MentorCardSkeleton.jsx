// 📄 src/components/Home/PopularMentorList/MentorCardSkeleton.jsx
import { Card, Box, Skeleton } from "@mui/material";

export default function MentorCardSkeleton() {
  return (
    <Card
      sx={{
        minWidth: 220,
        height: "100%",
        px: 2,
        py: 3,
        borderRadius: 1,
        backgroundColor: '#fefefe',
        boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
        display: "flex",
        flexDirection: "column",
        flex: 1,
        alignItems: "center",
        flexShrink: 0,
      }}
    >
      <Skeleton
        variant="circular"
        width={72}
        height={72}
        sx={{ mb: 2 }}
        animation="wave"
      />
      <Box display="flex" alignItems="center" gap={0.5}>
        <Skeleton variant="text" width={60} height={20} animation="wave" />
        <Skeleton variant="circular" width={16} height={16} animation="wave" />
      </Box>
      <Box display="flex" alignItems="center" gap={0.5} mt={0.5}>
        <Skeleton variant="circular" width={16} height={16} animation="wave" />
        <Skeleton variant="text" width={30} height={18} animation="wave" />
        <Skeleton variant="rounded" width={40} height={20} animation="wave" />
      </Box>
      <Skeleton
        variant="text"
        width={140}
        height={18}
        sx={{ mt: 1 }}
        animation="wave"
      />
      <Box mt={1.5} display="flex" flexWrap="wrap" justifyContent="center" gap={0.5}>
        {[1, 2, 3].map((i) => (
          <Skeleton
            key={i}
            variant="rounded"
            width={60}
            height={24}
            animation="wave"
          />
        ))}
      </Box>
    </Card>
  );
}