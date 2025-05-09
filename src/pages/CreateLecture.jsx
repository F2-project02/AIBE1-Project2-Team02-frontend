// src/pages/CreateLecture.jsx (수정된 부분)

import { useState, useEffect } from "react";
import { Box, Typography, Paper } from "@mui/material";
import CreateLectureTab from "../components/CreateLecture/CreateLectureTabs";
import BasicInfoForm from "../components/CreateLecture/BasicInfoForm";
import CurriculumForm from "../components/CreateLecture/CurriculumForm";
import ScheduleAndLocationForm from "../components/CreateLecture/ScheduleAndLocationForm";
import CustomToast from "../components/common/CustomToast";
import UnauthorizedView from "../components/CreateLecture/UnauthorizedView";
import { useUserStore } from "../store/useUserStore";
import { useLectureStore } from "../store/useLectureStore";
import { createLecture } from "../lib/api/lectureApi";
import { accountApi } from "../lib/api/accountApi"; // 새로 추가한 API import
import { mapLectureFormToApi } from "../utils/lectureDataMapper";
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

  // 멘토 권한 상태
  const [isMentor, setIsMentor] = useState(false);
  // 프로필 로딩 상태
  const [profileLoading, setProfileLoading] = useState(true);

  const [toastOpen, setToastOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastIcon, setToastIcon] = useState(null);
  const [toastType, setToastType] = useState("info");

  // 사용자 프로필 정보 로드 및 권한 확인
  useEffect(() => {
    const checkMentorStatus = async () => {
      if (isLoggedIn) {
        try {
          setProfileLoading(true);
          const response = await accountApi.getProfile();

          if (response.success && response.data) {
            // 사용자 역할이 "MENTOR"인지 확인
            setIsMentor(response.data.role === "MENTOR");
          } else {
            setIsMentor(false);
          }
        } catch (error) {
          console.error("멘토 권한 확인 실패:", error);
          setIsMentor(false);
          showToast("권한 확인 중 오류가 발생했습니다.", warnGif, "error");
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

  // 탭 변경 시 데이터 유효성 검증
  const handleTabChange = (newValue) => {
    // 현재 탭에서 다음 탭으로 이동할 때만 유효성 검사
    if (newValue > currentTab) {
      if (currentTab === 0) {
        // 기본 정보 탭 유효성 검사
        if (
          !formData.title ||
          !formData.category ||
          !formData.middleCategory ||
          !formData.subCategory ||
          !formData.price ||
          !formData.description
        ) {
          showToast("필수 항목을 모두 입력해주세요.", warnGif, "error");
          return;
        }
        if (!formData.categoryId) {
          showToast("카테고리를 완전히 선택해주세요.", warnGif, "error");
          return;
        }
      } else if (currentTab === 1) {
        // 커리큘럼 탭 유효성 검사
        if (!formData.curriculum) {
          showToast("커리큘럼을 입력해주세요.", warnGif, "error");
          return;
        }
      }
    }

    // 유효성 검사 통과 시 탭 변경
    setCurrentTab(newValue);
  };

  const handleBasicInfoNext = () => {
    // 기본 정보 제출 시 자동으로 다음 탭으로 이동
    setCurrentTab(1);
  };

  const handleCurriculumNext = () => {
    // 커리큘럼 제출 시 자동으로 다음 탭으로 이동
    setCurrentTab(2);
  };

  const handleScheduleSubmit = async () => {
    try {
      // 최종 제출 전 모든 필수 필드 확인
      if (
        !formData.title ||
        !formData.categoryId ||
        !formData.price ||
        !formData.description ||
        !formData.curriculum
      ) {
        showToast(
          "기본 정보와 커리큘럼을 모두 입력해주세요.",
          warnGif,
          "error"
        );
        return;
      }

      if (formData.timeSlots.length === 0) {
        showToast("최소 하나의 시간대를 입력해주세요.", warnGif, "error");
        return;
      }

      if (formData.regions.length === 0) {
        showToast("최소 하나의 지역을 선택해주세요.", warnGif, "error");
        return;
      }

      setIsLoading(true);
      setError(null);

      // 폼 데이터를 API 형식으로 변환
      const apiData = mapLectureFormToApi(formData);

      // API 호출
      const response = await createLecture(apiData);

      if (response.success) {
        showToast("과외가 성공적으로 등록되었어요!", createLectureGif);
        setTimeout(() => {
          window.location.href = "/";
        }, 3000);
        return;
      } else {
        throw new Error(response.message || "과외 등록에 실패했습니다.");
      }
    } catch (err) {
      console.error("Error creating lecture:", err);
      showToast(
        "과외 등록에 실패했습니다. 모든 필수 항목을 입력했는지 확인해주세요.",
        warnGif,
        "error"
      );
    } finally {
      setIsLoading(false);
    }
  };

  // 프로필 로딩 중이면 로딩 화면 표시
  if (profileLoading) {
    return (
      <Box sx={{ mt: 8, textAlign: "center" }}>
        <Typography variant="h6">권한 확인 중...</Typography>
      </Box>
    );
  }

  // 로그인 , 멘토권한 둘중 하나라도 없으면 막기
  if (!isLoggedIn || !isMentor) {
    return <UnauthorizedView />;
  }

  return (
    <Box sx={{ mt: 4, mb: 4 }}>
      {/* 상단 타이틀 */}
      <Typography
        variant="h5"
        fontWeight={600}
        color="var(--text-100)"
        mt={4}
        mb={4}
      >
        새 과외 등록
      </Typography>

      {/* 탭 메뉴 */}
      <CreateLectureTab value={currentTab} onChange={handleTabChange} />

      {/* 탭 패널 */}
      <Paper
        elevation={0}
        sx={{
          backgroundColor: "var(--bg-100)",
        }}
      >
        <TabPanel value={currentTab} index={0}>
          <BasicInfoForm onNext={handleBasicInfoNext}   showToast={(msg) => showToast(msg, warnGif, "error")} />
        </TabPanel>

        <TabPanel value={currentTab} index={1}>
          <CurriculumForm onNext={handleCurriculumNext}   showToast={(msg) => showToast(msg, warnGif, "error")} />
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
