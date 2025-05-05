// src/utils/lectureDataMapper.js

export const mapLectureFormToApi = (formData) => {
  console.log("mapLectureFormToApi 입력:", formData);

  // categoryId를 직접 사용 (이미 설정된 값)
  const categoryId = formData.categoryId; // Number 변환 불필요, 이미 숫자로 저장됨
  console.log("categoryId:", categoryId);
  console.log("categoryId 타입:", typeof categoryId);

  if (!categoryId) {
    console.error("categoryId가 없습니다!");
  }

  const apiData = {
    lectureTitle: formData.title,
    description: formData.description,
    categoryId: categoryId, // 이미 숫자로 저장된 값 사용
    curriculum: formData.curriculum,
    price: Number(formData.price),
    regions: formData.regions.map((region) => ({
      regionCode: region.regionCode,
    })),
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
