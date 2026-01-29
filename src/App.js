import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Footer } from "./components/layout/Footer";
import AskSanriPage from "./pages/AskSanriPage";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<AskSanriPage />} />
      </Routes>
      <Footer />
    </BrowserRouter>
  );
}