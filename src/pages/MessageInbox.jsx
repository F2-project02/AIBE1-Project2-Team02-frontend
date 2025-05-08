// src/pages/MessageInbox.jsx

import { Box } from "@mui/material";
import { useState, useEffect } from "react";
import MessageTabs from "../components/Messages/MessageTabs";
import MessageSearchFilter from "../components/Messages/MessageSearchFilter";
import MessageTable from "../components/Messages/MessageTable/MessageTable";
import { useMessageStore } from "../store/useMessageStore";
import { getMessages } from "../lib/api/messageApi";

export default function MessageInbox() {
  const { tab, setTab, filter, setFilter, page, setPage } = useMessageStore();
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [totalCount, setTotalCount] = useState(0);

  const fetchData = async () => {
    setLoading(true);
    try {
      const data = await getMessages({
        tab,
        page,
        filterBy: filter.filterBy,
        keyword: filter.keyword,
      });
      setMessages(data.content);
      setTotalCount(data.totalCount);
    } catch (e) {
      console.error("메시지 불러오기 실패", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [tab, page, filter]);

  const handleTabChange = (_, newValue) => {
    setTab(newValue);
    setPage(0);
    setFilter({ filterBy: "nickname", keyword: "" });
  };

  const handleSearch = ({ filterBy, keyword }) => {
    setPage(0);
    setFilter({ filterBy, keyword });
  };
  return (
    <Box mt={4}>
      <MessageTabs value={tab} onChange={handleTabChange} />

      {/* 필터 */}
      <Box mt={2} display="flex" justifyContent="flex-end">
        <MessageSearchFilter onSearch={handleSearch} />
      </Box>

      {/* 쪽지 리스트 */}
      <Box mt={2}>
        <MessageTable
          messages={messages}
          loading={loading}
          tab={tab}
          totalItems={totalCount} // 총 개수
          totalPages={Math.ceil(totalCount / 10)} // 총 페이지 수
        />
      </Box>
    </Box>
  );
}
