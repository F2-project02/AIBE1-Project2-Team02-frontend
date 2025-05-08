import { Box, Stack, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import ApplicationItem from "./ApplicationItem";
import ApplicationItemSkeleton from "./ApplicationItemSkeleton";
import useInquiryStore from "../../../../store/useInquiryStore";
import { getLectureApplicants } from "../../../../lib/api/inquiryApi";

export default function ApplicationsList({ lectureId }) {
  const {
    applicants,
    applicantsLoading,
    setApplicants,
    setApplicantsLoading,
    setApplicantsError,
  } = useInquiryStore();

  useEffect(() => {
    if (!lectureId) {
      setApplicants([]);
      setApplicantsLoading(false);
      return;
    }

    const fetchApplicants = async () => {
      setApplicantsLoading(true);
      try {
        const data = await getLectureApplicants(lectureId);
        setApplicants(data);
      } catch (err) {
        console.error("신청자 조회 실패:", err);
        setApplicantsError(err);
      } finally {
        setApplicantsLoading(false);
      }
    };

    fetchApplicants();
  }, [lectureId, setApplicants, setApplicantsLoading, setApplicantsError]);

  if (!lectureId) {
    return (
      <Box
        sx={{
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "var(--bg-100)",
          borderRadius: 1,
          p: 4,
          minHeight: 200,
        }}
      >
        <Typography variant="body1" color="text.secondary" align="center">
          왼쪽에서 강의를 선택하면
          <br />
          신청자 목록이 여기에 표시됩니다
        </Typography>
      </Box>
    );
  }

  if (!lectureId) {
    return (
      <Box
        sx={{
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "var(--bg-100)",
          borderRadius: 1,
          p: 4,
          minHeight: 200,
        }}
      >
        <Typography variant="body1" color="text.secondary" align="center">
          왼쪽에서 강의를 선택하면
          <br />
          신청자 목록이 여기에 표시됩니다
        </Typography>
      </Box>
    );
  }

  return (
    <Stack spacing={2}>
      {applicantsLoading ? (
        Array(2)
          .fill(null)
          .map((_, i) => <ApplicationItemSkeleton key={i} />)
      ) : applicants.length > 0 ? (
        applicants.map((item) => (
          <ApplicationItem key={item.applicationId} data={item} />
        ))
      ) : (
        <Box
          sx={{
            p: 3,
            backgroundColor: "var(--bg-100)",
            borderRadius: 1,
            textAlign: "center",
          }}
        >
          <Typography variant="body1" color="text.secondary">
            아직 신청자가 없습니다
          </Typography>
        </Box>
      )}
    </Stack>
  );
}
