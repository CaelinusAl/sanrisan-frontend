import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import AskSanriPage from "./pages/AskSanriPage";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<AskSanriPage />} />
        <Route path="/ask" element={<AskSanriPage />} />
      </Routes>
    </BrowserRouter>
  );
}