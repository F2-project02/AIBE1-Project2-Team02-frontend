export const dummyLecture = {
  lectureId: 1,
  lectureTitle: "디자인 포토샵 완전정복",
  price: 35000,
  description: "이 수업은 포토샵을 처음 접하는 사람을 위한 강의입니다...",
  curriculum: `
        1주차 - 포토샵 인터페이스 익히기
        2주차 - 레이어와 마스크 이해하기
        3주차 - 실습: 썸네일 만들기
        4주차 - 실무 스타일 가이드 디자인
      `,
  category: {
    parentCategory: "예체능",
    middleCategory: "디자인",
    subcategory: "포토샵",
  },
  availableTimeSlots: [
    { day: "화요일", time: "19:00~21:00" },
    { day: "목요일", time: "16:00~18:00" },
  ],
  regions: [{ sido: "서울특별시", sigungu: "송파구" }],
  mentor: {
    nickname: "가나다라마바사아자차카타",
    age: 24,
    sex: "여성",
    education: "홍익대",
    major: "시각디자인과",
    mbti: "INTJ",
    regions: ["강남구 대치동", "강남구 삼성동"],
    isCertified: true,
    rating: 4.9,
    profileImage: "/images/default-profile.svg",
    analysisComment:
      "문법만 가르치는 게 아니라, 실무 감각까지 키워주는 찐 실무형 디자인 멘토!",
    content: "현직 브랜드 디자이너로서 실무 중심으로 알려드립니다.",
    appealFileUrl: "/files/appeal.pdf",
    tag: "디자인, 포토샵, 실무중심",
  },
  reviews: [
    {
      reviewId: 1,
      writer: { nickname: "후기왕", profileImage: "/images/user1.png" },
      rating: 5,
      content: "썸네일을 혼자서 뚝딱 만들 수 있게 됐어요!",
      createdAt: "2024-04-01T12:34:00",
    },
    {
      reviewId: 2,
      writer: { nickname: "수강생2", profileImage: "/images/user2.png" },
      rating: 4,
      content: "강사님이 친절하게 알려주셔서 좋았어요.",
      createdAt: "2024-04-03T09:15:00",
    },
  ],
};