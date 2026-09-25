import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "./Dashboard.css";

function Dashboard() {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    const token = localStorage.getItem("token");

    if (!savedUser || !token) {
      navigate("/login");
      return;
    }

    setUser(JSON.parse(savedUser));

    fetchComplaints(token);
  }, [navigate]);

  const fetchComplaints = async (token) => {
    try {
      const response = await fetch(
        "http://localhost:5000/api/complaints/my",
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setError(
          data.message || "Failed to load complaints"
        );
        setLoading(false);
        return;
      }

      setComplaints(data.complaints || []);

    } catch (err) {
      setError("Unable to connect to server");
    }

    setLoading(false);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    navigate("/login");
  };

  if (!user) {
    return <p>Loading...</p>;
  }

  const totalComplaints = complaints.length;

  const submittedComplaints = complaints.filter(
    (complaint) => complaint.status === "Submitted"
  ).length;

  const inProgressComplaints = complaints.filter(
    (complaint) =>
      complaint.status === "In Progress"
  ).length;

  const resolvedComplaints = complaints.filter(
    (complaint) =>
      complaint.status === "Resolved"
  ).length;

  return (
    <div className="dashboard-page">

      {/* Header */}
      <header className="dashboard-header">

        <div className="dashboard-logo">
          <div className="dashboard-logo-icon">📝</div>

          <div>
            <h1>Online Complaint</h1>
            <p>Registration System</p>
          </div>
        </div>

        <button
          className="logout-button"
          onClick={handleLogout}
        >
          Logout
        </button>

      </header>

      {/* Main Content */}
      <main className="dashboard-container">

        {/* Welcome Section */}
        <section className="welcome-section">

          <div>
            <h2>Welcome, {user.name}! 👋</h2>

            <p>
              Manage and track your complaints from your dashboard.
            </p>
          </div>

          <div className="user-role">
            <span>Logged in as</span>
            <strong>{user.role}</strong>
          </div>

        </section>

        {/* Error */}
        {error && (
          <div className="dashboard-error">
            {error}
          </div>
        )}

        {/* Statistics */}
        {!loading && (
          <section className="statistics-section">

            <div className="section-title">
              <h3>Complaint Overview</h3>
              <p>Track the status of your complaints</p>
            </div>

            <div className="stats-grid">

              <div className="stat-card total-card">
                <div className="stat-icon">📋</div>

                <div>
                  <p>Total Complaints</p>
                  <h3>{totalComplaints}</h3>
                </div>
              </div>

              <div className="stat-card submitted-card">
                <div className="stat-icon">📨</div>

                <div>
                  <p>Submitted</p>
                  <h3>{submittedComplaints}</h3>
                </div>
              </div>

              <div className="stat-card progress-card">
                <div className="stat-icon">⏳</div>

                <div>
                  <p>In Progress</p>
                  <h3>{inProgressComplaints}</h3>
                </div>
              </div>

              <div className="stat-card resolved-card">
                <div className="stat-icon">✅</div>

                <div>
                  <p>Resolved</p>
                  <h3>{resolvedComplaints}</h3>
                </div>
              </div>

            </div>

          </section>
        )}

        {/* Complaint Management */}
        <section className="management-section">

          <div className="section-title">
            <h3>Complaint Management</h3>
            <p>Register a new complaint or view your existing complaints</p>
          </div>

          <div className="management-grid">

            <Link
              to="/complaints/new"
              className="management-card"
            >
              <div className="management-icon">
                📝
              </div>

              <div>
                <h4>Register New Complaint</h4>
                <p>
                  Submit a new complaint and provide the required details.
                </p>
              </div>

              <span className="arrow">→</span>
            </Link>

            <Link
              to="/complaints"
              className="management-card"
            >
              <div className="management-icon">
                📂
              </div>

              <div>
                <h4>My Complaints</h4>
                <p>
                  View, track, edit and manage your complaints.
                </p>
              </div>

              <span className="arrow">→</span>
            </Link>

          </div>

        </section>

      </main>

      {/* Footer */}
      <footer className="dashboard-footer">
        <p>
          Online Complaint Registration System
        </p>
      </footer>

    </div>
  );
}

export default Dashboard;