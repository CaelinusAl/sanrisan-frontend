import { BrowserRouter } from "react-router-dom";
import { Footer } from "./components/layout/Footer";
import docs from "./data/docs.json";

export default function App() {
  return (
    <BrowserRouter>
      <div>
        <h1>{docs.home.title}</h1>
        <p>{docs.home.subtitle}</p>
        <small>{docs.home.status}</small>
      </div>
      <Footer />
    </BrowserRouter>
  );
}