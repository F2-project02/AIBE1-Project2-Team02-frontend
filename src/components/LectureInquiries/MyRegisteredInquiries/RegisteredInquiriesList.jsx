import { Box, Stack, Button, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import MyRegisteredLectureItem from "./RegisteredInquiryItem";
import RegisteredInquirySkeleton from "./RegisteredInquirySkeleton";
import useInquiryStore from "../../../store/useInquiryStore";
import { getMyRegisteredLectures } from "../../../lib/api/inquiryApi";
import MoreButton from "../MoreButton";

export default function RegisteredInquiriesList() {
  const {
    registeredLectures,
    setRegisteredLectures,
    loading,
    setLoading,
    setError,
  } = useInquiryStore();

  const [isExpanded, setIsExpanded] = useState(false);

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

  const handleLectureToggle = (lectureId) => {
    // 부모 컴포넌트에 선택된 강의 ID 전달
    if (onLectureClick) onLectureClick(newId);
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
              <MyRegisteredLectureItem
                key={lecture.lectureId}
                data={lecture}
                onToggle={() => handleLectureToggle(lecture.lectureId)}
              />
            ))}

        {!loading && registeredLectures.length > 3 && (
          <MoreButton isExpanded={isExpanded} onClick={handleToggle} />
        )}
      </Stack>
    </Box>
  );
}
