import { HashRouter, Routes, Route } from "react-router-dom";
import PlayerRegistration from "./PlayerRegistration";
import AdminDashboard from "./AdminDashboard";
import TORRegistration from "./pages/TORRegistration";

function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<PlayerRegistration />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/tor" element={<TORRegistration />} />
      </Routes>
    </HashRouter>
  );
}

export default App;

