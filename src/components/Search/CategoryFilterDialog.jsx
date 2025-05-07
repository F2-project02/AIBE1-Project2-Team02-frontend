// src/components/Search/CategoryFilterDialog.jsx

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  Tabs,
  Tab,
  Chip,
  IconButton,
  Grid,
  CircularProgress,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import GradientButton from "../Button/GradientButton";
import { categoryApi } from "../../lib/api/categoryAPi";

function CategoryFilterDialog({
  open,
  onClose,
  selectedCategories,
  setSelectedCategories,
}) {
  const [loading, setLoading] = useState(false);
  const [parentCategories, setParentCategories] = useState([]);
  const [middleCategories, setMiddleCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);

  const [selectedParent, setSelectedParent] = useState("");
  const [selectedMiddle, setSelectedMiddle] = useState("");
  const [tempSelectedCategories, setTempSelectedCategories] = useState([]);

  // 대분류 카테고리 로드
  const loadParentCategories = async () => {
    try {
      setLoading(true);
      const response = await categoryApi.getParentCategories();
      if (response) {
        setParentCategories(response);
        if (response.length > 0) {
          setSelectedParent(response[0]);
        }
      }
    } catch (error) {
      console.error("카테고리 로드 에러:", error);
    } finally {
      setLoading(false);
    }
  };

  // 중분류 카테고리 로드
  const loadMiddleCategories = async (parent) => {
    if (!parent) return;

    try {
      setLoading(true);
      const response = await categoryApi.getMiddleCategories(parent);
      if (response) {
        setMiddleCategories(response);
        if (response.length > 0) {
          setSelectedMiddle(response[0]);
        } else {
          setSelectedMiddle("");
          setSubCategories([]);
        }
      }
    } catch (error) {
      console.error("중분류 카테고리 로드 에러:", error);
      setMiddleCategories([]);
    } finally {
      setLoading(false);
    }
  };

  // 소분류 카테고리 로드
  const loadSubCategories = async (parent, middle) => {
    if (!parent || !middle) return;

    try {
      setLoading(true);
      const response = await categoryApi.getSubcategories(parent, middle);
      if (response) {
        setSubCategories(response);
      }
    } catch (error) {
      console.error("소분류 카테고리 로드 에러:", error);
      setSubCategories([]);
    } finally {
      setLoading(false);
    }
  };

  // 다이얼로그 열릴 때 초기 데이터 로드
  useEffect(() => {
    if (open) {
      loadParentCategories();
      setTempSelectedCategories([...selectedCategories]);
    }
  }, [open, selectedCategories]);

  // 대분류 변경 시 중분류 로드
  useEffect(() => {
    if (selectedParent) {
      loadMiddleCategories(selectedParent);
    }
  }, [selectedParent]);

  // 중분류 변경 시 소분류 로드
  useEffect(() => {
    if (selectedParent && selectedMiddle) {
      loadSubCategories(selectedParent, selectedMiddle);
    }
  }, [selectedParent, selectedMiddle]);

  // 대분류 탭 변경 핸들러
  const handleParentChange = (event, newValue) => {
    setSelectedParent(newValue);
  };

  // 중분류 탭 변경 핸들러
  const handleMiddleChange = (event, newValue) => {
    setSelectedMiddle(newValue);
  };

  // 카테고리 선택/해제 핸들러
  const handleCategoryToggle = (category) => {
    setTempSelectedCategories((prev) => {
      if (prev.includes(category)) {
        return prev.filter((cat) => cat !== category);
      } else {
        // 최대 3개 제한
        if (prev.length >= 3) {
          alert("최대 3개 카테고리까지 선택 가능합니다.");
          return prev;
        }
        return [...prev, category];
      }
    });
  };

  // 선택 완료 핸들러
  const handleConfirm = () => {
    setSelectedCategories(tempSelectedCategories);
    onClose();
  };

  // 선택 초기화 핸들러
  const handleReset = () => {
    setTempSelectedCategories([]);
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="sm"
      PaperProps={{
        sx: {
          borderRadius: "20px",
          overflowY: "visible",
        },
      }}
    >
      <DialogTitle
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Typography variant="h6" fontWeight={600}>
          과목 필터
        </Typography>
        <IconButton onClick={onClose} size="small">
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ pb: 1 }}>
        {/* 선택된 카테고리 표시 */}
        {tempSelectedCategories.length > 0 && (
          <Box sx={{ mb: 2 }}>
            <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 1 }}>
              선택 항목 {tempSelectedCategories.length}/3
            </Typography>
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
              {tempSelectedCategories.map((category) => (
                <Chip
                  key={category}
                  label={category}
                  onDelete={() => handleCategoryToggle(category)}
                  sx={{
                    backgroundColor: "var(--action-primary-bg)",
                    color: "var(--primary-200)",
                    fontWeight: 500,
                    borderRadius: "8px",
                  }}
                />
              ))}
              <Button
                variant="text"
                onClick={handleReset}
                sx={{ color: "var(--text-400)", fontSize: 14, ml: 1 }}
              >
                초기화
              </Button>
            </Box>
          </Box>
        )}

        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
            <CircularProgress size={32} sx={{ color: "var(--primary-100)" }} />
          </Box>
        ) : (
          <>
            {/* 대분류 탭 */}
            {parentCategories.length > 0 && (
              <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
                <Tabs
                  value={selectedParent}
                  onChange={handleParentChange}
                  variant="scrollable"
                  scrollButtons="auto"
                  TabIndicatorProps={{
                    style: { backgroundColor: "var(--primary-100)" },
                  }}
                >
                  {parentCategories.map((parent) => (
                    <Tab
                      key={parent}
                      label={parent}
                      value={parent}
                      sx={{
                        textTransform: "none",
                        fontWeight: "500",
                        fontSize: "14px",
                        color: "var(--text-300)",
                        "&.Mui-selected": {
                          color: "var(--primary-100)",
                        },
                      }}
                    />
                  ))}
                </Tabs>
              </Box>
            )}

            {/* 중분류 탭 */}
            {middleCategories.length > 0 && (
              <Box sx={{ borderBottom: 1, borderColor: "divider", mt: 2 }}>
                <Tabs
                  value={selectedMiddle}
                  onChange={handleMiddleChange}
                  variant="scrollable"
                  scrollButtons="auto"
                  TabIndicatorProps={{
                    style: { backgroundColor: "var(--primary-100)" },
                  }}
                >
                  {middleCategories.map((middle) => (
                    <Tab
                      key={middle}
                      label={middle}
                      value={middle}
                      sx={{
                        textTransform: "none",
                        fontWeight: "500",
                        fontSize: "14px",
                        color: "var(--text-300)",
                        "&.Mui-selected": {
                          color: "var(--primary-100)",
                        },
                      }}
                    />
                  ))}
                </Tabs>
              </Box>
            )}

            {/* 소분류 선택 영역 */}
            {subCategories.length > 0 && (
              <Grid container spacing={1} sx={{ mt: 2 }}>
                {subCategories.map((sub) => (
                  <Grid item key={sub}>
                    <Chip
                      label={sub}
                      onClick={() => handleCategoryToggle(sub)}
                      sx={{
                        backgroundColor: tempSelectedCategories.includes(sub)
                          ? "var(--primary-100)"
                          : "var(--bg-200)",
                        color: tempSelectedCategories.includes(sub)
                          ? "white"
                          : "var(--text-300)",
                        fontWeight: "500",
                        borderRadius: "20px",
                        cursor: "pointer",
                        "&:hover": {
                          backgroundColor: tempSelectedCategories.includes(sub)
                            ? "var(--primary-200)"
                            : "var(--bg-300)",
                        },
                      }}
                    />
                  </Grid>
                ))}
              </Grid>
            )}
          </>
        )}
      </DialogContent>

      <DialogActions sx={{ px: 3, py: 2 }}>
        <Button
          onClick={onClose}
          sx={{
            color: "var(--text-300)",
            textTransform: "none",
            fontWeight: "500",
          }}
        >
          취소
        </Button>
        <GradientButton onClick={handleConfirm} size="xs">
          선택 완료 ({tempSelectedCategories.length}/3)
        </GradientButton>
      </DialogActions>
    </Dialog>
  );
}

export default CategoryFilterDialog;
