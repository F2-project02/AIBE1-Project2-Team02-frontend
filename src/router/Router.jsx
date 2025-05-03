// src/router/Router.jsx

import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "../pages/Home";
import Layout from "../components/layout/Layout";
import Navbar from "../components/layout/Navbar";
import LoginModal from "../components/auth/LoginModal";
import Footer from "../components/layout/Footer";

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Navbar />
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
        </Routes>
      </Layout>
      <LoginModal /> {/* 항상 렌더링되지만 상태로만 열고 닫힘 */}
      <Footer />
    </BrowserRouter>
  );
}