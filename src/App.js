import React from "react";
import { Routes, Route, HashRouter } from "react-router-dom";
import Editor from "./components/Editor";
import Home from "./components/Home";

function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<Editor />} />
        <Route path="/home" element={<Home />} />
        <Route path="/files/:id" element={<Editor />} />
      </Routes>
    </HashRouter>
  );
}

export default App;
