// src/lib/api/lectureApi.js

import axiosInstance from "../axiosInstance";

/**
 * 강의 생성 API
 */
export const createLecture = async (lectureData) => {
  try {
    const endpoint = "/api/lectures";
    const response = await axiosInstance.post(endpoint, lectureData);
    return response.data;
  } catch (error) {
    console.error("강의 생성 에러:", error);
    throw error;
  }
};

/**
 * 강의 검색 API
 */
export const getLectures = async (params = {}) => {
  try {
    // 배열 파라미터 처리를 위한 설정
    const response = await axiosInstance.get("/api/lectures", {
      params,
      paramsSerializer: {
        indexes: null, // 배열은 regions=item1&regions=item2 형식으로 전송
      },
    });
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

/**
 * 강의 상태 변경 API (마감/오픈)
 */
export const updateLectureStatus = async (lectureId, isClosed) => {
  try {
    const response = await axiosInstance.patch(
      `/api/lectures/${lectureId}/status`,
      null,
      { params: { isClosed } }
    );
    return response.data;
  } catch (error) {
    console.error("강의 상태 변경 에러:", error);
    throw error;
  }
};

/**
 * 강의 리뷰 조회 API
 */
export const getLectureReviews = async (lectureId) => {
  try {
    const response = await axiosInstance.get(
      `/api/lectures/${lectureId}/reviews`
    );
    return response.data;
  } catch (error) {
    console.error("강의 리뷰 조회 에러:", error);
    throw error;
  }
};

/**
 * 강의 커리큘럼 조회 API
 */
export const getLectureCurriculum = async (lectureId) => {
  try {
    const response = await axiosInstance.get(
      `/api/lectures/${lectureId}/curriculum`
    );
    return response.data;
  } catch (error) {
    console.error("강의 커리큘럼 조회 에러:", error);
    throw error;
  }
};

/*
 * 해당 강의 조회 API
 */

export async function fetchLectureApplyForm(lectureId) {
  const response = await axiosInstance.get(
    `/api/application/${lectureId}/form/list`
  );
  return response.data.data;
}

/**
 * 강의 신청 API
 */

export const applyLecture = async (payload) => {
  try {
    const response = await axiosInstance.post(
      `/api/application/apply`,
      payload
    );
    return response.data;
  } catch (error) {
    console.error("수업 신청 실패", error);
    throw error;
  }
};
