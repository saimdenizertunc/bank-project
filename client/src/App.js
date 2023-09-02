import React from "react";
import { Routes, Route, BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./components/AuthContext";
import Home from "./components/Home";
import Transfer from "./components/Transfer";
import Credit from "./components/Credit";
import Login from "./components/Login";

function App() {

  return (
    <AuthProvider>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/transfer" element={<Transfer/>} />
        <Route path="/credit" element={<Credit />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </BrowserRouter>
    </AuthProvider>
  );
}

export default App;