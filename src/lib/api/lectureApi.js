// src/lib/api/lectureApi.js

import axiosInstance from "../axiosInstance";

/**
 * 강의 생성 API
 */
export const createLecture = async (lectureData) => {
  try {
    // 개발 환경에서는 dev 엔드포인트 사용
    const endpoint = import.meta.env.DEV
      ? "/api/lectures/dev"
      : "/api/lectures";
    const response = await axiosInstance.post(endpoint, lectureData);
    return response.data;
  } catch (error) {
    console.error("강의 생성 에러:", error);
    throw error;
  }
};

/**
 * 강의 목록 조회 API
 */
export const getLectures = async (params = {}) => {
  try {
    const response = await axiosInstance.get("/api/lectures", { params });
    return response.data;
  } catch (error) {
    console.error("강의 목록 조회 에러:", error);
    throw error;
  }
};

/**
 * 특정 강의 조회 API
 */
export const getLecture = async (lectureId) => {
  try {
    const response = await axiosInstance.get(`/api/lectures/${lectureId}`);
    return response.data;
  } catch (error) {
    console.error("강의 조회 에러:", error);
    throw error;
  }
};

/**
 * 강의 수정 API
 */
export const updateLecture = async (lectureId, lectureData) => {
  try {
    const response = await axiosInstance.put(
      `/api/lectures/${lectureId}`,
      lectureData
    );
    return response.data;
  } catch (error) {
    console.error("강의 수정 에러:", error);
    throw error;
  }
};

/**
 * 강의 삭제 API
 */
export const deleteLecture = async (lectureId) => {
  try {
    const response = await axiosInstance.delete(`/api/lectures/${lectureId}`);
    return response.data;
  } catch (error) {
    console.error("강의 삭제 에러:", error);
    throw error;
  }
};
