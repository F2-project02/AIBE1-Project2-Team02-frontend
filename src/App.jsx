// src/App.jsx – 전체 레이아웃 렌더링 (공통 컴포넌트 포함)

import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import LoginModal from './components/auth/LoginModal';
import Layout from './components/layout/Layout';
import AppRouter from './router/Router';

export default function App() {
  return (
    <>
      <Navbar />
      <Layout>
        <AppRouter />
      </Layout>
      <LoginModal />
      <Footer />
    </>
  );
}