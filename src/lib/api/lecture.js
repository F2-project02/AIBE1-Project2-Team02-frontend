import { dummyLecture } from "../../constants/mock/dummyLecture";

/**
 * 강의 상세 정보 조회 (API mock 버전)
 * @param {number|string} lectureId
 * @returns {Promise<Object>} 강의 데이터 (모킹)
 */
export const getLectureDetail = async (lectureId) => {
  // 강제로 200~500ms 사이 딜레이 주기
  await new Promise((resolve) => setTimeout(resolve, Math.random() * 300 + 200));

  // ID만 바꿔서 반환 (URL로 들어온 ID와 일치하도록)
  return {
    ...dummyLecture,
    lectureId: Number(lectureId),
  };
};