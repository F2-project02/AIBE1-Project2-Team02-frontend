// 📄 src/utils/apiDataMapper.js

/**
 * 백엔드 API 데이터를 프론트엔드 컴포넌트에 맞게 변환하는 유틸리티 함수들
 */

/**
 * 백엔드 API에서 받아온 강의 목록 데이터를 CourseCard 컴포넌트에서 사용할 수 있는 형태로 변환
 * @param {Array} lectures - 백엔드 API에서 받아온 강의 목록 데이터
 * @returns {Array} - CourseCard 컴포넌트에서 사용할 수 있는 형태로 변환된 강의 목록 데이터
 */
// src/utils/lectureSearchApi.js
export const convertLecturesToCourseCards = (lectures) => {
  if (!lectures || !Array.isArray(lectures)) return [];

  return lectures
    .map((lecture) => {
      // 기본 구조 확인
      if (!lecture) return null;

      // 지역 정보 처리
      let regions = [];
      if (lecture.regions) {
        // 문자열로 된 JSON 배열인 경우
        if (typeof lecture.regions === "string") {
          try {
            regions = JSON.parse(lecture.regions);
          } catch (e) {
            console.error("지역 정보 파싱 에러:", e);
            regions = [];
          }
        }
        // 이미 배열인 경우
        else if (Array.isArray(lecture.regions)) {
          regions = lecture.regions;
        }
        // region 객체 배열인 경우 (시군구 추출)
        else if (lecture.regions[0]?.sigungu) {
          regions = lecture.regions.map((r) => r.sigungu || r.sido);
        }
      }

      // 카테고리 정보 처리
      let subcategory = [];
      if (lecture.subcategory) {
        subcategory = [lecture.subcategory];
      } else if (lecture.category) {
        // 객체 형태인 경우 (sub, middle, parent 순으로 우선순위)
        if (typeof lecture.category === "object") {
          if (lecture.category.sub) {
            subcategory = [lecture.category.sub];
          } else if (lecture.category.middle) {
            subcategory = [lecture.category.middle];
          } else if (lecture.category.parent) {
            subcategory = [lecture.category.parent];
          }
        }
        // 문자열인 경우
        else if (typeof lecture.category === "string") {
          subcategory = [lecture.category];
        }
      }

      // 멘토 정보 처리
      const mentorName =
        lecture.mentorNickname || lecture.mentor?.nickname || "멘토";
      const profileImage =
        lecture.profileImage ||
        lecture.mentor?.profileImage ||
        "/images/default-profile.svg";
      const isCertified =
        lecture.isCertified !== undefined
          ? lecture.isCertified
          : lecture.mentor?.isCertified || false;
      const rating =
        lecture.averageRating !== undefined
          ? lecture.averageRating
          : lecture.mentor?.rating || 4.0;

      // 최종 변환된 객체 반환
      return {
        lectureId: lecture.lectureId,
        title: lecture.lectureTitle || lecture.title || "과외 제목",
        price: lecture.price || 0,
        mentorName,
        profileImage,
        isCertified,
        rating,
        subcategory,
        region: regions.length > 0 ? regions : ["온라인"],
      };
    })
    .filter(Boolean); // null 값 제거
};

/**
 * 백엔드 API에서 받아온 강의 상세 데이터를 강의 상세 페이지에서 사용할 수 있는 형태로 변환
 * @param {Object} lecture - 백엔드 API에서 받아온 강의 상세 데이터
 * @returns {Object} - 강의 상세 페이지에서 사용할 수 있는 형태로 변환된 강의 상세 데이터
 */
export const convertLectureDetail = (lecture) => {
  if (!lecture) return null;

  // 시간표 정보 처리
  let timeSlots = [];
  if (lecture.timeSlots) {
    if (typeof lecture.timeSlots === "string") {
      try {
        timeSlots = JSON.parse(lecture.timeSlots);
      } catch (e) {
        console.error("시간표 정보 파싱 에러:", e);
      }
    } else if (Array.isArray(lecture.timeSlots)) {
      timeSlots = lecture.timeSlots;
    }
  }

  // 지역 정보 처리
  let regions = [];
  if (lecture.regions) {
    if (typeof lecture.regions === "string") {
      try {
        regions = JSON.parse(lecture.regions);
      } catch (e) {
        console.error("지역 정보 파싱 에러:", e);
      }
    } else if (Array.isArray(lecture.regions)) {
      regions = lecture.regions;
    }
  }

  // 카테고리 정보
  const category = {
    parent: lecture.parentCategory || "",
    middle: lecture.middleCategory || "",
    sub: lecture.subcategory || "",
  };

  return {
    id: lecture.lectureId,
    title: lecture.lectureTitle || lecture.title || "제목 없음",
    description: lecture.description || "",
    curriculum: lecture.curriculum || "",
    price: lecture.price || 0,
    isClosed: lecture.isClosed || false,
    createdAt: lecture.createdAt || new Date().toISOString(),
    updatedAt: lecture.updatedAt || new Date().toISOString(),
    mentor: {
      id: lecture.mentor?.userId || 0,
      nickname: lecture.mentorNickname || lecture.mentor?.nickname || "멘토",
      profileImage:
        lecture.mentor?.profileImage || "/images/default-profile.svg",
      isCertified: lecture.mentor?.isCertified || false,
      rating: lecture.mentor?.rating || 4.0,
    },
    category,
    timeSlots,
    regions,
  };
};

/**
 * 카테고리 계층 구조를 변환
 * @param {Array} categoryTree - 백엔드 API에서 받아온 카테고리 트리 데이터
 * @returns {Object} - 계층 구조로 변환된 카테고리 데이터
 */
export const convertCategoryTree = (categoryTree) => {
  if (!categoryTree || !Array.isArray(categoryTree)) return {};

  const result = {};

  categoryTree.forEach((category) => {
    const parent = category.parentCategory;
    const middle = category.middleCategory;
    const sub = category.subcategory;

    if (!result[parent]) {
      result[parent] = {};
    }

    if (!result[parent][middle]) {
      result[parent][middle] = [];
    }

    if (sub) {
      result[parent][middle].push(sub);
    }
  });

  return result;
};

/**
 * 지역 정보를 계층 구조로 변환
 * @param {Array} regions - 백엔드 API에서 받아온 지역 정보 데이터
 * @returns {Object} - 계층 구조로 변환된 지역 데이터
 */
export const convertRegionsTree = (regions) => {
  if (!regions || !Array.isArray(regions)) return {};

  const result = {};

  regions.forEach((region) => {
    const sido = region.sido;
    const sigungu = region.sigungu;
    const dong = region.dong;

    if (!result[sido]) {
      result[sido] = {};
    }

    if (!result[sido][sigungu]) {
      result[sido][sigungu] = [];
    }

    if (dong) {
      result[sido][sigungu].push(dong);
    }
  });

  return result;
};
