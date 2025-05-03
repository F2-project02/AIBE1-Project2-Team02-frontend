// src/router/Router.jsx – Routes 전용 구성

import { Routes, Route } from 'react-router-dom';
import Home from '../pages/Home';

export default function AppRouter() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
    </Routes>
  );
}
