// src/router/Router.jsx – Routes 전용 구성

import { Routes, Route } from "react-router-dom";
import Home from "../pages/Home";
import LectureDetailPage from "../pages/LectureDetailPage";
import MessageInbox from "../pages/MessageInbox";
import CreateLecture from "../pages/CreateLecture";
import CourseSearchPage from "../pages/CourseSearchPage";
import MyPage from "../pages/MyPage";
import LectureInquiries from "../pages/LectureInquiries";
import EditLecturePage from "../pages/EditLecturePage";

export default function AppRouter() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/register" element={<CreateLecture />} />
      <Route path="/lectures/:lectureId" element={<LectureDetailPage />} />
      <Route path="/lectures/:lectureId/edit" element={<EditLecturePage />} />
      <Route path="/questions" element={<LectureInquiries />} />
      <Route path="/messages" element={<MessageInbox />} />
      <Route path="/search" element={<CourseSearchPage />} />
      <Route path="/mypage" element={<MyPage />} />
    </Routes>
  );
}
