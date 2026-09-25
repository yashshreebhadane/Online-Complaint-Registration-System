import { Routes, Route, Navigate } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import Register from "./pages/Register";
import NewComplaint from "./pages/NewComplaint";
import MyComplaints from "./pages/MyComplaints";
import ComplaintDetails from "./pages/ComplaintDetails";
import EditComplaint from "./pages/EditComplaint";
import AdminDashboard from "./pages/AdminDashboard";
import AdminComplaints from "./pages/AdminComplaints";
import AdminComplaintDetails from "./pages/AdminComplaintDetails";

function App() {
  return (
    <Routes>

      <Route path="/" element={<Navigate to="/login" />} />

      <Route path="/login" element={<Login />} />

      <Route path="/register" element={<Register />} />

      <Route path="/dashboard" element={<Dashboard />} />

      <Route path="/complaints/new" element={<NewComplaint />} />

      <Route path="/complaints"  element={<MyComplaints />}  />

      <Route path="/complaints/:id" element={<ComplaintDetails />} />

      <Route path="/complaints/:id/edit" element={<EditComplaint />} />

      <Route path="/admin/dashboard" element={<AdminDashboard />} />

      <Route path="/admin/complaints/:id" element={<AdminComplaintDetails />} />

      <Route path="/admin/complaints" element={<AdminComplaints />} />

    </Routes>
  );
}

export default App;