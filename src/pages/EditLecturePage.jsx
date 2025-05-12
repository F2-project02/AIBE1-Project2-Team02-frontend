// ✅ 리팩토링 및 AI 필터링 적용된 src/pages/EditLecturePage.jsx

import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  Paper,
  CircularProgress,
  Alert,
  Button,
} from "@mui/material";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import { getLecture, updateLecture } from "../lib/api/lectureApi";
import { useUserStore } from "../store/useUserStore";
import { useLectureStore } from "../store/useLectureStore";
import { mapLectureFormToApi } from "../utils/lectureDataMapper";
import {
  validateBasicInfo,
  validateCurriculum,
  validateFinalLectureData,
} from "../utils/lectureFormValidator";
import { getModerationMessage } from "../utils/moderationHelper";
import CreateLectureTab from "../components/CreateLecture/CreateLectureTabs";
import BasicInfoForm from "../components/CreateLecture/BasicInfoForm";
import CurriculumForm from "../components/CreateLecture/CurriculumForm";
import ScheduleAndLocationForm from "../components/CreateLecture/ScheduleAndLocationForm";
import CustomToast from "../components/common/CustomToast";
import BasicInfoFormSkeleton from "../components/CreateLecture/skeletons/BasicInfoFormSkeleton";
import UnauthorizedView from "../components/CreateLecture/UnauthorizedView";
import warnGif from "../assets/warn.gif";
import createLectureGif from "../assets/createlecture.gif";

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
  const { userId, role, isLoggedIn } = useUserStore();
  const {
    formData,
    setFormData,
    resetFormData,
    setIsLoading,
    setError,
    isLoading,
  } = useLectureStore();

  const [currentTab, setCurrentTab] = useState(0);
  const [lecture, setLecture] = useState(null);
  const [loading, setLoading] = useState(true);
  const [toastOpen, setToastOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastIcon, setToastIcon] = useState(null);
  const [toastType, setToastType] = useState("info");

  const showToast = (message, icon = warnGif, type = "error") => {
    setToastMessage(message);
    setToastIcon(icon);
    setToastType(type);
    setToastOpen(true);
  };

  useEffect(() => {
    const fetchLecture = async () => {
      try {
        setLoading(true);
        const response = await getLecture(lectureId);
        if (response.success && response.data) {
          setLecture(response.data);
          initializeFormData(response.data);
        } else {
          throw new Error(response.message);
        }
      } catch (err) {
        showToast("강의 정보를 불러오는데 실패했어요.");
      } finally {
        setLoading(false);
      }
    };

    fetchLecture();
    return () => resetFormData();
  }, [lectureId, resetFormData]);

  const initializeFormData = (data) => {
    const category = data.parentCategory || "";
    const middleCategory = data.middleCategory || "";
    const subCategory = data.subcategory || "";

    let timeSlots = [];
    try {
      const parsed =
        typeof data.timeSlots === "string"
          ? JSON.parse(data.timeSlots || "[]")
          : data.timeSlots;
      timeSlots = Array.isArray(parsed)
        ? parsed.map((slot, i) => ({ ...slot, id: Date.now() + i }))
        : [];
    } catch (e) {
      console.error("Error parsing timeSlots", e);
    }

    let regions = [];
    try {
      const parsed =
        typeof data.regions === "string"
          ? JSON.parse(data.regions || "[]")
          : data.regions;
      regions = Array.isArray(parsed) ? parsed : [parsed];
      regions = regions.map((region, i) => {
        if (typeof region === "string") {
          return {
            displayName: region,
            regionName: region,
            regionCode: `temp-${i}`,
          };
        } else {
          return {
            ...region,
            regionCode: region.regionCode || `temp-${i}`,
          };
        }
      });
    } catch (e) {
      console.error("Error parsing regions", e);
    }

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

  const hasPermission = () => {
    return lecture && (role === "ADMIN" || lecture.authorUserId === userId);
  };

  const handleTabChange = (newValue) => {
    if (newValue > currentTab) {
      if (currentTab === 0 && !validateBasicInfo(formData)) {
        showToast("기본 정보를 모두 입력해주세요.");
        return;
      }
      if (currentTab === 1 && !validateCurriculum(formData)) {
        showToast("커리큘럼을 입력해주세요.");
        return;
      }
    }
    setCurrentTab(newValue);
  };

  const handleSubmit = async () => {
    if (!validateFinalLectureData(formData)) {
      showToast("빠진 정보가 없는지 확인해주세요.");
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      const apiData = mapLectureFormToApi(formData);
      const response = await updateLecture(lectureId, apiData);

      if (response.success) {
        showToast(
          "강의가 성공적으로 수정되었어요!",
          createLectureGif,
          "success"
        );
        setTimeout(() => {
          navigate(`/lectures/${lectureId}`);
        }, 800);
      } else {
        const friendly = getModerationMessage(response.message);
        showToast(friendly, warnGif, "error");
      }
    } catch (err) {
      const message = err?.response?.data?.message;
      showToast(
        getModerationMessage(message) || "수정 중 오류가 발생했어요.",
        warnGif,
        "error"
      );
    } finally {
      setIsLoading(false);
    }
  };

  if (loading || lecture === null) {
    return (
      <Box sx={{ mt: 4, mb: 4 }}>
        <Typography
          variant="h5"
          fontWeight={600}
          color="var(--text-100)"
          mt={4}
          mb={4}
        >
          강의 수정하기
        </Typography>
        <CreateLectureTab value={0} onChange={() => {}} />
        <Paper elevation={0} sx={{ backgroundColor: "var(--bg-100)" }}>
          <BasicInfoFormSkeleton />
        </Paper>
      </Box>
    );
  }

  if (!isLoggedIn || !hasPermission()) {
    return <UnauthorizedView />;
  }

  return (
    <Box sx={{ mt: 4, mb: 6 }}>
      <Button
        startIcon={<ChevronLeftIcon />}
        onClick={() => navigate(`/lectures/${lectureId}`)}
        sx={{ mb: 2 }}
      >
        돌아가기
      </Button>

      <Typography variant="h5" fontWeight={600} color="var(--text-100)" mb={4}>
        강의 수정하기
      </Typography>

      <CreateLectureTab value={currentTab} onChange={handleTabChange} />

      <Paper elevation={0} sx={{ backgroundColor: "var(--bg-100)" }}>
        <TabPanel value={currentTab} index={0}>
          <BasicInfoForm
            onNext={() => setCurrentTab(1)}
            showToast={showToast}
          />
        </TabPanel>
        <TabPanel value={currentTab} index={1}>
          <CurriculumForm
            onNext={() => setCurrentTab(2)}
            showToast={showToast}
          />
        </TabPanel>
        <TabPanel value={currentTab} index={2}>
          <ScheduleAndLocationForm
            onSubmit={handleSubmit}
            isLoading={isLoading}
            showToast={showToast}
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
