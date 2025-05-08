// 📄 src/components/LectureInquiries/InquiryTabs.jsx

import { Tabs, Tab, Box } from "@mui/material";
import BookmarkIcon from "@mui/icons-material/Bookmark";
import EditIcon from "@mui/icons-material/Edit";

function InquiryTabs({ value, onChange }) {
  return (
    <Box>
      <Tabs
        value={value}
        onChange={onChange}
        sx={{
          "& .MuiTabs-indicator": {
            height: 2,
            backgroundColor: "primary.main",
          },
          "& .MuiTab-root": {
            textTransform: "none",
            fontFamily: "Pretendard, Helvetica",
            fontSize: "13px",
            fontWeight: 500,
            letterSpacing: "0.4px",
            lineHeight: "24px",
            minWidth: "108px",
            padding: "9px 16px",
            color: "var(--text-300)",
            gap: "4px",
          },
          "& .Mui-selected": {
            color: "primary.main",
          },
        }}
      >
        <Tab
          label={
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <BookmarkIcon fontSize="small" />
              <Box component="span" sx={{ ml: 0.5 }}>
                내가 신청한 과외
              </Box>
            </Box>
          }
          value="requested"
        />
        <Tab
          label={
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <EditIcon fontSize="small" />
              <Box component="span" sx={{ ml: 0.5 }}>
                내가 등록한 과외
              </Box>
            </Box>
          }
          value="registered"
        />
      </Tabs>
    </Box>
  );
}

export default InquiryTabs;
