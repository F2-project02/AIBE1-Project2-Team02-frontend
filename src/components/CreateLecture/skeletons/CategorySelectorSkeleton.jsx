// 📄 src/components/CreateLecture/CategorySelectorSkeleton.jsx
import { Box, Skeleton } from "@mui/material";

export default function CategorySelectorSkeleton() {
  return (
    <Box
      display="flex"
      flexDirection={{ xs: "column", sm: "row" }}
      gap={{ xs: 1.5, sm: 1 }}
      width="100%"
    >
      {[1, 2, 3].map((_, idx) => (
        <Skeleton
          key={idx}
          variant="rounded"
          animation="wave"
          height={48}
          sx={{
            width: "100%",
            borderRadius: "8px",                    
            bgcolor: "var(--bg-200)",                
          }}
        />
      ))}
    </Box>
  );
}