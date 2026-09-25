import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "./AdminDashboard.css";

function AdminDashboard() {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [complaints, setComplaints] = useState([]);

  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    const token = localStorage.getItem("token");

    if (!savedUser || !token) {
      navigate("/login");
      return;
    }

    const parsedUser = JSON.parse(savedUser);

    if (parsedUser.role !== "admin") {
      navigate("/dashboard");
      return;
    }

    setUser(parsedUser);
    fetchComplaints(token);
  }, [navigate]);

  const fetchComplaints = async (token) => {
    try {
      const response = await fetch(
        "http://localhost:5000/api/complaints/all",
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      const data = await response.json();

      if (response.ok) {
        setComplaints(data.complaints || []);
      }
    } catch (error) {
      console.error("Error fetching complaints:", error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    navigate("/login");
  };

  const totalComplaints = complaints.length;

  const submittedComplaints = complaints.filter(
    (complaint) => complaint.status === "Submitted"
  ).length;

  const inProgressComplaints = complaints.filter(
    (complaint) => complaint.status === "In Progress"
  ).length;

  const resolvedComplaints = complaints.filter(
    (complaint) => complaint.status === "Resolved"
  ).length;

  if (!user) {
    return (
      <div className="admin-loading">
        <div className="admin-spinner"></div>
        <p>Loading admin dashboard...</p>
      </div>
    );
  }

  return (
    <div className="admin-dashboard-page">

      {/* Header */}
      <header className="admin-header">

        <div className="admin-logo">

          <div className="admin-logo-icon">
            📝
          </div>

          <div>
            <h1>Online Complaint</h1>
            <p>Registration System</p>
          </div>

        </div>

        <div className="admin-header-actions">

          <span className="admin-role-badge">
            👑 Administrator
          </span>

          <button
            onClick={handleLogout}
            className="admin-logout-button"
          >
            Logout
          </button>

        </div>

      </header>

      {/* Main */}
      <main className="admin-container">

        {/* Welcome */}
        <section className="admin-welcome">

          <div>

            <p className="admin-small-title">
              ADMINISTRATOR PANEL
            </p>

            <h2>
              Welcome, {user.name} 👋
            </h2>

            <p>
              Manage and monitor all complaints submitted through
              the complaint registration system.
            </p>

          </div>

          <div className="admin-welcome-icon">
            👨‍💼
          </div>

        </section>

        {/* Statistics */}
        <section className="admin-section">

          <div className="admin-section-heading">

            <div>
              <h3>Complaint Statistics</h3>
              <p>Overview of all registered complaints</p>
            </div>

          </div>

          <div className="admin-stat-grid">

            {/* Total */}
            <div className="admin-stat-card">

              <div className="admin-stat-icon total-icon">
                📋
              </div>

              <div>
                <span>Total Complaints</span>
                <strong>{totalComplaints}</strong>
              </div>

            </div>

            {/* Submitted */}
            <div className="admin-stat-card">

              <div className="admin-stat-icon submitted-icon">
                📩
              </div>

              <div>
                <span>Submitted</span>
                <strong>{submittedComplaints}</strong>
              </div>

            </div>

            {/* In Progress */}
            <div className="admin-stat-card">

              <div className="admin-stat-icon progress-icon">
                🔄
              </div>

              <div>
                <span>In Progress</span>
                <strong>{inProgressComplaints}</strong>
              </div>

            </div>

            {/* Resolved */}
            <div className="admin-stat-card">

              <div className="admin-stat-icon resolved-icon">
                ✓
              </div>

              <div>
                <span>Resolved</span>
                <strong>{resolvedComplaints}</strong>
              </div>

            </div>

          </div>

        </section>

        {/* Admin Controls */}
        <section className="admin-section">

          <div className="admin-section-heading">

            <div>
              <h3>Admin Controls</h3>
              <p>Manage complaints and access the user dashboard</p>
            </div>

          </div>

          <div className="admin-control-grid">

            {/* Manage Complaints */}
            <Link
              to="/admin/complaints"
              className="admin-control-card"
            >

              <div className="control-icon">
                📋
              </div>

              <div className="control-content">

                <h4>Manage Complaints</h4>

                <p>
                  View, search, filter, update and delete
                  complaints submitted by users.
                </p>

                <span>
                  Open Complaint Management →
                </span>

              </div>

            </Link>

            {/* User Dashboard */}
            <Link
              to="/dashboard"
              className="admin-control-card"
            >

              <div className="control-icon user-dashboard-icon">
                👤
              </div>

              <div className="control-content">

                <h4>User Dashboard</h4>

                <p>
                  Access the standard user dashboard and
                  complaint registration features.
                </p>

                <span>
                  Open User Dashboard →
                </span>

              </div>

            </Link>

          </div>

        </section>

        {/* Footer Info */}
        <section className="admin-info-card">

          <div className="admin-info-icon">
            🔐
          </div>

          <div>
            <h4>Administrator Access</h4>

            <p>
              You are logged in with administrator privileges.
              You can manage complaints submitted by all users.
            </p>
          </div>

        </section>

      </main>

      <footer className="admin-footer">
        <p>
          © 2026 Online Complaint Registration System
        </p>
      </footer>

    </div>
  );
}

export default AdminDashboard;