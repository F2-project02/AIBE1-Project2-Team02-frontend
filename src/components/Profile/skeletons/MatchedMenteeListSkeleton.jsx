// src/components/Profile/skeletons/MatchedMenteeListSkeleton.jsx
import React from "react";
import {
  Box,
  Typography,
  Skeleton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Card,
  CardContent,
  Grid,
  useTheme,
  useMediaQuery,
} from "@mui/material";

export default function MatchedMenteeListSkeleton() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.between("sm", "md"));

  // 모바일용 스켈레톤 UI
  const renderMobileSkeleton = () => {
    return (
      <Box>
        {[1, 2, 3].map((item) => (
          <Card
            key={item}
            variant="outlined"
            sx={{
              mb: 2,
              borderRadius: "8px",
              boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
            }}
          >
            <CardContent>
              {/* 프로필 및 닉네임 */}
              <Box display="flex" alignItems="center" gap={2} mb={2}>
                <Skeleton
                  variant="circular"
                  width={48}
                  height={48}
                  animation="wave"
                />
                <Box>
                  <Skeleton
                    variant="text"
                    width={80}
                    height={24}
                    animation="wave"
                  />
                  <Skeleton
                    variant="text"
                    width={120}
                    height={18}
                    animation="wave"
                  />
                </Box>
              </Box>

              {/* 과외명 */}
              <Skeleton
                variant="text"
                width="90%"
                height={28}
                animation="wave"
                sx={{ mb: 2 }}
              />

              {/* 시간대 텍스트 */}
              <Skeleton
                variant="text"
                width={60}
                height={20}
                animation="wave"
                sx={{ mb: 1 }}
              />

              {/* 시간대 칩 */}
              <Box display="flex" flexWrap="wrap" gap={0.5} mb={2}>
                <Skeleton
                  variant="rounded"
                  width={120}
                  height={24}
                  animation="wave"
                  sx={{ borderRadius: 4 }}
                />
                <Skeleton
                  variant="rounded"
                  width={140}
                  height={24}
                  animation="wave"
                  sx={{ borderRadius: 4 }}
                />
              </Box>

              {/* 버튼 */}
              <Skeleton
                variant="rounded"
                width="100%"
                height={36}
                animation="wave"
                sx={{ mt: 1 }}
              />
            </CardContent>
          </Card>
        ))}
      </Box>
    );
  };

  // 태블릿용 스켈레톤 UI
  const renderTabletSkeleton = () => {
    return (
      <Grid container spacing={2}>
        {[1, 2, 3, 4].map((item) => (
          <Grid item xs={12} sm={6} key={item}>
            <Card
              variant="outlined"
              sx={{
                height: "100%",
                borderRadius: "8px",
                boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
              }}
            >
              <CardContent>
                {/* 프로필 및 닉네임 */}
                <Box display="flex" alignItems="center" gap={2} mb={2}>
                  <Skeleton
                    variant="circular"
                    width={40}
                    height={40}
                    animation="wave"
                  />
                  <Box>
                    <Skeleton
                      variant="text"
                      width={70}
                      height={22}
                      animation="wave"
                    />
                    <Skeleton
                      variant="text"
                      width={100}
                      height={16}
                      animation="wave"
                    />
                  </Box>
                </Box>

                {/* 과외명 */}
                <Skeleton
                  variant="text"
                  width="85%"
                  height={26}
                  animation="wave"
                  sx={{ mb: 2 }}
                />

                {/* 시간대 칩 */}
                <Box display="flex" flexWrap="wrap" gap={0.5} mb={2}>
                  <Skeleton
                    variant="rounded"
                    width={110}
                    height={22}
                    animation="wave"
                    sx={{ borderRadius: 4, mb: 0.5 }}
                  />
                  <Skeleton
                    variant="rounded"
                    width={130}
                    height={22}
                    animation="wave"
                    sx={{ borderRadius: 4, mb: 0.5 }}
                  />
                </Box>

                {/* 버튼 */}
                <Skeleton
                  variant="rounded"
                  width="100%"
                  height={32}
                  animation="wave"
                  sx={{ mt: 1 }}
                />
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    );
  };

  // 데스크탑용 스켈레톤 UI
  const renderDesktopSkeleton = () => {
    return (
      <TableContainer component={Paper} variant="outlined">
        <Table sx={{ tableLayout: "fixed" }} size="medium">
          <TableHead>
            <TableRow
              sx={{
                backgroundColor: "var(--bg-200)",
                "& .MuiTableCell-head": {
                  textAlign: "center",
                },
              }}
            >
              <TableCell
                sx={{
                  padding: "12px 16px",
                  width: "130px",
                  overflow: "hidden",
                }}
              >
                수강생
              </TableCell>
              <TableCell sx={{ padding: "12px 16px", width: "160px" }}>
                과외명
              </TableCell>
              <TableCell sx={{ padding: "12px 16px", width: "130px" }}>
                시간대
              </TableCell>
              <TableCell sx={{ padding: "12px 16px", width: "110px" }}>
                매칭일
              </TableCell>
              <TableCell sx={{ padding: "12px 16px", width: "90px" }}>
                취소
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {[1, 2, 3, 4, 5].map((item) => (
              <TableRow key={item} hover>
                <TableCell sx={{ padding: "12px 16px" }}>
                  <Box
                    display="flex"
                    alignItems="center"
                    gap={2}
                    sx={{
                      maxWidth: "100%",
                    }}
                  >
                    <Skeleton
                      variant="circular"
                      width={40}
                      height={40}
                      animation="wave"
                    />
                    <Skeleton
                      variant="text"
                      width={70}
                      height={20}
                      animation="wave"
                    />
                  </Box>
                </TableCell>
                <TableCell>
                  <Skeleton
                    variant="text"
                    width="90%"
                    height={20}
                    animation="wave"
                  />
                </TableCell>
                <TableCell>
                  <Box display="flex" flexWrap="wrap" gap={0.5}>
                    <Skeleton
                      variant="rounded"
                      width={100}
                      height={22}
                      animation="wave"
                      sx={{ borderRadius: 4 }}
                    />
                  </Box>
                </TableCell>
                <TableCell>
                  <Skeleton
                    variant="text"
                    width={80}
                    height={20}
                    animation="wave"
                  />
                </TableCell>
                <TableCell sx={{ padding: "12px 16px" }}>
                  <Skeleton
                    variant="rounded"
                    width={80}
                    height={30}
                    animation="wave"
                    sx={{ borderRadius: 1 }}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    );
  };

  return (
    <Box>
      {/* 제목 스켈레톤 */}
      <Skeleton
        variant="text"
        width={180}
        height={36}
        animation="wave"
        sx={{ mx: "auto", mb: 3 }}
      />

      {/* 화면 크기별 스켈레톤 렌더링 */}
      {isMobile
        ? renderMobileSkeleton()
        : isTablet
        ? renderTabletSkeleton()
        : renderDesktopSkeleton()}
    </Box>
  );
}
