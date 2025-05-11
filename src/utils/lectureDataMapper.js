export const mapLectureFormToApi = (formData) => {
  console.log("mapLectureFormToApi 입력:", formData);

  // categoryId를 직접 사용
  const categoryId = formData.categoryId;

  // 임시 리전 코드 처리 로직 추가
  let validRegions = [];

  // 지역이 하나도 없는 경우를 대비한 안전 처리
  if (formData.regions && formData.regions.length > 0) {
    // Case 1: 임시 지역 코드가 있는 경우 (수정 시 기존 지역 정보)
    if (
      formData.regions.some((region) => region.regionCode?.startsWith("temp-"))
    ) {
      console.log("임시 지역 코드 감지 - 백엔드로 전송을 위한 변환 수행");

      // 수정모드에서 기존 지역 정보를 그대로 유지하기 위한 특별 처리
      // 이 부분에서 백엔드 API와의 호환성을 맞추는 것이 중요합니다

      // 방법 1: 임시 지역 코드를 사용하는 경우에도 그대로 전송
      validRegions = formData.regions.map((region) => ({
        regionCode: region.regionCode,
        // 백엔드에서 필요로 하는 다른 필드도 추가
      }));

      console.log("임시 지역 코드 변환:", validRegions);
    }
    // Case 2: 정상적인 지역 코드인 경우 (새로 선택한 지역 정보)
    else {
      validRegions = formData.regions
        .filter((region) => {
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
    }
  }

  // 지역 정보가 없는 경우 로그 출력
  if (validRegions.length === 0) {
    console.warn("⚠️ 경고: 전송할 지역 정보가 없어요!");
  }

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
