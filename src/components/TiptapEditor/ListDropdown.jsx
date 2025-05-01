// src/components/TiptapEditor/ListDropDown.jsx

import React from 'react'
import {
  IconButton,
  Menu,
  MenuItem,
  Tooltip,
} from '@mui/material'
import {
  FormatListBulleted,
  FormatListNumbered,
  ArrowDropDown,
} from '@mui/icons-material'

export default function ListDropdown({ editor, anchorEl, onClick, onClose }) {
  return (
    <>
      <Tooltip title="List">
        <IconButton onClick={onClick}>
          <FormatListBulleted />
          <ArrowDropDown />
        </IconButton>
      </Tooltip>
      <Menu anchorEl={anchorEl} open={!!anchorEl} onClose={onClose}>
        <MenuItem
          onClick={() => {
            editor.chain().focus().toggleBulletList().run()
            onClose()
          }}
        >
          <FormatListBulleted sx={{ mr: 1 }} />
          Bullet
        </MenuItem>
        <MenuItem
          onClick={() => {
            editor.chain().focus().toggleOrderedList().run()
            onClose()
          }}
        >
          <FormatListNumbered sx={{ mr: 1 }} />
          Ordered
        </MenuItem>
      </Menu>
    </>
  )
}
