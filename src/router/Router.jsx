// src/router/Router.jsx – Routes 전용 구성

import { Routes, Route } from "react-router-dom";
import Home from "../pages/Home";
import CreateLecture from "../pages/CreateLecture";

export default function AppRouter() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/register" element={<CreateLecture />} />
    </Routes>
  );
}
