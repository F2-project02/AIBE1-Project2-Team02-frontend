// src/pages/MessageInbox.jsx

import { Box, Button } from "@mui/material";
import { useState, useEffect } from "react";
import MessageTabs from "../components/Messages/MessageTabs";
import MessageSearchFilter from "../components/Messages/MessageSearchFilter";
import MessageTable from "../components/Messages/MessageTable/MessageTable";
import { useMessageStore } from "../store/useMessageStore";
import { getMessages, deleteMessages } from "../lib/api/messageApi";
import MessageReportModal from "../components/Messages/MessageReportModal";
import MessageDeleteModal from "../components/Messages/MessageDeleteModal";
import CustomToast from "../components/common/CustomToast";
import warnGif from "../assets/warn.gif";
import messageGif from "../assets/message.gif";

export default function MessageInbox() {
  const {
    tab,
    setTab,
    filter,
    setFilter,
    page,
    setPage,
    selectedMessageIds,
    clearSelectedMessageIds,
  } = useMessageStore();
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [totalCount, setTotalCount] = useState(0);

  const [reportOpen, setReportOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [selectedMessage, setSelectedMessage] = useState(null);

  const [toastOpen, setToastOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastIcon, setToastIcon] = useState(null);
  const [toastType, setToastType] = useState("info");

  const showToast = (message, icon = null, type = "info") => {
    setToastMessage(message);
    setToastIcon(icon);
    setToastType(type);
    setToastOpen(true);
  };

  const handleReportClick = () => {
    if (selectedMessageIds.length === 0) {
      showToast("신고할 항목을 선택해주세요.", warnGif, "warning");
      return;
    }

    if (selectedMessageIds.length > 1) {
      showToast("신고는 하나만 선택해주세요.", warnGif, "warning");
      return;
    }

    const selected = messages.find(
      (msg) => msg.messageId === selectedMessageIds[0]
    );

    if (!selected) {
      showToast("선택한 메시지를 찾을 수 없습니다.", warnGif, "error");
      return;
    }

    setSelectedMessage(selected);
    setReportOpen(true);
  };

  const handleDeleteClick = () => {
    if (selectedMessageIds.length === 0) {
      showToast("삭제할 항목을 선택해주세요.", warnGif, "warning");
      return;
    }
    setDeleteOpen(true);
  };

  const handleDeleteConfirm = async () => {
    console.log("삭제 시도:", selectedMessageIds);
    try {
      await deleteMessages({ messageIds: selectedMessageIds });
      clearSelectedMessageIds();
      await fetchData();
    } catch (e) {
      console.error("삭제 실패", e);
      throw e;
    }
  };

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
    clearSelectedMessageIds();
  };

  const handleSearch = ({ filterBy, keyword }) => {
    setPage(0);
    setFilter({ filterBy, keyword });
  };
  return (
    <>
      <Box mt={4} mb={8}>
        <MessageTabs value={tab} onChange={handleTabChange} />

        {/* 필터 */}
        <Box
          mt={2}
          display="flex"
          justifyContent="space-between"
          alignItems="center"
        >
          {/* 왼쪽: 버튼 영역 */}

          <Box display="flex" gap={1}>
            <Button
              variant="outlined"
              onClick={handleDeleteClick}
              sx={{
                borderRadius: "10px",
                minWidth: 80,
                fontWeight: 500,
                color: "var(--text-300)",
                borderColor: "var(--bg-300)",
              }}
            >
              삭제
            </Button>
            {tab === 0 && (
              <Button
                variant="outlined"
                onClick={handleReportClick}
                sx={{
                  borderRadius: "10px",
                  minWidth: 80,
                  fontWeight: 500,
                  color: "var(--text-300)",
                  borderColor: "var(--bg-300)",
                }}
              >
                신고
              </Button>
            )}
          </Box>

          {/* 오른쪽: 필터 */}
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

      <MessageReportModal
        open={reportOpen}
        onClose={() => setReportOpen(false)}
        message={selectedMessage}
        showToast={showToast}
      />

      <MessageDeleteModal
        key={deleteOpen ? "open" : "closed"}
        open={deleteOpen}
        onClose={() => setDeleteOpen(false)}
        onDelete={handleDeleteConfirm}
        showToast={showToast}
        selectedCount={selectedMessageIds.length}
      />

      <CustomToast
        open={toastOpen}
        onClose={() => setToastOpen(false)}
        message={toastMessage}
        iconSrc={toastIcon}
        type={toastType}
      />
    </>
  );
}
