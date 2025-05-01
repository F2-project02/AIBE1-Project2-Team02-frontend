// src/components/TiptapEditor/ImageDropzone.jsx

import React from 'react'
import { Box, Typography, Input } from '@mui/material'
import UploadIllustration from '../../assets/file-upload.png'

export default function ImageDropzone({ onFileSelect, inputRef }) {
  const handleDrop = (e) => {
    e.preventDefault()
    const file = e.dataTransfer.files?.[0]
    if (file?.type.startsWith('image/')) {
      onFileSelect(file)
    }
  }

  const handleClick = () => {
    inputRef?.current?.click()
  }

  return (
    <Box
      className="dropzone"
      onClick={handleClick}
      onDrop={handleDrop}
      onDragOver={(e) => e.preventDefault()}
    >
      {/* 파일 업로드 이미지 */}
      <img
        src={UploadIllustration}
        alt="이미지 업로드"
        className="dropzone-img"
      />

      {/* 텍스트 영역 */}
      <Typography component="span" variant="body2" sx={{ fontSize: '0.95rem', mb: 0.5 }}>
        <span className="dropzone-link">클릭하여 업로드</span>하거나 파일을 끌어다 놓으세요
      </Typography>
      <br />
      <Typography variant="caption" sx={{ color: '#999', fontSize: '0.75rem' }}>
        최대 파일 크기 5MB (JPG, PNG)
      </Typography>

      {/* 숨겨진 파일 input */}
      <Input
        type="file"
        inputRef={inputRef}
        onChange={(e) => {
          const file = e.target.files?.[0]
          if (file?.type.startsWith('image/')) {
            onFileSelect(file)
          }
        }}
        sx={{ display: 'none' }}
      />
    </Box>
  )
}
