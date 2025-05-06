// src/components/CreateLecture/LectureEditor.jsx

import React, { useRef } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import TextAlign from "@tiptap/extension-text-align";
import Underline from "@tiptap/extension-underline";
import Highlight from "@tiptap/extension-highlight";
import TextStyle from "@tiptap/extension-text-style";
import Color from "@tiptap/extension-color";
import Heading from "@tiptap/extension-heading";
import Image from "@tiptap/extension-image";
import { Box, IconButton, Tooltip, Input } from "@mui/material";
import {
  FormatBold,
  FormatItalic,
  FormatUnderlined,
  FormatAlignLeft,
  FormatAlignCenter,
  FormatAlignRight,
  FormatAlignJustify,
  FormatListBulleted,
  FormatListNumbered,
  Image as ImageIcon,
} from "@mui/icons-material";
import "./lectureEditor.css";

export default function LectureEditor({ value, onChange, placeholder }) {
  const fileInputRef = useRef(null);
  const editor = useEditor({
    extensions: [
      StarterKit.configure({ heading: false }),
      Underline,
      TextAlign.configure({ types: ["heading", "paragraph"] }),
      Highlight.configure({ multicolor: true }),
      TextStyle,
      Color,
      Heading.configure({ levels: [1, 2, 3, 4] }),
      Image,
    ],
    content: value || "",
    editorProps: {
      attributes: {
        "data-placeholder": placeholder || "",
      },
    },
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      onChange?.(html);
    },
  });

  // 이미지 삽입 로직
  const handleImageInsert = (file) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      editor?.chain().focus().setImage({ src: reader.result }).run();
    };
    reader.readAsDataURL(file);
  };

  const handleClickUpload = () => {
    fileInputRef.current?.click();
  };

  const validateAndInsertImage = (file) => {
    const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"];
    const maxSize = 5 * 1024 * 1024; // 5MB

    if (!allowedTypes.includes(file.type)) {
      alert(
        "지원되지 않는 이미지 형식입니다. (JPG, PNG, WEBP, GIF만 가능합니다.)"
      );
      return;
    }

    if (file.size > maxSize) {
      alert("파일 크기가 5MB를 초과했습니다.");
      return;
    }

    handleImageInsert(file);
  };

  if (!editor) return null;

  return (
    <Box
      className="lecture-editor-container"
      sx={{
        width: "100%",
        display: "flex",
        flexDirection: "column",
        border: "1px solid",
        borderColor: "var(--bg-300)",
        borderRadius: 2,
      }}
    >
      {/* 툴바 */}
      <Box
        className="lecture-editor-toolbar"
        sx={{
          position: "sticky",
          top: 0,
          backgroundColor: "var(--bg-100)",
          zIndex: 10,
          display: "flex",
          flexWrap: "wrap",
          gap: 0.5,
          justifyContent: "flex-start",
          borderBottom: "1px solid var(--bg-300)",
          padding: 1,
          maxWidth: "100%",
          overflowX: "auto",
        }}
      >
        <Tooltip title="Bold">
          <IconButton
            onClick={() => editor.chain().focus().toggleBold().run()}
            sx={{
              color: editor.isActive("bold")
                ? "var(--primary-200)"
                : "var(--text-300)",
            }}
          >
            <FormatBold />
          </IconButton>
        </Tooltip>

        <Tooltip title="Italic">
          <IconButton
            onClick={() => editor.chain().focus().toggleItalic().run()}
            sx={{
              color: editor.isActive("italic")
                ? "var(--primary-200)"
                : "var(--text-300)",
            }}
          >
            <FormatItalic />
          </IconButton>
        </Tooltip>

        <Tooltip title="Underline">
          <IconButton
            onClick={() => editor.chain().focus().toggleUnderline().run()}
            sx={{
              color: editor.isActive("underline")
                ? "var(--primary-200)"
                : "var(--text-300)",
            }}
          >
            <FormatUnderlined />
          </IconButton>
        </Tooltip>

        <Tooltip title="Left">
          <IconButton
            onClick={() => editor.chain().focus().setTextAlign("left").run()}
            sx={{
              color: editor.isActive({ textAlign: "left" })
                ? "var(--primary-200)"
                : "var(--text-300)",
            }}
          >
            <FormatAlignLeft />
          </IconButton>
        </Tooltip>

        <Tooltip title="Center">
          <IconButton
            onClick={() => editor.chain().focus().setTextAlign("center").run()}
            sx={{
              color: editor.isActive({ textAlign: "center" })
                ? "var(--primary-200)"
                : "var(--text-300)",
            }}
          >
            <FormatAlignCenter />
          </IconButton>
        </Tooltip>

        <Tooltip title="Right">
          <IconButton
            onClick={() => editor.chain().focus().setTextAlign("right").run()}
            sx={{
              color: editor.isActive({ textAlign: "right" })
                ? "var(--primary-200)"
                : "var(--text-300)",
            }}
          >
            <FormatAlignRight />
          </IconButton>
        </Tooltip>

        <Tooltip title="Justify">
          <IconButton
            onClick={() => editor.chain().focus().setTextAlign("justify").run()}
            sx={{
              color: editor.isActive({ textAlign: "justify" })
                ? "var(--primary-200)"
                : "var(--text-300)",
            }}
          >
            <FormatAlignJustify />
          </IconButton>
        </Tooltip>

        <Tooltip title="Bullet List">
          <IconButton
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            sx={{
              color: editor.isActive("bulletList")
                ? "var(--primary-200)"
                : "var(--text-300)",
            }}
          >
            <FormatListBulleted />
          </IconButton>
        </Tooltip>

        <Tooltip title="Numbered List">
          <IconButton
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            sx={{
              color: editor.isActive("orderedList")
                ? "var(--primary-200)"
                : "var(--text-300)",
            }}
          >
            <FormatListNumbered />
          </IconButton>
        </Tooltip>

        <Tooltip title="Insert Image">
          <IconButton
            onClick={handleClickUpload}
            sx={{
              color: "var(--text-300)",
            }}
          >
            <ImageIcon />
          </IconButton>
        </Tooltip>
      </Box>

      <EditorContent editor={editor} className="lecture-editor-content" />

      {/* 숨겨진 파일 input */}
      <Input
        type="file"
        inputRef={fileInputRef}
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) {
            validateAndInsertImage(file);
          }
        }}
        sx={{ display: "none" }}
      />
    </Box>
  );
}
