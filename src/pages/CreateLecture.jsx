// src/pages/CreateLecture.jsx

import { useState, useEffect } from "react";
import { Box, Typography, Tabs, Tab, Paper } from "@mui/material";
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

  const handleTabChange = (newValue) => {
    setCurrentTab(newValue);
  };

  const handleBasicInfoNext = (data) => {
    setFormData({
      ...formData,
      ...data,
    });
    setCurrentTab(1);
  };

  const handleCurriculumNext = (data) => {
    setFormData({
      ...formData,
      ...data,
    });
    setCurrentTab(2);
  };

  const handleScheduleSubmit = async () => {
    try {
      setIsLoading(true);
      setError(null);

      // 폼 데이터를 API 형식으로 변환
      const apiData = mapLectureFormToApi(formData);
      console.log("Sending data:", apiData); // 전송하는 데이터 확인

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
      setError(err.message);
      alert(err.message);
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
    <Box sx={{ mt: 4 }}>
      {/* 개발 모드 안내 */}
      {import.meta.env.DEV && (
        <Box sx={{ mb: 2, p: 1, bgcolor: "info.light", borderRadius: 1 }}>
          <Typography variant="body2" color="info.contrastText">
            현재 개발 모드입니다. 임시 토큰이 설정되었습니다.
          </Typography>
        </Box>
      )}

      {/* 상단 타이틀 */}
      <Typography variant="h5" fontWeight={600} gutterBottom>
        과외 등록하기
      </Typography>

      <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
        여러분의 지식과 경험을 공유해주세요!
      </Typography>

      {/* 탭 메뉴 */}
      <Box
        sx={{
          borderBottom: 1,
          borderColor: "divider",
          mb: 3,
        }}
      >
        <Tabs
          value={currentTab}
          onChange={(_, newValue) => handleTabChange(newValue)}
          sx={{
            minHeight: 48,
            "& .MuiTab-root": {
              textTransform: "none",
              fontSize: 16,
              fontWeight: 600,
              color: "var(--text-400)",
              padding: "12px 24px",
              "&.Mui-selected": {
                color: "var(--primary-200)",
              },
            },
          }}
        >
          <Tab label="기본 정보" />
          <Tab label="커리큘럼" />
          <Tab label="일정 및 지역" />
        </Tabs>
      </Box>

      {/* 탭 패널 */}
      <Paper elevation={0} sx={{ p: 4, borderRadius: 2 }}>
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

      {/* 에러 메시지 */}
      {error && (
        <Box
          sx={{
            mt: 2,
            p: 2,
            bgcolor: "error.light",
            borderRadius: 1,
            color: "error.contrastText",
          }}
        >
          {error}
        </Box>
      )}
    </Box>
  );
}
