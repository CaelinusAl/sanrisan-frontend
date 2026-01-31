import React, { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import AskSanriPage from "./pages/AskSanriPage";
import Navbar from "./components/layout/Navbar";
import { Footer } from "./components/layout/Footer";

function NotFound() {
  return (
    <div style={{ padding: 24, fontFamily: "system-ui" }}>
      <h2 style={{ marginTop: 0 }}>404</h2>
      <p>Sayfa bulunamadı.</p>
      <a href="/" style={{ color: "black" }}>Ana sayfaya dön</a>
    </div>
  );
}

export default function App() {
  const [mode, setMode] = useState(() => localStorage.getItem("SANRI_MODE") || "ayna_sade");

  useEffect(() => {
    localStorage.setItem("SANRI_MODE", mode);
  }, [mode]);

  return (
    <BrowserRouter>
      <Navbar mode={mode} setMode={setMode} />

      <Routes>
        <Route path="/" element={<AskSanriPage mode={mode} />} />
        <Route path="/ask" element={<AskSanriPage mode={mode} />} />
        <Route path="/404" element={<NotFound />} />
        <Route path="*" element={<Navigate to="/404" replace />} />
      </Routes>

      <Footer />
    </BrowserRouter>
  );
}