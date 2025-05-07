// src/components/common/SelectableButtonGroup.jsx
import { Box, Button } from "@mui/material";

export default function SelectableButtonGroup({ items, selected, onSelect }) {
  return (
    <Box display="flex" gap={1}>
      {items.map((item) => (
        <Button
          key={item}
          variant={selected === item ? "contained" : "outlined"}
          onClick={() => onSelect(item)}
          sx={{
            flex: 1, // 한 줄에 균등하게 분할
            height: 40,
            minWidth: 0,
            borderRadius: "8px",
            border: "none",
            color: selected === item ? "var(--primary-300)" : "var(--text-300)",
            bgcolor:
              selected === item ? "var(--action-primary-bg)" : "var(--bg-200)",
            "&:hover": {
              bgcolor:
                selected === item
                  ? "var(--action-primary-bg)"
                  : "var(--bg-300)",
            },
          }}
        >
          {item}
        </Button>
      ))}
    </Box>
  );
}