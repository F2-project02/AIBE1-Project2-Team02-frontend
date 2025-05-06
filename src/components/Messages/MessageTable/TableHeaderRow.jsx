// src/components/Messages/MessageTable/TableHeaderRow.jsx

import {
  TableHead,
  TableRow,
  TableCell,
  Checkbox,
  Typography,
} from "@mui/material";
import PropTypes from "prop-types";

export default function TableHeaderRow({
  tab,
  onSelectAllClick,
  numSelected,
  rowCount,
  selectedAll,
  isMobile,
}) {
  const isReceived = tab === 0;

  return (
    <TableHead>
      <TableRow>
        <TableCell padding="checkbox">
          <Checkbox
            size="small"
            indeterminate={numSelected > 0 && numSelected < rowCount}
            checked={selectedAll}
            onChange={onSelectAllClick}
            inputProps={{ "aria-label": "select all messages" }}
          />
        </TableCell>
        <TableCell width={120}>
          <Typography>{isReceived ? "보낸 사람" : "받는 사람"}</Typography>
        </TableCell>
        <TableCell width={400}>
          <Typography>내용</Typography>
        </TableCell>
        {!isMobile && (
          <>
            <TableCell align="center">
              <Typography>읽음 여부</Typography>
            </TableCell>
            <TableCell align="center">
              <Typography>날짜</Typography>
            </TableCell>
          </>
        )}
      </TableRow>
    </TableHead>
  );
}

// TableHeaderRow.propTypes = {
//   numSelected: PropTypes.number.isRequired,
//   onSelectAllClick: PropTypes.func.isRequired,
//   rowCount: PropTypes.number.isRequired,
//   selectedAll: PropTypes.bool.isRequired,
//   tab: PropTypes.number.isRequired,
// };
