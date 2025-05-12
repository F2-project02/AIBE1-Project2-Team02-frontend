import { useState } from "react";
import { Box, Card, Avatar, Typography, Stack, Button } from "@mui/material";
import GradientButton from "../../../Button/GradientButton";
import RejectReasonModal from "./RejectReasonModal";
import { approveApplication } from "../../../../lib/api/inquiryApi";
import useInquiryStore from "../../../../store/useInquiryStore";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import ApproveConfirmModal from "./ApproveConfirmModal";

export default function ApplicationItem({ data, showToast }) {
  const {
    applicationId,
    nickname,
    lectureTitle,
    createdAt,
    profileImage,
    requestedTimeSlot,
  } = data;
  const [openReject, setOpenReject] = useState(false);

  const { applicants, setApplicants } = useInquiryStore();
  const [openApproveModal, setOpenApproveModal] = useState(false);

  const handleApprove = async () => {
    await approveApplication(applicationId);
    const filtered = applicants.filter(
      (app) => app.applicationId !== applicationId
    );
    setApplicants(filtered);
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

        {requestedTimeSlot && (
          <>
            <Box
              mt={1}
              sx={{
                backgroundColor: "var(--bg-100)",
                borderRadius: "12px",
                display: "flex",
                alignItems: "center",
                gap: 1,
              }}
            >
              <AccessTimeIcon
                sx={{ color: "var(--primary-300)", fontSize: 18 }}
              />
              <Typography
                fontWeight={500}
                fontSize={14}
                color="var(--text-300)"
              >
                {requestedTimeSlot.dayOfWeek}요일 |{" "}
                {requestedTimeSlot.startTime} - {requestedTimeSlot.endTime}
              </Typography>
            </Box>
          </>
        )}

        {/* 버튼 */}
        <Box display="flex" justifyContent="flex-end" gap={1}>
          <Button
            variant="outlined"
            size="small"
            onClick={(e) => {
              setOpenReject(true);
            }}
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
            onClick={() => {
              setOpenApproveModal(true);
            }}
          >
            수락하기
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

      <ApproveConfirmModal
        open={openApproveModal}
        onClose={() => setOpenApproveModal(false)}
        onApprove={handleApprove}
        showToast={showToast}
      />
    </>
  );
}
