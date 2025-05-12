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

// src/lib/api/lectureApi.js - 삭제 함수만 수정

/**
 * 강의 삭제 API
 */
export const deleteLecture = async (lectureId) => {
  try {
    if (!lectureId) {
      throw new Error("강의 ID가 필요합니다");
    }

    console.log(`DELETE API 요청: /api/lectures/${lectureId}`);

    const response = await axiosInstance.delete(`/api/lectures/${lectureId}`);

    console.log("DELETE API 응답:", response);

    // 응답 상태 코드로 성공 여부 판단 (200~299는 성공)
    const isSuccess = response.status >= 200 && response.status < 300;

    // 빈 응답이어도 상태 코드를 기준으로 성공 여부 결정
    if (!response.data) {
      return {
        success: isSuccess,
        message: isSuccess
          ? "강의가 성공적으로 삭제되었습니다"
          : "서버 응답이 비어있습니다",
      };
    }

    // 응답에 success 필드가 없는 경우 상태 코드로 판단
    if (response.data.success === undefined) {
      return {
        success: isSuccess,
        data: response.data,
        message: response.data.message || "처리 완료",
      };
    }

    return response.data;
  } catch (error) {
    console.error(`강의 삭제 에러 (ID: ${lectureId}):`, error);

    // 오류 응답 구조화
    let errorMessage = "강의 삭제 중 오류가 발생했습니다";
    let errorSuccess = false;

    if (error.response) {
      // 서버 응답이 있는 경우 (4xx, 5xx 에러)
      console.log("서버 오류 응답:", error.response.data);
      errorMessage =
        error.response.data?.message || `서버 오류: ${error.response.status}`;
    } else if (error.request) {
      // 요청은 보냈지만 응답이 없는 경우
      errorMessage = "서버로부터 응답이 없습니다";
    } else {
      // 요청 설정 단계에서 문제 발생
      errorMessage = error.message || "알 수 없는 오류";
    }

    return {
      success: errorSuccess,
      message: errorMessage,
    };
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
  const response = await axiosInstance.post(`/api/application/apply`, payload);
  return response.data;
};
