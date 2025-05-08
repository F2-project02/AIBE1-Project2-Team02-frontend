import { Box, Stack, Button, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import MyRegisteredLectureItem from "./RegisteredInquiryItem";
import RegisteredInquirySkeleton from "./RegisteredInquirySkeleton";
import useInquiryStore from "../../../store/useInquiryStore";
import { getMyRegisteredLectures } from "../../../lib/api/inquiryApi";

export default function RegisteredInquiriesList({
  onLectureClick,
  selectedLectureId,
}) {
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
        console.log(data);
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
    // 이미 선택된 강의면 선택 해제, 아니면 선택
    const newId = selectedLectureId === lectureId ? null : lectureId;

    // 부모 컴포넌트에 선택된 강의 ID 전달
    if (onLectureClick) onLectureClick(newId);
  };

  const handleExpandClick = () => {
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
                isSelected={selectedLectureId === lecture.lectureId}
                onToggle={() => handleLectureToggle(lecture.lectureId)}
              />
            ))}

        {!loading && registeredLectures.length > 3 && (
          <Box display="flex" justifyContent="center" mt={1}>
            <Button
              fullWidth
              variant="outlined"
              onClick={() => setIsExpanded((prev) => !prev)}
              sx={{
                backgroundColor: "var(--bg-100)",
                borderRadius: "12px",
                borderColor: "var(--bg-300)",
                color: "var(--text-400)",
                fontWeight: 600,
                height: 30,
                p: 1.5,
                ":hover": {
                  backgroundColor: "var(--bg-200)",
                },
              }}
            >
              {isExpanded ? "접기" : "더보기"}
            </Button>
          </Box>
        )}
      </Stack>
    </Box>
  );
}
