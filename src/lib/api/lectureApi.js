// src/lib/api/lectureApi.js

import axiosInstance from "../axiosInstance";
import mockLectureApi from "./mockLectureApi";

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

/**
 * 모의 강의 상세 데이터 (개발 환경용)
 */
const mockGetLecture = async (lectureId) => {
  // 지연 시간 시뮬레이션
  await new Promise((resolve) => setTimeout(resolve, 800));

  const lectureData = {
    success: true,
    message: "강의 상세 정보를 성공적으로 조회했습니다.",
    data: {
      lectureId: parseInt(lectureId),
      lectureTitle: "React로 만드는 현대적인 웹 애플리케이션",
      mentorNickname: "ReactMaster",
      createdAt: "2024-05-01T09:30:00",
      updatedAt: "2024-05-02T14:15:00",
      parentCategory: "IT/개발",
      middleCategory: "프론트엔드",
      subcategory: "React",
      isClosed: false,
      status: "AVAILABLE",
      description:
        "<p>React의 기초부터 고급 개념까지 배우는 과외입니다.</p><p>컴포넌트 설계, 상태 관리, 라우팅, 성능 최적화 등을 다룹니다.</p><p>실무에서 바로 활용할 수 있는 지식을 제공합니다.</p>",
      price: 50000,
      curriculum:
        "<h2>커리큘럼</h2><ul><li>1주차: React 기초 및 컴포넌트 구조</li><li>2주차: Props와 State 관리</li><li>3주차: Hook의 이해와 활용</li><li>4주차: Context API와 Redux</li><li>5주차: 라우팅과 코드 분할</li><li>6주차: API 연동 및 비동기 처리</li><li>7주차: 성능 최적화 기법</li><li>8주차: 실전 프로젝트 완성</li></ul>",
      regions: JSON.stringify(["서울특별시 강남구", "서울특별시 서초구"]),
      timeSlots: JSON.stringify([
        { day: "월", startTime: "19:00", endTime: "21:00" },
        { day: "수", startTime: "19:00", endTime: "21:00" },
        { day: "토", startTime: "14:00", endTime: "16:00" },
      ]),
    },
  };

  return lectureData;
};
