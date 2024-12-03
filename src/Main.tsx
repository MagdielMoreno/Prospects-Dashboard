import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import ErrorPage from "@/pages/Error";
import Header from "@/components/Header";
import Prospects from "@/pages/Prospects";
import Capture from "./pages/Capture";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter>
      <main className="flex min-h-screen flex-col">
        <Header />
        <Routes>
          {/* Prospects */}
          <Route path="/" element={<Prospects />} />

          {/* Capture */}
          <Route path="/capture" element={<Capture />} />

          {/* Error */}
          <Route path="*" element={<ErrorPage />} />
        </Routes>
      </main>
    </BrowserRouter>
  </React.StrictMode>
);
