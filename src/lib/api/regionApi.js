// src/lib/api/regionApi.js
import axiosInstance from "../axiosInstance";

export const regionApi = {
  /**
   * 모든 시도 목록 조회
   */
  getSidos: async () => {
    const response = await axiosInstance.get("/api/regions/sidos");
    return response.data.data;
  },

  /**
   * 특정 시도의 시군구 목록 조회
   */
  getSigungus: async (sido) => {
    const response = await axiosInstance.get("/api/regions/sigungus", {
      params: { sido },
    });
    return response.data.data;
  },

  /**
   * 특정 시군구의 읍면동 목록 조회
   */
  getDongs: async (sido, sigungu) => {
    const response = await axiosInstance.get("/api/regions/dongs", {
      params: { sido, sigungu },
    });
    return response.data.data;
  },

  /**
   * 전체 지역 정보 조회
   */
  getAllRegions: async () => {
    const response = await axiosInstance.get("/api/regions");
    return response.data.data;
  },
};
