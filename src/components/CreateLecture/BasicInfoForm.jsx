// src/components/CreateLecture/BasicInfoForm.jsx
import { useEffect, useState } from "react";
import {
  Box,
  Typography,
  TextField,
  Select,
  MenuItem,
  CircularProgress,
} from "@mui/material";
import GradientButton from "../Button/GradientButton";
import { useLectureStore } from "../../store/useLectureStore";
import LectureEditor from "./LectureEditor";
import { categoryApi } from "../../lib/api/categoryApi";

export default function BasicInfoForm({ onNext }) {
  const { formData, setFormField } = useLectureStore();
  const [loading, setLoading] = useState(false);
  const [categoryTree, setCategoryTree] = useState({});
  const [parentCategories, setParentCategories] = useState([]);
  const [middleCategories, setMiddleCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);

  // 컴포넌트 마운트 시 카테고리 트리 데이터 로드
  useEffect(() => {
    const fetchCategoryData = async () => {
      try {
        setLoading(true);
        const tree = await categoryApi.getCategoryTree();
        setCategoryTree(tree);
        setParentCategories(Object.keys(tree));
        setLoading(false);
      } catch (error) {
        console.error("카테고리 데이터 로딩 실패:", error);
        setLoading(false);
      }
    };

    fetchCategoryData();
  }, []);

  // 카테고리가 변경될 때 하위 카테고리 업데이트
  useEffect(() => {
    if (formData.category && categoryTree[formData.category]) {
      setMiddleCategories(
        Object.keys(categoryTree[formData.category].middle || {})
      );
      setFormField("middleCategory", "");
      setFormField("subCategory", "");
      setFormField("categoryId", null);
    }
  }, [formData.category, categoryTree]);

  useEffect(() => {
    if (
      formData.category &&
      formData.middleCategory &&
      categoryTree[formData.category]?.middle?.[formData.middleCategory]
    ) {
      setSubCategories(
        Object.keys(
          categoryTree[formData.category].middle[formData.middleCategory]
        )
      );
      setFormField("subCategory", "");
      setFormField("categoryId", null);
    }
  }, [formData.middleCategory, formData.category, categoryTree]);

  // 카테고리에 따른 ID 설정 수정
  useEffect(() => {
    if (
      formData.category &&
      formData.middleCategory &&
      formData.subCategory &&
      categoryTree[formData.category]?.middle?.[formData.middleCategory]?.[
        formData.subCategory
      ]
    ) {
      const categoryId =
        categoryTree[formData.category].middle[formData.middleCategory][
          formData.subCategory
        ];
      setFormField("categoryId", categoryId);
    } else {
      setFormField("categoryId", null);
    }
  }, [
    formData.category,
    formData.middleCategory,
    formData.subCategory,
    categoryTree,
  ]);

  const handleNext = () => {
    if (!formData.title || !formData.categoryId || !formData.price) {
      alert("필수 항목을 모두 입력해주세요.");
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
        {loading ? (
          <CircularProgress size={24} />
        ) : (
          <Box display="flex" gap={1}>
            <Select
              fullWidth
              value={formData.category || ""}
              onChange={(e) => setFormField("category", e.target.value)}
              displayEmpty
            >
              <MenuItem value="">대분류</MenuItem>
              {parentCategories.map((category) => (
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
              {middleCategories.map((middle) => (
                <MenuItem key={middle} value={middle}>
                  {middle}
                </MenuItem>
              ))}
            </Select>

            <Select
              fullWidth
              value={formData.subCategory || ""}
              onChange={(e) => setFormField("subCategory", e.target.value)}
              displayEmpty
              disabled={!formData.middleCategory}
            >
              <MenuItem value="">소분류</MenuItem>
              {subCategories.map((sub) => (
                <MenuItem key={sub} value={sub}>
                  {sub}
                </MenuItem>
              ))}
            </Select>
          </Box>
        )}
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
        disabled={loading}
      >
        다음으로
      </GradientButton>
    </Box>
  );
}
