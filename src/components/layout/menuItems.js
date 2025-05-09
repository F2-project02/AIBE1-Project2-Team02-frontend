// src/components/layout/menuItems.js 탭 메뉴 데이터 정의

const menuItems = [
  { label: "과외 찾기", path: "/search" },
  { label: "과외 등록", path: "/register", requiresLogin: true },
  { label: "과외 문의", path: "/questions", requiresLogin: true },
  { label: "매칭 쪽지함", path: "/messages", requiresLogin: true },
  { label: "궁금증 해결센터", path: "/help" },
];

export default menuItems;