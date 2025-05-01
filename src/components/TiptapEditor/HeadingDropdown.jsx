// src/components/TiptapEditor/HeadingDropdown.jsx

import React from 'react'
import {
  IconButton,
  Menu,
  MenuItem,
  Tooltip,
} from '@mui/material'
import { Title, ArrowDropDown } from '@mui/icons-material'

export default function HeadingDropdown({ editor, anchorEl, onClick, onClose }) {
  return (
    <>
      <Tooltip title="Heading">
        <IconButton onClick={onClick}>
          <Title />
          <ArrowDropDown />
        </IconButton>
      </Tooltip>
      <Menu anchorEl={anchorEl} open={!!anchorEl} onClose={onClose}>
        {[1, 2, 3, 4].map((level) => (
          <MenuItem
            key={level}
            onClick={() => {
              editor.chain().focus().toggleHeading({ level }).run()
              onClose()
            }}
          >
            Heading {level}
          </MenuItem>
        ))}
      </Menu>
    </>
  )
}
