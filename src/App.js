import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Footer } from "./components/layout/Footer";
import docs from "./data/docs.json";
import AskSanriPage from "./pages/AskSanriPage";

<Route path="/ask" element={<AskSanriPage />} />
function Home() {
  const { title, subtitle, status } = docs.home;
  return (
    <div style={{ padding: 24, fontFamily: "system-ui" }}>
      <h1 style={{ margin: 0 }}>{title}</h1>
      <p style={{ marginTop: 8 }}>{subtitle}</p>
      <p style={{ marginTop: 8, opacity: 0.8 }}>{status}</p>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/ask" element={<AskSanriPage />} />
        <Route path="/" element={<Home />} />
      </Routes>
      <Footer />
    </BrowserRouter>
  );
}