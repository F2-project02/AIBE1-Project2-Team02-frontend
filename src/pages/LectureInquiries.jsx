import { useState } from "react";
import { Box, Typography, Grid, Paper } from "@mui/material";
import InquiryTabs from "../components/LectureInquiries/InquiryTabs";
import RequestedInquiriesList from "../components/LectureInquiries/MyRequestedInquiries/RequestedInquiriesList";
import RegisteredInquiriesList from "../components/LectureInquiries/MyRegisteredInquiries/RegisteredInquiriesList";
import ApplicationsList from "../components/LectureInquiries/MyRegisteredInquiries/InquiryApplications/ApplicationsList";

function LectureInquiries() {
  const [activeTab, setActiveTab] = useState("requested");

  return (
    <Box sx={{ mt: 3, maxWidth: 1200, mx: "auto" }}>
      <Grid container spacing={14}>
        {/* 왼쪽 영역: 탭과 목록 */}
        <Grid item xs={12} md={6}>
          {/* 탭 영역 */}
          <Box sx={{ mb: 3, display: "flex", alignItems: "center" }}>
            <InquiryTabs
              value={activeTab}
              onChange={(e, newVal) => {
                setActiveTab(newVal);
              }}
            />
          </Box>

          {/* 탭 컨텐츠 */}
          {activeTab === "requested" ? (
            <RequestedInquiriesList />
          ) : (
            <RegisteredInquiriesList />
          )}
        </Grid>

        {/* 오른쪽 영역: 신청 리스트 (등록한 과외 탭에서만 내용 표시) */}
        <Grid item xs={12} md={6}>
          {activeTab === "registered" ? (
            <Box>
              <Typography variant="h6" fontWeight={600} sx={{ py: 1 }}>
                과외 신청 리스트
              </Typography>
              <ApplicationsList />
            </Box>
          ) : (
            // 내가 신청한 과외 탭에서는 빈 공간 유지
            <Box></Box>
          )}
        </Grid>
      </Grid>
    </Box>
  );
}

export default LectureInquiries;
