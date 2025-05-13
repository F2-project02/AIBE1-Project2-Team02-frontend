import { useState } from "react";
import { useTheme, useMediaQuery } from "@mui/material";
import { Box, Typography, Grid } from "@mui/material";
import InquiryTabs from "../components/LectureInquiries/InquiryTabs";
import RequestedInquiriesList from "../components/LectureInquiries/MyRequestedInquiries/RequestedInquiriesList";
import RegisteredInquiriesList from "../components/LectureInquiries/MyRegisteredInquiries/RegisteredInquiriesList";
import ApplicationsList from "../components/LectureInquiries/MyRegisteredInquiries/InquiryApplications/ApplicationsList";

function LectureInquiries() {
  const [activeTab, setActiveTab] = useState("requested");
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  return (
    <Box sx={{ my: 3, maxWidth: 1200, mx: "auto", px: { xs: 1, md: 0 } }}>
      <Grid container spacing={8}>
        {/* 왼쪽 영역 */}
        <Grid item xs={12} md={6}>
          <Box sx={{ width: "100%" }}>
            <Box sx={{ mb: 3 }}>
              <InquiryTabs
                value={activeTab}
                onChange={(e, newVal) => setActiveTab(newVal)}
              />
            </Box>
            {activeTab === "requested" ? (
              <RequestedInquiriesList />
            ) : (
              <RegisteredInquiriesList />
            )}
            {isMobile && activeTab === "registered" && (
              <Box mt={4}>
                <Typography variant="h6" fontWeight={600} sx={{ py: 1 }}>
                  과외 신청 리스트
                </Typography>
                <ApplicationsList />
              </Box>
            )}
          </Box>
        </Grid>

        {/* 오른쪽 영역 (데스크탑 only) */}
        {!isMobile && activeTab === "registered" && (
          <Grid item xs={12} md={6}>
            <Box sx={{ width: "100%" }}>
              <Typography variant="h6" fontWeight={600} sx={{ py: 1 }}>
                과외 신청 리스트
              </Typography>
              <ApplicationsList />
            </Box>
          </Grid>
        )}
      </Grid>
    </Box>
  );
}

export default LectureInquiries;
