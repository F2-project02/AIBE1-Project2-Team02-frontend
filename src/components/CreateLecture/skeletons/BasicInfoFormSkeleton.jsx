// src/components/CreateLecture/skeletons/BasicInfoFormSkeleton.jsx
import { Box, Skeleton, useTheme } from "@mui/material";
import CategorySelectorSkeleton from "./CategorySelectorSkeleton";
import FormFieldWrapper from "../FormFieldWrapper";

export default function BasicInfoFormSkeleton() {
  const theme = useTheme();

  return (
    <Box mt={4}>
      {/* 과외명 */}
      <Skeleton
        variant="text"
        animation="wave"
        width="30%"
        height={28}
        sx={{
          mb: 1,
          bgcolor: "var(--bg-200)",
        }}
      />
      <Skeleton
        variant="rounded"
        animation="wave"
        width="100%"
        height={56}
        sx={{
          mb: 3,
          borderRadius: "12px",
          bgcolor: "var(--bg-200)",
        }}
      />

      {/* 카테고리 */}
      <FormFieldWrapper label="카테고리" required>
        <CategorySelectorSkeleton />
      </FormFieldWrapper>

      {/* 수강료 */}
      <Skeleton
        variant="text"
        animation="wave"
        width="30%"
        height={28}
        sx={{
          mb: 1,
          bgcolor: "var(--bg-200)",
        }}
      />
      <Skeleton
        variant="rounded"
        animation="wave"
        width="240px"
        height={56}
        sx={{
          mb: 3,
          borderRadius: "12px",
          bgcolor: "var(--bg-200)",
        }}
      />

      {/* 소개 */}
      <Skeleton
        variant="text"
        animation="wave"
        width="30%"
        height={28}
        sx={{
          mb: 1,
          bgcolor: "var(--bg-200)",
        }}
      />
      <Skeleton
        variant="rounded"
        animation="wave"
        width="100%"
        height={200}
        sx={{
          mb: 3,
          borderRadius: "12px",
          bgcolor: "var(--bg-200)",
        }}
      />

      {/* 버튼 */}
      <Skeleton
        variant="rounded"
        animation="wave"
        width={{ xs: "100%", md: "240px" }}
        height={48}
        sx={{
          mt: 4,
          borderRadius: "12px",
          bgcolor: "var(--bg-200)",
        }}
      />
    </Box>
  );
}
