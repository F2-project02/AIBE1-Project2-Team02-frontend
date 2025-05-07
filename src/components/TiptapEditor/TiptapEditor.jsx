// src/components/TiptapEditor/TiptapEditor.jsx
import React, { useRef, useState } from "react";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";
import TextAlign from "@tiptap/extension-text-align";
import Highlight from "@tiptap/extension-highlight";
import TextStyle from "@tiptap/extension-text-style";
import Color from "@tiptap/extension-color";
import Heading from "@tiptap/extension-heading";
import Placeholder from "@tiptap/extension-placeholder";
import { Box } from "@mui/material";

import Toolbar from "./Toolbar";
import "./editor.css";

export default function TiptapEditor({ value, onChange, placeholder }) {
  const [showDropzone, setShowDropzone] = useState(false);
  const fileInputRef = useRef(null);

  const editor = useEditor({
    content: value,
    onUpdate: ({ editor }) => {
      onChange?.(editor.getHTML());
    },
    extensions: [
      StarterKit.configure({ heading: false }),
      Underline,
      Link,
      Image,
      TextAlign.configure({ types: ["heading", "paragraph"] }),
      Highlight.configure({ multicolor: true }),
      TextStyle,
      Color,
      Heading.configure({ levels: [1, 2, 3, 4] }),
      Placeholder.configure({
        placeholder: placeholder || "내용을 입력하세요...",
      }),
    ],
  });

  const handleImageInsert = (file) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      editor?.chain().focus().setImage({ src: reader.result }).run();
    };
    reader.readAsDataURL(file);
  };

  if (!editor) return null;

  return (
    <Box className="editor-container" sx={{ width: "100%" }}>
      <Toolbar
        editor={editor}
        fileInputRef={fileInputRef}
        onImageInsert={handleImageInsert}
      />
      <EditorContent editor={editor} className="tiptap" />
    </Box>
  );
}