import "./App.css";
import Home from "./pages/Home";
import Download from "./pages/Download";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/download" element={<Download />} />
      </Routes>
    </Router>
  );
}

export default App;
