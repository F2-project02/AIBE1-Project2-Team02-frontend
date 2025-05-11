// src/pages/CreateLecture.jsx

import { useState, useEffect } from "react";
import { Box, Typography, Paper } from "@mui/material";
import CreateLectureTab from "../components/CreateLecture/CreateLectureTabs";
import BasicInfoForm from "../components/CreateLecture/BasicInfoForm";
import CurriculumForm from "../components/CreateLecture/CurriculumForm";
import ScheduleAndLocationForm from "../components/CreateLecture/ScheduleAndLocationForm";
import CustomToast from "../components/common/CustomToast";
import UnauthorizedView from "../components/CreateLecture/UnauthorizedView";
import BasicInfoFormSkeleton from "../components/CreateLecture/skeletons/BasicInfoFormSkeleton";
import { useUserStore } from "../store/useUserStore";
import { useLectureStore } from "../store/useLectureStore";
import { createLecture } from "../lib/api/lectureApi";
import { accountApi } from "../lib/api/accountApi";
import { mapLectureFormToApi } from "../utils/lectureDataMapper";
import {
  validateBasicInfo,
  validateCurriculum,
  validateFinalLectureData,
} from "../utils/lectureFormValidator";

import { getModerationMessage } from "../utils/moderationHelper";
import createLectureGif from "../assets/createlecture.gif";
import warnGif from "../assets/warn.gif";

function TabPanel({ children, value, index }) {
  return (
    <div role="tabpanel" hidden={value !== index} style={{ marginTop: "24px" }}>
      {value === index && <Box>{children}</Box>}
    </div>
  );
}

export default function CreateLecture() {
  const [currentTab, setCurrentTab] = useState(0);
  const { isLoggedIn } = useUserStore();
  const { formData, isLoading, error, setError, setIsLoading } =
    useLectureStore();

  const [isMentor, setIsMentor] = useState(null);
  const [profileLoading, setProfileLoading] = useState(true);

  const [toastOpen, setToastOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastIcon, setToastIcon] = useState(null);
  const [toastType, setToastType] = useState("info");

  // 멘토 권한 확인
  useEffect(() => {
    const checkMentorStatus = async () => {
      if (isLoggedIn) {
        try {
          setProfileLoading(true);
          const response = await accountApi.getProfile();

          if (response.success && response.data) {
            setIsMentor(response.data.role === "MENTOR");
          } else {
            setIsMentor(false);
          }
        } catch (error) {
          setIsMentor(false);
          showToast("권한 확인 중 오류가 발생했어요.", warnGif, "error");
        } finally {
          setProfileLoading(false);
        }
      } else {
        setProfileLoading(false);
        setIsMentor(false);
      }
    };

    checkMentorStatus();
  }, [isLoggedIn]);

  const showToast = (message, icon = null, type = "info") => {
    setToastMessage(message);
    setToastIcon(icon);
    setToastType(type);
    setToastOpen(true);
  };

  const handleTabChange = (newValue) => {
    if (newValue > currentTab) {
      if (currentTab === 0 && !validateBasicInfo(formData)) {
        showToast("기본 정보를 모두 입력해주세요.", warnGif, "error");
        return;
      }
      if (currentTab === 1 && !validateCurriculum(formData)) {
        showToast("커리큘럼을 입력해주세요.", warnGif, "error");
        return;
      }
    }
    setCurrentTab(newValue);
  };

  const handleBasicInfoNext = () => setCurrentTab(1);
  const handleCurriculumNext = () => setCurrentTab(2);

  const handleScheduleSubmit = async () => {
    if (!validateFinalLectureData(formData)) {
      showToast("빠진 정보가 없는지 확인해주세요.", warnGif, "error");
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      const apiData = mapLectureFormToApi(formData);
      const response = await createLecture(apiData);

      if (response.success) {
        showToast("과외가 성공적으로 등록되었어요!", createLectureGif);
        setTimeout(() => {
          window.location.href = "/";
        }, 3000);
      } else {
        const friendlyMessage = getModerationMessage(response.message);
        showToast(friendlyMessage, warnGif, "error");
      }
    } catch (err) {
      const message = err?.response?.data?.message;
      const fallback = "잠시 연결이 원활하지 않아요. 다시 시도해주세요.";
      showToast(getModerationMessage(message) || fallback, warnGif, "error");
    } finally {
      setIsLoading(false);
    }
  };

  // 1단계: 멘토 확인 전
  if (profileLoading || isMentor === null) {
    return (
      <Box sx={{ mt: 4, mb: 4 }}>
        <Typography
          variant="h5"
          fontWeight={600}
          color="var(--text-100)"
          mt={4}
          mb={4}
        >
          새 과외 등록
        </Typography>
        <CreateLectureTab value={0} onChange={() => {}} />
        <Paper elevation={0} sx={{ backgroundColor: "var(--bg-100)" }}>
          <BasicInfoFormSkeleton />
        </Paper>
      </Box>
    );
  }

  // 2단계: 로그인 안 했거나 멘토 아님
  if (!isLoggedIn || isMentor === false) {
    return <UnauthorizedView />;
  }

  // 3단계: 정상 멘토 계정
  return (
    <Box sx={{ mt: 4, mb: 4 }}>
      <Typography
        variant="h5"
        fontWeight={600}
        color="var(--text-100)"
        mt={4}
        mb={4}
      >
        새 과외 등록
      </Typography>

      <CreateLectureTab value={currentTab} onChange={handleTabChange} />

      <Paper elevation={0} sx={{ backgroundColor: "var(--bg-100)" }}>
        <TabPanel value={currentTab} index={0}>
          <BasicInfoForm
            onNext={handleBasicInfoNext}
            showToast={(msg) => showToast(msg, warnGif, "error")}
          />
        </TabPanel>

        <TabPanel value={currentTab} index={1}>
          <CurriculumForm
            onNext={handleCurriculumNext}
            showToast={(msg) => showToast(msg, warnGif, "error")}
          />
        </TabPanel>

        <TabPanel value={currentTab} index={2}>
          <ScheduleAndLocationForm
            onSubmit={handleScheduleSubmit}
            isLoading={isLoading}
            showToast={(msg) => showToast(msg, warnGif, "error")}
          />
        </TabPanel>
      </Paper>

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