import axiosInstance from "../axiosInstance";

export const reportUser = async ({
  targetType,
  targetId,
  reason,
  reasonType,
}) => {
  await axiosInstance.post("/api/report", {
    targetType,
    targetId,
    reason,
    reasonType,
  });
};
