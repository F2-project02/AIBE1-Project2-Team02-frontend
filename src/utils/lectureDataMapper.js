// src/utils/lectureDataMapper.js

export const mapLectureFormToApi = (formData) => {
  console.log("mapLectureFormToApi 입력:", formData);

  // categoryId를 직접 사용
  const categoryId = formData.categoryId;
  console.log("categoryId:", categoryId);
  console.log("categoryId 타입:", typeof categoryId);

  if (!categoryId) {
    console.error("categoryId가 없습니다!");
  }

  // 유효한 지역 코드만 필터링 (임시 코드 제거)
  const validRegions = formData.regions
    .filter((region) => {
      // temp- 로 시작하는 임시 코드는 제외
      const isValid =
        region.regionCode && !region.regionCode.startsWith("temp-");
      if (!isValid) {
        console.log("유효하지 않은 지역 제외:", region);
      }
      return isValid;
    })
    .map((region) => ({
      regionCode: region.regionCode,
    }));

  console.log("API에 전송될 유효한 지역 목록:", validRegions);

  const apiData = {
    lectureTitle: formData.title,
    description: formData.description,
    categoryId: categoryId,
    curriculum: formData.curriculum,
    price: Number(formData.price),
    regions: validRegions,
    timeSlots: formData.timeSlots.map((slot) => {
      const formattedSlot = {
        dayOfWeek: slot.dayOfWeek,
        startTime: slot.startTime,
        endTime: slot.endTime,
      };
      delete formattedSlot.id;
      return formattedSlot;
    }),
  };

  console.log("최종 API 데이터:", apiData);

  return apiData;
};
