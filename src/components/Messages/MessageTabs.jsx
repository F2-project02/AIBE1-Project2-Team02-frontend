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
            backgroundColor: "var(--primary-200)",
          },
          "& .MuiTab-root": {
            fontWeight: 500,
            color: "var(--text-400)",
          },
          "& .Mui-selected": {
            color: "var(--primary-200)",
          },
        }}
      >
        <Tab label="받은 쪽지함" />
        <Tab label="보낸 쪽지함" />
      </MUITabs>
    </Box>
  );
}
