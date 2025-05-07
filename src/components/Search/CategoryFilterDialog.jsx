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
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import GradientButton from "../Button/GradientButton";

// Mock category data (이후 API 연동)
const categoryData = {
  "교육/입시": {
    중등교육: ["국어", "영어", "수학", "과학", "사회", "한국사"],
    고등교육: [
      "국어",
      "영어",
      "수학",
      "물리",
      "화학",
      "생물",
      "지구과학",
      "한국사",
      "세계사",
      "경제",
    ],
    대입: ["수능", "논술", "면접", "내신"],
  },
  "IT/개발": {
    프론트엔드: ["HTML/CSS", "JavaScript", "React", "Vue", "Angular"],
    백엔드: ["Java", "Python", "Node.js", "Spring", "Express", "Django"],
    모바일: ["Android", "iOS", "React Native", "Flutter"],
    데이터사이언스: ["SQL", "Python", "R", "데이터분석", "머신러닝", "딥러닝"],
  },
  "취업/N잡": {
    취업준비: ["자소서", "면접", "포트폴리오", "직무적성검사"],
    자격증: ["토익", "토플", "컴활", "SQLD"],
    부업: ["주식", "부동산", "블로그", "유튜브"],
  },
  자격: {
    국가자격증: ["공인중개사", "식품기사", "전기기사", "간호사"],
    민간자격증: ["빅데이터분석기사", "네트워크관리사", "컴퓨터활용능력"],
  },
  학위: {
    정규학위: ["학사", "석사", "박사"],
    비정규학위: ["독학학위제", "학점은행제"],
  },
  예체능: {
    음악: ["피아노", "기타", "드럼", "보컬"],
    미술: ["회화", "디자인", "조소", "공예"],
    체육: ["축구", "농구", "테니스", "수영"],
  },
  라이프스타일: {
    요리: ["한식", "양식", "일식", "중식", "베이킹"],
    운동: ["헬스", "요가", "필라테스"],
    여가: ["여행", "사진", "독서"],
  },
};

function CategoryFilterDialog({
  open,
  onClose,
  selectedCategories,
  setSelectedCategories,
}) {
  const [selectedParent, setSelectedParent] = useState("교육/입시");
  const [selectedMiddle, setSelectedMiddle] = useState(null);
  const [middleCategories, setMiddleCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const [tempSelectedCategories, setTempSelectedCategories] = useState([]);

  // 선택된 대분류에 따른 중분류 목록 업데이트
  useEffect(() => {
    if (selectedParent) {
      const middleCats = Object.keys(categoryData[selectedParent]);
      setMiddleCategories(middleCats);
      setSelectedMiddle(middleCats[0]);
    }
  }, [selectedParent]);

  // 선택된 중분류에 따른 소분류 목록 업데이트
  useEffect(() => {
    if (selectedParent && selectedMiddle) {
      setSubCategories(categoryData[selectedParent][selectedMiddle]);
    }
  }, [selectedParent, selectedMiddle]);

  // 다이얼로그 열릴 때 임시 선택된 카테고리 초기화
  useEffect(() => {
    if (open) {
      setTempSelectedCategories([...selectedCategories]);
    }
  }, [open, selectedCategories]);

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
              선택 항목 {tempSelectedCategories.length}
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

        {/* 대분류 탭 */}
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
            {Object.keys(categoryData).map((parent) => (
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

        {/* 중분류 탭 */}
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

        {/* 소분류 선택 영역 */}
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
          선택 완료 ({tempSelectedCategories.length})
        </GradientButton>
      </DialogActions>
    </Dialog>
  );
}

export default CategoryFilterDialog;
