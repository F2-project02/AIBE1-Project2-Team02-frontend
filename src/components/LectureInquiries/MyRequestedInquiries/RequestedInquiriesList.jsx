import { Box, Stack, Typography } from "@mui/material";

import { useEffect, useState } from "react";
import RequestedInquiryItem from "../MyRequestedInquiries/RequestedInquiryItem";
import RequestedInquirySkeleton from "../MyRequestedInquiries/RequestedInquirySkeleton";
import useInquiryStore from "../../../store/useInquiryStore";
import { getMyRequestedInquiries } from "../../../lib/api/inquiryApi";
import MoreButton from "../MoreButton";
import { useNavigate } from "react-router-dom";

export default function RequestedInquiriesList() {
  const {
    requestedInquiries,
    loading,
    setRequestedInquiries,
    setLoading,
    setError,
  } = useInquiryStore();

  const [isExpanded, setIsExpanded] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchInquiries = async () => {
      setLoading(true);
      try {
        const data = await getMyRequestedInquiries();
        setRequestedInquiries(data);
      } catch (err) {
        console.error("신청한 과외 목록 조회 실패:", err);
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchInquiries();
  }, [setLoading, setRequestedInquiries, setError]);

  const displayedLectures = isExpanded
    ? requestedInquiries
    : requestedInquiries.slice(0, 3);

  const handleToggle = () => {
    setIsExpanded((prev) => !prev);
  };

  return (
    <Stack>
      {loading ? (
        Array(3)
          .fill(null)
          .map((_, idx) => <RequestedInquirySkeleton key={idx} />)
      ) : requestedInquiries.length === 0 ? (
        <Box
          onClick={() => navigate("/search")}
          sx={{
            width: 400,
            minHeight: 220,
            px: 2,
            py: 3,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "column",
            bgcolor: "#f9f9f9",
            borderRadius: 2,
            border: "1px dashed var(--bg-300)",
            color: "var(--text-300)",
            fontWeight: 500,
            textAlign: "center",
            cursor: "pointer",
            transition: "all 0.2s",
            "&:hover": {
              backgroundColor: "var(--bg-100)",
            },
          }}
        >
          <Typography variant="body1" fontWeight={600}>
            신청한 과외가 없습니다.
          </Typography>
          <Typography variant="body2" color="var(--text-400)" mt={1}>
            과외를 찾아 신청해보세요!
          </Typography>
        </Box>
      ) : (
        displayedLectures.map((lecture) => (
          <RequestedInquiryItem key={lecture.applicationId} data={lecture} />
        ))
      )}

      {/* 더보기/접기 버튼 */}
      {!loading && requestedInquiries.length > 3 && (
        <MoreButton isExpanded={isExpanded} onClick={handleToggle} />
      )}
    </Stack>
  );
}
