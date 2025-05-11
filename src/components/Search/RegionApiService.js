// src/components/Search/RegionApiService.js
import { regionApi } from "../../lib/api/regionApi";

/**
 * 지역 API 관련 서비스 함수들
 */
export const RegionApiService = {
  /**
   * 모든 시도 목록 조회
   * @returns {Promise<string[]>} 시도 목록
   */
  async getSidos() {
    try {
      const response = await regionApi.getSidos();
      if (Array.isArray(response)) {
        return response;
      }
      return [];
    } catch (error) {
      console.error("시도 목록 조회 실패:", error);
      // 실패 시 기본 데이터
      return [
        "서울특별시",
        "경기도",
        "인천광역시",
        "부산광역시",
        "대구광역시",
        "대전광역시",
        "광주광역시",
      ];
    }
  },

  /**
   * 특정 시도의 시군구 목록 조회
   * @param {string} sido 시도명
   * @returns {Promise<string[]>} 시군구 목록
   */
  async getSigungus(sido) {
    try {
      const response = await regionApi.getSigungus(sido);
      if (Array.isArray(response)) {
        return response;
      }
      return [];
    } catch (error) {
      console.error("시군구 목록 조회 실패:", error);
      // 실패 시 기본 데이터
      if (sido === "서울특별시") {
        return [
          "강남구",
          "서초구",
          "송파구",
          "강서구",
          "마포구",
          "종로구",
          "중구",
        ];
      } else if (sido === "경기도") {
        return ["성남시", "수원시", "용인시", "고양시", "안양시", "부천시"];
      }
      return [];
    }
  },

  /**
   * 특정 시군구의 읍면동 목록 조회
   * @param {string} sido 시도명
   * @param {string} sigungu 시군구명
   * @returns {Promise<object[]>} 읍면동 정보 목록
   */
  async getDongs(sido, sigungu) {
    try {
      const response = await regionApi.getDongs(sido, sigungu);
      if (Array.isArray(response)) {
        // 전체 주소를 기준으로 중복 제거
        const uniqueAddressMap = new Map();

        response.forEach((dong) => {
          const fullAddress = `${dong.sido} ${dong.sigungu} ${
            dong.dong || ""
          }`.trim();

          // 이미 존재하는 주소가 아닐 경우에만 추가
          if (!uniqueAddressMap.has(fullAddress)) {
            uniqueAddressMap.set(fullAddress, dong);
          }
        });

        return Array.from(uniqueAddressMap.values());
      }
      return [];
    } catch (error) {
      console.error("읍면동 목록 조회 실패:", error);
      return [];
    }
  },

  /**
   * 전체 지역 정보 조회
   * @returns {Promise<object>} 전체 지역 정보
   */
  async getAllRegions() {
    try {
      const response = await regionApi.getAllRegions();
      return response;
    } catch (error) {
      console.error("전체 지역 정보 조회 실패:", error);
      return { sidos: [], sigungus: [], detailedRegions: [] };
    }
  },

  /**
   * 지역 코드로 지역 정보 찾기
   * @param {string} regionCode 지역 코드
   * @param {object[]} allRegions 모든 지역 정보 리스트
   * @returns {object|null} 지역 정보
   */
  findRegionByCode(regionCode, allRegions) {
    if (!allRegions || !Array.isArray(allRegions.detailedRegions)) {
      return null;
    }

    return (
      allRegions.detailedRegions.find(
        (region) => region.regionCode === regionCode
      ) || null
    );
  },
};
