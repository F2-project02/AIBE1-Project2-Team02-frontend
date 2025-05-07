import { format } from "date-fns";

// 배열을 Date 객체로 변환 (e.g. [2025, 5, 7, 12, 45, 0] → Date)
export function toDateFromArray(arr) {
  if (!Array.isArray(arr) || arr.length < 6) return null;
  const [y, m, d, h, min, s] = arr;
  return new Date(y, m - 1, d, h, min, s); // month는 0부터 시작
}

// 포맷팅 (e.g. "2025-05-07 12:45")
export function formatDateFromArray(arr) {
  const date = toDateFromArray(arr);
  return date ? format(date, "yyyy-MM-dd HH:mm") : "";
}
