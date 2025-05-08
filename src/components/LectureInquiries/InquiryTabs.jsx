// 📄 src/components/LectureInquiries/InquiryTabs.jsx

import { Tabs, Tab, Box } from "@mui/material";
import BookmarkIcon from "@mui/icons-material/Bookmark";
import EditIcon from "@mui/icons-material/Edit";

function InquiryTabs({ value, onChange }) {
  return (
    <Box sx={{ width: "100%", borderBottom: "none" }}>
      <Tabs
        value={value}
        onChange={onChange}
        textColor="inherit"
        TabIndicatorProps={{
          style: { backgroundColor: "var(--primary-200)", height: 2 },
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
          sx={{
            fontWeight: 500,
            fontSize: "13px",
            textTransform: "none",
            minWidth: 108,
            padding: "9px 16px",
            color: "var(--text-400)",
            "&.Mui-selected": { color: "var(--primary-200)" },
          }}
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
          sx={{
            fontWeight: 500,
            fontSize: "13px",
            textTransform: "none",
            minWidth: 108,
            padding: "9px 16px",
            color: "var(--text-400)",
            "&.Mui-selected": { color: "var(--primary-200)" },
          }}
        />
      </Tabs>
    </Box>
  );
}

export default InquiryTabs;