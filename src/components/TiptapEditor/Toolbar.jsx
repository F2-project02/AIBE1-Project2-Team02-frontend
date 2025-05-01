// src/components/TiptapEditor/Toolbar.jsx

import React, { useState } from 'react'
import { Box, IconButton, Tooltip } from '@mui/material'
import {
  FormatBold, FormatItalic, FormatUnderlined,
  FormatAlignLeft, FormatAlignCenter, FormatAlignRight, FormatAlignJustify,
  Image as ImageIcon,
} from '@mui/icons-material'

import HeadingDropdown from './HeadingDropdown'
import ListDropdown from './ListDropdown'
import HighlightPopover from './HighlightPopover'

export default function Toolbar({ editor, onOpenDropzone }) {
  const [anchorHeading, setAnchorHeading] = useState(null)
  const [anchorList, setAnchorList] = useState(null)
  const [anchorHighlight, setAnchorHighlight] = useState(null)

  return (
    <Box className="toolbar">
      <HeadingDropdown
        editor={editor}
        anchorEl={anchorHeading}
        onClick={(e) => setAnchorHeading(e.currentTarget)}
        onClose={() => setAnchorHeading(null)}
      />

      <ListDropdown
        editor={editor}
        anchorEl={anchorList}
        onClick={(e) => setAnchorList(e.currentTarget)}
        onClose={() => setAnchorList(null)}
      />

      <Tooltip title="Bold">
        <IconButton onClick={() => editor.chain().focus().toggleBold().run()}>
          <FormatBold />
        </IconButton>
      </Tooltip>
      <Tooltip title="Italic">
        <IconButton onClick={() => editor.chain().focus().toggleItalic().run()}>
          <FormatItalic />
        </IconButton>
      </Tooltip>
      <Tooltip title="Underline">
        <IconButton onClick={() => editor.chain().focus().toggleUnderline().run()}>
          <FormatUnderlined />
        </IconButton>
      </Tooltip>

      <HighlightPopover
        editor={editor}
        anchorEl={anchorHighlight}
        onClick={(e) => setAnchorHighlight(e.currentTarget)}
        onClose={() => setAnchorHighlight(null)}
      />

      <Tooltip title="Left">
        <IconButton onClick={() => editor.chain().focus().setTextAlign('left').run()}>
          <FormatAlignLeft />
        </IconButton>
      </Tooltip>
      <Tooltip title="Center">
        <IconButton onClick={() => editor.chain().focus().setTextAlign('center').run()}>
          <FormatAlignCenter />
        </IconButton>
      </Tooltip>
      <Tooltip title="Right">
        <IconButton onClick={() => editor.chain().focus().setTextAlign('right').run()}>
          <FormatAlignRight />
        </IconButton>
      </Tooltip>
      <Tooltip title="Justify">
        <IconButton onClick={() => editor.chain().focus().setTextAlign('justify').run()}>
          <FormatAlignJustify />
        </IconButton>
      </Tooltip>

      <Tooltip title="Add image">
        <IconButton onClick={onOpenDropzone}>
          <ImageIcon />
        </IconButton>
      </Tooltip>
    </Box>
  )
}
