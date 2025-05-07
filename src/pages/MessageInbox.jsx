// src/pages/MessageInbox.jsx

import { Box, Typography, Paper } from "@mui/material";
import { useState, useEffect } from "react";
import MessageTabs from "../components/Messages/MessageTabs";
import MessageSearchFilter from "../components/Messages/MessageSearchFilter";
import MessageTable from "../components/Messages/MessageTable/MessageTable";
import { dummyReceivedMessages } from "../constants/mock/dummyReceivedMessages";
import { dummySentMessages } from "../constants/mock/dummySentMessages";
import { useMessageStore } from "../store/useMessageStore";

export default function MessageInbox() {
  const { tab, setTab, filter, setFilter, page, setPage } = useMessageStore();
  const messages = tab === 0 ? dummyReceivedMessages : dummySentMessages;

  const handleTabChange = (_, newValue) => {
    setTab(newValue);
    setPage(0);
  };

  const handleSearch = ({ filterBy, keyword }) => {
    setFilter({ filterBy, keyword });
    setPage(0);
  };

  return (
    <Box p={4} sx={{ backgroundColor: "#fff" }}>
      <MessageTabs value={tab} onChange={handleTabChange} />

      {/* 필터 */}
      <Box mt={4} display="flex" justifyContent="flex-end">
        <MessageSearchFilter onSearch={handleSearch} />
      </Box>

      {/* 쪽지 리스트 */}
      <Box mt={2}>
        <MessageTable messages={messages} loading={false} tab={tab} />
      </Box>
    </Box>
  );
}
