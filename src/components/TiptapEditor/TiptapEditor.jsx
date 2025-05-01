// src/components/TiptapEditor/TiptapEditor.jsx

import React, { useRef, useState } from 'react'
import { EditorContent, useEditor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Underline from '@tiptap/extension-underline'
import Link from '@tiptap/extension-link'
import Image from '@tiptap/extension-image'
import TextAlign from '@tiptap/extension-text-align'
import Highlight from '@tiptap/extension-highlight'
import TextStyle from '@tiptap/extension-text-style'
import Color from '@tiptap/extension-color'
import Heading from '@tiptap/extension-heading'
import { Box } from '@mui/material'

import Toolbar from './Toolbar'
import ImageDropzone from './ImageDropzone'
import './editor.css'

export default function TiptapEditor() {
  const [showDropzone, setShowDropzone] = useState(false)
  const fileInputRef = useRef(null)

  const editor = useEditor({
    extensions: [
      StarterKit.configure({ heading: false }),
      Underline,
      Link,
      Image,
      TextAlign.configure({ types: ['heading', 'paragraph'] }),
      Highlight.configure({ multicolor: true }),
      TextStyle,
      Color,
      Heading.configure({ levels: [1, 2, 3, 4] }),
    ],
    content: '<p>멘토스는 아직 테스팅중이에요... :)</p>',
  })

  // 이미지 삽입 로직 (커서 위치에 삽입)
  const handleImageInsert = (file) => {
    const reader = new FileReader()
    reader.onloadend = () => {
      editor?.chain().focus().setImage({ src: reader.result }).run()
    }
    reader.readAsDataURL(file)
  }

  if (!editor) return null

  return (
    <Box className="editor-container" sx={{ width: '100%' }}>
      <Toolbar
        editor={editor}
        onOpenDropzone={() => setShowDropzone(true)}
        fileInputRef={fileInputRef}
      />

      <EditorContent editor={editor} />

      {showDropzone && (
        <ImageDropzone
          inputRef={fileInputRef}
          onFileSelect={handleImageInsert}
          onClose={() => setShowDropzone(false)}
        />
      )}
    </Box>
  )
}
