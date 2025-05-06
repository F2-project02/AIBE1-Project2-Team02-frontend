// 📄 src/utils/mapLecturesToCourseCards.js

export const mapLecturesToCourseCards = (lectures) => {
  return lectures.map((lecture) => ({
    lectureId: lecture.lectureId,
    title: lecture.title,
    price: lecture.price,
    mentorName: lecture.mentor.nickname,
    profileImage: lecture.mentor.profileImage,
    isCertified: lecture.mentor.isCertified,
    rating: lecture.mentor.rating,
    subcategory: [lecture.category.sub],
    region: lecture.regions.map((r) => r.sigungu),
  }));
};
