import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import DoctorRegister from "./pages/DoctorRegister";
import PatientRegister from "./pages/PatientRegister";
import ReceptionistRegister from "./pages/Receptionistregister";
import Home from "./pages/Home";
import Navbar from "./components/Navbar";

function App() {
  return (
    <div className="App">
      <Navbar />
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/doctor-register" element={<DoctorRegister />} />
          <Route path="/patient-register" element={<PatientRegister />} />
          <Route path="/receptionist-register" element={<ReceptionistRegister />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
