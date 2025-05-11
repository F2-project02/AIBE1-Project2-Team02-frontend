// src/pages/MyPage.jsx
import { useState, useEffect } from "react";
import { Box, useMediaQuery, useTheme } from "@mui/material";
import ProfileCard from "../components/Profile/ProfileCard";
import ProfileImageUploader from "../components/Profile/ProfileImageUploader";
import MyPageSidebar from "../components/Profile/MyPageSidebar";
import ProfileForm from "../components/Profile/ProfileForm";
import MentorFormView from "../components/Profile/MentorFormView";
import DeleteAccountForm from "../components/Profile/DeleteAccountForm";
import { fetchProfileData, fetchMentorProfile } from "../lib/api/profileApi";
import { useLocation } from "react-router-dom";
import CustomToast from "../components/common/CustomToast";
import warnGif from "../assets/warn.gif";
import successGif from "../assets/message.gif";

import ProfileCardSkeleton from "../components/Profile/skeletons/ProfileCardSkeleton";
import ProfileFormSkeleton from "../components/Profile/skeletons/ProfileFormSkeleton";
import MyPageSidebarSkeleton from "../components/Profile/skeletons/MyPageSidebarSkeleton";
import MentorFormViewSkeleton from "../components/Profile/skeletons/MentorFormViewSkeleton";
import DeleteAccountFormSkeleton from "../components/Profile/skeletons/DeleteAccountFormSkeleton";
import ProfileImageUploaderSkeleton from "../components/Profile/skeletons/ProfileImageUploaderSkeleton";

export default function MyPage() {
  const [profileData, setProfileData] = useState(null);
  const [mentorProfile, setMentorProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [tabLoading, setTabLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState(
    "/images/default-profile.svg"
  );

  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const tabParam = searchParams.get("tab");

  const [activeTab, setActiveTab] = useState(
    tabParam || location.state?.activeTab || "profile"
  );

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.between("sm", "md"));

  const [toastOpen, setToastOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastIcon, setToastIcon] = useState(null);
  const [toastType, setToastType] = useState("info");

  // showToast 함수 추가
  const showToast = (message, icon = null, type = "info") => {
    setToastMessage(message);
    setToastIcon(icon);
    setToastType(type);
    setToastOpen(true);
  };

  useEffect(() => {
    const loadProfileData = async () => {
      setLoading(true);
      try {
        const data = await fetchProfileData();
        setProfileData(data);
        setImagePreview(data.profileImage || "/images/default-profile.svg");

        // 멘토 프로필 로드
        if (data.role === "MENTOR") {
          const mentorData = await fetchMentorProfile();
          setMentorProfile(mentorData);
        }
      } catch (error) {
        console.error("프로필 로드 오류:", error);
      } finally {
        setLoading(false);
      }
    };

    loadProfileData();
  }, []);

  // 프로필 이미지 업데이트 함수
  const handleProfileImageUpdate = (imageUrl) => {
    setProfileData({ ...profileData, profileImage: imageUrl });
    setImagePreview(imageUrl);
  };

  // 프로필 정보 업데이트 함수
  const handleProfileUpdate = (updatedData) => {
    setProfileData({
      ...profileData,
      ...updatedData,
      regions: updatedData.regions || profileData.regions,
    });
  };

  // 탭 변경 핸들러
  const handleTabChange = (tabName) => {
    setTabLoading(true);
    setActiveTab(tabName);

    setTimeout(() => {
      setTabLoading(false);
    }, 300);
  };

  const renderActiveTabContent = () => {
    if (loading || tabLoading) {
      switch (activeTab) {
        case "profile":
          return (
            <>
              <ProfileImageUploaderSkeleton />
              <ProfileFormSkeleton />
            </>
          );
        case "mentor":
          return <MentorFormViewSkeleton />;
        case "delete":
          return <DeleteAccountFormSkeleton />;
        default:
          return <ProfileFormSkeleton />;
      }
    }

    switch (activeTab) {
      case "profile":
        return (
          <>
            <ProfileImageUploader
              imagePreview={imagePreview}
              onImageUpdate={handleProfileImageUpdate}
            />
            {profileData && (
              <ProfileForm
                profileData={profileData}
                onProfileUpdate={handleProfileUpdate}
                showToast={showToast}
              />
            )}
          </>
        );
      case "mentor":
        return (
          <MentorFormView onProfileUpdate={() => {}} showToast={showToast} />
        );
      case "delete":
        return <DeleteAccountForm showToast={showToast} />;
      default:
        return null;
    }
  };

  return (
    <Box sx={{ mt: 4, mb: 8, px: { xs: 1, sm: 2, md: 3 } }}>
      {/* 상단 프로필 카드 영역 */}
      {loading ? (
        <ProfileCardSkeleton />
      ) : (
        <ProfileCard
          profileData={profileData}
          mentorProfile={mentorProfile}
          imagePreview={imagePreview}
        />
      )}

      {/* 하단 메뉴 및 폼 영역 */}
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          gap: { xs: 2, md: 4 },
          mt: { xs: 2, md: 4 },
        }}
      >
        {/* 사이드바 영역 */}
        <Box
          sx={{
            width: { xs: "100%", md: 240 },
            mb: { xs: 3, md: 0 },
          }}
        >
          {loading ? (
            <MyPageSidebarSkeleton />
          ) : (
            <MyPageSidebar
              activeTab={activeTab}
              onTabChange={handleTabChange}
              isLoading={tabLoading}
            />
          )}
        </Box>

        {/* 콘텐츠 영역 */}
        <Box
          sx={{
            flex: 1,
            width: { xs: "100%", md: "auto" },
          }}
        >
          {renderActiveTabContent()}
        </Box>
      </Box>

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
