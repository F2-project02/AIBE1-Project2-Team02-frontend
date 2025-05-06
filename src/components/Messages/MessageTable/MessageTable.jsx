// src/components/Messages/MessageTable/MessageTable.jsx

import {
  Table,
  TableBody,
  TableRow,
  TableCell,
  TableContainer,
  Paper,
  useMediaQuery,
  useTheme,
  Box,
  Typography,
} from "@mui/material";
import TableHeaderRow from "./TableHeaderRow";
import MessageRow from "./MessageRow";
import TablePagination from "./TablePagination";
import MessageModal from "../MessageModal";
import { useState, useEffect, useCallback } from "react";
import MessageSkeletonRow from "./MessageSkeletonRow";

export default function MessageTable({ messages = [], loading, tab }) {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [selectedMessageId, setSelectedMessageId] = useState(null);
  const [selectedAll, setSelectedAll] = useState(false);
  const [selectedMessages, setSelectedMessages] = useState([]);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const displayedMessages = messages.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  const isPageFull = displayedMessages.length === 10;

  const handleRowClick = (messageId) => {
    setSelectedMessageId(messageId);
  };

  const handleSelect = useCallback(
    (messageId) => {
      const newSelectedMessages = [...selectedMessages];
      const messageIndex = newSelectedMessages.indexOf(messageId);

      if (messageIndex === -1) {
        newSelectedMessages.push(messageId);
      } else {
        newSelectedMessages.splice(messageIndex, 1);
      }

      setSelectedMessages(newSelectedMessages);
      setSelectedAll(newSelectedMessages.length === displayedMessages.length);
    },
    [displayedMessages, selectedMessages, setSelectedAll, setSelectedMessages]
  );

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = displayedMessages.map((n) => n.messageId);
      setSelectedMessages(newSelecteds);
    } else {
      setSelectedMessages([]);
    }
    setSelectedAll(event.target.checked);
  };

  useEffect(() => {
    if (!displayedMessages.length) {
      setSelectedAll(false);
      setSelectedMessages([]);
      return;
    }
    setSelectedAll(selectedMessages.length === displayedMessages.length);
  }, [displayedMessages.length, selectedMessages.length]);

  useEffect(() => {
    setPage(0);
    setSelectedAll(false);
    setSelectedMessages([]);
  }, [messages.length]);

  const isMessageSelected = (messageId) =>
    selectedMessages.indexOf(messageId) !== -1;

  return (
    <>
      <TableContainer
        component={Paper}
        elevation={0}
        sx={{
          boxShadow: "none",
          minHeight: 585,
          width: "100%",
          overflowX: "auto",
        }}
      >
        <Table sx={{ width: isMobile ? "auto" : "100%", tableLayout: "fixed" }}>
          <TableHeaderRow
            tab={tab}
            numSelected={selectedMessages.length}
            rowCount={displayedMessages.length}
            onSelectAllClick={handleSelectAllClick}
            selectedAll={selectedAll}
            isMobile={isMobile}
          />
          <TableBody>
            {loading ? (
              Array.from({ length: 10 }).map((_, i) => (
                <MessageSkeletonRow key={i} />
              ))
            ) : displayedMessages.length > 0 ? (
              displayedMessages.map((msg, i) => (
                <MessageRow
                  key={msg.messageId}
                  {...msg}
                  onClick={handleRowClick}
                  isLast={i === displayedMessages.length - 1}
                  removeBorder={isPageFull && i === 9}
                  isSelected={isMessageSelected(msg.messageId)}
                  onSelect={handleSelect}
                  isMobile={isMobile}
                />
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={isMobile ? 3 : 5}
                  align="center"
                  sx={{
                    height: 300,
                    borderBottom: "none",
                    px: 0,
                    py: 0,
                  }}
                >
                  <Box
                    display="flex"
                    justifyContent="center"
                    alignItems="center"
                    height="100%"
                    width="100%"
                  >
                    <Typography
                      color="text.secondary"
                      fontSize="14px"
                      textAlign="center"
                    >
                      쪽지가 없습니다.
                    </Typography>
                  </Box>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <TablePagination
        page={page}
        totalItems={messages.length}
        rowsPerPage={rowsPerPage}
        onPageChange={setPage}
        onRowsPerPageChange={(val) => {
          setRowsPerPage(10);
          setPage(0);
        }}
      />

      {selectedMessageId && (
        <MessageModal
          messageId={selectedMessageId}
          tab={tab}
          onClose={() => setSelectedMessageId(null)}
        />
      )}
    </>
  );
}
