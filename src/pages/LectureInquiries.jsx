import { useState } from "react";
import { Box, Typography, Grid } from "@mui/material";
import InquiryTabs from "../components/LectureInquiries/InquiryTabs";
import RequestedInquiriesList from "../components/LectureInquiries/MyRequestedInquiries/RequestedInquiriesList";
import RegisteredInquiriesList from "../components/LectureInquiries/MyRegisteredInquiries/RegisteredInquiriesList";
import ApplicationsList from "../components/LectureInquiries/MyRegisteredInquiries/InquiryApplications/ApplicationsList";

function LectureInquiries() {
  const [activeTab, setActiveTab] = useState("requested");
  const [selectedLectureId, setSelectedLectureId] = useState(null);

  // 과외 목록 탭에서만 좌/우 레이아웃 사용
  const isRegisteredTab = activeTab === "registered";

  return (
    <Box sx={{ py: 6, px: 2, maxWidth: 1200, mx: "auto" }}>
      {/* 상단 탭 영역 */}
      <Box sx={{ mb: 3, display: "flex", alignItems: "center", gap: 21 }}>
        <InquiryTabs
          value={activeTab}
          onChange={(e, newVal) => {
            setActiveTab(newVal);
            setSelectedLectureId(null); // 탭 전환 시 우측 내용 초기화
          }}
        />

        {isRegisteredTab && (
          <Typography variant="h6" fontWeight={600}>
            과외 신청 리스트
          </Typography>
        )}
      </Box>

      {isRegisteredTab ? (
        // 내가 등록한 과외 탭 - 좌우 분할 레이아웃
        <Grid container spacing={4}>
          {/* 좌측: 등록한 과외 목록 */}
          <Grid item xs={12} md={6}>
            <RegisteredInquiriesList
              onLectureClick={setSelectedLectureId}
              selectedLectureId={selectedLectureId}
            />
          </Grid>

          {/* 우측: 신청자 목록 */}
          <Grid item xs={12} md={6}>
            <Box>
              <ApplicationsList lectureId={selectedLectureId} />
            </Box>
          </Grid>
        </Grid>
      ) : (
        // 내가 신청한 과외 탭 - 전체 영역 사용
        <RequestedInquiriesList />
      )}
    </Box>
  );
}

export default LectureInquiries;
