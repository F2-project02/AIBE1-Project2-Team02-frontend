// 📄 src/components/LectureDetail/LectureTabs.jsx

import { useState } from "react";
import { Box, Tabs, Tab } from "@mui/material";
import LectureInfo from "./LectureInfo";
import CurriculumSection from "./CurriculumSection";
import MentorProfile from "./MentorProfile";
import ReviewSection from "./ReviewSection";

// 스켈레톤 컴포넌트
import LectureInfoSkeleton from "./skeleton/LectureInfoSkeleton";
import CurriculumSectionSkeleton from "./skeleton/CurriculumSectionSkeleton";
import MentorProfileSkeleton from "./skeleton/MentorProfileSkeleton";
import ReviewSectionSkeleton from "./skeleton/ReviewSectionSkeleton";

const tabList = [
  { label: "상세정보", value: 0 },
  { label: "커리큘럼", value: 1 },
  { label: "멘토 정보", value: 2 },
  { label: "수강 후기", value: 3 },
];

export default function LectureTabs({ lecture, loading }) {
  const [tabIndex, setTabIndex] = useState(0);

  return (
    <Box sx={{ mt: 6, width: "100%" }}>
      <Tabs
        value={tabIndex}
        onChange={(e, newValue) => setTabIndex(newValue)}
        variant="scrollable"
        scrollButtons="auto"
        textColor="inherit"
        TabIndicatorProps={{
          style: {
            backgroundColor: "var(--primary-200)",
          },
        }}
      >
        {tabList.map((tab) => (
          <Tab
            key={tab.value}
            label={tab.label}
            sx={{
              fontWeight: 600,
              color: "var(--text-300)",
              "&.Mui-selected": {
                color: "var(--primary-200)",
              },
            }}
          />
        ))}
      </Tabs>

      <Box sx={{ mt: 4 }}>
        {tabIndex === 0 &&
          (loading ? (
            <LectureInfoSkeleton />
          ) : (
            <LectureInfo description={lecture.description} />
          ))}

        {tabIndex === 1 &&
          (loading ? (
            <CurriculumSectionSkeleton />
          ) : (
            <CurriculumSection curriculum={lecture.curriculum} />
          ))}

        {tabIndex === 2 &&
          (loading ? (
            <MentorProfileSkeleton />
          ) : (
            <MentorProfile mentor={lecture.mentor} />
          ))}

        {tabIndex === 3 &&
          (loading ? (
            <ReviewSectionSkeleton />
          ) : (
            <ReviewSection reviews={lecture.reviews} />
          ))}
      </Box>
    </Box>
  );
}