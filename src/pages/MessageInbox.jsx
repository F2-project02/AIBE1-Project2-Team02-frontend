// src/pages/MessageInbox.jsx

import { Box, Typography, Paper } from "@mui/material";
import { useState, useEffect } from "react";
import MessageTabs from "../components/Messages/MessageTabs";
import MessageSearchFilter from "../components/Messages/MessageSearchFilter";
import MessageTable from "../components/Messages/MessageTable/MessageTable";
import { dummyReceivedMessages } from "../constants/mock/dummyReceivedMessages";
import { dummySentMessages } from "../constants/mock/dummySentMessages";

export default function MessageInbox() {
  const [tab, setTab] = useState(0);
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    if (tab === 0) {
      // 받은 쪽지함
      setMessages(dummyReceivedMessages);
    } else {
      // 보낸 쪽지함
      setMessages(dummySentMessages);
    }
  }, [tab]);

  const handleTabChange = (e, newValue) => {
    setTab(newValue);
  };

  const handleSearch = ({ filterBy, keyword }) => {
    console.log("검색 조건:", filterBy, keyword);
    // 👉 여기서 필터링 쿼리 or 리스트 필터링 처리
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
