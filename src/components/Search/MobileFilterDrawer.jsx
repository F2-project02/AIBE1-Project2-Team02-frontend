// 📄 components/Search/MobileFilterDrawer.jsx
import { Drawer, Box, IconButton, Typography, Divider } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

export default function MobileFilterDrawer({ open, onClose, children }) {
  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: {
          width: "80vw",
          maxWidth: 360,
          p: 3,
          backgroundColor: "var(--bg-100)",
          borderTopLeftRadius: "16px",
          borderBottomLeftRadius: "16px",
        },
      }}
    >
      <Box
        display="flex"
        alignItems="center"
        justifyContent="space-between"
        mb={2}
      >
        <Typography fontSize={18} fontWeight={600}>
          필터
        </Typography>
        <IconButton onClick={onClose}>
          <CloseIcon />
        </IconButton>
      </Box>
      {children}
    </Drawer>
  );
}