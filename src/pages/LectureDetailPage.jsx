// src/pages/LectureDetailPage.jsx

import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Box, Stack, Typography } from "@mui/material";
import { getLecture } from "../lib/api/lectureApi";
import axiosInstance from "../lib/axiosInstance";
import { useUserStore } from "../store/useUserStore";

import LectureHeader from "../components/LectureDetail/LectureHeader";
import LectureTabs from "../components/LectureDetail/LectureTabs";
import LectureInfoBox from "../components/LectureDetail/LectureInfoBox";
import CustomToast from "../components/common/CustomToast";
import warnGif from "../assets/warn.gif";

// Skeleton components
import LectureHeaderSkeleton from "../components/LectureDetail/skeleton/LectureHeaderSkeleton";
import LectureInfoBoxSkeleton from "../components/LectureDetail/skeleton/LectureInfoBoxSkeleton";

export default function LectureDetailPage() {
  const { lectureId } = useParams();
  const [lecture, setLecture] = useState(null);
  const [loading, setLoading] = useState(true);
  const [toastOpen, setToastOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastIcon, setToastIcon] = useState(null);
  const { userId } = useUserStore();

  useEffect(() => {
    const fetchLectureData = async () => {
      try {
        setLoading(true);
        const response = await getLecture(lectureId);

        if (response.success && response.data) {
          const lectureData = response.data;

          // 공개 멘토 프로필 API로 변경
          const publicProfileRes = await axiosInstance.get(
            `/api/account/mentor/${lectureData.mentorId}/public-profile`
          );
          const mergedMentor = publicProfileRes?.data?.data;

          const formattedLecture = formatLectureData({
            ...lectureData,
            mentorInfo: mergedMentor,
          });

          setLecture(formattedLecture);
        } else {
          throw new Error(
            response.message || "강의 정보를 불러오는데 실패했어요."
          );
        }
      } catch (err) {
        console.error(err);
        setToastIcon(warnGif);
        setToastMessage("강의 정보를 불러오는데 실패했어요.");
        setToastOpen(true);
      } finally {
        setLoading(false);
      }
    };

    if (lectureId) fetchLectureData();
  }, [lectureId]);

  const formatLectureData = (data) => {
    let timeSlots = [];
    if (data.timeSlots) {
      try {
        timeSlots =
          typeof data.timeSlots === "string"
            ? JSON.parse(data.timeSlots)
            : data.timeSlots;
      } catch (e) {
        console.error("Error parsing timeSlots:", e);
      }
    }

    let regions = [];
    if (data.regions) {
      try {
        regions =
          typeof data.regions === "string"
            ? JSON.parse(data.regions)
            : data.regions;
      } catch (e) {
        console.error("Error parsing regions:", e);
      }
    }

    const category = {
      parent: data.parentCategory || "",
      middle: data.middleCategory || "",
      sub: data.subcategory || "",
    };

    const mentor = data.mentorInfo;

    return {
      lectureId: data.lectureId,
      title: data.lectureTitle,
      description: data.description,
      price: data.price,
      curriculum: data.curriculum,
      category,
      isClosed: data.isClosed,
      status: data.status,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
      availableTimeSlots: timeSlots,
      regions,
      mentor,
      reviews: [],
      authorUserId: data.authorUserId,
      mentorId: data.mentorId,
    };
  };

  return (
    <Box sx={{ mt: 8, mb: 10 }}>
      {loading ? (
        <Stack
          direction={{ xs: "column", md: "row" }}
          spacing={6}
          justifyContent="space-between"
        >
          <Box flex={1}>
            <LectureHeaderSkeleton />
            <Box mt={6}>
              <LectureTabs loading={true} />
            </Box>
          </Box>
          <Box sx={{ width: { xs: "100%", md: 300 } }}>
            <LectureInfoBoxSkeleton />
          </Box>
        </Stack>
      ) : lecture ? (
        <Stack
          direction={{ xs: "column", md: "row" }}
          spacing={6}
          justifyContent="space-between"
        >
          <Box flex={1}>
            <LectureHeader lecture={lecture} />
            <Box mt={6}>
              <LectureTabs lecture={lecture} loading={false} />
            </Box>
          </Box>
          <Box sx={{ width: { xs: "100%", md: 300 } }}>
            <LectureInfoBox lecture={lecture} />
          </Box>
        </Stack>
      ) : (
        <Typography textAlign="center" mt={10}>
          해당 강의를 찾을 수 없어요. URL을 확인해주세요.
        </Typography>
      )}

      <CustomToast
        open={toastOpen}
        onClose={() => setToastOpen(false)}
        message={toastMessage}
        iconSrc={toastIcon}
        type="error"
      />
    </Box>
  );
}