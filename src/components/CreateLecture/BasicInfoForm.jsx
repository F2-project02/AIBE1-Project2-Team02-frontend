import { useEffect, useState } from "react";
import { Box, Typography, Skeleton } from "@mui/material";
import GradientButton from "../Button/GradientButton";
import FormFieldWrapper from "./FormFieldWrapper";
import CategorySelector from "./CategorySelector";
import CustomTextField from "../common/CustomTextField";
import { useLectureStore } from "../../store/useLectureStore";
import TiptapEditor from "../TiptapEditor/TiptapEditor";
import { categoryApi } from "../../lib/api/categoryApi";

export default function BasicInfoForm({ onNext, showToast }) {
  const { formData, setFormField } = useLectureStore();
  const [loading, setLoading] = useState(false);
  const [categoryTree, setCategoryTree] = useState({});
  const [parentCategories, setParentCategories] = useState([]);
  const [middleCategories, setMiddleCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);

  // 카테고리 트리 데이터 로드
  useEffect(() => {
    const fetchCategoryData = async () => {
      try {
        setLoading(true);
        const tree = await categoryApi.getCategoryTree();
        setCategoryTree(tree);
        setParentCategories(Object.keys(tree));
      } catch (error) {
        console.error("카테고리 데이터 로딩 실패:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategoryData();
  }, []);

  // 카테고리 선택 시 하위 카테고리 업데이트
  useEffect(() => {
    if (formData.category && categoryTree[formData.category]) {
      const newMiddle = Object.keys(
        categoryTree[formData.category].middle || {}
      );
      setMiddleCategories(newMiddle);

      if (!newMiddle.includes(formData.middleCategory)) {
        setFormField("middleCategory", "");
        setFormField("subCategory", "");
        setFormField("categoryId", null);
      }
    }
  }, [formData.category, categoryTree]);

  useEffect(() => {
    const middle = formData.middleCategory;
    const top = formData.category;
    if (top && middle && categoryTree[top]?.middle?.[middle]) {
      const newSubs = Object.keys(categoryTree[top].middle[middle]);
      setSubCategories(newSubs);

      if (!newSubs.includes(formData.subCategory)) {
        setFormField("subCategory", "");
        setFormField("categoryId", null);
      }
    }
  }, [formData.middleCategory, formData.category, categoryTree]);

  // 최종 categoryId 설정
  useEffect(() => {
    const id =
      categoryTree?.[formData.category]?.middle?.[formData.middleCategory]?.[
        formData.subCategory
      ];
    setFormField("categoryId", id ?? null);
  }, [
    formData.category,
    formData.middleCategory,
    formData.subCategory,
    categoryTree,
  ]);

  const handleNext = () => {
    if (!formData.title || !formData.categoryId || !formData.price) {
      showToast("필수 항목을 모두 입력해주세요.");
      return;
    }
    onNext();
  };

  return (
    <Box>
      <Typography variant="h6" fontWeight={600} gutterBottom>
        과외 기본 정보
      </Typography>

      <Typography variant="body2" color="var(--text-300)" sx={{ mb: 4 }}>
        과외에 대한 기본적인 정보를 입력해주세요.
      </Typography>

      <FormFieldWrapper label="과외명" required>
        <CustomTextField
          placeholder="과외 제목을 입력하세요"
          value={formData.title || ""}
          onChange={(e) => {
            const value = e.target.value;
            setFormField("title", value.slice(0, 50));
          }}
          sx={{ maxWidth: "640px", width: "100%" }}
          inputProps={{ maxLength: 50 }}
        />
        <Box
          display="flex"
          justifyContent="space-between"
          width="100%"
          maxWidth="640px"
          mt={0.5}
        >
          <Typography variant="caption" color="var(--text-300)">
            최대 50자까지 입력할 수 있어요.
          </Typography>
          <Typography
            variant="caption"
            color={formData.title?.length > 50 ? "error" : "var(--text-300)"}
          >
            {(formData.title || "").length} / 50자
          </Typography>
        </Box>
      </FormFieldWrapper>

      <FormFieldWrapper label="카테고리" required>
        <CategorySelector
          categoryTree={categoryTree}
          parentCategories={parentCategories}
          middleCategories={middleCategories}
          subCategories={subCategories}
          formData={formData}
          setFormField={setFormField}
          loading={loading}
        />
      </FormFieldWrapper>

      <FormFieldWrapper label="회당 수강료" required>
        <CustomTextField
          type="number"
          value={formData.price ?? ""}
          onChange={(e) => {
            const numeric = Number(e.target.value);
            if (
              Number.isInteger(numeric) &&
              numeric >= 0 &&
              numeric <= 1000000
            ) {
              setFormField("price", numeric);
            }
          }}
          sx={{ width: { xs: "100%", md: "240px" } }}
          inputProps={{
            min: 0,
            step: 5000,
            inputMode: "numeric",
          }}
          inputSx={{ textAlign: "right" }}
          InputProps={{
            endAdornment: (
              <Typography
                variant="body2"
                color="var(--text-400)"
                sx={{ ml: 1 }}
              >
                원
              </Typography>
            ),
          }}
        />
        <Typography variant="caption" color="var(--text-300)">
          1회 수업 기준으로 원하는 금액을 입력하세요.
        </Typography>
      </FormFieldWrapper>

      <FormFieldWrapper label="과외 소개" required>
        <TiptapEditor
          value={formData.description}
          onChange={(content) => {
            console.log("에디터 내용 변경:", content);
            setFormField("description", content);
          }}
          placeholder="과외의 특징과 목표 등을 자세히 설명해주세요."
        />
      </FormFieldWrapper>

      <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
        <GradientButton
          fullWidth
          size="md"
          onClick={handleNext}
          sx={{
            py: 1.5,
            width: { xs: "100%", md: "240px" },
          }}
          disabled={loading}
        >
          다음으로
        </GradientButton>
      </Box>
    </Box>
  );
}
