// src/pages/CreateLecture.jsx

import { useState, useEffect } from "react";
import { Box, Typography, Paper } from "@mui/material";
import CreateLectureTab from "../components/CreateLecture/CreateLectureTabs";
import BasicInfoForm from "../components/CreateLecture/BasicInfoForm";
import CurriculumForm from "../components/CreateLecture/CurriculumForm";
import ScheduleAndLocationForm from "../components/CreateLecture/ScheduleAndLocationForm";
import UnauthorizedView from "../components/CreateLecture/UnauthorizedView";
import { useUserStore } from "../store/useUserStore";
import { useLectureStore } from "../store/useLectureStore";
import { createLecture } from "../lib/api/lectureApi";
import { mapLectureFormToApi } from "../utils/lectureDataMapper";

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
  const { formData, isLoading, error, setError, setIsLoading, setFormData } =
    useLectureStore();

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
          alert("필수 항목을 모두 입력해주세요.");
          return;
        }
        if (!formData.categoryId) {
          alert("카테고리를 완전히 선택해주세요.");
          return;
        }
      } else if (currentTab === 1) {
        // 커리큘럼 탭 유효성 검사
        if (!formData.curriculum) {
          alert("커리큘럼을 입력해주세요.");
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
        alert("기본 정보와 커리큘럼을 모두 입력해주세요.");
        return;
      }

      if (formData.timeSlots.length === 0) {
        alert("최소 하나의 시간대를 입력해주세요.");
        return;
      }

      if (formData.regions.length === 0) {
        alert("최소 하나의 지역을 선택해주세요.");
        return;
      }

      setIsLoading(true);
      setError(null);

      // 폼 데이터를 API 형식으로 변환
      const apiData = mapLectureFormToApi(formData);

      // API 호출
      const response = await createLecture(apiData);

      if (response.success) {
        alert("과외가 성공적으로 등록되었습니다!");
        window.location.href = "/";
      } else {
        throw new Error(response.message || "과외 등록에 실패했습니다.");
      }
    } catch (err) {
      console.error("Error creating lecture:", err);
      alert(
        "과외 등록에 실패했습니다. 모든 필수 항목을 입력했는지 확인해주세요."
      );
    } finally {
      setIsLoading(false);
    }
  };

  // 임시로 항상 true로 설정하여 테스트 가능하게 함
  const isMentor = true;

  // 테스트를 위해 항상 폼을 보여줌
  // if (!isLoggedIn || !isMentor) {
  //   return <UnauthorizedView />;
  // }

  return (
    <Box sx={{ mt: 4, mb: 4 }}>
      {/* 개발 모드 안내 */}
      {import.meta.env.DEV && (
        <Box sx={{ mb: 3, p: 2, bgcolor: "var(--action-primary-bg)", borderRadius: "8px" }}>
          <Typography variant="body2" color="var(--primary-300)">
            ※ 현재 개발 모드입니다. 임시 토큰이 설정되었습니다.
          </Typography>
        </Box>
      )}

      {/* 상단 타이틀 */}
      <Typography variant="h5" fontWeight={600} color="var(--text-100)" mt={4} mb={4}>
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
          <BasicInfoForm onNext={handleBasicInfoNext} />
        </TabPanel>

        <TabPanel value={currentTab} index={1}>
          <CurriculumForm onNext={handleCurriculumNext} />
        </TabPanel>

        <TabPanel value={currentTab} index={2}>
          <ScheduleAndLocationForm
            onSubmit={handleScheduleSubmit}
            isLoading={isLoading}
          />
        </TabPanel>
      </Paper>
    </Box>
  );
}