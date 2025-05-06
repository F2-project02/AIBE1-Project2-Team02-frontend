// 📄 src/api/lecture.js
import { dummyLectures } from "../../constants/mock/dummyLectures";

/**
 * 강의 상세 정보 조회 (lectureId 기준)
 * @param {number|string} lectureId
 * @returns {Promise<Object|null>}
 */
export const getLectureDetail = async (lectureId) => {
  await new Promise((r) => setTimeout(r, Math.random() * 300 + 200));

  return (
    dummyLectures.find((lecture) => lecture.lectureId === Number(lectureId)) ||
    null
  );
};
