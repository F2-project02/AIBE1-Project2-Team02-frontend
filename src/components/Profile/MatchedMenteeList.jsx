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
} from "@mui/material";
import {
  getMatchedMentees,
  cancelLectureMatchingByMatchId,
} from "../../lib/api/lectureApi";
import CustomToast from "../../components/common/CustomToast";
import warnGif from "../../assets/warn.gif";
import successGif from "../../assets/heartsmile.gif";

export default function MatchedMenteeList() {
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
          setMentees(response.data);
        } else {
          setError("수강생 목록을 불러오는데 실패했습니다.");
        }
      } catch (error) {
        console.error("수강생 목록 조회 오류:", error);
        setError("수강생 목록을 불러오는데 실패했습니다.");
      } finally {
        setLoading(false);
      }
    };

    fetchMatchedMentees();
  }, []);

  useEffect(() => {
    if (error) {
      showToast(error, null, "error");
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
        showToast("매칭이 성공적으로 취소되었습니다", null, "success");
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
    return (
      <Box display="flex" justifyContent="center" alignItems="center" p={4}>
        <CircularProgress />
      </Box>
    );
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
        <Typography variant="body1" color="text.secondary">
          매칭된 수강생이 없습니다.
        </Typography>
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h6" fontWeight={600} mb={3}>
        매칭된 수강생 목록
      </Typography>

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
                          key={idx}
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
                    {mentee.joinedAt
                      ? `${mentee.joinedAt[0]}-${String(
                          mentee.joinedAt[1]
                        ).padStart(2, "0")}-${String(
                          mentee.joinedAt[2]
                        ).padStart(2, "0")}`
                      : "-"}
                  </Typography>
                </TableCell>
                <TableCell sx={{ padding: "12px 16px" }}>
                  <Button
                    variant="outlined"
                    size="small"
                    color="error"
                    onClick={() => handleCancelClick(mentee)}
                    sx={{
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
      {/* 매칭 취소 확인 대화상자 */}
      <Dialog
        open={cancelDialogOpen}
        onClose={() => setCancelDialogOpen(false)}
        PaperProps={{
          sx: {
            borderRadius: "16px",
            backgroundColor: "var(--bg-100)",
            px: 2,
            py: 2,
          },
        }}
      >
        <DialogTitle sx={{ color: "var(--text-100)", fontWeight: 600 }}>
          매칭 취소 확인
        </DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ color: "var(--text-300)" }}>
            {selectedMentee?.nickname}님과의 과외 매칭을 취소하시겠습니까?
            <br />
            취소 후에는 복구할 수 없습니다.
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ justifyContent: "space-between", px: 2, pb: 2 }}>
          <Button
            onClick={() => setCancelDialogOpen(false)}
            sx={{
              color: "var(--text-300)",
              fontWeight: 500,
            }}
          >
            취소
          </Button>
          <Button
            onClick={handleConfirmCancel}
            variant="contained"
            disabled={cancelLoading}
            sx={{
              backgroundColor: "var(--action-red)",
              color: "white",
              fontWeight: 600,
              "&:hover": {
                backgroundColor: "rgba(204, 105, 105, 0.9)",
              },
            }}
          >
            {cancelLoading ? (
              <CircularProgress size={24} color="inherit" />
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
