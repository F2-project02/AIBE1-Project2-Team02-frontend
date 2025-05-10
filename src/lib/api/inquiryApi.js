// src/lib/apis/inquiryApi.js
import axiosInstance from "../axiosInstance";

// 내가 신청한 과외 목록 조회
export const getMyRequestedInquiries = async () => {
  const res = await axiosInstance.get("/api/application/apply/list");
  return res.data.data; // ApiResponseFormat<T> 구조를 기준으로 data만 반환
};

// 내가 등록한 과외 목록
export const getMyRegisteredLectures = async () => {
  const res = await axiosInstance.get("/api/application/apply/lectures/list");
  return res.data.data;
};

// 특정 강의의 신청자 목록 조회
export const getLectureApplicants = async () => {
  const res = await axiosInstance.get(`/api/application/applicants`);
  return res.data.data;
};

// 신청 수락 API
export const approveApplication = async (applicationId) => {
  const res = await axiosInstance.post("/api/application/approve", {
    applicationId,
  });
  return res.data;
};

// 신청 반려 API
export const rejectApplication = async ({ applicationId, reason }) => {
  const res = await axiosInstance.post("/api/application/reject", {
    applicationId,
    reason,
  });
  return res.data;
};
