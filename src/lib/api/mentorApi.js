// src/lib/api/mentorApi.js

import axiosInstance from "../axiosInstance";

/**
 * 특정 멘토의 프로필 정보 조회 API
 * @param {number} mentorId - 멘토 ID
 * @returns {Promise<Object>} - 멘토 프로필 데이터
 */
export const getMentorProfile = async (mentorId) => {
  try {
    const response = await axiosInstance.get(
      `/api/mentors/${mentorId}/profile`
    );
    return response.data;
  } catch (error) {
    // 추가 API 엔드포인트가 없는 경우를 위한 대체 로직
    console.warn("멘토 전용 API가 없어 계정 API로 시도합니다:", error);

    try {
      // 계정 API로 시도
      const accountResponse = await axiosInstance.get(
        `/api/account/mentor/profile`
      );
      return accountResponse.data;
    } catch (secondError) {
      console.error("멘토 프로필 조회 실패:", secondError);
      throw secondError;
    }
  }
};

/**
 * 현재 로그인한 사용자의 멘토 프로필 정보 조회 API
 * @returns {Promise<Object>} - 멘토 프로필 데이터
 */
export const getMyMentorProfile = async () => {
  try {
    const response = await axiosInstance.get(`/api/account/mentor/profile`);
    return response.data;
  } catch (error) {
    console.error("내 멘토 프로필 조회 실패:", error);
    throw error;
  }
};

/**
 * 멘토 상태 조회 API
 * @returns {Promise<Object>} - 멘토 상태 데이터
 */
export const getMentorStatus = async () => {
  try {
    const response = await axiosInstance.get(`/api/account/mentor/status`);
    return response.data;
  } catch (error) {
    console.error("멘토 상태 조회 실패:", error);
    throw error;
  }
};

/**
 * 멘토 신청 API
 * @param {FormData} formData - 멘토 신청 데이터 (MultipartForm)
 * @returns {Promise<Object>} - 응답 데이터
 */
export const applyMentor = async (formData) => {
  try {
    const response = await axiosInstance.post(
      `/api/account/mentor/apply`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("멘토 신청 실패:", error);
    throw error;
  }
};

/**
 * 멘토 프로필 업데이트 API
 * @param {FormData} formData - 멘토 프로필 업데이트 데이터 (MultipartForm)
 * @returns {Promise<Object>} - 응답 데이터
 */
export const updateMentorProfile = async (formData) => {
  try {
    const response = await axiosInstance.put(
      `/api/account/mentor/profile`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("멘토 프로필 업데이트 실패:", error);
    throw error;
  }
};
