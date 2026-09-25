import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import "./AdminComplaintDetails.css";

function AdminComplaintDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [complaint, setComplaint] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    const savedUser = localStorage.getItem("user");

    if (!token || !savedUser) {
      navigate("/login");
      return;
    }

    const user = JSON.parse(savedUser);

    if (user.role !== "admin") {
      navigate("/dashboard");
      return;
    }

    fetchComplaint(token);
  }, [id, navigate]);

  const fetchComplaint = async (token) => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/complaints/${id}`,
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
          data.message || "Failed to fetch complaint"
        );
        setLoading(false);
        return;
      }

      setComplaint(data.complaint);
    } catch (error) {
      setError("Unable to connect to server");
    }

    setLoading(false);
  };

  const updateStatus = async () => {
    const token = localStorage.getItem("token");

    try {
      const response = await fetch(
        `http://localhost:5000/api/complaints/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify({
            status: complaint.status
          })
        }
      );

      const data = await response.json();

      if (!response.ok) {
        alert(data.message || "Failed to update status");
        return;
      }

      alert("Complaint status updated successfully");

      setComplaint(data.complaint);

    } catch (error) {
      alert("Unable to connect to server");
    }
  };

  const getStatusClass = (status) => {
    return status
      ?.toLowerCase()
      .replace(/\s+/g, "-");
  };

  const getPriorityClass = (priority) => {
    return priority?.toLowerCase();
  };

  if (loading) {
    return (
      <div className="admin-details-loading">
        <div className="admin-details-spinner"></div>
        <p>Loading complaint details...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="admin-details-error-page">
        <div className="admin-details-error-card">
          <div className="admin-details-error-icon">
            ⚠️
          </div>

          <h2>Unable to Load Complaint</h2>

          <p>{error}</p>

          <button
            onClick={() =>
              navigate("/admin/complaints")
            }
            className="admin-details-back-button"
          >
            ← Back to Complaints
          </button>
        </div>
      </div>
    );
  }

  if (!complaint) {
    return (
      <div className="admin-details-error-page">
        <div className="admin-details-error-card">
          <div className="admin-details-error-icon">
            📭
          </div>

          <h2>Complaint Not Found</h2>

          <p>
            The requested complaint could not be found.
          </p>

          <button
            onClick={() =>
              navigate("/admin/complaints")
            }
            className="admin-details-back-button"
          >
            ← Back to Complaints
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-details-page">

      {/* Header */}
      <header className="admin-details-header">

        <div className="admin-details-logo">
          <div className="admin-details-logo-icon">
            📝
          </div>

          <div>
            <h1>Online Complaint</h1>
            <p>Registration System</p>
          </div>
        </div>

        <div className="admin-details-header-actions">

          <Link
            to="/admin/dashboard"
            className="admin-details-dashboard-link"
          >
            Admin Dashboard
          </Link>

          <Link
            to="/admin/complaints"
            className="admin-details-manage-link"
          >
            Manage Complaints
          </Link>

        </div>

      </header>

      {/* Main Content */}
      <main className="admin-details-container">

        {/* Page Heading */}
        <div className="admin-details-heading">

          <div>
            <p className="admin-details-label">
              ADMINISTRATION
            </p>

            <h2>Complaint Details</h2>

            <p>
              View complaint information and manage its current status.
            </p>
          </div>

          <span
            className={`admin-details-status-badge ${getStatusClass(
              complaint.status
            )}`}
          >
            {complaint.status}
          </span>

        </div>

        {/* Complaint Information */}
        <section className="admin-details-card">

          <div className="admin-details-card-header">

            <div className="admin-details-card-icon">
              📋
            </div>

            <div>
              <h3>Complaint Information</h3>

              <p>
                Details submitted by the complainant
              </p>
            </div>

          </div>

          <div className="admin-details-id-box">

            <span>Complaint ID</span>

            <strong>
              {complaint.complaintId}
            </strong>

          </div>

          <div className="admin-details-title-section">

            <span>Complaint Title</span>

            <h3>
              {complaint.title}
            </h3>

          </div>

          <div className="admin-details-description">

            <span>Description</span>

            <p>
              {complaint.description}
            </p>

          </div>

          <div className="admin-details-info-grid">

            <div className="admin-info-item">
              <span>Category</span>
              <strong>
                {complaint.category}
              </strong>
            </div>

            <div className="admin-info-item">
              <span>Priority</span>

              <strong
                className={`admin-details-priority ${getPriorityClass(
                  complaint.priority
                )}`}
              >
                {complaint.priority}
              </strong>

            </div>

            <div className="admin-info-item">
              <span>Location</span>

              <strong>
                {complaint.location}
              </strong>
            </div>

            <div className="admin-info-item">
              <span>Current Status</span>

              <strong>
                {complaint.status}
              </strong>
            </div>

          </div>

        </section>

        {/* Status Management */}
        <section className="admin-details-card status-management-card">

          <div className="admin-details-card-header">

            <div className="admin-details-card-icon status-icon">
              🔄
            </div>

            <div>
              <h3>Manage Complaint Status</h3>

              <p>
                Update the current status of this complaint.
              </p>
            </div>

          </div>

          <div className="status-update-area">

            <div className="status-select-group">

              <label htmlFor="complaint-status">
                Complaint Status
              </label>

              <select
                id="complaint-status"
                value={complaint.status}
                onChange={(e) =>
                  setComplaint({
                    ...complaint,
                    status: e.target.value
                  })
                }
              >
                <option value="Submitted">
                  Submitted
                </option>

                <option value="Under Review">
                  Under Review
                </option>

                <option value="In Progress">
                  In Progress
                </option>

                <option value="Resolved">
                  Resolved
                </option>

                <option value="Closed">
                  Closed
                </option>

              </select>

            </div>

            <button
              onClick={updateStatus}
              className="update-status-button"
            >
              ✓ Update Status
            </button>

          </div>

        </section>

        {/* Complainant Information */}
        <section className="admin-details-card">

          <div className="admin-details-card-header">

            <div className="admin-details-card-icon user-icon">
              👤
            </div>

            <div>
              <h3>Complainant Information</h3>

              <p>
                Information about the user who submitted the complaint.
              </p>
            </div>

          </div>

          {complaint.complainant ? (

            <div className="person-info-grid">

              <div className="person-info-item">
                <span>Name</span>

                <strong>
                  {complaint.complainant.name}
                </strong>
              </div>

              <div className="person-info-item">
                <span>Email</span>

                <strong>
                  {complaint.complainant.email}
                </strong>
              </div>

              <div className="person-info-item">
                <span>Phone</span>

                <strong>
                  {complaint.complainant.phone}
                </strong>
              </div>

            </div>

          ) : (

            <div className="no-information">
              <span>ℹ️</span>
              <p>
                No complainant information available.
              </p>
            </div>

          )}

        </section>

        {/* Assigned Agent */}
        <section className="admin-details-card">

          <div className="admin-details-card-header">

            <div className="admin-details-card-icon agent-icon">
              👨‍💼
            </div>

            <div>
              <h3>Assigned Agent</h3>

              <p>
                Information about the agent handling this complaint.
              </p>
            </div>

          </div>

          {complaint.assignedAgent ? (

            <div className="person-info-grid">

              <div className="person-info-item">
                <span>Name</span>

                <strong>
                  {complaint.assignedAgent.name}
                </strong>
              </div>

              <div className="person-info-item">
                <span>Email</span>

                <strong>
                  {complaint.assignedAgent.email}
                </strong>
              </div>

              <div className="person-info-item">
                <span>Department</span>

                <strong>
                  {complaint.assignedAgent.department}
                </strong>
              </div>

            </div>

          ) : (

            <div className="no-information">
              <span>ℹ️</span>

              <p>
                No agent assigned.
              </p>
            </div>

          )}

        </section>

        {/* Bottom Navigation */}
        <div className="admin-details-bottom-actions">

          <button
            onClick={() =>
              navigate("/admin/complaints")
            }
            className="admin-details-back-link"
          >
            ← Back to Manage Complaints
          </button>

        </div>

      </main>

      <footer className="admin-details-footer">
        <p>
          © 2026 Online Complaint Registration System
        </p>
      </footer>

    </div>
  );
}

export default AdminComplaintDetails;