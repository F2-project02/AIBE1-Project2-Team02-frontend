import { Box, Stack, Button } from "@mui/material";

import { useEffect, useState } from "react";
import RequestedInquiryItem from "../MyRequestedInquiries/RequestedInquiryItem";
import RequestedInquirySkeleton from "../MyRequestedInquiries/RequestedInquirySkeleton";
import useInquiryStore from "../../../store/useInquiryStore";
import { getMyRequestedInquiries } from "../../../lib/api/inquiryApi";
import MoreButton from "../MoreButton";

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
        <MoreButton isExpanded={isExpanded} onClick={handleToggle} />
      )}
    </Stack>
  );
}
