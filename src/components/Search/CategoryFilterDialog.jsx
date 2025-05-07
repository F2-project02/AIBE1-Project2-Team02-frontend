// src/components/Search/CategoryFilterDialog.jsx
import { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Box,
  Typography,
  IconButton,
  Button,
  Divider,
  CircularProgress,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import GradientButton from "../Button/GradientButton";
import { categoryApi } from "../../lib/api/categoryApi";

export default function CategoryFilterDialog({
  open,
  onClose,
  initialSelection = null,
  onSelect,
}) {
  // Selected category state
  const [selectedParent, setSelectedParent] = useState("");
  const [selectedMiddle, setSelectedMiddle] = useState("");
  const [selectedSub, setSelectedSub] = useState("");

  // Available categories
  const [parentCategories, setParentCategories] = useState([]);
  const [middleCategories, setMiddleCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);

  // Loading states
  const [loadingParent, setLoadingParent] = useState(false);
  const [loadingMiddle, setLoadingMiddle] = useState(false);
  const [loadingSub, setLoadingSub] = useState(false);

  // Reset selections when dialog opens/closes
  useEffect(() => {
    if (open && initialSelection) {
      // Parse the initialSelection if it's a string like "대분류 > 중분류 > 소분류"
      const parts = initialSelection.split(" > ");

      if (parts.length >= 1) setSelectedParent(parts[0]);
      if (parts.length >= 2) setSelectedMiddle(parts[1]);
      if (parts.length >= 3) setSelectedSub(parts[2]);
    } else if (!open) {
      // Don't reset on close to maintain state between openings
    }
  }, [open, initialSelection]);

  // Load parent categories on mount
  useEffect(() => {
    const loadParentCategories = async () => {
      if (!open) return;

      try {
        setLoadingParent(true);

        // 실제 API 호출
        const response = await categoryApi.getParentCategories();

        if (response && Array.isArray(response)) {
          setParentCategories(response);
        } else {
          console.error(
            "Parent categories response is not an array:",
            response
          );
          // 임시 대체 데이터
          setParentCategories([
            "교육/입시",
            "IT/개발",
            "취업/N잡",
            "자격증",
            "예체능",
            "라이프스타일",
          ]);
        }
      } catch (error) {
        console.error("Failed to load parent categories:", error);
        // API 호출 실패 시 임시 데이터
        setParentCategories([
          "교육/입시",
          "IT/개발",
          "취업/N잡",
          "자격증",
          "예체능",
          "라이프스타일",
        ]);
      } finally {
        setLoadingParent(false);
      }
    };

    loadParentCategories();
  }, [open]);

  // Load middle categories when parent changes
  useEffect(() => {
    const loadMiddleCategories = async () => {
      if (!selectedParent) {
        setMiddleCategories([]);
        return;
      }

      try {
        setLoadingMiddle(true);

        // 실제 API 호출
        const response = await categoryApi.getMiddleCategories(selectedParent);

        if (response && Array.isArray(response)) {
          setMiddleCategories(response);
        } else {
          console.error(
            "Middle categories response is not an array:",
            response
          );
          // 임시 대체 데이터
          let fallbackCategories = [];

          if (selectedParent === "IT/개발") {
            fallbackCategories = [
              "프론트엔드",
              "백엔드",
              "모바일",
              "데이터베이스",
              "AI/머신러닝",
            ];
          } else if (selectedParent === "교육/입시") {
            fallbackCategories = ["초등", "중등", "고등", "대학"];
          } else {
            fallbackCategories = ["기초", "중급", "고급"];
          }

          setMiddleCategories(fallbackCategories);
        }
      } catch (error) {
        console.error("Failed to load middle categories:", error);
        // API 호출 실패 시 임시 데이터
        let fallbackCategories = [];

        if (selectedParent === "IT/개발") {
          fallbackCategories = [
            "프론트엔드",
            "백엔드",
            "모바일",
            "데이터베이스",
            "AI/머신러닝",
          ];
        } else if (selectedParent === "교육/입시") {
          fallbackCategories = ["초등", "중등", "고등", "대학"];
        } else {
          fallbackCategories = ["기초", "중급", "고급"];
        }

        setMiddleCategories(fallbackCategories);
      } finally {
        setLoadingMiddle(false);
      }
    };

    loadMiddleCategories();
  }, [selectedParent]);

  // Load sub categories when middle changes
  useEffect(() => {
    const loadSubCategories = async () => {
      if (!selectedParent || !selectedMiddle) {
        setSubCategories([]);
        return;
      }

      try {
        setLoadingSub(true);

        // 실제 API 호출
        const response = await categoryApi.getSubcategories(
          selectedParent,
          selectedMiddle
        );

        if (response && Array.isArray(response)) {
          setSubCategories(response);
        } else {
          console.error("Sub categories response is not an array:", response);
          // 임시 대체 데이터
          let fallbackCategories = [];

          if (selectedMiddle === "프론트엔드") {
            fallbackCategories = ["React", "Vue", "Angular", "JavaScript"];
          } else if (selectedMiddle === "백엔드") {
            fallbackCategories = ["Java", "Python", "Node.js", "Spring"];
          } else if (selectedMiddle === "초등") {
            fallbackCategories = ["국어", "수학", "영어", "과학", "사회"];
          } else {
            fallbackCategories = ["입문", "실전", "심화"];
          }

          setSubCategories(fallbackCategories);
        }
      } catch (error) {
        console.error("Failed to load sub categories:", error);
        // API 호출 실패 시 임시 데이터
        let fallbackCategories = [];

        if (selectedMiddle === "프론트엔드") {
          fallbackCategories = ["React", "Vue", "Angular", "JavaScript"];
        } else if (selectedMiddle === "백엔드") {
          fallbackCategories = ["Java", "Python", "Node.js", "Spring"];
        } else if (selectedMiddle === "초등") {
          fallbackCategories = ["국어", "수학", "영어", "과학", "사회"];
        } else {
          fallbackCategories = ["입문", "실전", "심화"];
        }

        setSubCategories(fallbackCategories);
      } finally {
        setLoadingSub(false);
      }
    };

    loadSubCategories();
  }, [selectedMiddle, selectedParent]);

  // Handle selection reset
  const handleReset = () => {
    setSelectedParent("");
    setSelectedMiddle("");
    setSelectedSub("");
  };

  // Handle selection complete
  const handleComplete = () => {
    let result = null;

    if (selectedSub) {
      result = `${selectedParent} > ${selectedMiddle} > ${selectedSub}`;
    } else if (selectedMiddle) {
      result = `${selectedParent} > ${selectedMiddle}`;
    } else if (selectedParent) {
      result = selectedParent;
    }

    onSelect(result);
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="sm"
      PaperProps={{
        sx: {
          borderRadius: 2,
          p: 3,
        },
      }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 2,
        }}
      >
        <Typography variant="h6" fontWeight={600}>
          과목 카테고리 선택
        </Typography>
        <IconButton onClick={onClose} size="small">
          <CloseIcon />
        </IconButton>
      </Box>

      <Divider sx={{ mb: 3 }} />

      {/* 대분류 선택 */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="subtitle2" fontWeight={600} gutterBottom>
          대분류
        </Typography>

        {loadingParent ? (
          <Box sx={{ display: "flex", justifyContent: "center", my: 2 }}>
            <CircularProgress size={24} />
          </Box>
        ) : (
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
            {parentCategories.map((category) => (
              <Box
                key={category}
                onClick={() => {
                  setSelectedParent(category);
                  setSelectedMiddle("");
                  setSelectedSub("");
                }}
                sx={{
                  px: 2,
                  py: 1,
                  backgroundColor:
                    selectedParent === category
                      ? "var(--action-primary-bg)"
                      : "var(--bg-200)",
                  color:
                    selectedParent === category
                      ? "var(--primary-200)"
                      : "var(--text-300)",
                  borderRadius: "20px",
                  cursor: "pointer",
                  fontWeight: selectedParent === category ? 600 : 400,
                  fontSize: "14px",
                  transition: "all 0.2s ease",
                  "&:hover": {
                    backgroundColor:
                      selectedParent === category
                        ? "var(--action-primary-bg)"
                        : "var(--bg-300)",
                  },
                }}
              >
                {category}
              </Box>
            ))}
          </Box>
        )}
      </Box>

      {/* 중분류 선택 */}
      {selectedParent && (
        <Box sx={{ mb: 3 }}>
          <Typography variant="subtitle2" fontWeight={600} gutterBottom>
            중분류
          </Typography>

          {loadingMiddle ? (
            <Box sx={{ display: "flex", justifyContent: "center", my: 2 }}>
              <CircularProgress size={24} />
            </Box>
          ) : (
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
              {middleCategories.map((category) => (
                <Box
                  key={category}
                  onClick={() => {
                    setSelectedMiddle(category);
                    setSelectedSub("");
                  }}
                  sx={{
                    px: 2,
                    py: 1,
                    backgroundColor:
                      selectedMiddle === category
                        ? "var(--action-primary-bg)"
                        : "var(--bg-200)",
                    color:
                      selectedMiddle === category
                        ? "var(--primary-200)"
                        : "var(--text-300)",
                    borderRadius: "20px",
                    cursor: "pointer",
                    fontWeight: selectedMiddle === category ? 600 : 400,
                    fontSize: "14px",
                    transition: "all 0.2s ease",
                    "&:hover": {
                      backgroundColor:
                        selectedMiddle === category
                          ? "var(--action-primary-bg)"
                          : "var(--bg-300)",
                    },
                  }}
                >
                  {category}
                </Box>
              ))}
            </Box>
          )}
        </Box>
      )}

      {/* 소분류 선택 */}
      {selectedMiddle && (
        <Box sx={{ mb: 4 }}>
          <Typography variant="subtitle2" fontWeight={600} gutterBottom>
            소분류
          </Typography>

          {loadingSub ? (
            <Box sx={{ display: "flex", justifyContent: "center", my: 2 }}>
              <CircularProgress size={24} />
            </Box>
          ) : (
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
              {subCategories.map((category) => (
                <Box
                  key={category}
                  onClick={() => setSelectedSub(category)}
                  sx={{
                    px: 2,
                    py: 1,
                    backgroundColor:
                      selectedSub === category
                        ? "var(--action-primary-bg)"
                        : "var(--bg-200)",
                    color:
                      selectedSub === category
                        ? "var(--primary-200)"
                        : "var(--text-300)",
                    borderRadius: "20px",
                    cursor: "pointer",
                    fontWeight: selectedSub === category ? 600 : 400,
                    fontSize: "14px",
                    transition: "all 0.2s ease",
                    "&:hover": {
                      backgroundColor:
                        selectedSub === category
                          ? "var(--action-primary-bg)"
                          : "var(--bg-300)",
                    },
                  }}
                >
                  {category}
                </Box>
              ))}
            </Box>
          )}
        </Box>
      )}

      {/* 현재 선택 표시 */}
      {selectedParent && (
        <Box
          sx={{
            mb: 4,
            p: 2,
            borderRadius: 1,
            backgroundColor: "var(--bg-200)",
          }}
        >
          <Typography variant="body2" color="var(--text-300)">
            현재 선택:
          </Typography>
          <Typography
            variant="body1"
            fontWeight={600}
            color="var(--primary-200)"
          >
            {selectedParent}
            {selectedMiddle && ` > ${selectedMiddle}`}
            {selectedSub && ` > ${selectedSub}`}
          </Typography>
        </Box>
      )}

      {/* 버튼 영역 */}
      <Box sx={{ display: "flex", gap: 2 }}>
        <Button
          variant="outlined"
          onClick={handleReset}
          sx={{
            flex: 1,
            py: 1.2,
            borderColor: "var(--bg-300)",
            color: "var(--text-300)",
            "&:hover": {
              borderColor: "var(--bg-300)",
              backgroundColor: "var(--bg-200)",
            },
          }}
        >
          초기화
        </Button>

        <GradientButton onClick={handleComplete} sx={{ flex: 1, py: 1.2 }}>
          선택 완료
        </GradientButton>
      </Box>
    </Dialog>
  );
}
