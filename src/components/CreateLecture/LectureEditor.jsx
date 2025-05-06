// src/components/CreateLecture/LectureEditor.jsx

import React, { useRef } from "react";
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
import { Box } from "@mui/material";

import Toolbar from "../TiptapEditor/Toolbar";
import "../TiptapEditor/editor.css";

export default function LectureEditor({ value, onChange, placeholder }) {
  const fileInputRef = useRef(null);

  const editor = useEditor({
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
    ],
    content: value || "",
    editorProps: {
      attributes: {
        class: "ProseMirror",
        "data-placeholder": placeholder || "",
      },
    },
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      onChange?.(html);
    },
  });

  // 이미지 삽입 로직 (커서 위치에 삽입)
  const handleImageInsert = (file) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      editor?.chain().focus().setImage({ src: reader.result }).run();
    };
    reader.readAsDataURL(file);
  };

  if (!editor) return null;

  return (
    <Box
      className="editor-container"
      sx={{
        width: "100%",
        border: "1px solid",
        borderColor: "var(--bg-300)",
        borderRadius: 2,
        overflow: "hidden",
      }}
    >
      <Toolbar
        editor={editor}
        fileInputRef={fileInputRef}
        onImageInsert={handleImageInsert}
      />

      <EditorContent
        editor={editor}
        style={{
          minHeight: "200px",
          padding: "16px",
        }}
      />
    </Box>
  );
}
