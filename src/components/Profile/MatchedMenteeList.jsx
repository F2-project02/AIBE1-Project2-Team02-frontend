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
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
} from "@mui/material";
import CancelIcon from "@mui/icons-material/Cancel";
// import { getMatchedMentees, cancelMatching } from "../../lib/api/lectureApi";
import { getMatchedMentees } from "../../lib/api/lectureApi";
import { formatDateFromArray } from "../../utils/messageDate";

export default function MatchedMenteeList() {
  const [mentees, setMentees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
  const [selectedMentee, setSelectedMentee] = useState(null);
  const [cancelLoading, setCancelLoading] = useState(false);

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

  const handleCancelClick = (mentee) => {
    setSelectedMentee(mentee);
    setCancelDialogOpen(true);
  };

  // // 취소 확인 핸들러
  // const handleConfirmCancel = async () => {
  //   if (!selectedMentee) return;

  //   setCancelLoading(true);
  //   try {
  //     // API 호출로 매칭 취소 처리
  //     const response = await cancelMatching(selectedMentee.matchId);

  //     if (response.success) {
  //       // 성공 시 목록 다시 불러오기
  //       await fetchMentees();
  //     } else {
  //       alert(
  //         "매칭 취소 중 오류가 발생했습니다: " +
  //           (response.message || "알 수 없는 오류")
  //       );
  //     }
  //   } catch (error) {
  //     console.error("매칭 취소 오류:", error);
  //     alert(
  //       "매칭 취소 중 오류가 발생했습니다: " +
  //         (error.message || "알 수 없는 오류")
  //     );
  //   } finally {
  //     setCancelLoading(false);
  //     setCancelDialogOpen(false);
  //     setSelectedMentee(null);
  //   }
  // };

  // 취소 확인 핸들러 - API 연결 없이 임시 구현
  const handleConfirmCancel = async () => {
    if (!selectedMentee) return;

    setCancelLoading(true);

    // API 연결 대신 타이머로 로딩 시뮬레이션
    setTimeout(() => {
      // 임시로 성공 처리 - 목록에서 해당 항목만 제거
      setMentees((prev) =>
        prev.filter((m) => m.matchId !== selectedMentee.matchId)
      );

      setCancelLoading(false);
      setCancelDialogOpen(false);
      setSelectedMentee(null);

      // 성공 메시지 (선택 사항)
      alert("매칭이 취소되었습니다.");
    }, 1000); // 1초 후 완료
  };

  // 취소 대화상자 닫기 핸들러
  const handleCancelDialogClose = () => {
    setCancelDialogOpen(false);
    setSelectedMentee(null);
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
            <TableRow sx={{ backgroundColor: "var(--bg-200)" }}>
              <TableCell
                sx={{
                  padding: "12px 16px",
                  width: "130px",
                  overflow: "hidden",
                }}
              >
                수강생
              </TableCell>
              <TableCell sx={{ padding: "12px 16px", width: "200px" }}>
                과외명
              </TableCell>
              <TableCell sx={{ padding: "12px 16px", width: "130px" }}>
                시간대
              </TableCell>
              <TableCell sx={{ padding: "12px 16px", width: "110px" }}>
                매칭일
              </TableCell>
              <TableCell sx={{ padding: "12px 16px", width: "110px" }}>
                관리
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
                      ? formatDateFromArray(mentee.joinedAt).split(" ")[0]
                      : "-"}
                  </Typography>
                </TableCell>
                <TableCell sx={{ padding: "4px 8px", textAlign: "center" }}>
                  <Button
                    onClick={() => handleCancelClick(mentee)}
                    variant="outlined"
                    color="error"
                    size="small"
                    sx={{
                      color: "var(--action-red)",
                      borderColor: "var(--action-red-bg)",
                      fontSize: "0.7rem",
                      padding: "2px 8px",
                      minWidth: "60px",
                      whiteSpace: "nowrap",
                      "&:hover": {
                        backgroundColor: "var(--action-red-bg)",
                        borderColor: "var(--action-red)",
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

      {/* 취소 확인 대화상자 */}
      <Dialog
        open={cancelDialogOpen}
        onClose={handleCancelDialogClose}
        PaperProps={{
          sx: {
            borderRadius: "12px",
            padding: "8px",
          },
        }}
      >
        <DialogTitle sx={{ fontWeight: 600 }}>매칭 취소</DialogTitle>
        <DialogContent>
          <DialogContentText>
            {selectedMentee && (
              <>
                <strong>{selectedMentee.nickname}</strong> 님과의{" "}
                <strong>{selectedMentee.lectureTitle}</strong> 매칭을
                취소하시겠습니까?
                <br />
                <br />
                취소 후에는 복구할 수 없으며, 수강생에게 알림이 발송됩니다.
              </>
            )}
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ padding: "0 24px 16px 0" }}>
          <Button
            onClick={handleCancelDialogClose}
            sx={{ color: "var(--text-300)" }}
            disabled={cancelLoading}
          >
            아니오
          </Button>
          <Button
            onClick={handleConfirmCancel}
            variant="contained"
            sx={{
              backgroundColor: "var(--action-red)",
              "&:hover": {
                backgroundColor: "var(--action-red)",
                opacity: 0.9,
              },
            }}
            disabled={cancelLoading}
            autoFocus
          >
            {cancelLoading ? <CircularProgress size={24} /> : "취소하기"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
