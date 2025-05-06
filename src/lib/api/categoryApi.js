// src/lib/api/categoryApi.js
import axiosInstance from "../axiosInstance";

export const categoryApi = {
  /**
   * 모든 카테고리 조회
   */
  getAllCategories: async () => {
    const response = await axiosInstance.get("/api/categories");
    return response.data.data;
  },

  /**
   * 카테고리 트리 조회 (계층 구조)
   */
  getCategoryTree: async () => {
    const response = await axiosInstance.get("/api/categories/tree");
    return response.data.data;
  },

  /**
   * 특정 카테고리 조회
   */
  getCategoryById: async (categoryId) => {
    const response = await axiosInstance.get(`/api/categories/${categoryId}`);
    return response.data.data;
  },

  /**
   * 대분류 카테고리 목록 조회
   */
  getParentCategories: async () => {
    const response = await axiosInstance.get("/api/categories/parents");
    return response.data.data;
  },

  /**
   * 중분류 카테고리 목록 조회
   */
  getMiddleCategories: async (parentCategory) => {
    const response = await axiosInstance.get("/api/categories/middles", {
      params: { parentCategory },
    });
    return response.data.data;
  },

  /**
   * 소분류 카테고리 목록 조회
   */
  getSubcategories: async (parentCategory, middleCategory) => {
    const response = await axiosInstance.get("/api/categories/subs", {
      params: { parentCategory, middleCategory },
    });
    return response.data.data;
  },
};
