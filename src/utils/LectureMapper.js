// src/utils/lectureMapper.js

/**
 * 지역 데이터를 문자열 형식으로 변환
 * @param {object|string} region - 지역 데이터 (객체 또는 문자열)
 * @returns {string} - 형식화된 지역 문자열
 */
const formatRegion = (region) => {
  if (typeof region === "string") {
    return region;
  } else if (region && typeof region === "object") {
    if (region.displayName) {
      return region.displayName;
    }

    // 구성 요소에서 문자열 생성
    const parts = [region.sido, region.sigungu, region.dong]
      .filter(Boolean) // 빈 값 제거
      .join(" ");

    return parts || "";
  }

  return "";
};

/**
 * 백엔드 API의 강의 데이터를 CourseCard 컴포넌트 형식으로 변환
 * @param {Object} lecture - 백엔드 API의 강의 데이터
 * @returns {Object} - CourseCard 컴포넌트 형식의 데이터
 */
export const mapLectureToCard = (lecture) => {
  if (!lecture) return null;

  // 지역 데이터 처리
  let regionStrings = [];

  if (lecture.regions) {
    try {
      // 지역이 JSON 문자열로 제공된 경우 파싱
      if (typeof lecture.regions === "string") {
        try {
          const parsedRegions = JSON.parse(lecture.regions);
          if (Array.isArray(parsedRegions)) {
            regionStrings = parsedRegions.map(formatRegion).filter(Boolean);
          } else {
            regionStrings = [formatRegion(parsedRegions)];
          }
        } catch (e) {
          // JSON 파싱 실패 시 문자열로 취급
          regionStrings = [lecture.regions];
        }
      }
      // 지역이 이미 배열인 경우
      else if (Array.isArray(lecture.regions)) {
        regionStrings = lecture.regions.map(formatRegion).filter(Boolean);
      }
      // 지역이 객체인 경우
      else if (
        typeof lecture.regions === "object" &&
        lecture.regions !== null
      ) {
        regionStrings = [formatRegion(lecture.regions)];
      }
    } catch (error) {
      console.error("지역 데이터 처리 오류:", error);
      regionStrings = [];
    }
  }

  // 카테고리 데이터 처리
  let categoryString = "";
  if (lecture.subcategory) {
    categoryString = lecture.subcategory;
  } else if (lecture.middleCategory) {
    categoryString = lecture.middleCategory;
  } else if (lecture.parentCategory) {
    categoryString = lecture.parentCategory;
  }

  return {
    lectureId: lecture.lectureId,
    title: lecture.lectureTitle,
    price: lecture.price || 0,
    mentorName: lecture.mentorNickname || "",
    profileImage: lecture.profileImage || "/images/default-profile.svg",
    isCertified: lecture.isCertified || false,
    rating: lecture.averageRating || 0,
    subcategory: categoryString ? [categoryString] : [],
    region: regionStrings,
  };
};

/**
 * 백엔드 API의 강의 목록을 CourseCard 컴포넌트 형식으로 변환
 * @param {Array} lectures - 백엔드 API의 강의 목록
 * @returns {Array} - CourseCard 컴포넌트 형식의 강의 목록
 */
export const mapLecturesToCards = (lectures) => {
  if (!Array.isArray(lectures)) return [];
  return lectures.map(mapLectureToCard).filter(Boolean);
};
