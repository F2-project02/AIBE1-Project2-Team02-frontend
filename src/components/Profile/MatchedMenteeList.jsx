// src/components/Profile/MatchedMenteeList.jsx
import { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Avatar,
  Chip,
  CircularProgress,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  useTheme,
  useMediaQuery,
  Card,
  CardContent,
  Grid,
} from "@mui/material";
import {
  getMatchedMentees,
  cancelLectureMatchingByMatchId,
} from "../../lib/api/lectureApi";
import MatchedMenteeListSkeleton from "./skeletons/MatchedMenteeListSkeleton";
import CustomToast from "../../components/common/CustomToast";
import warnGif from "../../assets/warn.gif";
import thumbsupGif from "../../assets/thumbsup.gif";
import thinking from "../../assets/thinking.gif";

export default function MatchedMenteeList() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.between("sm", "md"));

  const [mentees, setMentees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
  const [selectedMentee, setSelectedMentee] = useState(null);
  const [cancelLoading, setCancelLoading] = useState(false);

  const [toastOpen, setToastOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastIcon, setToastIcon] = useState(null);
  const [toastType, setToastType] = useState("info");

  const showToast = (message, icon = null, type = "info") => {
    setToastMessage(message);
    setToastIcon(icon);
    setToastType(type);
    setToastOpen(true);
  };

  useEffect(() => {
    const fetchMatchedMentees = async () => {
      try {
        setLoading(true);
        const response = await getMatchedMentees();
        if (response.success && response.data) {
          // 백엔드에서 이미 필터링된 결과를 받으므로 추가 필터링 불필요
          setMentees(response.data);

          // 디버깅용 로그 (나중에 제거 가능)
          console.log("서버에서 받은 데이터:", response.data);
        } else {
          setError("수강생 목록을 불러오는데 실패했어요.");
        }
      } catch (error) {
        console.error("수강생 목록 조회 오류:", error);
        setError("수강생 목록을 불러오는데 실패했어요.");
      } finally {
        setLoading(false);
      }
    };

    fetchMatchedMentees();
  }, []);

  useEffect(() => {
    if (error) {
      showToast(error, warnGif, "error");
    }
  }, [error]);

  const handleCancelClick = (mentee) => {
    setSelectedMentee(mentee);
    setCancelDialogOpen(true);
  };

  const handleConfirmCancel = async () => {
    if (!selectedMentee) return;

    try {
      setCancelLoading(true);

      const response = await cancelLectureMatchingByMatchId(
        selectedMentee.matchId
      );

      if (response.success) {
        setMentees(
          mentees.filter((mentee) => mentee.matchId !== selectedMentee.matchId)
        );
        setCancelDialogOpen(false);
        setSelectedMentee(null);
        showToast("매칭이 성공적으로 취소됐어요.", thumbsupGif, "success");
      } else {
        setError(response.message || "매칭 취소에 실패했습니다.");
      }
    } catch (error) {
      console.error("매칭 취소 중 오류 발생:", error);
      setError(
        "매칭 취소 중 오류가 발생했습니다: " +
          (error.message || "알 수 없는 오류")
      );
    } finally {
      setCancelLoading(false);
    }
  };

  if (loading) {
    return <MatchedMenteeListSkeleton />;
  }

  if (error) {
    return (
      <Box p={4} textAlign="center">
        <Typography variant="body1" color="error">
          {error}
        </Typography>
      </Box>
    );
  }

  if (mentees.length === 0) {
    return (
      <Box p={4} textAlign="center">
        <Typography variant="body1" color="var(--text-300)">
          매칭된 수강생이 없습니다.
        </Typography>
      </Box>
    );
  }

  // 날짜 형식 변환 함수
  const formatDate = (dateArray) => {
    if (!dateArray) return "-";
    return `${dateArray[0]}-${String(dateArray[1]).padStart(2, "0")}-${String(
      dateArray[2]
    ).padStart(2, "0")}`;
  };

  // 모바일 뷰 - 카드 형태로 표시
  const renderMobileView = () => (
    <Box>
      {mentees.map((mentee) => (
        <Card
          key={mentee.matchId}
          variant="outlined"
          sx={{
            mb: 2,
            borderRadius: "8px",
            boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
          }}
        >
          <CardContent>
            <Box display="flex" alignItems="center" gap={2} mb={2}>
              <Avatar
                src={mentee.profileImage || "/images/default-profile.svg"}
                alt={mentee.nickname}
                sx={{ width: 48, height: 48 }}
              />
              <Box>
                <Typography fontWeight={600}>{mentee.nickname}</Typography>
                <Typography variant="body2" color="var(--text-300)">
                  {formatDate(mentee.joinedAt)}
                </Typography>
              </Box>
            </Box>

            <Typography variant="subtitle1" fontWeight={500} mb={1}>
              {mentee.lectureTitle}
            </Typography>

            <Typography variant="body2" color="var(--text-300)" mb={2}>
              시간대:
            </Typography>

            {mentee.matchedTimeSlots ? (
              <Box display="flex" flexWrap="wrap" gap={0.5} mb={2}>
                {JSON.parse(mentee.matchedTimeSlots).map((slot, idx) => (
                  <Chip
                    key={`${mentee.matchId}-${idx}`}
                    label={`${slot.dayOfWeek} ${slot.startTime}-${slot.endTime}`}
                    size="small"
                    sx={{
                      backgroundColor: "var(--action-primary-bg)",
                      color: "var(--primary-200)",
                      fontSize: 12,
                    }}
                  />
                ))}
              </Box>
            ) : (
              <Typography variant="body2" mb={2}>
                시간 정보 없음
              </Typography>
            )}

            <Button
              variant="outlined"
              fullWidth
              color="error"
              onClick={() => handleCancelClick(mentee)}
              sx={{
                mt: 1,
                borderColor: "var(--action-red)",
                color: "var(--action-red)",
                fontSize: 14,
                "&:hover": {
                  borderColor: "var(--action-red)",
                  backgroundColor: "var(--action-red-bg)",
                },
              }}
            >
              매칭 취소
            </Button>
          </CardContent>
        </Card>
      ))}
    </Box>
  );

  // 태블릿 뷰 - 그리드 형태로 표시
  const renderTabletView = () => (
    <Grid container spacing={2}>
      {mentees.map((mentee) => (
        <Grid item xs={12} sm={6} key={mentee.matchId}>
          <Card
            variant="outlined"
            sx={{
              height: "100%",
              borderRadius: "8px",
              boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
            }}
          >
            <CardContent>
              <Box display="flex" alignItems="center" gap={2} mb={2}>
                <Avatar
                  src={mentee.profileImage || "/images/default-profile.svg"}
                  alt={mentee.nickname}
                  sx={{ width: 40, height: 40 }}
                />
                <Box>
                  <Typography fontWeight={600}>{mentee.nickname}</Typography>
                  <Typography variant="body2" color="var(--text-300)">
                    {formatDate(mentee.joinedAt)}
                  </Typography>
                </Box>
              </Box>

              <Typography
                variant="subtitle1"
                fontWeight={500}
                mb={1}
                sx={{
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
              >
                {mentee.lectureTitle}
              </Typography>

              {mentee.matchedTimeSlots ? (
                <Box display="flex" flexWrap="wrap" gap={0.5} mb={2}>
                  {JSON.parse(mentee.matchedTimeSlots).map((slot, idx) => (
                    <Chip
                      key={`${mentee.matchId}-${idx}`}
                      label={`${slot.dayOfWeek} ${slot.startTime}-${slot.endTime}`}
                      size="small"
                      sx={{
                        backgroundColor: "var(--action-primary-bg)",
                        color: "var(--primary-200)",
                        fontSize: 12,
                        mb: 0.5,
                      }}
                    />
                  ))}
                </Box>
              ) : (
                <Typography variant="body2" mb={2}>
                  시간 정보 없음
                </Typography>
              )}

              <Button
                variant="outlined"
                fullWidth
                color="error"
                onClick={() => handleCancelClick(mentee)}
                sx={{
                  mt: "auto",
                  borderColor: "var(--action-red)",
                  color: "var(--action-red)",
                  fontSize: 12,
                  "&:hover": {
                    borderColor: "var(--action-red)",
                    backgroundColor: "var(--action-red-bg)",
                  },
                }}
              >
                매칭 취소
              </Button>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );

  // 데스크탑 뷰 - 테이블 형태
  const renderDesktopView = () => (
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
          {mentees.map((mentee) => (
            <TableRow key={mentee.matchId} hover>
              <TableCell sx={{ padding: "12px 16px" }}>
                <Box
                  display="flex"
                  alignItems="center"
                  gap={2}
                  sx={{
                    maxWidth: "100%",
                  }}
                >
                  <Avatar
                    src={mentee.profileImage || "/images/default-profile.svg"}
                    alt={mentee.nickname}
                    sx={{ width: 40, height: 40, flexShrink: 0 }}
                  />
                  <Typography
                    variant="body2"
                    fontWeight={500}
                    sx={{
                      width: "85px",
                      textOverflow: "ellipsis",
                      wordWrap: "break-word",
                      display: "flex",
                      alignItems: "center",
                      maxWidth: "85px",
                      wordBreak: "break-all",
                      overflowWrap: "break-word",
                      boxSizing: "border-box",
                    }}
                  >
                    {mentee.nickname}
                  </Typography>
                </Box>
              </TableCell>
              <TableCell>
                <Typography
                  variant="body2"
                  sx={{
                    maxWidth: "200px",
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    display: "block",
                  }}
                >
                  {mentee.lectureTitle}
                </Typography>
              </TableCell>
              <TableCell>
                {mentee.matchedTimeSlots ? (
                  <Box display="flex" flexWrap="wrap" gap={0.5}>
                    {JSON.parse(mentee.matchedTimeSlots).map((slot, idx) => (
                      <Chip
                        key={`${mentee.matchId}-${idx}`}
                        label={`${slot.dayOfWeek} ${slot.startTime}-${slot.endTime}`}
                        size="small"
                        sx={{
                          backgroundColor: "var(--action-primary-bg)",
                          color: "var(--primary-200)",
                          fontSize: 12,
                        }}
                      />
                    ))}
                  </Box>
                ) : (
                  "시간 정보 없음"
                )}
              </TableCell>
              <TableCell>
                <Typography variant="body2" sx={{ whiteSpace: "nowrap" }}>
                  {formatDate(mentee.joinedAt)}
                </Typography>
              </TableCell>
              <TableCell sx={{ padding: "12px 16px" }}>
                <Button
                  variant="outlined"
                  size="small"
                  color="error"
                  onClick={() => handleCancelClick(mentee)}
                  sx={{
                    borderRadius: "8px",
                    borderColor: "var(--action-red)",
                    color: "var(--action-red)",
                    fontSize: 12,
                    "&:hover": {
                      borderColor: "var(--action-red)",
                      backgroundColor: "var(--action-red-bg)",
                    },
                  }}
                >
                  매칭 취소
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );

  return (
    <Box>
      <Typography
        variant="h6"
        fontWeight={600}
        mb={3}
        sx={{ fontSize: "1.25rem" }}
      >
        매칭된 수강생 목록
      </Typography>

      {isMobile
        ? renderMobileView()
        : isTablet
        ? renderTabletView()
        : renderDesktopView()}

      {/* 매칭 취소 확인 대화상자 */}
      <Dialog
        open={cancelDialogOpen}
        onClose={() => setCancelDialogOpen(false)}
        PaperProps={{
          sx: {
            borderRadius: "16px",
            backgroundColor: "var(--bg-100)",
            px: isMobile ? 1 : 2,
            py: isMobile ? 1 : 2,
            width: isMobile ? "90%" : "auto",
            maxWidth: isMobile ? "none" : undefined,
          },
        }}
      >
        <DialogTitle
          sx={{
            color: "var(--text-100)",
            fontWeight: 600,
            fontSize: isMobile ? "1.1rem" : "1.25rem",
            pt: isMobile ? 2 : 3,
          }}
        >
          매칭 취소 확인
        </DialogTitle>
        <DialogContent>
          <Box
            component="img"
            src={thinking}
            alt="경고"
            sx={{
              display: "block",
              mx: "auto",
              my: 2,
              width: 80,
              height: 80,
              borderRadius: "8px",
            }}
          />
          <DialogContentText
            sx={{
              color: "var(--text-300)",
              fontSize: isMobile ? "0.9rem" : "1rem",
              textAlign: "center",
            }}
          >
            {selectedMentee?.nickname}님과의 과외 매칭을 취소하시겠어요?
            <br />
            취소 후에는 복구할 수 없어요.
          </DialogContentText>
        </DialogContent>
        <DialogActions
          sx={{
            justifyContent: "center",
            px: isMobile ? 1 : 2,
            pb: isMobile ? 2 : 3,
          }}
        >
          <Button
            onClick={() => setCancelDialogOpen(false)}
            sx={{
              borderRadius: "8px",
              color: "var(--text-300)",
              fontWeight: 500,
              fontSize: isMobile ? "0.875rem" : "0.95rem",
            }}
          >
            취소
          </Button>
          <Button
            onClick={handleConfirmCancel}
            variant="contained"
            disabled={cancelLoading}
            sx={{
              borderRadius: "8px",
              backgroundColor: "var(--action-red)",
              color: "var(--bg-100)",
              boxShadow: "none",
              fontWeight: 500,
              fontSize: isMobile ? "0.875rem" : "0.95rem",
              "&:hover": {
                boxShadow: "none",
                backgroundColor: "rgba(204, 105, 105, 0.9)",
              },
            }}
          >
            {cancelLoading ? (
              <CircularProgress size={isMobile ? 20 : 24} color="inherit" />
            ) : (
              "매칭 취소"
            )}
          </Button>
        </DialogActions>
      </Dialog>
      <CustomToast
        open={toastOpen}
        onClose={() => setToastOpen(false)}
        message={toastMessage}
        iconSrc={toastIcon}
        type={toastType}
      />
    </Box>
  );
}
