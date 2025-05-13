// lib/api/notificationApi.js
import axiosInstance from "../axiosInstance";

export const getUnreadCount = async () => {
  const res = await axiosInstance.get("/api/notifications/unread-count");
  return res.data.data;
};

export const getRecentNotifications = async () => {
  const res = await axiosInstance.get("/api/notifications");
  return res.data.data;
};

export const markAllAsRead = async () => {
  await axiosInstance.post("/api/notifications/read-all");
};
