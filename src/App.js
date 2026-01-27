import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Navbar } from './components/layout/Navbar';function Home() {
  return <div>Ask Sanrı Home</div>;
}

export default function App() {
  return (
    <BrowserRouter>
  <Navbar />
  <Routes>...</Routes>
</BrowserRouter>
  );
}