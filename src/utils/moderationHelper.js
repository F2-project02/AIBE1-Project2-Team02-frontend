/**
 * Gemini AI의 차단 사유(reason)를 사용자 친화적인 한글 메시지로 변환합니다.
 *
 * @param {string} reason - Gemini로부터 전달된 차단 사유 키워드
 * @returns {string} - 사용자에게 보여줄 자연어 메시지
 */
export function getModerationMessage(reason) {
  switch (reason) {
    case "Profanity":
      return "불쾌감을 줄 수 있는 표현은 피해주세요.";
    case "Sexual":
      return "조금 더 건강한 표현으로 바꿔볼까요?";
    case "Hate":
      return "누군가에게 상처가 될 수 있는 표현은 피해주세요.";
    case "Violence":
      return "폭력적인 표현은 지양해주세요.";
    case "Sensitive":
      return "개인정보나 민감한 내용은 포함할 수 없어요.";
    default:
      return reason || "조금 더 적절한 내용으로 수정해주세요.";
  }
}