import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Results from "./pages/Results";
import History from "./pages/History";
import Navbar from "./components/Navbar";

import { useEffect } from "react";
import { useLocation } from "react-router-dom";

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

// Then add <ScrollToTop /> inside your <Router> in App.jsx

function App() {
  return (
    <Router>
      <ScrollToTop />
      <div className="min-h-screen bg-eco-dark text-white font-sans">
        <Navbar /> {/* This stays at the top */}
        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/results/:id" element={<Results />} />
            <Route path="/history" element={<History />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
