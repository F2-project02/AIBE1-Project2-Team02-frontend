// src/components/TiptapEditor/HighlightPopover.jsx

import React from "react";
import { IconButton, Tooltip, Popover, Box } from "@mui/material";
import { FormatColorFill } from "@mui/icons-material";

// 파스텔톤 하이라이트 색상
const HIGHLIGHT_COLORS = [
  "#FFEBEE", // 연핑크
  "#FFF9C4", // 연노랑
  "#E1F5FE", // 연하늘
  "#E8F5E9", // 연연두
  "#F3E5F5", // 연보라
];

export default function HighlightPopover({
  editor,
  anchorEl,
  onClick,
  onClose,
}) {
  return (
    <>
      <Tooltip title="Highlight">
        <IconButton onClick={onClick}>
          <FormatColorFill />
        </IconButton>
      </Tooltip>

      <Popover
        open={!!anchorEl}
        anchorEl={anchorEl}
        onClose={onClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
      >
        <Box sx={{ display: "flex", p: 1, gap: 1 }}>
          {HIGHLIGHT_COLORS.map((color) => (
            <Box
              key={color}
              onClick={() => {
                editor.chain().focus().toggleHighlight({ color }).run();
                onClose();
              }}
              sx={{
                width: 24,
                height: 24,
                borderRadius: "50%",
                backgroundColor: color,
                cursor: "pointer",
                border: editor.isActive("highlight", { color })
                  ? "2px solid black"
                  : "1px solid #ccc",
              }}
            />
          ))}
          <Box
            onClick={() => {
              editor.chain().focus().unsetHighlight().run();
              onClose();
            }}
            sx={{
              width: 24,
              height: 24,
              borderRadius: "50%",
              border: "1px solid #ccc",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 12,
              cursor: "pointer",
            }}
          >
            ⛌
          </Box>
        </Box>
      </Popover>
    </>
  );
}
