// src/constants/mock/mockData.js

// Mock categories
export const mockCategories = {
  parents: [
    "교육/입시",
    "IT/개발",
    "취업/N잡",
    "자격증",
    "예체능",
    "라이프스타일",
  ],

  // Middle categories by parent
  middle: {
    "교육/입시": ["초등학교", "중학교", "고등학교", "대학교"],
    "IT/개발": ["프론트엔드", "백엔드", "앱 개발", "데이터 분석", "인공지능"],
    "취업/N잡": ["공기업", "대기업", "외국계", "스타트업", "포트폴리오"],
    자격증: ["국가기술자격증", "어학자격증", "공무원", "금융자격증"],
    예체능: ["음악", "미술", "체육", "공연"],
    라이프스타일: ["요리", "반려동물", "취미", "심리상담"],
  },

  // Subcategories by middle
  sub: {
    중학교: [
      { id: 101, name: "중등수학" },
      { id: 102, name: "중등과학" },
      { id: 103, name: "중등영어" },
      { id: 104, name: "중등국어" },
    ],
    고등학교: [
      { id: 201, name: "고등수학" },
      { id: 202, name: "고등과학" },
      { id: 203, name: "고등영어" },
      { id: 204, name: "고등국어" },
      { id: 205, name: "대학입시" },
    ],
    프론트엔드: [
      { id: 301, name: "HTML/CSS" },
      { id: 302, name: "JavaScript" },
      { id: 303, name: "React" },
      { id: 304, name: "Vue.js" },
    ],
    백엔드: [
      { id: 401, name: "Java" },
      { id: 402, name: "Python" },
      { id: 403, name: "Node.js" },
      { id: 404, name: "Spring" },
    ],
    "앱 개발": [
      { id: 501, name: "Android" },
      { id: 502, name: "iOS" },
      { id: 503, name: "Flutter" },
      { id: 504, name: "React Native" },
    ],
  },
};

// Mock regions
export const mockRegions = {
  // 시도 목록
  sidos: [
    "서울특별시",
    "경기도",
    "인천광역시",
    "부산광역시",
    "대구광역시",
    "대전광역시",
  ],

  // 시군구 목록 (시도별)
  sigungus: {
    서울특별시: ["강남구", "서초구", "송파구", "종로구", "마포구", "강서구"],
    경기도: ["성남시", "수원시", "용인시", "고양시", "안양시", "부천시"],
    인천광역시: ["중구", "연수구", "남동구", "서구", "부평구"],
  },

  // 동 목록 (시군구별)
  dongs: {
    강남구: [
      {
        regionCode: "1168010100",
        dong: "역삼동",
        displayName: "서울특별시 강남구 역삼동",
      },
      {
        regionCode: "1168010200",
        dong: "논현동",
        displayName: "서울특별시 강남구 논현동",
      },
      {
        regionCode: "1168010300",
        dong: "삼성동",
        displayName: "서울특별시 강남구 삼성동",
      },
      {
        regionCode: "1168010400",
        dong: "청담동",
        displayName: "서울특별시 강남구 청담동",
      },
    ],
    서초구: [
      {
        regionCode: "1165010100",
        dong: "서초동",
        displayName: "서울특별시 서초구 서초동",
      },
      {
        regionCode: "1165010200",
        dong: "방배동",
        displayName: "서울특별시 서초구 방배동",
      },
      {
        regionCode: "1165010300",
        dong: "잠원동",
        displayName: "서울특별시 서초구 잠원동",
      },
      {
        regionCode: "1165010400",
        dong: "반포동",
        displayName: "서울특별시 서초구 반포동",
      },
    ],
    마포구: [
      {
        regionCode: "1144010100",
        dong: "합정동",
        displayName: "서울특별시 마포구 합정동",
      },
      {
        regionCode: "1144010200",
        dong: "망원동",
        displayName: "서울특별시 마포구 망원동",
      },
      {
        regionCode: "1144010300",
        dong: "상암동",
        displayName: "서울특별시 마포구 상암동",
      },
      {
        regionCode: "1144010400",
        dong: "서교동",
        displayName: "서울특별시 마포구 서교동",
      },
    ],
  },
};

// Mock API responses
export const mockCategoryApi = {
  getParentCategories: () => Promise.resolve(mockCategories.parents),

  getMiddleCategories: (parentCategory) =>
    Promise.resolve(mockCategories.middle[parentCategory] || []),

  getSubcategories: (parentCategory, middleCategory) =>
    Promise.resolve(mockCategories.sub[middleCategory] || []),
};

export const mockRegionApi = {
  getSidos: () => Promise.resolve(mockRegions.sidos),

  getSigungus: (sido) => Promise.resolve(mockRegions.sigungus[sido] || []),

  getDongs: (sido, sigungu) =>
    Promise.resolve(mockRegions.dongs[sigungu] || []),
};
