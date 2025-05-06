// src/router/Router.jsx – Routes 전용 구성

import { Routes, Route } from "react-router-dom";
import Home from "../pages/Home";
import LectureDetailPage from "../pages/LectureDetailPage";
import MessageInbox from "../pages/MessageInbox";
// import CreateLecture from "../pages/CreateLecture";

export default function AppRouter() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/lectures/:lectureId" element={<LectureDetailPage />} />
      {/* <Route path="/register" element={<CreateLecture />} /> */}
      <Route path="/messages" element={<MessageInbox />} />
    </Routes>
  );
}
