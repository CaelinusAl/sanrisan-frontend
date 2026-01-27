import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

function Home() {
  return <div>Ask Sanrı Home</div>;
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
      </Routes>
    </BrowserRouter>
  );
}