// src/router/Router.jsx – Routes 전용 구성

import { Routes, Route } from "react-router-dom";
import Home from "../pages/Home";
import MessageInbox from "../pages/MessageInbox";

export default function AppRouter() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/messages" element={<MessageInbox />} />
    </Routes>
  );
}
