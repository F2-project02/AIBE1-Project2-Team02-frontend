import { Box, Stack, Button, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import RegisteredLectureItem from "./RegisteredInquiryItem";
import RegisteredInquirySkeleton from "./RegisteredInquirySkeleton";
import useInquiryStore from "../../../store/useInquiryStore";
import { getMyRegisteredLectures } from "../../../lib/api/inquiryApi";
import MoreButton from "../MoreButton";
import { toggleLectureStatus } from "../../../lib/api/inquiryApi";
import CustomToast from "../../common/CustomToast";
import warnGif from "../../../assets/warn.gif";

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
        {loading
          ? Array(3)
              .fill(null)
              .map((_, idx) => <RegisteredInquirySkeleton key={idx} />)
          : displayedLectures.map((lecture) => (
              <RegisteredLectureItem
                key={lecture.lectureId}
                data={lecture}
                onToggle={() =>
                  handleLectureToggle(lecture.lectureId, lecture.isClosed)
                }
              />
            ))}

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
