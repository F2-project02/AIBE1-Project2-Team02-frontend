// src/hooks/useLecturePermission.js

import { useState, useEffect } from "react";
import { useUserStore } from "../store/useUserStore";

/**
 * 강의에 대한 권한 체크 훅
 * @param {Object} lecture - 강의 데이터
 * @returns {Object} 권한 정보
 */
export default function useLecturePermission(lecture) {
  const { userId, role, myLectureIds = [] } = useUserStore();
  const [hasPermission, setHasPermission] = useState(false);
  const [isOwner, setIsOwner] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    if (!lecture) return;

    // 어드민 권한 체크
    const adminCheck = role === "ADMIN";
    setIsAdmin(adminCheck);

    let ownerCheck = false;

    // 강의 작성자 확인 방법 2: 작성자(authorUserId)와 현재 사용자 ID 비교
    if (!ownerCheck && lecture?.authorUserId) {
      ownerCheck = lecture.authorUserId === userId;
      console.log("Author check:", lecture.authorUserId, userId, ownerCheck);
    }

    // 추가 확인 방법: mentorNickname이 현재 사용자 닉네임과 같은지 확인
    // (닉네임은 고유하므로 이 방법도 가능함)
    if (
      !ownerCheck &&
      lecture?.mentorNickname &&
      useUserStore.getState().nickname
    ) {
      ownerCheck = lecture.mentorNickname === useUserStore.getState().nickname;
      console.log(
        "Nickname check:",
        lecture.mentorNickname,
        useUserStore.getState().nickname,
        ownerCheck
      );
    }

    setIsOwner(ownerCheck);

    // 권한 부여 (관리자이거나 소유자)
    setHasPermission(adminCheck || ownerCheck);
  }, [lecture, userId, role, myLectureIds]);

  return {
    hasPermission,
    isOwner,
    isAdmin,
  };
}
