import { Tabs as MUITabs, Tab, Box } from "@mui/material";

export default function MessageTabs({ value, onChange }) {
  return (
    <Box>
      <MUITabs
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
          },
          "& .Mui-selected": {
            color: "primary.main",
          },
        }}
      >
        <Tab label="받은 쪽지함" />
        <Tab label="보낸 쪽지함" />
      </MUITabs>
    </Box>
  );
}
