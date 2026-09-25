import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import "./ComplaintDetails.css";

function ComplaintDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [complaint, setComplaint] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    fetchComplaint();
  }, [id]);

  const fetchComplaint = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/login");
      return;
    }

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
        setError(data.message || "Failed to fetch complaint");
        setLoading(false);
        return;
      }

      setComplaint(data.complaint);

    } catch (err) {
      setError("Unable to connect to server");
    }

    setLoading(false);
  };

  const handleDelete = async () => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this complaint?"
    );

    if (!confirmDelete) {
      return;
    }

    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/login");
      return;
    }

    setDeleting(true);
    setError("");

    try {
      const response = await fetch(
        `http://localhost:5000/api/complaints/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setError(
          data.message || "Failed to delete complaint"
        );
        setDeleting(false);
        return;
      }

      alert("Complaint deleted successfully!");

      navigate("/complaints");

    } catch (err) {
      setError("Unable to connect to server");
    }

    setDeleting(false);
  };

  if (loading) {
    return (
      <div className="details-loading">
        <div className="details-spinner"></div>
        <p>Loading complaint details...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="details-error-page">
        <div className="details-error-card">
          <div className="details-error-icon">⚠️</div>
          <h2>Error</h2>
          <p>{error}</p>

          <Link
            to="/complaints"
            className="back-complaints-button"
          >
            ← Back to My Complaints
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="complaint-details-page">

      {/* Header */}
      <header className="details-header">

        <div className="details-logo">

          <div className="details-logo-icon">
            📝
          </div>

          <div>
            <h1>Online Complaint</h1>
            <p>Registration System</p>
          </div>

        </div>

        <Link
          to="/dashboard"
          className="details-dashboard-link"
        >
          Dashboard
        </Link>

      </header>

      {/* Main Content */}
      <main className="details-container">

        {/* Page Heading */}
        <div className="details-heading">

          <div>
            <h2>Complaint Details</h2>

            <p>
              View the complete information about your complaint.
            </p>
          </div>

          <span className="details-id">
            {complaint.complaintId}
          </span>

        </div>

        {/* Main Card */}
        <div className="details-card">

          {/* Title and Status */}
          <div className="details-card-header">

            <div>
              <span className="details-label">
                Complaint Title
              </span>

              <h3>
                {complaint.title}
              </h3>
            </div>

            <span
              className={`details-status ${complaint.status
                ?.toLowerCase()
                .replace(/\s+/g, "-")}`}
            >
              {complaint.status}
            </span>

          </div>

          {/* Description */}
          <div className="details-description">

            <span className="details-label">
              Description
            </span>

            <p>
              {complaint.description}
            </p>

          </div>

          {/* Information Grid */}
          <div className="details-info-grid">

            <div className="details-info-item">
              <span className="details-label">
                Category
              </span>

              <strong>
                {complaint.category}
              </strong>
            </div>

            <div className="details-info-item">
              <span className="details-label">
                Priority
              </span>

              <strong
                className={`details-priority-${complaint.priority?.toLowerCase()}`}
              >
                {complaint.priority}
              </strong>
            </div>

            <div className="details-info-item">
              <span className="details-label">
                Location
              </span>

              <strong>
                {complaint.location}
              </strong>
            </div>

            <div className="details-info-item">
              <span className="details-label">
                Created At
              </span>

              <strong>
                {new Date(
                  complaint.createdAt
                ).toLocaleString()}
              </strong>
            </div>

            {complaint.updatedAt && (
              <div className="details-info-item">
                <span className="details-label">
                  Last Updated
                </span>

                <strong>
                  {new Date(
                    complaint.updatedAt
                  ).toLocaleString()}
                </strong>
              </div>
            )}

          </div>

          {/* Assigned Agent */}
          {complaint.assignedAgent && (
            <div className="assigned-agent-section">

              <div className="agent-heading">
                <span className="agent-icon">👤</span>

                <div>
                  <h3>Assigned Agent</h3>
                  <p>
                    Person assigned to handle this complaint
                  </p>
                </div>
              </div>

              <div className="agent-info-grid">

                <div>
                  <span className="details-label">
                    Name
                  </span>

                  <strong>
                    {complaint.assignedAgent.name}
                  </strong>
                </div>

                <div>
                  <span className="details-label">
                    Email
                  </span>

                  <strong>
                    {complaint.assignedAgent.email}
                  </strong>
                </div>

                <div>
                  <span className="details-label">
                    Department
                  </span>

                  <strong>
                    {complaint.assignedAgent.department}
                  </strong>
                </div>

              </div>

            </div>
          )}

          {/* Actions */}
          <div className="details-actions">

            <Link
              to={`/complaints/${complaint._id}/edit`}
              className="edit-complaint-button"
            >
              ✏️ Edit Complaint
            </Link>

            <button
              onClick={handleDelete}
              disabled={deleting}
              className="delete-complaint-button"
            >
              {deleting
                ? "Deleting..."
                : "🗑️ Delete Complaint"}
            </button>

          </div>

        </div>

        {/* Back Link */}
        <div className="details-back-link">
          <Link to="/complaints">
            ← Back to My Complaints
          </Link>
        </div>

      </main>

    </div>
  );
}

export default ComplaintDetails;