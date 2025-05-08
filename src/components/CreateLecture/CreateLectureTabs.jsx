// src/components/CreateLecture/CreateLectureTab.jsx
import { Tabs, Tab, Box } from "@mui/material";

export default function CreateLectureTab({ value, onChange }) {
  const labels = ["기본 정보", "커리큘럼", "일정 및 지역"];

  return (
    <Box sx={{ width: "100%" }}>
      <Tabs
        value={value}
        onChange={(_, newValue) => onChange(newValue)}
        variant="scrollable"
        scrollButtons="auto"
        textColor="inherit"
        TabIndicatorProps={{
          style: { backgroundColor: "var(--primary-200)" },
        }}
      >
        {labels.map((label) => (
          <Tab
            key={label}
            label={label}
            sx={{
              fontWeight: 500,
              color: "var(--text-400)",
              "&.Mui-selected": {
                color: "var(--primary-200)",
              },
            }}
          />
        ))}
      </Tabs>
    </Box>
  );
}