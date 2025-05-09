// src/lib/api/accountApi.js
import axiosInstance from "../axiosInstance";

export const accountApi = {
  /**
   * 사용자 프로필 정보 조회
   */
  getProfile: async () => {
    try {
      const response = await axiosInstance.get("/api/account/profile");
      return response.data;
    } catch (error) {
      console.error("프로필 조회 에러:", error);
      throw error;
    }
  },
};
