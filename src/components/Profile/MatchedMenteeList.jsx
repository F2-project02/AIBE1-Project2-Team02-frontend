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
} from "@mui/material";
import { getMatchedMentees } from "../../lib/api/lectureApi";
import { formatDateFromArray } from "../../utils/messageDate";

export default function MatchedMenteeList() {
  const [mentees, setMentees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: "var(--bg-200)" }}>
              <TableCell>수강생</TableCell>
              <TableCell>과외명</TableCell>
              <TableCell>시간대</TableCell>
              <TableCell>매칭일</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {mentees.map((mentee) => (
              <TableRow key={mentee.matchId} hover>
                <TableCell>
                  <Box display="flex" alignItems="center" gap={2}>
                    <Avatar
                      src={mentee.profileImage || "/images/default-profile.svg"}
                      alt={mentee.nickname}
                      sx={{ width: 40, height: 40 }}
                    />
                    <Typography variant="body2" fontWeight={500}>
                      {mentee.nickname}
                    </Typography>
                  </Box>
                </TableCell>
                <TableCell>{mentee.lectureTitle}</TableCell>
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
                  {mentee.joinedAt
                    ? formatDateFromArray(mentee.joinedAt).split(" ")[0]
                    : "-"}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}
