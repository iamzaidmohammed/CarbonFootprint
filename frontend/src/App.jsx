import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />

        <Route
          path="/results/:id"
          element={<div>Results Page Loading...</div>}
        />
        <Route path="/history" element={<div>History Page</div>} />
      </Routes>
    </Router>
  );
}

export default App;
