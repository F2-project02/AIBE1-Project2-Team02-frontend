import { Box, Stack, Button } from "@mui/material";

import { useEffect, useState } from "react";
import RequestedInquiryItem from "../MyRequestedInquiries/RequestedInquiryItem";
import RequestedInquirySkeleton from "../MyRequestedInquiries/RequestedInquirySkeleton";
import useInquiryStore from "../../../store/useInquiryStore";
import { getMyRequestedInquiries } from "../../../lib/api/inquiryApi";

export default function RequestedInquiriesList() {
  const {
    requestedInquiries,
    loading,
    setRequestedInquiries,
    setLoading,
    setError,
  } = useInquiryStore();

  const [isExpanded, setIsExpanded] = useState(false);

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
      {loading
        ? Array(3)
            .fill(null)
            .map((_, idx) => <RequestedInquirySkeleton key={idx} />)
        : displayedLectures.map((lecture) => (
            <RequestedInquiryItem key={lecture.applicationId} data={lecture} />
          ))}

      {/* 더보기/접기 버튼 */}
      {!loading && requestedInquiries.length > 3 && (
        <Box display="flex" justifyContent="center" mt={1}>
          <Button
            fullWidth
            variant="outlined"
            sx={{
              backgroundColor: "var(--bg-100)",
              borderRadius: "12px",
              borderColor: "var(--bg-300)",
              color: "var(--text-400)",
              fontWeight: 600,
              height: 30,
              p: 1.5,
              ":hover": {
                backgroundColor: "var(--bg-200)",
              },
            }}
            onClick={() => setIsExpanded((prev) => !prev)}
          >
            {isExpanded ? "접기" : "더보기"}
          </Button>
        </Box>
      )}
    </Stack>
  );
}
