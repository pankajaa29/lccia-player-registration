import { HashRouter, Routes, Route } from "react-router-dom";
import PlayerRegistration from "./PlayerRegistration";
import AdminDashboard from "./AdminDashboard";

function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<PlayerRegistration />} />
        <Route path="/admin" element={<AdminDashboard />} />
      </Routes>
    </HashRouter>
  );
}

export default App;
