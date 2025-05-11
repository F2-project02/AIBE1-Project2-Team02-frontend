import { useState } from "react";
import { Box, Card, Avatar, Typography, Stack, Button } from "@mui/material";
import GradientButton from "../../../Button/GradientButton";
import RejectReasonModal from "./RejectReasonModal";
import { approveApplication } from "../../../../lib/api/inquiryApi";
import useInquiryStore from "../../../../store/useInquiryStore";
import partyGif from "../../../../assets/party.gif";
import warnGif from "../../../../assets/warn.gif";

export default function ApplicationItem({ data, showToast }) {
  const { applicationId, nickname, lectureTitle, createdAt, profileImage } =
    data;
  const [openReject, setOpenReject] = useState(false);
  const [approving, setApproving] = useState(false);

  const { applicants, setApplicants } = useInquiryStore();

  const handleApprove = async () => {
    if (approving) return;
    setApproving(true);
    try {
      await approveApplication(applicationId);
      showToast("과외 신청 수락 되었어요!", partyGif);
      const filtered = applicants.filter(
        (app) => app.applicationId !== applicationId
      );
      setApplicants(filtered);
    } catch (err) {
      console.error("수락 실패:", err);
      showToast("과외 신청 수락이 실패했어요.", warnGif, "error");
    } finally {
      setApproving(false);
    }
  };

  const handleRejectSubmitted = (rejectedId) => {
    setOpenReject(false);
    const filtered = applicants.filter(
      (app) => app.applicationId !== rejectedId
    );
    setApplicants(filtered);
  };

  return (
    <>
      <Card
        sx={{
          borderRadius: "12px",
          boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.04)",
          width: 400,
          p: 2,
        }}
      >
        {/* 프로필 */}
        <Stack direction="row" alignItems="center" spacing={2} mb={1}>
          <Avatar
            src={profileImage || "/images/default-profile.svg"}
            sx={{ width: 32, height: 32 }}
          />
          <Box>
            <Typography variant="subtitle2" fontWeight={600}>
              {nickname}
            </Typography>
            <Typography variant="subtitle2" color="var(--text-300)">
              {createdAt}
            </Typography>
          </Box>
        </Stack>

        {/* 강의명 */}
        <Typography variant="body1" fontWeight={600} mb={2}>
          {lectureTitle || "강의명이 없어요."}
        </Typography>

        {/* 버튼 */}
        <Box display="flex" justifyContent="flex-end" gap={1}>
          <Button
            variant="outlined"
            size="small"
            onClick={() => setOpenReject(true)}
            sx={{
              borderRadius: "10px",
              minWidth: 80,
              fontWeight: 500,
              color: "var(--text-300)",
              borderColor: "var(--bg-300)",
            }}
          >
            반려하기
          </Button>

          <GradientButton
            size="xs"
            sx={{
              minWidth: 80,
              fontWeight: 500,
              borderRadius: "10px",
            }}
            onClick={handleApprove}
            disabled={approving}
          >
            {approving ? "처리 중..." : "수락하기"}
          </GradientButton>
        </Box>
      </Card>

      <RejectReasonModal
        open={openReject}
        onClose={() => setOpenReject(false)}
        applicationId={applicationId}
        menteeNickname={nickname}
        onRejectSubmitted={handleRejectSubmitted}
      />
    </>
  );
}
