// src/lib/api/categoryApi.js
import axiosInstance from "../axiosInstance";

// 카테고리 데이터 - API 호출 실패시 폴백으로 사용
const FALLBACK_DATA = {
  parents: [
    "교육/입시",
    "IT/개발",
    "취업/N잡",
    "자격증",
    "예체능",
    "라이프스타일",
  ],
  middle: {
    "교육/입시": [
      "영유/입시",
      "초등",
      "중등",
      "고등국어",
      "고등영어",
      "고등수학",
      "고등사회",
      "고등과학",
      "제2외국어",
      "논술",
      "입시컨설팅",
    ],
    "IT/개발": ["개발/데이터", "프로그래밍언어", "업무스킬"],
    "취업/N잡": ["취업", "재테크/N잡"],
    자격증: ["자격증"],
    예체능: [
      "악기",
      "음악",
      "국악",
      "미술",
      "공예",
      "사진/영상/3D",
      "디자인",
      "운동",
      "댄스",
      "연기/공연/영화",
    ],
    라이프스타일: ["요리/커피", "뷰티", "취미(기타)"],
  },
  sub: {
    "교육/입시": {
      고등국어: ["내신국어", "독서", "문학", "화법과 작문", "언어와 매체"],
      고등영어: ["내신영어", "수능영어"],
      고등수학: [
        "수학 I",
        "수학 II",
        "미적분",
        "확률과 통계(확통)",
        "기하",
        "경제수학",
      ],
      고등과학: [
        "통합과학",
        "물리 I",
        "물리 II",
        "화학 I",
        "화학 II",
        "생명과학 I",
        "생명과학 II",
        "지구과학 I",
        "지구과학 II",
        "전자회로",
      ],
      제2외국어: [
        "독일어",
        "러시아어",
        "베트남어",
        "스페인어",
        "아랍어",
        "일본어",
        "중국어",
        "프랑스어",
        "한문",
      ],
      논술: ["인문논술", "국어논술", "수리논술", "과학논술", "편입논술"],
    },
    "IT/개발": {
      "개발/데이터": [
        "AI/머신러닝",
        "게임 개발",
        "데이터 분석",
        "모바일 개발",
        "시스템/DevOps",
        "알고리즘",
        "정보 보안",
        "기초 프로그래밍",
        "프론트엔드",
        "백엔드",
        "CS 지식",
      ],
      프로그래밍언어: [
        "C",
        "C#",
        "C++",
        "Go",
        "Java",
        "JavaScript",
        "Kotlin",
        "Python",
        "SQL",
      ],
    },
    "취업/N잡": {
      취업: ["취업 자소서", "취업 면접", "GSAT", "NCS", "PSAT", "skct", "KIDA"],
      "재테크/N잡": [
        "미국 주식",
        "한국 주식",
        "비트코인",
        "NFT",
        "부동산/경매",
        "오픈마켓",
        "유튜브 운영",
        "창업",
      ],
    },
  },
};

export const categoryApi = {
  /**
   * 모든 카테고리 조회
   */
  getAllCategories: async () => {
    try {
      const response = await axiosInstance.get("/api/categories");
      return response.data.data;
    } catch (error) {
      console.error("카테고리 목록 조회 실패:", error);
      throw error;
    }
  },

  /**
   * 카테고리 트리 조회 (계층 구조)
   */
  getCategoryTree: async () => {
    try {
      const response = await axiosInstance.get("/api/categories/tree");
      return response.data.data;
    } catch (error) {
      console.error("카테고리 트리 조회 실패:", error);
      throw error;
    }
  },

  /**
   * 특정 카테고리 조회
   */
  getCategoryById: async (categoryId) => {
    try {
      const response = await axiosInstance.get(`/api/categories/${categoryId}`);
      return response.data.data;
    } catch (error) {
      console.error("카테고리 조회 실패:", error);
      throw error;
    }
  },

  /**
   * 대분류 카테고리 목록 조회
   */
  getParentCategories: async () => {
    try {
      // 직접 axiosInstance 사용하여 요청
      const response = await axiosInstance.get("/api/categories/parents");

      // 응답에서 데이터 추출 및 반환
      if (response && response.data && response.data.data) {
        return response.data.data;
      } else if (response && response.data) {
        return response.data;
      }

      console.warn("대분류 카테고리 응답 형식이 예상과 다릅니다:", response);
      return FALLBACK_DATA.parents;
    } catch (error) {
      console.error("대분류 카테고리 조회 실패:", error);
      return FALLBACK_DATA.parents; // 오류 시 폴백 데이터 반환
    }
  },

  /**
   * 중분류 카테고리 목록 조회
   *
   * 백엔드 API와 일치하는 정확한 파라미터 이름 사용
   * parentCategory 파라미터를 사용
   */
  getMiddleCategories: async (parentCategory) => {
    try {
      if (!parentCategory) {
        return [];
      }

      // 특수문자가 포함된 카테고리명 처리
      const cleanParentCategory = parentCategory.split(":")[0].trim();

      console.log(`중분류 요청: parentCategory=${cleanParentCategory}`);

      // 수정: axiosInstance의 params 옵션 사용하여 올바르게 요청
      const response = await axiosInstance.get("/api/categories/middles", {
        params: { parentCategory: cleanParentCategory },
        timeout: 5000, // 필요시 타임아웃 조정
      });

      // 응답에서 데이터 추출 및 반환
      if (response && response.data && response.data.data) {
        return response.data.data;
      } else if (response && response.data) {
        return response.data;
      }

      console.warn("중분류 카테고리 응답 형식이 예상과 다릅니다:", response);
      return FALLBACK_DATA.middle[cleanParentCategory] || [];
    } catch (error) {
      console.error("중분류 카테고리 조회 실패:", error);
      // 오류 시 폴백 데이터 사용
      const cleanParentCategory = parentCategory.split(":")[0].trim();
      return FALLBACK_DATA.middle[cleanParentCategory] || [];
    }
  },

  /**
   * 소분류 카테고리 목록 조회
   *
   * 백엔드 API와 일치하는 정확한 파라미터 이름 사용
   * parentCategory와 middleCategory 파라미터를 사용
   */
  getSubcategories: async (parentCategory, middleCategory) => {
    try {
      if (!parentCategory || !middleCategory) {
        return [];
      }

      // 특수문자가 포함된 카테고리명 처리
      const cleanParentCategory = parentCategory.split(":")[0].trim();
      const cleanMiddleCategory = middleCategory.split(":")[0].trim();

      console.log(
        `소분류 요청: parentCategory=${cleanParentCategory}, middleCategory=${cleanMiddleCategory}`
      );

      // 수정: axiosInstance의 params 옵션 사용하여 올바르게 요청
      const response = await axiosInstance.get("/api/categories/subs", {
        params: {
          parentCategory: cleanParentCategory,
          middleCategory: cleanMiddleCategory,
        },
        timeout: 5000,
      });

      // 응답에서 데이터 추출 및 반환
      if (response && response.data && response.data.data) {
        return response.data.data;
      } else if (response && response.data) {
        return response.data;
      }

      console.warn("소분류 카테고리 응답 형식이 예상과 다릅니다:", response);

      // 폴백 데이터 사용
      if (
        FALLBACK_DATA.sub[cleanParentCategory] &&
        FALLBACK_DATA.sub[cleanParentCategory][cleanMiddleCategory]
      ) {
        return FALLBACK_DATA.sub[cleanParentCategory][cleanMiddleCategory];
      }

      return [];
    } catch (error) {
      console.error("소분류 카테고리 조회 실패:", error);

      // 오류 시 폴백 데이터 사용
      const cleanParentCategory = parentCategory.split(":")[0].trim();
      const cleanMiddleCategory = middleCategory.split(":")[0].trim();

      if (
        FALLBACK_DATA.sub[cleanParentCategory] &&
        FALLBACK_DATA.sub[cleanParentCategory][cleanMiddleCategory]
      ) {
        return FALLBACK_DATA.sub[cleanParentCategory][cleanMiddleCategory];
      }

      return [];
    }
  },

  /**
   * 카테고리 데이터 직접 표시용 API 요청 (디버깅용)
   */
  debugCategoryApi: async (endpoint, params = {}) => {
    try {
      const response = await axiosInstance.get(endpoint, { params });
      console.log(`Debug API Call to ${endpoint}:`, response);
      return response.data;
    } catch (error) {
      console.error(`Debug API Error on ${endpoint}:`, error);
      throw error;
    }
  },
};

/**
 * CategoryService - 사용자 인터페이스 컴포넌트를 위한 서비스
 */
export const CategoryService = {
  /**
   * 대분류 카테고리 가져오기
   */
  async getParentCategories() {
    try {
      const result = await categoryApi.getParentCategories();
      if (result && result.length > 0) {
        return result;
      }

      console.log("API 호출 실패, 폴백 데이터 사용 (대분류)");
      return FALLBACK_DATA.parents;
    } catch (error) {
      console.error("대분류 카테고리 로드 오류:", error);
      return FALLBACK_DATA.parents;
    }
  },

  /**
   * 중분류 카테고리 가져오기
   */
  async getMiddleCategories(parentCategory) {
    if (!parentCategory) return [];

    try {
      // 특수문자가 포함된 카테고리명 처리
      const cleanParentCategory = parentCategory.split(":")[0].trim();

      const result = await categoryApi.getMiddleCategories(cleanParentCategory);
      if (result && result.length > 0) {
        return result;
      }

      console.log(
        `API 호출 실패, 폴백 데이터 사용 (중분류: ${cleanParentCategory})`
      );
      return FALLBACK_DATA.middle[cleanParentCategory] || [];
    } catch (error) {
      console.error(`'${parentCategory}'의 중분류 카테고리 로드 오류:`, error);

      // 특수문자가 포함된 카테고리명 처리
      const cleanParentCategory = parentCategory.split(":")[0].trim();
      return FALLBACK_DATA.middle[cleanParentCategory] || [];
    }
  },

  /**
   * 소분류 카테고리 가져오기
   */
  async getSubcategories(parentCategory, middleCategory) {
    if (!parentCategory || !middleCategory) return [];

    try {
      // 특수문자가 포함된 카테고리명 처리
      const cleanParentCategory = parentCategory.split(":")[0].trim();
      const cleanMiddleCategory = middleCategory.split(":")[0].trim();

      const result = await categoryApi.getSubcategories(
        cleanParentCategory,
        cleanMiddleCategory
      );

      if (result && result.length > 0) {
        return result;
      }

      console.log(
        `API 호출 실패, 폴백 데이터 사용 (소분류: ${cleanParentCategory} > ${cleanMiddleCategory})`
      );

      if (
        FALLBACK_DATA.sub[cleanParentCategory] &&
        FALLBACK_DATA.sub[cleanParentCategory][cleanMiddleCategory]
      ) {
        return FALLBACK_DATA.sub[cleanParentCategory][cleanMiddleCategory];
      }

      return [];
    } catch (error) {
      console.error(
        `'${parentCategory} > ${middleCategory}'의 소분류 카테고리 로드 오류:`,
        error
      );

      // 특수문자가 포함된 카테고리명 처리
      const cleanParentCategory = parentCategory.split(":")[0].trim();
      const cleanMiddleCategory = middleCategory.split(":")[0].trim();

      if (
        FALLBACK_DATA.sub[cleanParentCategory] &&
        FALLBACK_DATA.sub[cleanParentCategory][cleanMiddleCategory]
      ) {
        return FALLBACK_DATA.sub[cleanParentCategory][cleanMiddleCategory];
      }

      return [];
    }
  },

  /**
   * 디버그용 함수 - 백엔드 API를 직접 호출해서 응답 확인
   */
  async debugApiCall() {
    try {
      console.log("API 디버그 시작...");

      // 대분류 API 확인
      const parentResult = await categoryApi.getParentCategories();
      console.log("대분류 API 응답:", parentResult);

      // 기본값 사용
      const parentCategory = "IT/개발";

      // 중분류 API 확인
      const middleResult = await categoryApi.getMiddleCategories(
        parentCategory
      );
      console.log(`중분류 API 응답 (${parentCategory}):`, middleResult);

      // 기본값 사용
      const middleCategory = "프로그래밍언어";

      // 소분류 API 확인
      const subResult = await categoryApi.getSubcategories(
        parentCategory,
        middleCategory
      );
      console.log(
        `소분류 API 응답 (${parentCategory} > ${middleCategory}):`,
        subResult
      );

      return {
        parentResult,
        middleResult,
        subResult,
      };
    } catch (error) {
      console.error("API 디버그 오류:", error);
      return { error };
    }
  },
};
