// src/pages/EditLecturePage.jsx

import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  Paper,
  Alert,
  CircularProgress,
  Tabs,
  Tab,
  Button,
  Snackbar,
} from "@mui/material";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import { getLecture, updateLecture } from "../lib/api/lectureApi";
import { useUserStore } from "../store/useUserStore";
import useLecturePermission from "../hooks/useLecturePermission";
import BasicInfoForm from "../components/CreateLecture/BasicInfoForm";
import CurriculumForm from "../components/CreateLecture/CurriculumForm";
import ScheduleAndLocationForm from "../components/CreateLecture/ScheduleAndLocationForm";
import { useLectureStore } from "../store/useLectureStore";
import { mapLectureFormToApi } from "../utils/lectureDataMapper";

function TabPanel({ children, value, index }) {
  return (
    <div role="tabpanel" hidden={value !== index} style={{ marginTop: "24px" }}>
      {value === index && <Box>{children}</Box>}
    </div>
  );
}

export default function EditLecturePage() {
  const { lectureId } = useParams();
  const navigate = useNavigate();
  const [currentTab, setCurrentTab] = useState(0);
  const [lecture, setLecture] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const { formData, setFormData, resetFormData } = useLectureStore();
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "info",
  });

  // 권한 체크
  const { hasPermission } = useLecturePermission(lecture);

  // 컴포넌트 마운트 시 강의 데이터 로드
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await getLecture(lectureId);
        if (response.success && response.data) {
          // 백엔드 응답 로깅
          console.log("Raw lecture data:", response.data);

          // 권한 확인을 위해 필요한 authorUserId 추가
          const enhancedData = {
            ...response.data,
            authorUserId: response.data.authorUserId,
          };

          setLecture(enhancedData);

          // 폼 초기값 설정
          initializeFormData(enhancedData);
        } else {
          throw new Error(response.message || "강의를 찾을 수 없습니다.");
        }
      } catch (err) {
        console.error("강의 로드 오류:", err);
        setError("강의 정보를 로드하는데 실패했습니다.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();

    // 컴포넌트 언마운트 시 폼 데이터 초기화
    return () => {
      resetFormData();
    };
  }, [lectureId, resetFormData]);

  // 강의 데이터를 폼 데이터로 변환하여 초기화
  const initializeFormData = (data) => {
    // 카테고리 정보
    const category = data.parentCategory || "";
    const middleCategory = data.middleCategory || "";
    const subCategory = data.subcategory || "";

    // timeSlots 처리
    let timeSlots = [];
    if (data.timeSlots) {
      try {
        if (typeof data.timeSlots === "string") {
          timeSlots = JSON.parse(data.timeSlots);
        } else {
          timeSlots = data.timeSlots;
        }
      } catch (e) {
        console.error("Error parsing timeSlots:", e);
      }
    }

    // regions 처리
    let regions = [];
    if (data.regions) {
      try {
        if (typeof data.regions === "string") {
          regions = JSON.parse(data.regions);
        } else {
          regions = data.regions.map((region) => {
            if (typeof region === "string") {
              // 문자열 형태의 리전 처리
              return { regionName: region };
            } else {
              // 객체 형태의 리전 처리
              return {
                regionCode: region.regionCode,
                regionName:
                  region.displayName ||
                  `${region.sido} ${region.sigungu} ${region.dong}`.trim(),
              };
            }
          });
        }
      } catch (e) {
        console.error("Error parsing regions:", e);
      }
    }

    // 폼 데이터 초기화
    setFormData({
      title: data.lectureTitle,
      category,
      middleCategory,
      subCategory,
      categoryId: data.categoryId,
      price: data.price,
      description: data.description,
      curriculum: data.curriculum,
      timeSlots,
      regions,
    });
  };

  // 탭 변경 처리
  const handleTabChange = (event, newValue) => {
    setCurrentTab(newValue);
  };

  // 탭 이동 처리 함수들
  const handleBasicInfoNext = () => {
    setCurrentTab(1);
  };

  const handleCurriculumNext = () => {
    setCurrentTab(2);
  };

  // 강의 수정 제출 처리
  const handleSubmit = async () => {
    try {
      // 필수 필드 체크
      if (
        !formData.title ||
        !formData.categoryId ||
        !formData.price ||
        !formData.description ||
        !formData.curriculum
      ) {
        setSnackbar({
          open: true,
          message: "기본 정보와 커리큘럼을 모두 입력해주세요.",
          severity: "error",
        });
        return;
      }

      if (formData.timeSlots.length === 0) {
        setSnackbar({
          open: true,
          message: "최소 하나의 시간대를 입력해주세요.",
          severity: "error",
        });
        return;
      }

      if (formData.regions.length === 0) {
        setSnackbar({
          open: true,
          message: "최소 하나의 지역을 선택해주세요.",
          severity: "error",
        });
        return;
      }

      setSaving(true);
      setError(null);

      // 폼 데이터를 API 형식으로 변환
      const apiData = mapLectureFormToApi(formData);

      // 강의 수정 API 호출
      const response = await updateLecture(lectureId, apiData);

      if (response.success) {
        setSnackbar({
          open: true,
          message: "강의가 성공적으로 수정되었습니다!",
          severity: "success",
        });

        // 강의 상세 페이지로 리다이렉트 (약간의 지연을 줘서 메시지 확인 가능하도록)
        setTimeout(() => {
          navigate(`/lectures/${lectureId}`);
        }, 1500);
      } else {
        throw new Error(response.message || "강의 수정에 실패했습니다.");
      }
    } catch (err) {
      console.error("강의 수정 오류:", err);
      setSnackbar({
        open: true,
        message: err.message || "강의 수정 중 문제가 발생했습니다.",
        severity: "error",
      });
    } finally {
      setSaving(false);
    }
  };

  // 스낵바 닫기
  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  // 취소 버튼 처리
  const handleCancel = () => {
    navigate(`/lectures/${lectureId}`);
  };

  // 권한 없음 상태
  if (!loading && !hasPermission) {
    return (
      <Box sx={{ mt: 8, p: 3, textAlign: "center" }}>
        <Alert severity="warning" sx={{ mb: 2 }}>
          수정 권한이 없습니다.
        </Alert>
        <Typography variant="body1" sx={{ mb: 3 }}>
          해당 강의를 수정할 권한이 없습니다.
        </Typography>
        <Button
          variant="contained"
          startIcon={<ChevronLeftIcon />}
          onClick={() => navigate(`/lectures/${lectureId}`)}
        >
          강의로 돌아가기
        </Button>
      </Box>
    );
  }

  // 로딩 상태
  if (loading) {
    return (
      <Box sx={{ mt: 8, p: 3, textAlign: "center" }}>
        <CircularProgress size={60} />
        <Typography variant="body1" sx={{ mt: 2 }}>
          강의 정보를 불러오는 중...
        </Typography>
      </Box>
    );
  }

  // 에러 상태
  if (error) {
    return (
      <Box sx={{ mt: 8, p: 3, textAlign: "center" }}>
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
        <Typography variant="body1" sx={{ mb: 3 }}>
          강의 정보를 불러오는데 문제가 발생했습니다. 잠시 후 다시 시도해주세요.
        </Typography>
        <Button
          variant="contained"
          startIcon={<ChevronLeftIcon />}
          onClick={() => navigate("/")}
        >
          홈으로 돌아가기
        </Button>
      </Box>
    );
  }

  return (
    <Box sx={{ mt: 4, mb: 8 }}>
      {/* 상단 헤더 */}
      <Box sx={{ display: "flex", alignItems: "center", mb: 4 }}>
        <Button
          startIcon={<ChevronLeftIcon />}
          onClick={handleCancel}
          sx={{ mr: 2 }}
        >
          돌아가기
        </Button>
        <Typography variant="h5" fontWeight={600}>
          강의 수정하기
        </Typography>
      </Box>

      {/* 상태 알림 */}
      {saving && (
        <Alert severity="info" sx={{ mb: 3 }}>
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <CircularProgress size={20} sx={{ mr: 2 }} />
            강의를 저장하는 중입니다...
          </Box>
        </Alert>
      )}

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
          onChange={handleTabChange}
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
      <Paper
        elevation={0}
        sx={{
          p: 4,
          borderRadius: 2,
          backgroundColor: "var(--bg-100)",
        }}
      >
        <TabPanel value={currentTab} index={0}>
          <BasicInfoForm onNext={handleBasicInfoNext} isEditing={true} />
        </TabPanel>

        <TabPanel value={currentTab} index={1}>
          <CurriculumForm onNext={handleCurriculumNext} isEditing={true} />
        </TabPanel>

        <TabPanel value={currentTab} index={2}>
          <ScheduleAndLocationForm
            onSubmit={handleSubmit}
            isLoading={saving}
            isEditing={true}
            onCancel={handleCancel}
          />
        </TabPanel>
      </Paper>

      {/* 알림 메시지 */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}
