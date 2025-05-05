// src/components/CreateLecture/BasicInfoForm.jsx

import { useEffect } from "react";
import { Box, Typography, TextField, Select, MenuItem } from "@mui/material";
import GradientButton from "../Button/GradientButton";
import { useLectureStore } from "../../store/useLectureStore";
import LectureEditor from "./LectureEditor";

// DB에 있는 테스트 데이터에 맞는 카테고리 구조
const CATEGORIES = {
  학문: {
    middle: {
      컴퓨터공학: {
        프로그래밍: 1,
      },
      수학: {
        미적분: 2,
      },
    },
  },
  예술: {
    middle: {
      음악: {
        피아노: 3,
      },
    },
  },
};

export default function BasicInfoForm({ onNext }) {
  const { formData, setFormField } = useLectureStore();

  // 카테고리가 변경될 때 하위 카테고리 초기화
  useEffect(() => {
    if (formData.category) {
      setFormField("middleCategory", "");
      setFormField("subCategory", "");
      setFormField("categoryId", null);
    }
  }, [formData.category]);

  useEffect(() => {
    if (formData.middleCategory) {
      setFormField("subCategory", "");
      setFormField("categoryId", null);
    }
  }, [formData.middleCategory]);

  // 카테고리에 따른 ID 설정 수정
  useEffect(() => {
    if (formData.category && formData.middleCategory && formData.subCategory) {
      const categoryId =
        CATEGORIES[formData.category]?.middle[formData.middleCategory]?.[
          formData.subCategory
        ];
      console.log("현재 선택된 카테고리:", {
        category: formData.category,
        middleCategory: formData.middleCategory,
        subCategory: formData.subCategory,
      });
      console.log("설정될 categoryId:", categoryId);

      // categoryId를 설정하고, 기존 category 필드는 그대로 유지
      setFormField("categoryId", categoryId);
    } else {
      // 하나라도 선택되지 않았을 때는 categoryId를 null로
      setFormField("categoryId", null);
    }
  }, [formData.category, formData.middleCategory, formData.subCategory]);

  const handleNext = () => {
    // 유효성 검사
    if (
      !formData.title ||
      !formData.category ||
      !formData.middleCategory ||
      !formData.subCategory ||
      !formData.price
    ) {
      alert("필수 항목을 모두 입력해주세요.");
      return;
    }

    // categoryId 확인
    if (!formData.categoryId) {
      alert("카테고리를 완전히 선택해주세요.");
      return;
    }

    onNext();
  };

  return (
    <Box>
      <Typography variant="h6" fontWeight={600} gutterBottom>
        과외 기본 정보
      </Typography>

      <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
        과외에 대한 기본적인 정보를 입력해주세요.
      </Typography>

      {/* 과외명 입력 */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="subtitle2" fontWeight={600} gutterBottom>
          과외명 *
        </Typography>
        <TextField
          fullWidth
          placeholder="과외 제목을 입력하세요"
          value={formData.title || ""}
          onChange={(e) => setFormField("title", e.target.value)}
          sx={{ mb: 3 }}
        />
      </Box>

      {/* 카테고리 선택 */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="subtitle2" fontWeight={600} gutterBottom>
          카테고리 *
        </Typography>
        <Box display="flex" gap={1}>
          <Select
            fullWidth
            value={formData.category || ""}
            onChange={(e) => setFormField("category", e.target.value)}
            displayEmpty
          >
            <MenuItem value="">대분류</MenuItem>
            {Object.keys(CATEGORIES).map((category) => (
              <MenuItem key={category} value={category}>
                {category}
              </MenuItem>
            ))}
          </Select>

          <Select
            fullWidth
            value={formData.middleCategory || ""}
            onChange={(e) => setFormField("middleCategory", e.target.value)}
            displayEmpty
            disabled={!formData.category}
          >
            <MenuItem value="">중분류</MenuItem>
            {formData.category &&
              Object.keys(CATEGORIES[formData.category]?.middle || {}).map(
                (middle) => (
                  <MenuItem key={middle} value={middle}>
                    {middle}
                  </MenuItem>
                )
              )}
          </Select>

          <Select
            fullWidth
            value={formData.subCategory || ""}
            onChange={(e) => setFormField("subCategory", e.target.value)}
            displayEmpty
            disabled={!formData.middleCategory}
          >
            <MenuItem value="">소분류</MenuItem>
            {formData.middleCategory &&
              CATEGORIES[formData.category]?.middle[formData.middleCategory] &&
              Object.keys(
                CATEGORIES[formData.category].middle[formData.middleCategory]
              ).map((sub) => (
                <MenuItem key={sub} value={sub}>
                  {sub}
                </MenuItem>
              ))}
          </Select>
        </Box>
      </Box>

      {/* 희당 수강료 */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="subtitle2" fontWeight={600} gutterBottom>
          희당 수강료 *
        </Typography>
        <TextField
          fullWidth
          placeholder="원"
          value={formData.price || ""}
          onChange={(e) => setFormField("price", e.target.value)}
          type="number"
          InputProps={{
            endAdornment: (
              <Typography variant="body2" color="text.secondary">
                원
              </Typography>
            ),
          }}
        />
      </Box>

      {/* 과외 소개 */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="subtitle2" fontWeight={600} gutterBottom>
          과외 소개 *
        </Typography>
        <LectureEditor
          value={formData.description}
          onChange={(content) => setFormField("description", content)}
          placeholder="과외의 특징과 목표 등을 자세히 설명해주세요."
        />
      </Box>

      {/* 다음으로 버튼 */}
      <GradientButton
        fullWidth
        size="md"
        onClick={handleNext}
        sx={{
          py: 1.5,
        }}
      >
        다음으로
      </GradientButton>
    </Box>
  );
}
