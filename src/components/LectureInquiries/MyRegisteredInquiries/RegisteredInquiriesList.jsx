import { Box, Stack, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import RegisteredLectureItem from "./RegisteredInquiryItem";
import RegisteredInquirySkeleton from "./RegisteredInquirySkeleton";
import useInquiryStore from "../../../store/useInquiryStore";
import { getMyRegisteredLectures } from "../../../lib/api/inquiryApi";
import MoreButton from "../MoreButton";
import { toggleLectureStatus } from "../../../lib/api/inquiryApi";
import CustomToast from "../../common/CustomToast";
import warnGif from "../../../assets/warn.gif";
import { useNavigate } from "react-router-dom";

export default function RegisteredInquiriesList() {
  const {
    registeredLectures,
    setRegisteredLectures,
    loading,
    setLoading,
    setError,
  } = useInquiryStore();

  const [isExpanded, setIsExpanded] = useState(false);

  const [toastOpen, setToastOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastIcon, setToastIcon] = useState(null);
  const [toastType, setToastType] = useState("info");

  const navigate = useNavigate();

  const showToast = (message, icon = null, type = "info") => {
    setToastMessage(message);
    setToastIcon(icon);
    setToastType(type);
    setToastOpen(true);
  };

  useEffect(() => {
    const fetchLectures = async () => {
      setLoading(true);
      try {
        const data = await getMyRegisteredLectures();
        setRegisteredLectures(data);
      } catch (err) {
        console.error("등록한 과외 조회 실패:", err);
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchLectures();
  }, [setRegisteredLectures, setLoading, setError]);

  const displayedLectures = isExpanded
    ? registeredLectures
    : registeredLectures.slice(0, 3);

  const handleLectureToggle = async (lectureId, isClosed) => {
    try {
      await toggleLectureStatus(lectureId, !isClosed);

      const updatedLectures = registeredLectures.map((lecture) =>
        lecture.lectureId === lectureId
          ? { ...lecture, isClosed: !isClosed }
          : lecture
      );

      setRegisteredLectures(updatedLectures);
    } catch (err) {
      showToast(err.response?.data?.message, warnGif, "error");
    }
  };

  const handleToggle = () => {
    setIsExpanded((prev) => !prev);
  };

  return (
    <Box>
      <Stack>
        {loading ? (
          Array(3)
            .fill(null)
            .map((_, idx) => <RegisteredInquirySkeleton key={idx} />)
        ) : registeredLectures.length === 0 ? (
          <Box
            onClick={() => navigate("/register")}
            sx={{
              width: 400,
              minHeight: 220,
              px: 2,
              py: 3,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              flexDirection: "column",
              bgcolor: "#fefefe",
              borderRadius: 2,
              border: "1px dashed var(--bg-300)",
              color: "var(--text-300)",
              fontWeight: 500,
              textAlign: "center",
              cursor: "pointer",
              transition: "all 0.2s",
              "&:hover": {
                backgroundColor: "var(--bg-100)",
              },
            }}
          >
            <Typography variant="body1" fontWeight={600}>
              등록된 과외가 없습니다.
            </Typography>
            <Typography variant="body2" color="var(--text-400)" mt={1}>
              과외를 등록해보세요!
            </Typography>
          </Box>
        ) : (
          displayedLectures.map((lecture) => (
            <RegisteredLectureItem
              key={lecture.lectureId}
              data={lecture}
              onToggle={() =>
                handleLectureToggle(lecture.lectureId, lecture.isClosed)
              }
            />
          ))
        )}

        {!loading && registeredLectures.length > 3 && (
          <MoreButton isExpanded={isExpanded} onClick={handleToggle} />
        )}
      </Stack>

      <CustomToast
        open={toastOpen}
        onClose={() => setToastOpen(false)}
        message={toastMessage}
        iconSrc={toastIcon}
        type={toastType}
      />
    </Box>
  );
}
