// src/lib/api/reviewApi.js

import axiosInstance from "../axiosInstance";


const baseUrl = `/api/review`;

/**
 * 리뷰 생성 API
 */
export const createReview = async (reveiwData) => {
  try {
    const response = await axiosInstance.post(
      baseUrl, reveiwData
    );
    return response.data;
  } catch (error) {
    console.error("리뷰 생성 에러:", error);
    throw error;
  }
}


/**
 * 특정 강의 리뷰 조회 API
 */
export const getReviewsByLecture = async (lectureId) => {
  try {
    const response = await axiosInstance.get(
      `${baseUrl}/lecture/${lectureId}`
    );
    return response.data;
  } catch (error) {
    console.error("리뷰 조회 에러:", error);
    throw error;
  }
}

/**
 * 리뷰 수정 API
 */
export const updateReview = async (reviewId, reviewData) => {
  try {
    const response = await axiosInstance.patch(
      `${baseUrl}/${reviewId}`, reviewData
    );
    return response.data;
  } catch (error) {
    console.error("리뷰 수정 에러:", error);
    throw error;
  }
};

/**
 * 리뷰 삭제 API
 */
export const deleteReview = async (reviewId) => {
  try {
    const response = await axiosInstance.delete(
      `${baseUrl}/${reviewId}`
    );
    return response.data;
  } catch (error) {
    console.error("리뷰 삭제 에러:", error);
    throw error;
  }
};

/**
 * 특정 강의 별점 조회 API
 */
export const getRatingByLecture = async (lectureIdData) => {
    try {
        const response = await axiosInstance.post(
        `${baseUrl}/lecture/average-rating`, lectureIdData
        );
        return response.data;
    } catch (error) {
        console.error("별점 조회 에러:", error);
        throw error;
    }
}


/**
 * 특정 멘토 별점 조회 API
 */
export const getRatingByMentor = async (mentorIdData) => {
    try {
        const response = await axiosInstance.post(
        `${baseUrl}/mentor/average-rating`, mentorIdData
        );
        return response.data;
    } catch (error) {
        console.error("별점 조회 에러:", error);
        throw error;
    }
}