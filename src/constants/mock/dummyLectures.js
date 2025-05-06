// 📄 src/constants/mock/dummyLectures.js

export const dummyLectures = [
  {
    lectureId: 1,
    title: "디자인 포토샵 완전정복",
    price: 35000,
    description: "이 수업은 포토샵을 처음 접하는 사람을 위한 강의입니다...",
    curriculum: `
        1주차 - 포토샵 인터페이스 익히기
        2주차 - 레이어와 마스크 이해하기
        3주차 - 실습: 썸네일 만들기
        4주차 - 실무 스타일 가이드 디자인
      `,
    category: {
      parent: "예체능",
      middle: "디자인",
      sub: "포토샵",
    },
    availableTimeSlots: [
      { day: "화요일", time: "19:00~21:00" },
      { day: "목요일", time: "16:00~18:00" },
    ],
    regions: [
      { sido: "서울특별시", sigungu: "송파구" },
      { sido: "서울특별시", sigungu: "강남구" },
    ],
    mentor: {
      userId: 101,
      nickname: "가나다라마바사아자차카타",
      isCertified: true,
      profileImage: "/images/default-profile.svg",
      mbti: "INTJ",
      rating: 4.9,
      education: "홍익대",
      major: "시각디자인과",
      age: 24,
      sex: "여성",
      regions: ["강남구 대치동", "강남구 삼성동"],
      analysisComment:
        "문법만 가르치는 게 아니라, 실무 감각까지 키워주는 찐 실무형 디자인 멘토!",
      content: "현직 브랜드 디자이너로서 실무 중심으로 알려드립니다.",
      appealFileUrl: "/files/appeal.pdf",
      tag: "디자인, 포토샵, 실무중심",
    },
    reviews: [
      {
        reviewId: 1,
        writer: {
          userId: 201,
          nickname: "후기왕",
          profileImage: "/images/user1.png",
        },
        rating: 5,
        content: "썸네일을 혼자서 뚝딱 만들 수 있게 됐어요!",
        createdAt: "2024-04-01T12:34:00",
      },
      {
        reviewId: 2,
        writer: {
          userId: 202,
          nickname: "수강생2",
          profileImage: "/images/user2.png",
        },
        rating: 4,
        content: "강사님이 친절하게 알려주셔서 좋았어요.",
        createdAt: "2024-04-03T09:15:00",
      },
    ],
  },
  {
    lectureId: 2,
    title: "국어 내신 만점 전략",
    price: 25000,
    description: "내신 대비를 위한 필수 국어 전략 강의! 비문학·문학 완전 정복!",
    curriculum: `
      1주차 - 현대시 해석법
      2주차 - 비문학 독해 스킬
      3주차 - 서술형 답안 작성 요령
      4주차 - 기출문제 풀이 실전
    `,
    category: {
      parent: "교육/입시",
      middle: "중등",
      sub: "국어",
    },
    availableTimeSlots: [
      { day: "월요일", time: "18:00~20:00" },
      { day: "토요일", time: "10:00~12:00" },
    ],
    regions: [
      { sido: "경기도", sigungu: "성남시" },
      { sido: "서울특별시", sigungu: "관악구" },
    ],
    mentor: {
      userId: 102,
      nickname: "문학소녀",
      isCertified: true,
      profileImage: "/images/user3.png",
      mbti: "INFJ",
      rating: 4.8,
      education: "서울대",
      major: "국어교육과",
      age: 26,
      sex: "여성",
      regions: ["관악구", "성남시"],
      analysisComment:
        "국어는 암기가 아닙니다. 감각과 이해로 푸는 법을 알려드릴게요.",
      content: "현직 국어 교사가 직접 알려주는 내신 맞춤 전략!",
      appealFileUrl: "/files/korean.pdf",
      tag: "내신, 국어, 서술형, 기출분석",
    },
    reviews: [
      {
        reviewId: 3,
        writer: {
          userId: 203,
          nickname: "고1학생",
          profileImage: "/images/user3.png",
        },
        rating: 5,
        content: "이해가 쏙쏙 됐어요. 국어가 재미있어졌습니다!",
        createdAt: "2024-04-10T14:20:00",
      },
    ],
  },
  {
    lectureId: 3,
    title: "수학 기초부터 수능까지",
    price: 40000,
    description: "개념 정리부터 실전까지, 수포자도 환영!",
    curriculum: `
      1주차 - 수와 연산의 원리
      2주차 - 함수와 그래프
      3주차 - 기출문제 유형 분석
      4주차 - 실전 모의고사 풀이
    `,
    category: {
      parent: "교육/입시",
      middle: "고등",
      sub: "수학",
    },
    availableTimeSlots: [
      { day: "수요일", time: "17:00~19:00" },
      { day: "일요일", time: "13:00~15:00" },
    ],
    regions: [{ sido: "부산광역시", sigungu: "해운대구" }],
    mentor: {
      userId: 103,
      nickname: "수포자탈출",
      isCertified: false,
      profileImage: "/images/default-profile.svg",
      mbti: "ESTP",
      rating: 4.6,
      education: "부산대",
      major: "수학교육과",
      age: 28,
      sex: "남성",
      regions: ["해운대구"],
      analysisComment:
        "수학도 말로 풀 수 있어요. 개념을 잡아야 문제를 풀 수 있습니다.",
      content: "학생 눈높이에 맞춘 설명으로 수포자 탈출을 도와드립니다.",
      appealFileUrl: "/files/math.pdf",
      tag: "수학, 수능, 개념, 유형정리",
    },
    reviews: [
      {
        reviewId: 4,
        writer: {
          userId: 204,
          nickname: "이과준비생",
          profileImage: "/images/user4.png",
        },
        rating: 4,
        content: "개념 설명이 정말 쉬웠어요. 복습 영상도 굿!",
        createdAt: "2024-04-12T16:00:00",
      },
    ],
  },
  {
    lectureId: 4,
    title: "영어 독해 완전 정복",
    price: 30000,
    description: "문장 해석이 막막한 친구들을 위한 구조독해 특강",
    curriculum: `
      1주차 - 문장 구조 분석
      2주차 - 구문 독해 트레이닝
      3주차 - 속독을 위한 팁
      4주차 - 수능형 긴 지문 훈련
    `,
    category: {
      parent: "교육/입시",
      middle: "고등",
      sub: "영어",
    },
    availableTimeSlots: [{ day: "금요일", time: "19:30~21:30" }],
    regions: [{ sido: "대전광역시", sigungu: "유성구" }],
    mentor: {
      userId: 104,
      nickname: "문장분해마스터",
      isCertified: true,
      profileImage: "/images/user5.png",
      mbti: "ENTJ",
      rating: 4.7,
      education: "카이스트",
      major: "영문학과",
      age: 25,
      sex: "남성",
      regions: ["유성구"],
      analysisComment: "단어만 아는 건 영어가 아닙니다. 구조가 핵심입니다.",
      content: "구조 독해의 핵심을 콕 집어주는 영어 특강입니다.",
      appealFileUrl: "/files/english.pdf",
      tag: "영어독해, 구조독해, 수능영어",
    },
    reviews: [],
  },
  {
    lectureId: 5,
    title: "Python으로 배우는 코딩 기초",
    price: 32000,
    description: "프로그래밍을 처음 접하는 사람을 위한 파이썬 기초 강의입니다.",
    curriculum: `
      1주차 - 파이썬 문법 기초
      2주차 - 조건문과 반복문
      3주차 - 함수와 리스트
      4주차 - 간단한 프로젝트 실습
    `,
    category: {
      parent: "IT/개발",
      middle: "프로그래밍",
      sub: "파이썬",
    },
    availableTimeSlots: [
      { day: "화요일", time: "19:00~21:00" },
      { day: "토요일", time: "14:00~16:00" },
    ],
    regions: [{ sido: "서울특별시", sigungu: "마포구" }],
    mentor: {
      userId: 105,
      nickname: "파이썬쌤",
      isCertified: true,
      profileImage: "/images/user6.png",
      mbti: "ISTJ",
      rating: 4.8,
      education: "서울과학기술대",
      major: "컴퓨터공학과",
      age: 30,
      sex: "남성",
      regions: ["마포구"],
      analysisComment:
        "프로그래밍의 첫걸음을 가장 쉽게! 이해와 재미 중심의 수업!",
      content: "비전공자도 이해할 수 있는 실용 중심 파이썬 강의입니다.",
      appealFileUrl: "/files/python.pdf",
      tag: "파이썬, 코딩입문, 실습중심",
    },
    reviews: [
      {
        reviewId: 5,
        writer: {
          userId: 205,
          nickname: "개발초보",
          profileImage: "/images/user5.png",
        },
        rating: 5,
        content: "정말 기초부터 차근차근 설명해주셔서 좋았어요!",
        createdAt: "2024-04-15T11:10:00",
      },
    ],
  },
  {
    lectureId: 6,
    title: "React로 프론트엔드 시작하기",
    price: 40000,
    description: "컴포넌트 기반 개발 방식으로 모던 웹을 배워봐요.",
    curriculum: `
      1주차 - React 기본 개념과 JSX
      2주차 - 상태 관리와 이벤트
      3주차 - 컴포넌트 재사용 및 Props
      4주차 - 실전 프로젝트 구성
    `,
    category: {
      parent: "IT/개발",
      middle: "웹 개발",
      sub: "React",
    },
    availableTimeSlots: [{ day: "수요일", time: "20:00~22:00" }],
    regions: [{ sido: "경기도", sigungu: "수원시" }],
    mentor: {
      userId: 106,
      nickname: "리액트고수",
      isCertified: false,
      profileImage: "/images/default-profile.svg",
      mbti: "ENTP",
      rating: 4.5,
      education: "한양대",
      major: "소프트웨어학과",
      age: 29,
      sex: "남성",
      regions: ["수원시", "용인시"],
      analysisComment: "기능 구현 위주의 빠른 실전형 프론트엔드 코스!",
      content: "React를 사용한 웹페이지 제작부터 배포까지 경험해봐요.",
      appealFileUrl: "/files/react.pdf",
      tag: "React, 웹개발, 프론트엔드",
    },
    reviews: [],
  },
  {
    lectureId: 7,
    title: "백엔드 개발 입문 - Java & Spring",
    price: 45000,
    description: "Java 언어부터 Spring Boot까지 웹 서비스 만들기 실습",
    curriculum: `
      1주차 - Java 기본 문법
      2주차 - Spring Boot 프로젝트 생성
      3주차 - REST API와 DB 연결
      4주차 - 로그인 기능 구현
    `,
    category: {
      parent: "IT/개발",
      middle: "서버 개발",
      sub: "Spring Boot",
    },
    availableTimeSlots: [
      { day: "토요일", time: "15:00~17:00" },
      { day: "일요일", time: "13:00~15:00" },
    ],
    regions: [{ sido: "대구광역시", sigungu: "달서구" }],
    mentor: {
      userId: 107,
      nickname: "스프링요정",
      isCertified: true,
      profileImage: "/images/user7.png",
      mbti: "INTP",
      rating: 4.9,
      education: "경북대",
      major: "컴퓨터공학과",
      age: 27,
      sex: "여성",
      regions: ["달서구"],
      analysisComment: "백엔드의 기본을 다지고 싶은 분께 추천드려요!",
      content: "이론과 실습을 균형 있게 배울 수 있는 백엔드 입문 강의입니다.",
      appealFileUrl: "/files/springboot.pdf",
      tag: "Java, Spring, 백엔드",
    },
    reviews: [
      {
        reviewId: 6,
        writer: {
          userId: 206,
          nickname: "취준개발자",
          profileImage: "/images/user6.png",
        },
        rating: 5,
        content: "Spring Boot 흐름이 잡혀서 정말 만족했습니다!",
        createdAt: "2024-04-18T19:40:00",
      },
    ],
  },
  {
    lectureId: 8,
    title: "이력서·자소서 완성반",
    price: 28000,
    description: "AI 시대에도 통하는 자소서, 기업 맞춤형으로 첨삭까지!",
    curriculum: `
      1주차 - 나를 파는 글쓰기 전략
      2주차 - 이력서 구성과 포트폴리오 기획
      3주차 - 기업별 자소서 맞춤 전략
      4주차 - 모의 면접 및 첨삭 피드백
    `,
    category: {
      parent: "취업/N잡",
      middle: "취업 준비",
      sub: "자소서·이력서",
    },
    availableTimeSlots: [
      { day: "월요일", time: "20:00~22:00" },
      { day: "토요일", time: "10:00~12:00" },
    ],
    regions: [{ sido: "서울특별시", sigungu: "영등포구" }],
    mentor: {
      userId: 108,
      nickname: "자소서코치",
      isCertified: true,
      profileImage: "/images/user8.png",
      mbti: "ENFJ",
      rating: 4.8,
      education: "고려대",
      major: "경영학과",
      age: 31,
      sex: "여성",
      regions: ["영등포구", "마포구"],
      analysisComment: "실제 인사담당자의 시선으로 피드백을 드려요!",
      content: "10년 경력의 인사팀장이 전하는 현실적인 자소서 전략.",
      appealFileUrl: "/files/resume.pdf",
      tag: "이력서, 자소서, 면접, 취업",
    },
    reviews: [
      {
        reviewId: 7,
        writer: {
          userId: 207,
          nickname: "취준러A",
          profileImage: "/images/user7.png",
        },
        rating: 5,
        content: "실제 피드백을 바로 받아서 정말 큰 도움이 되었어요.",
        createdAt: "2024-04-10T13:00:00",
      },
    ],
  },
  {
    lectureId: 9,
    title: "부업으로 시작하는 스마트스토어",
    price: 35000,
    description: "초보자도 가능한 네이버 스마트스토어 운영 A to Z",
    curriculum: `
      1주차 - 아이템 선정과 시장조사
      2주차 - 스마트스토어 등록 실습
      3주차 - 배송/CS 운영 전략
      4주차 - 광고와 마케팅 기초
    `,
    category: {
      parent: "취업/N잡",
      middle: "부업",
      sub: "스마트스토어",
    },
    availableTimeSlots: [{ day: "수요일", time: "20:00~22:00" }],
    regions: [{ sido: "인천광역시", sigungu: "부평구" }],
    mentor: {
      userId: 109,
      nickname: "부업장인",
      isCertified: false,
      profileImage: "/images/default-profile.svg",
      mbti: "ISFJ",
      rating: 4.6,
      education: "인천대",
      major: "전자상거래학",
      age: 33,
      sex: "남성",
      regions: ["부평구"],
      analysisComment:
        "내돈내산 기반 실전 경험에서 나오는 리얼 스토어 운영 팁!",
      content: "첫 창업도 두렵지 않도록, 실전 위주로 알려드립니다.",
      appealFileUrl: "/files/store.pdf",
      tag: "부업, 스마트스토어, 마케팅",
    },
    reviews: [
      {
        reviewId: 8,
        writer: {
          userId: 208,
          nickname: "N잡러",
          profileImage: "/images/user8.png",
        },
        rating: 4,
        content: "실무 경험이 많아서 설명이 현실적이었어요!",
        createdAt: "2024-04-11T15:20:00",
      },
    ],
  },
  {
    lectureId: 10,
    title: "면접에서 붙는 사람의 말투",
    price: 30000,
    description: "같은 답변도 다르게 들리는 ‘합격 언어’ 훈련",
    curriculum: `
      1주차 - 자기소개 멘트 다듬기
      2주차 - 기업 질문에 맞는 답변 구조
      3주차 - 말하기 피드백 실습
      4주차 - 모의 면접 진행
    `,
    category: {
      parent: "취업/N잡",
      middle: "면접",
      sub: "면접코칭",
    },
    availableTimeSlots: [{ day: "금요일", time: "19:00~21:00" }],
    regions: [{ sido: "광주광역시", sigungu: "북구" }],
    mentor: {
      userId: 110,
      nickname: "면접멘토",
      isCertified: true,
      profileImage: "/images/user9.png",
      mbti: "ESFP",
      rating: 4.9,
      education: "전남대",
      major: "교육학과",
      age: 35,
      sex: "남성",
      regions: ["북구"],
      analysisComment: "면접은 내용보다 전달입니다. 말투가 결과를 바꿔요.",
      content: "많은 합격자를 배출한 말하기 중심 면접 코칭입니다.",
      appealFileUrl: "/files/interview.pdf",
      tag: "면접, 말하기, 자기소개, 피드백",
    },
    reviews: [],
  },
  {
    lectureId: 11,
    title: "컴퓨터활용능력 2급 단기 합격반",
    price: 28000,
    description: "엑셀과 한글만 할 줄 알아도 가능한 필기+실기 올인원 강의!",
    curriculum: `
      1주차 - 필기 핵심 이론 요약
      2주차 - 엑셀 실기 기본 실습
      3주차 - 엑셀 함수/차트 유형 공략
      4주차 - 실전 모의고사 및 풀이
    `,
    category: {
      parent: "자격",
      middle: "IT 자격",
      sub: "컴활 2급",
    },
    availableTimeSlots: [{ day: "월요일", time: "19:00~21:00" }],
    regions: [{ sido: "서울특별시", sigungu: "동작구" }],
    mentor: {
      userId: 111,
      nickname: "자격증요정",
      isCertified: true,
      profileImage: "/images/user10.png",
      mbti: "ISFP",
      rating: 4.8,
      education: "이화여대",
      major: "교육공학",
      age: 32,
      sex: "여성",
      regions: ["동작구", "영등포구"],
      analysisComment:
        "단기간에 필기+실기를 한 번에! 암기 포인트를 콕 집어드립니다.",
      content: "기초부터 실전까지 한 번에 대비 가능한 실속 강의입니다.",
      appealFileUrl: "/files/computer-license.pdf",
      tag: "컴활, 자격증, 엑셀, 실기",
    },
    reviews: [
      {
        reviewId: 9,
        writer: {
          userId: 209,
          nickname: "공시생A",
          profileImage: "/images/user9.png",
        },
        rating: 5,
        content: "정말 빠르고 효율적으로 정리돼 있어요!",
        createdAt: "2024-04-09T18:00:00",
      },
    ],
  },
  {
    lectureId: 12,
    title: "한국사능력검정시험 중급 대비반",
    price: 30000,
    description: "스스로 외우지 않아도 암기가 되는 연상 암기법 전수!",
    curriculum: `
      1주차 - 선사~조선 전기 흐름 잡기
      2주차 - 근현대사 연표 정리
      3주차 - 출제 유형별 문제 풀이
      4주차 - 모의고사 실전 트레이닝
    `,
    category: {
      parent: "자격",
      middle: "국가 자격",
      sub: "한국사능력검정",
    },
    availableTimeSlots: [
      { day: "수요일", time: "18:00~20:00" },
      { day: "토요일", time: "11:00~13:00" },
    ],
    regions: [{ sido: "충청북도", sigungu: "청주시" }],
    mentor: {
      userId: 112,
      nickname: "역사멘토",
      isCertified: false,
      profileImage: "/images/default-profile.svg",
      mbti: "INFP",
      rating: 4.7,
      education: "충북대",
      major: "역사교육과",
      age: 29,
      sex: "남성",
      regions: ["청주시"],
      analysisComment: "암기보다 흐름이 중요! 도식화된 정리가 핵심이에요.",
      content: "교원 임용 준비까지 해봤던 제가 직접 요점만 정리해드립니다.",
      appealFileUrl: "/files/korean-history.pdf",
      tag: "한국사, 자격증, 연상암기, 중급",
    },
    reviews: [
      {
        reviewId: 10,
        writer: {
          userId: 210,
          nickname: "취준생B",
          profileImage: "/images/user10.png",
        },
        rating: 4,
        content: "역사에 약했는데 정말 흐름이 잡히네요!",
        createdAt: "2024-04-13T10:10:00",
      },
    ],
  },
  {
    lectureId: 13,
    title: "토익 750+ 보장반",
    price: 39000,
    description: "LC·RC 기본기부터 실전까지! 매주 모의고사와 피드백 제공",
    curriculum: `
      1주차 - 파트별 풀이 전략 (Part 1~4)
      2주차 - 파트별 풀이 전략 (Part 5~7)
      3주차 - 시간 관리와 오답 노트 작성법
      4주차 - 실전 모의고사 및 해설
    `,
    category: {
      parent: "자격",
      middle: "어학 자격",
      sub: "TOEIC",
    },
    availableTimeSlots: [
      { day: "화요일", time: "20:00~22:00" },
      { day: "일요일", time: "10:00~12:00" },
    ],
    regions: [{ sido: "경상남도", sigungu: "창원시" }],
    mentor: {
      userId: 113,
      nickname: "토익박살",
      isCertified: true,
      profileImage: "/images/user11.png",
      mbti: "ENTJ",
      rating: 4.9,
      education: "부산외대",
      major: "영어통번역",
      age: 34,
      sex: "여성",
      regions: ["창원시"],
      analysisComment: "파트별 고득점 전략을 훈련식으로 반복 학습합니다!",
      content: "토익은 전략과 반복입니다. 함께 공부하고 바로 피드백 받아요.",
      appealFileUrl: "/files/toeic.pdf",
      tag: "토익, LC, RC, 고득점",
    },
    reviews: [],
  },
  {
    lectureId: 14,
    title: "학점은행제 경영학 학사과정 가이드",
    price: 40000,
    description: "직장인·N잡러를 위한 온라인 학사 학위 취득 로드맵!",
    curriculum: `
      1주차 - 학점은행제란? 제도 완전 정리
      2주차 - 전공/교양 이수 전략과 학습계획서 작성
      3주차 - 온라인 강의 수강 팁과 과제 대처법
      4주차 - 학위 신청 및 학점 인정 노하우
    `,
    category: {
      parent: "학위",
      middle: "학점은행제",
      sub: "경영학",
    },
    availableTimeSlots: [
      { day: "월요일", time: "20:00~22:00" },
      { day: "일요일", time: "09:00~11:00" },
    ],
    regions: [{ sido: "서울특별시", sigungu: "성동구" }],
    mentor: {
      userId: 114,
      nickname: "학점멘토",
      isCertified: true,
      profileImage: "/images/user12.png",
      mbti: "ISTJ",
      rating: 4.9,
      education: "고려사이버대",
      major: "경영학과",
      age: 37,
      sex: "여성",
      regions: ["성동구", "동대문구"],
      analysisComment: "경력 + 학위가 필요한 분들을 위한 최적의 가이드입니다.",
      content: "직장병행자 기준으로 학위 취득을 도와드립니다.",
      appealFileUrl: "/files/degree-guide.pdf",
      tag: "학점은행제, 경영학, 온라인학위",
    },
    reviews: [
      {
        reviewId: 11,
        writer: {
          userId: 211,
          nickname: "직장인A",
          profileImage: "/images/user11.png",
        },
        rating: 5,
        content: "현실적으로 너무 잘 짜여진 로드맵이었어요.",
        createdAt: "2024-04-02T20:00:00",
      },
    ],
  },
  {
    lectureId: 15,
    title: "사회복지사 2급 준비반 (학위+실습 포함)",
    price: 45000,
    description:
      "이론+실습+자격까지, 사회복지사로 전직하고 싶은 분을 위한 패키지",
    curriculum: `
      1주차 - 사회복지 개론 및 관련법 이해
      2주차 - 전공필수 과목 학습법
      3주차 - 실습기관 찾기 및 실습 준비
      4주차 - 자격 신청 및 취업 방향성
    `,
    category: {
      parent: "학위",
      middle: "전문학사",
      sub: "사회복지",
    },
    availableTimeSlots: [{ day: "화요일", time: "19:00~21:00" }],
    regions: [{ sido: "경기도", sigungu: "의정부시" }],
    mentor: {
      userId: 115,
      nickname: "복지진로코치",
      isCertified: true,
      profileImage: "/images/user13.png",
      mbti: "ENFP",
      rating: 4.7,
      education: "한국방송통신대",
      major: "사회복지학과",
      age: 35,
      sex: "남성",
      regions: ["의정부시"],
      analysisComment:
        "현장에서 필요로 하는 역량까지 같이 준비하는 실전형 수업입니다.",
      content: "학위와 자격, 실습까지 한번에 준비할 수 있어요.",
      appealFileUrl: "/files/welfare.pdf",
      tag: "사회복지사, 학위과정, 실습",
    },
    reviews: [
      {
        reviewId: 12,
        writer: {
          userId: 212,
          nickname: "이직희망자",
          profileImage: "/images/user12.png",
        },
        rating: 5,
        content: "실습까지 연결해주셔서 진짜 현실적으로 큰 도움 됐어요.",
        createdAt: "2024-04-05T15:45:00",
      },
    ],
  },
  {
    lectureId: 16,
    title: "IT비전공자를 위한 컴퓨터공학 학위 설계",
    price: 42000,
    description: "개발자가 되고 싶은 문과생/비전공자에게 추천!",
    curriculum: `
      1주차 - 사이버대/학점은행 컴공 과정 소개
      2주차 - 전공 필수과목 학습법 및 순서
      3주차 - 병행 가능한 코딩 교육 병행전략
      4주차 - 취업/자격 연결 플랜
    `,
    category: {
      parent: "학위",
      middle: "학점은행제",
      sub: "컴퓨터공학",
    },
    availableTimeSlots: [{ day: "목요일", time: "20:00~22:00" }],
    regions: [{ sido: "대전광역시", sigungu: "서구" }],
    mentor: {
      userId: 116,
      nickname: "비전공컴공러",
      isCertified: false,
      profileImage: "/images/default-profile.svg",
      mbti: "INTJ",
      rating: 4.6,
      education: "서울사이버대",
      major: "컴퓨터공학",
      age: 30,
      sex: "여성",
      regions: ["서구"],
      analysisComment: "비전공자 특유의 어려움을 고려한 최적화 학위 설계",
      content: "본인도 비전공 출신이라 공감하며 도와드립니다!",
      appealFileUrl: "/files/cs-degree.pdf",
      tag: "컴공학위, 사이버대, IT진로",
    },
    reviews: [],
  },
  {
    lectureId: 17,
    title: "취미 드로잉 입문 클래스",
    price: 28000,
    description: "연필만 있으면 누구나 시작할 수 있는 기초 드로잉 강의",
    curriculum: `
      1주차 - 선과 형태 잡기
      2주차 - 명암과 음영 표현
      3주차 - 정물 스케치 실습
      4주차 - 인물 드로잉 도전
    `,
    category: {
      parent: "예체능",
      middle: "미술",
      sub: "드로잉",
    },
    availableTimeSlots: [{ day: "토요일", time: "14:00~16:00" }],
    regions: [{ sido: "서울특별시", sigungu: "종로구" }],
    mentor: {
      userId: 117,
      nickname: "그림쌤",
      isCertified: true,
      profileImage: "/images/user14.png",
      mbti: "ISFP",
      rating: 4.8,
      education: "서울예대",
      major: "시각디자인",
      age: 28,
      sex: "여성",
      regions: ["종로구", "서대문구"],
      analysisComment: "그림은 잘 그리기보다 즐기는 게 먼저입니다!",
      content: "그림에 자신 없는 분도 부담 없이 시작할 수 있어요.",
      appealFileUrl: "/files/drawing.pdf",
      tag: "드로잉, 미술입문, 취미미술",
    },
    reviews: [
      {
        reviewId: 13,
        writer: {
          userId: 213,
          nickname: "그림초보",
          profileImage: "/images/user13.png",
        },
        rating: 5,
        content: "명암 표현 배우고 나서 완전 달라졌어요!",
        createdAt: "2024-04-04T12:30:00",
      },
    ],
  },
  {
    lectureId: 18,
    title: "작곡 입문 - 나만의 음악 만들기",
    price: 40000,
    description: "코드부터 시작하는 감성 작곡 입문! 작곡 툴 사용법까지",
    curriculum: `
      1주차 - 음악 이론 기초 (화음, 코드)
      2주차 - 멜로디 작곡 실습
      3주차 - 미디(MIDI) 작곡 도구 활용
      4주차 - 곡 완성 및 공유
    `,
    category: {
      parent: "예체능",
      middle: "음악",
      sub: "작곡",
    },
    availableTimeSlots: [{ day: "일요일", time: "16:00~18:00" }],
    regions: [{ sido: "경기도", sigungu: "일산시" }],
    mentor: {
      userId: 118,
      nickname: "뮤직메이커",
      isCertified: false,
      profileImage: "/images/default-profile.svg",
      mbti: "ENFP",
      rating: 4.6,
      education: "서울예대",
      major: "실용음악과",
      age: 27,
      sex: "남성",
      regions: ["일산시", "파주시"],
      analysisComment: "이론보다 실전! 따라만 와도 곡 하나가 완성됩니다.",
      content: "나만의 감성으로 음악을 만들고 싶다면 이 수업을 추천해요.",
      appealFileUrl: "/files/composition.pdf",
      tag: "작곡, 미디, 음악이론, 취미",
    },
    reviews: [
      {
        reviewId: 14,
        writer: {
          userId: 214,
          nickname: "음악초보",
          profileImage: "/images/user14.png",
        },
        rating: 4,
        content: "미디툴 익히는 데 도움 많이 됐어요!",
        createdAt: "2024-04-06T17:50:00",
      },
    ],
  },
  {
    lectureId: 19,
    title: "포토샵으로 배우는 굿즈 디자인",
    price: 35000,
    description: "스티커, 엽서, 키링까지! 직접 만드는 나만의 굿즈",
    curriculum: `
      1주차 - 포토샵 기초 및 템플릿 구성
      2주차 - 굿즈별 제작 가이드 (엽서/스티커)
      3주차 - 인쇄용 설정 및 색상 관리
      4주차 - 나만의 디자인 완성
    `,
    category: {
      parent: "예체능",
      middle: "디자인",
      sub: "굿즈디자인",
    },
    availableTimeSlots: [{ day: "목요일", time: "19:00~21:00" }],
    regions: [{ sido: "부산광역시", sigungu: "남구" }],
    mentor: {
      userId: 119,
      nickname: "굿즈메이커",
      isCertified: true,
      profileImage: "/images/user15.png",
      mbti: "ISTP",
      rating: 4.7,
      education: "동명대",
      major: "디지털콘텐츠디자인",
      age: 31,
      sex: "여성",
      regions: ["남구"],
      analysisComment: "잘 그리지 않아도, 센스로 만들 수 있는 굿즈 디자인!",
      content: "포토샵이 어려웠던 분도 차근차근 따라올 수 있어요.",
      appealFileUrl: "/files/goods.pdf",
      tag: "포토샵, 굿즈제작, 디자인실습",
    },
    reviews: [],
  },
  {
    lectureId: 20,
    title: "노션으로 시작하는 생산성 관리",
    price: 29000,
    description: "계획, 기록, 협업까지 한 번에! 노션 초보 탈출 입문 수업",
    curriculum: `
      1주차 - 노션 기본 개념과 구조 이해
      2주차 - 할 일 관리와 캘린더 활용
      3주차 - 협업 템플릿 구성 실습
      4주차 - 나만의 생산성 시스템 만들기
    `,
    category: {
      parent: "라이프스타일",
      middle: "자기관리",
      sub: "생산성 툴",
    },
    availableTimeSlots: [
      { day: "수요일", time: "20:00~22:00" },
      { day: "토요일", time: "10:00~12:00" },
    ],
    regions: [{ sido: "서울특별시", sigungu: "양천구" }],
    mentor: {
      userId: 120,
      nickname: "노션장인",
      isCertified: true,
      profileImage: "/images/user16.png",
      mbti: "ISTJ",
      rating: 4.9,
      education: "한성대",
      major: "IT융합학",
      age: 30,
      sex: "여성",
      regions: ["양천구", "영등포구"],
      analysisComment: "단순한 메모 툴이 아닙니다. 인생이 바뀌는 관리 시스템!",
      content: "직장인, 학생 모두에게 추천하는 실용 중심 노션 강의입니다.",
      appealFileUrl: "/files/notion.pdf",
      tag: "노션, 생산성, 자기관리",
    },
    reviews: [
      {
        reviewId: 15,
        writer: {
          userId: 215,
          nickname: "생산성러버",
          profileImage: "/images/user15.png",
        },
        rating: 5,
        content: "노션 이제 못 놓아요... 진짜 인생템",
        createdAt: "2024-04-08T13:40:00",
      },
    ],
  },
  {
    lectureId: 21,
    title: "자기소개서보다 중요한 MBTI 탐색 클래스",
    price: 25000,
    description: "내 성향을 알고 커리어, 인간관계, 연애까지 전략 세우기!",
    curriculum: `
      1주차 - MBTI 4가지 축 깊이 이해하기
      2주차 - 나의 성향 탐색과 해석
      3주차 - 타인과의 관계 전략
      4주차 - 성향 기반 목표 세우기
    `,
    category: {
      parent: "라이프스타일",
      middle: "자기이해",
      sub: "MBTI",
    },
    availableTimeSlots: [{ day: "월요일", time: "19:00~21:00" }],
    regions: [{ sido: "경기도", sigungu: "성남시" }],
    mentor: {
      userId: 121,
      nickname: "MBTI해설사",
      isCertified: false,
      profileImage: "/images/default-profile.svg",
      mbti: "INFJ",
      rating: 4.6,
      education: "상담심리 전공",
      major: "심리학과",
      age: 33,
      sex: "여성",
      regions: ["성남시"],
      analysisComment: "자기이해는 모든 변화의 시작입니다.",
      content: "MBTI를 피상적으로 넘기지 말고, 인생 설계 도구로 활용해보세요.",
      appealFileUrl: "/files/mbti.pdf",
      tag: "MBTI, 자기탐색, 성격유형",
    },
    reviews: [
      {
        reviewId: 16,
        writer: {
          userId: 216,
          nickname: "성찰러",
          profileImage: "/images/user16.png",
        },
        rating: 4,
        content: "진짜 내 성격을 새롭게 보게 됐어요!",
        createdAt: "2024-04-10T20:20:00",
      },
    ],
  },
  {
    lectureId: 22,
    title: "혼자서도 잘 먹자! 자취요리 클래스",
    price: 27000,
    description:
      "냉장고 속 재료로 10분 만에 뚝딱! 자취생을 위한 실전 요리 수업",
    curriculum: `
      1주차 - 계란과 채소로 만드는 3가지 요리
      2주차 - 간단한 국·찌개 마스터
      3주차 - 한 그릇 덮밥과 볶음밥
      4주차 - 간식 및 브런치 레시피
    `,
    category: {
      parent: "라이프스타일",
      middle: "생활실용",
      sub: "자취요리",
    },
    availableTimeSlots: [{ day: "일요일", time: "11:00~13:00" }],
    regions: [{ sido: "대구광역시", sigungu: "중구" }],
    mentor: {
      userId: 122,
      nickname: "자취셰프",
      isCertified: true,
      profileImage: "/images/user17.png",
      mbti: "ESFJ",
      rating: 4.8,
      education: "한식조리기능사",
      major: "조리",
      age: 29,
      sex: "남성",
      regions: ["중구"],
      analysisComment:
        "이론보단 실전! 최소 재료로 최대 효과를 내는 레시피 공개",
      content: "조리 초보도 실패 없는 자취요리 노하우를 알려드립니다.",
      appealFileUrl: "/files/cooking.pdf",
      tag: "자취요리, 생활요리, 간편레시피",
    },
    reviews: [],
  },
];
