// 📄 src/components/Home/PopularMentorList/MentorCtaCardSkeleton.jsx

import { Card, Skeleton, Box } from "@mui/material";

export default function MentorCtaCardSkeleton() {
  return (
    <Card
      sx={{
        width: "100%",
        height: "100%",
        minHeight: 250,
        px: 2,
        py: 3,
        borderRadius: 1,
        backgroundColor: '#fefefe',
        boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.05)",
        background:
          "linear-gradient(225deg, rgba(91, 141, 239, 0.10) 0%, rgba(91, 141, 239, 0.02) 100%)",
        outline: "1px solid var(--bg-200)",
        outlineOffset: "-1px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        alignItems: "flex-start",
      }}
    >
      <Box flexGrow={1} width="100%" display="flex" flexDirection="column" justifyContent="center">
        <Skeleton variant="text" width="60%" height={24} sx={{ mx: "auto" }} />
        <Skeleton variant="text" width="80%" height={20} sx={{ mx: "auto" }} />
      </Box>
      <Box width="100%" display="flex" justifyContent="center">
        <Skeleton variant="rounded" width={100} height={36} sx={{ borderRadius: 2 }} />
      </Box>
    </Card>
  );
}