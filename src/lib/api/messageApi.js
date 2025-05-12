import axiosInstance from "../axiosInstance";

export const getMessages = async ({ tab, page, filterBy, keyword }) => {
  const type = tab === 0 ? "received" : "sent";

  const response = await axiosInstance.get(`/api/message/${type}`, {
    params: {
      page,
      size: 10,
      filterBy,
      keyword,
    },
  });

  return response.data.data;
};

export const getMessageById = async (messageId) => {
  const response = await axiosInstance.get(`/api/message/${messageId}`);
  return response.data.data;
};

export const sendMessage = async ({ receiverId, content }) => {
  const res = await axiosInstance.post("/api/message", { receiverId, content });
  return res.data.data;
};

export const deleteMessages = async ({ messageIds }) => {
  const res = await axiosInstance.post("/api/message/delete", { messageIds });
  return res.data.data;
};
