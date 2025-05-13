import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import isToday from "dayjs/plugin/isToday";
import isYesterday from "dayjs/plugin/isYesterday";
import "dayjs/locale/ko";

dayjs.extend(relativeTime);
dayjs.extend(isToday);
dayjs.extend(isYesterday);
dayjs.locale("ko");

const formatNotificationDate = (arr) => {
  if (!arr || arr.length < 6) return "";
  const [year, month, day, hour, minute, second] = arr;
  const iso = `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(
    2,
    "0"
  )}T${String(hour).padStart(2, "0")}:${String(minute).padStart(
    2,
    "0"
  )}:${String(second).padStart(2, "0")}`;

  const date = dayjs(iso);

  if (date.isToday()) {
    return date.fromNow();
  }

  if (date.isYesterday()) {
    return `어제 ${date.format("A hh:mm")}`;
  }

  return date.format("M월 D일");
};

export default formatNotificationDate;
