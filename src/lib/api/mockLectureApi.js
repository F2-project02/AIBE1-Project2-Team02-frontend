// src/lib/api/mockLectureApi.js
import { dummyLectures } from "../../constants/mock/dummyLectures";

/**
 * Mock function to simulate lecture search API
 */
export const searchLectures = async (params = {}) => {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 800));

  // Extract params with defaults
  const {
    keyword = "",
    category = null,
    region = null,
    minPrice = null,
    maxPrice = null,
    minRating = null,
    isCertified = null,
    page = 0,
    size = 10,
  } = params;

  // Apply filters
  let filteredLectures = [...dummyLectures];

  // Keyword search (in title, description, or mentor name)
  if (keyword) {
    const lowerKeyword = keyword.toLowerCase();
    filteredLectures = filteredLectures.filter(
      (lecture) =>
        lecture.title.toLowerCase().includes(lowerKeyword) ||
        lecture.description.toLowerCase().includes(lowerKeyword) ||
        lecture.mentor.nickname.toLowerCase().includes(lowerKeyword)
    );
  }

  // Category filter
  if (category) {
    filteredLectures = filteredLectures.filter((lecture) => {
      const categories = [
        lecture.category.parent,
        lecture.category.middle,
        lecture.category.sub,
      ].filter(Boolean);

      // Check if any category level contains the search term
      return categories.some(
        (cat) =>
          category.toLowerCase().includes(cat.toLowerCase()) ||
          cat.toLowerCase().includes(category.toLowerCase())
      );
    });
  }

  // Region filter
  if (region) {
    filteredLectures = filteredLectures.filter((lecture) => {
      return lecture.regions.some((reg) => {
        // Handle both string and object regions
        const regionName =
          typeof reg === "string"
            ? reg
            : `${reg.sido} ${reg.sigungu} ${reg.dong || ""}`.trim();

        return regionName.includes(region);
      });
    });
  }

  // Price range filter
  if (minPrice !== null) {
    filteredLectures = filteredLectures.filter(
      (lecture) => lecture.price >= minPrice
    );
  }

  if (maxPrice !== null) {
    filteredLectures = filteredLectures.filter(
      (lecture) => lecture.price <= maxPrice
    );
  }

  // Rating filter
  if (minRating !== null) {
    filteredLectures = filteredLectures.filter(
      (lecture) => lecture.mentor.rating >= minRating
    );
  }

  // Certified mentor filter
  if (isCertified !== null) {
    filteredLectures = filteredLectures.filter(
      (lecture) => lecture.mentor.isCertified === isCertified
    );
  }

  // Pagination
  const totalElements = filteredLectures.length;
  const totalPages = Math.ceil(totalElements / size);
  const startIndex = page * size;
  const endIndex = startIndex + size;
  const paginatedLectures = filteredLectures.slice(startIndex, endIndex);

  // Format response to match backend API
  const response = {
    content: paginatedLectures.map((lecture) => ({
      lectureId: lecture.lectureId,
      lectureTitle: lecture.title,
      price: lecture.price,
      mentorNickname: lecture.mentor.nickname,
      profileImage: lecture.mentor.profileImage,
      isCertified: lecture.mentor.isCertified,
      averageRating: lecture.mentor.rating,
      subcategory: lecture.category.sub,
      regions: lecture.regions,
      createdAt: lecture.createdAt,
    })),
    pageable: {
      pageNumber: page,
      pageSize: size,
    },
    totalPages,
    totalElements,
    last: page >= totalPages - 1,
    first: page === 0,
    size,
    number: page,
  };

  return {
    success: true,
    message: "강의 목록을 성공적으로 조회했습니다.",
    data: response,
  };
};

/**
 * Mock API wrapper to match backend API pattern
 */
export const mockLectureApi = {
  getLectures: searchLectures,
};

export default mockLectureApi;
