// src/utils/lectureFormValidator.js

/**
 * 기본 정보 유효성 검사
 */
export function validateBasicInfo(formData) {
    return (
      formData.title &&
      formData.category &&
      formData.middleCategory &&
      formData.subCategory &&
      formData.price &&
      formData.description &&
      formData.categoryId
    );
  }
  
  /**
   * 커리큘럼 유효성 검사
   */
  export function validateCurriculum(formData) {
    return !!formData.curriculum;
  }
  
  /**
   * 최종 제출 시 전체 유효성 검사
   */
  export function validateFinalLectureData(formData) {
    return (
      validateBasicInfo(formData) &&
      validateCurriculum(formData) &&
      formData.timeSlots.length > 0 &&
      formData.regions.length > 0
    );
  }
  