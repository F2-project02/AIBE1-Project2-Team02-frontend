// src/router/Router.jsx – Routes 전용 구성

import { Routes, Route } from "react-router-dom";
import Home from "../pages/Home";
import LectureDetailPage from "../pages/LectureDetailPage";

export default function AppRouter() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/lectures/:lectureId" element={<LectureDetailPage />} />
    </Routes>
  );
}
