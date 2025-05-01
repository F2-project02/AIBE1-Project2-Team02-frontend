// src/components/TiptapEditor/Toolbar.jsx

import React, { useState } from 'react'
import { Box, IconButton, Tooltip, Input } from '@mui/material'
import {
  FormatBold, FormatItalic, FormatUnderlined,
  FormatAlignLeft, FormatAlignCenter, FormatAlignRight, FormatAlignJustify,
  Image as ImageIcon,
} from '@mui/icons-material'

import HeadingDropdown from './HeadingDropdown'
import ListDropdown from './ListDropdown'
import HighlightPopover from './HighlightPopover'

export default function Toolbar({ editor, onImageInsert, fileInputRef }) {
  const [anchorHeading, setAnchorHeading] = useState(null)
  const [anchorList, setAnchorList] = useState(null)
  const [anchorHighlight, setAnchorHighlight] = useState(null)

  const handleClickUpload = () => {
    fileInputRef.current?.click()
  }

  const validateAndInsertImage = (file) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif']
    const maxSize = 5 * 1024 * 1024 // 5MB

    if (!allowedTypes.includes(file.type)) {
      alert('지원되지 않는 이미지 형식입니다. (JPG, PNG, WEBP, GIF만 가능합니다.)')
      return
    }

    if (file.size > maxSize) {
      alert('파일 크기가 5MB를 초과했습니다.')
      return
    }

    onImageInsert(file)
  }

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

      <Tooltip title="Insert Image">
        <IconButton onClick={handleClickUpload}>
          <ImageIcon />
        </IconButton>
      </Tooltip>

      {/* 숨겨진 파일 input */}
      <Input
        type="file"
        inputRef={fileInputRef}
        onChange={(e) => {
          const file = e.target.files?.[0]
          if (file) {
            validateAndInsertImage(file)
          }
        }}
        sx={{ display: 'none' }}
      />
    </Box>
  )
}
