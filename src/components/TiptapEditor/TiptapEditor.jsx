// src/components/TiptapEditor/TiptapEditor.jsx

import React, { useRef, useState, useEffect } from "react";
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
import { Box, CircularProgress } from "@mui/material";
import axiosInstance from "../../lib/axiosInstance";

import Toolbar from "./Toolbar";
import "./editor.css";

export default function TiptapEditor({ value, onChange, placeholder }) {
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);
  const [editorContent, setEditorContent] = useState(value || "");

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
      Placeholder.configure({
        placeholder: placeholder || "내용을 입력하세요...",
      }),
    ],
    content: value,
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      setEditorContent(html);
      if (onChange) {
        onChange(html);
      }
    },
  });

  // value prop이 변경되면 에디터 내용 업데이트
  useEffect(() => {
    if (editor && value !== undefined && value !== editorContent) {
      editor.commands.setContent(value);
      setEditorContent(value);
    }
  }, [value, editor]);

  const handleImageInsert = async (file) => {
    if (!file || !editor) return;

    try {
      setUploading(true);

      const formData = new FormData();
      formData.append("file", file);
      formData.append("directory", "lecture-images");

      const response = await axiosInstance.post(
        "/api/lectures/images/upload",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.data.success) {
        const imageUrl = response.data.data;

        // 이미지 삽입
        editor.chain().focus().setImage({ src: imageUrl }).run();

        // 중요: 이미지 삽입 후 콘텐츠 변경 내용을 상위 컴포넌트에 전달
        const updatedContent = editor.getHTML();
        setEditorContent(updatedContent);

        if (onChange) {
          onChange(updatedContent);
        }
      } else {
        throw new Error(response.data.message || "이미지 업로드 실패");
      }
    } catch (error) {
      alert("이미지 업로드 중 오류가 발생했습니다");
    } finally {
      setUploading(false);
    }
  };

  if (!editor) return null;

  return (
    <Box
      className="editor-container"
      sx={{ width: "100%", position: "relative" }}
    >
      <Toolbar
        editor={editor}
        fileInputRef={fileInputRef}
        onImageInsert={handleImageInsert}
      />

      {uploading && (
        <Box
          sx={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "rgba(255, 255, 255, 0.7)",
            zIndex: 10,
          }}
        >
          <Box ml={2}>이미지 업로드 중...</Box>
        </Box>
      )}

      <EditorContent editor={editor} className="tiptap" />
    </Box>
  );
}
