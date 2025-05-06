import { TableRow, TableCell, Skeleton, Box } from "@mui/material";

export default function MessageSkeletonRow() {
  return (
    <TableRow>
      <TableCell padding="checkbox" sx={{ pl: 1.5 }}>
        <Skeleton variant="circular" width={20} height={20} />
      </TableCell>

      <TableCell sx={{ py: 2, pl: 2 }}>
        <Skeleton variant="text" width="60%" height={24} />
      </TableCell>

      <TableCell sx={{ py: 1.5 }}>
        <Skeleton variant="text" width="90%" height={24} />
      </TableCell>

      <TableCell align="center" sx={{ py: 1.5 }}>
        <Box display="flex" justifyContent="center">
          <Skeleton variant="text" width="40%" height={24} />
        </Box>
      </TableCell>

      <TableCell align="center" sx={{ py: 1.5 }}>
        <Box display="flex" justifyContent="center">
          <Skeleton variant="text" width="60%" height={24} />
        </Box>
      </TableCell>
    </TableRow>
  );
}
