import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useState } from "react";

import Navbar from "./components/layout/Navbar";
import AskSanriPage from "./pages/AskSanriPage";

function App() {
  const [mode, setMode] = useState("ayna_sade");

  return (
    <BrowserRouter>
      <Navbar mode={mode} setMode={setMode} />

      <Routes>
        <Route path="/" element={<AskSanriPage mode={mode} />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;