import { BrowserRouter, Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard.page.jsx";
import Simulator from "./pages/Simulator.page.jsx";
import HospitalDetails from "./pages/HospitalDetails.page.jsx";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/simulator" element={<Simulator />} />
        <Route path="/hospital/:id" element={<HospitalDetails />} />
      </Routes>
    </BrowserRouter>
  );
}
