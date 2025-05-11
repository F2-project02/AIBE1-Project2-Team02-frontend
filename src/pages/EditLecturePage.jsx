// src/pages/EditLecturePage.jsx

import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  Paper,
  Alert,
  CircularProgress,
  Button,
  Snackbar,
} from "@mui/material";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import { getLecture, updateLecture } from "../lib/api/lectureApi";
import { useUserStore } from "../store/useUserStore";
import { useLectureStore } from "../store/useLectureStore";
import { mapLectureFormToApi } from "../utils/lectureDataMapper";
import CreateLectureTab from "../components/CreateLecture/CreateLectureTabs";
import BasicInfoForm from "../components/CreateLecture/BasicInfoForm";
import CurriculumForm from "../components/CreateLecture/CurriculumForm";
import ScheduleAndLocationForm from "../components/CreateLecture/ScheduleAndLocationForm";
import CustomToast from "../components/common/CustomToast";
// 필요한 경우 경고 GIF를 가져옴
import warnGif from "../assets/warn.gif";

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
  const { userId, role } = useUserStore();
  const { formData, setFormData, resetFormData } = useLectureStore();

  // 커스텀 토스트 상태
  const [toastOpen, setToastOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastIcon, setToastIcon] = useState(null);
  const [toastType, setToastType] = useState("info");

  // 기존 스낵바 상태 (호환성을 위해 유지)
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "info",
  });

  // 컴포넌트 마운트 시 강의 데이터 로드
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await getLecture(lectureId);
        if (response.success && response.data) {
          setLecture(response.data);

          // 폼 초기값 설정
          initializeFormData(response.data);
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

  // 토스트 메시지 표시 함수
  const showToast = (message, icon = warnGif, type = "error") => {
    setToastMessage(message);
    setToastIcon(icon);
    setToastType(type);
    setToastOpen(true);
  };

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

        // UI 작업을 위해 각 슬롯에 ID 추가
        timeSlots = timeSlots.map((slot, index) => ({
          ...slot,
          id: Date.now() + index,
        }));
      } catch (e) {
        console.error("Error parsing timeSlots:", e);
      }
    }

    // regions 처리
    let regions = [];
    if (data.regions) {
      try {
        // regions가 문자열이면 파싱
        if (typeof data.regions === "string") {
          const parsedRegions = JSON.parse(data.regions);
          regions = Array.isArray(parsedRegions)
            ? parsedRegions
            : [parsedRegions];
        } else {
          regions = Array.isArray(data.regions) ? data.regions : [data.regions];
        }

        // regions 데이터 정규화 - regionCode 추가 보장
        regions = regions.map((region, index) => {
          if (typeof region === "string") {
            // 문자열 형태의 지역 (예: "서울시 강남구")
            return {
              displayName: region,
              regionName: region,
              // API 요청시 필요한 regionCode 필드 추가
              regionCode: `temp-${index}`, // 임시 코드 생성 (API에서 무시될 수 있음)
            };
          } else if (region.regionCode) {
            // regionCode가 있는 경우 (정상)
            return region;
          } else {
            // 객체이지만 regionCode가 없는 경우
            return {
              ...region,
              regionCode: `temp-${index}`,
            };
          }
        });
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

  // 권한 체크
  const hasPermission = () => {
    if (!lecture || !userId) return false;
    return role === "ADMIN" || lecture.authorUserId === userId;
  };

  // 탭 변경 처리 (유효성 검사 추가)
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
          showToast("필수 항목을 모두 입력해주세요.");
          return;
        }
        if (!formData.categoryId) {
          showToast("카테고리를 완전히 선택해주세요.");
          return;
        }
      } else if (currentTab === 1) {
        // 커리큘럼 탭 유효성 검사
        if (
          !formData.curriculum ||
          formData.curriculum.trim() === "" ||
          formData.curriculum === "<p></p>"
        ) {
          showToast("커리큘럼을 입력해주세요.");
          return;
        }
      }
    }

    // 유효성 검사 통과 시 탭 변경
    setCurrentTab(newValue);
  };

  // 다음 단계로 이동
  const handleBasicInfoNext = () => {
    // 기본 정보 유효성 검사
    if (
      !formData.title ||
      !formData.category ||
      !formData.middleCategory ||
      !formData.subCategory ||
      !formData.price ||
      !formData.description
    ) {
      showToast("필수 항목을 모두 입력해주세요.");
      return;
    }
    if (!formData.categoryId) {
      showToast("카테고리를 완전히 선택해주세요.");
      return;
    }

    // 유효성 검사 통과 시 다음 탭으로 이동
    setCurrentTab(1);
  };

  const handleCurriculumNext = () => {
    // 커리큘럼 유효성 검사 - 더 상세하게 검증
    if (
      !formData.curriculum ||
      formData.curriculum.trim() === "" ||
      formData.curriculum === "<p></p>"
    ) {
      showToast("커리큘럼을 입력해주세요.");
      return;
    }

    // 유효성 검사 통과 시 다음 탭으로 이동
    setCurrentTab(2);
  };

  // 강의 수정 제출 처리
  const handleSubmit = async () => {
    try {
      // 최종 제출 전 모든 필수 필드 확인
      if (
        !formData.title ||
        !formData.categoryId ||
        !formData.price ||
        !formData.description
      ) {
        showToast("기본 정보를 모두 입력해주세요.");
        return;
      }

      // 커리큘럼 유효성 검사
      if (
        !formData.curriculum ||
        formData.curriculum.trim() === "" ||
        formData.curriculum === "<p></p>"
      ) {
        showToast("커리큘럼을 입력해주세요.");
        return;
      }

      if (formData.timeSlots.length === 0) {
        showToast("최소 하나의 시간대를 입력해주세요.");
        return;
      }

      if (formData.regions.length === 0) {
        showToast("최소 하나의 지역을 선택해주세요.");
        return;
      }

      setSaving(true);
      setError(null);

      // 폼 데이터를 API 형식으로 변환
      const apiData = mapLectureFormToApi(formData);

      // 강의 수정 API 호출
      const response = await updateLecture(lectureId, apiData);

      if (response.success) {
        showToast("강의가 성공적으로 수정되었습니다!", null, "success");

        // 강의 상세 페이지로 리다이렉트 (약간의 지연을 줘서 메시지 확인 가능하도록)
        setTimeout(() => {
          navigate(`/lectures/${lectureId}`);
        }, 500);
      } else {
        throw new Error(response.message || "강의 수정에 실패했습니다.");
      }
    } catch (err) {
      console.error("강의 수정 오류:", err);
      showToast(err.message || "강의 수정 중 문제가 발생했습니다.");
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
  if (!loading && !hasPermission()) {
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
      <CreateLectureTab value={currentTab} onChange={handleTabChange} />

      {/* 탭 패널 */}
      <Paper
        elevation={0}
        sx={{
          p: 4,
          backgroundColor: "var(--bg-100)",
        }}
      >
        <TabPanel value={currentTab} index={0}>
          <BasicInfoForm onNext={handleBasicInfoNext} showToast={showToast} />
        </TabPanel>

        <TabPanel value={currentTab} index={1}>
          <CurriculumForm onNext={handleCurriculumNext} showToast={showToast} />
        </TabPanel>

        <TabPanel value={currentTab} index={2}>
          <ScheduleAndLocationForm
            onSubmit={handleSubmit}
            isLoading={saving}
            showToast={showToast}
          />
        </TabPanel>
      </Paper>

      {/* 커스텀 토스트 */}
      <CustomToast
        open={toastOpen}
        onClose={() => setToastOpen(false)}
        message={toastMessage}
        iconSrc={toastIcon}
        type={toastType}
      />

      {/*  알림 메시지 */}
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
