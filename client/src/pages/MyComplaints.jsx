import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./MyComplaints.css";

function MyComplaints() {
  const navigate = useNavigate();

  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchComplaints();
  }, []);

  const fetchComplaints = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/login");
      return;
    }

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
          data.message || "Failed to fetch complaints"
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

  if (loading) {
    return (
      <div className="complaints-loading">
        <div className="loading-spinner"></div>
        <p>Loading complaints...</p>
      </div>
    );
  }

  return (
    <div className="my-complaints-page">

      {/* Header */}
      <header className="my-complaints-header">

        <div className="my-complaints-logo">

          <div className="my-complaints-logo-icon">
            📝
          </div>

          <div>
            <h1>Online Complaint</h1>
            <p>Registration System</p>
          </div>

        </div>

        <Link
          to="/dashboard"
          className="dashboard-link"
        >
          Dashboard
        </Link>

      </header>

      {/* Main Content */}
      <main className="my-complaints-container">

        <div className="complaints-heading">

          <div>
            <h2>My Complaints</h2>
            <p>
              View and track all complaints you have registered.
            </p>
          </div>

          <Link
            to="/complaints/new"
            className="new-complaint-button"
          >
            + New Complaint
          </Link>

        </div>

        {/* Error */}
        {error && (
          <div className="complaints-error">
            ⚠️ {error}
          </div>
        )}

        {/* No Complaints */}
        {!error && complaints.length === 0 && (
          <div className="empty-complaints">

            <div className="empty-icon">
              📂
            </div>

            <h3>No Complaints Yet</h3>

            <p>
              You have not registered any complaints yet.
            </p>

            <Link
              to="/complaints/new"
              className="empty-register-button"
            >
              Register a Complaint
            </Link>

          </div>
        )}

        {/* Complaints */}
        {complaints.length > 0 && (
          <div>

            <div className="complaints-summary">
              <span>
                Total Complaints
              </span>

              <strong>
                {complaints.length}
              </strong>
            </div>

            <div className="complaints-list">

              {complaints.map((complaint) => (

                <div
                  className="complaint-card"
                  key={complaint._id}
                >

                  <div className="complaint-card-top">

                    <div>
                      <h3>
                        {complaint.title}
                      </h3>

                      <p className="complaint-id">
                        ID: {complaint.complaintId}
                      </p>
                    </div>

                    <span
                      className={`status-badge ${complaint.status
                        ?.toLowerCase()
                        .replace(/\s+/g, "-")}`}
                    >
                      {complaint.status}
                    </span>

                  </div>

                  <div className="complaint-details">

                    <div className="detail-item">
                      <span className="detail-label">
                        Category
                      </span>

                      <strong>
                        {complaint.category}
                      </strong>
                    </div>

                    <div className="detail-item">
                      <span className="detail-label">
                        Priority
                      </span>

                      <strong className={`priority-${complaint.priority?.toLowerCase()}`}>
                        {complaint.priority}
                      </strong>
                    </div>

                    <div className="detail-item">
                      <span className="detail-label">
                        Location
                      </span>

                      <strong>
                        {complaint.location}
                      </strong>
                    </div>

                  </div>

                  <div className="complaint-card-bottom">

                    <Link
                      to={`/complaints/${complaint._id}`}
                      className="view-details-button"
                    >
                      View Details →
                    </Link>

                  </div>

                </div>

              ))}

            </div>

          </div>
        )}

        <div className="back-dashboard">
          <Link to="/dashboard">
            ← Back to Dashboard
          </Link>
        </div>

      </main>

    </div>
  );
}

export default MyComplaints;