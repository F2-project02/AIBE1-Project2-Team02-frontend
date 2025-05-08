// src/components/Messages/MessageTable/MessageSkeletonRow.jsx

import { TableRow, TableCell, Skeleton, Box } from "@mui/material";

export default function MessageSkeletonRow() {
  const skeletonSx = { bgcolor: "var(--bg-200)", animation: "wave" };

  return (
    <TableRow sx={{ bgcolor: "var(--bg-100)" }}>
      <TableCell padding="checkbox" sx={{ pl: 1.5 }}>
        <Skeleton variant="circular" width={20} height={20} sx={skeletonSx} />
      </TableCell>

      <TableCell sx={{ py: 2, pl: 2 }}>
        <Skeleton variant="text" width="60%" height={24} sx={skeletonSx} />
      </TableCell>

      <TableCell sx={{ py: 1.5 }}>
        <Skeleton variant="text" width="90%" height={24} sx={skeletonSx} />
      </TableCell>

      <TableCell align="center" sx={{ py: 1.5 }}>
        <Box display="flex" justifyContent="center">
          <Skeleton variant="text" width="40%" height={24} sx={skeletonSx} />
        </Box>
      </TableCell>

      <TableCell align="center" sx={{ py: 1.5 }}>
        <Box display="flex" justifyContent="center">
          <Skeleton variant="text" width="60%" height={24} sx={skeletonSx} />
        </Box>
      </TableCell>
    </TableRow>
  );
}