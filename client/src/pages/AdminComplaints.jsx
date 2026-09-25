import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./AdminComplaints.css";

function AdminComplaints() {
  const navigate = useNavigate();

  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [priorityFilter, setPriorityFilter] = useState("All");

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

      if (!response.ok) {
        setError(data.message || "Failed to fetch complaints");
        setLoading(false);
        return;
      }

      setComplaints(data.complaints || []);

    } catch (err) {
      setError("Unable to connect to server");
    }

    setLoading(false);
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this complaint?"
    );

    if (!confirmDelete) {
      return;
    }

    const token = localStorage.getItem("token");

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
        alert(data.message || "Failed to delete complaint");
        return;
      }

      alert("Complaint deleted successfully!");

      setComplaints((previousComplaints) =>
        previousComplaints.filter(
          (complaint) => complaint._id !== id
        )
      );

    } catch (err) {
      alert("Unable to connect to server");
    }
  };

  const filteredComplaints = complaints.filter((complaint) => {

    const searchText = search.toLowerCase();

    const matchesSearch =
      complaint.complaintId
        ?.toLowerCase()
        .includes(searchText) ||
      complaint.title
        ?.toLowerCase()
        .includes(searchText) ||
      complaint.category
        ?.toLowerCase()
        .includes(searchText) ||
      complaint.location
        ?.toLowerCase()
        .includes(searchText);

    const matchesStatus =
      statusFilter === "All" ||
      complaint.status === statusFilter;

    const matchesPriority =
      priorityFilter === "All" ||
      complaint.priority === priorityFilter;

    return (
      matchesSearch &&
      matchesStatus &&
      matchesPriority
    );
  });

  const getStatusClass = (status) => {
    return status
      ?.toLowerCase()
      .replace(/\s+/g, "-");
  };

  const getPriorityClass = (priority) => {
    return priority
      ?.toLowerCase();
  };

  if (loading) {
    return (
      <div className="admin-complaints-loading">
        <div className="admin-complaints-spinner"></div>
        <p>Loading complaints...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="admin-complaints-error-page">
        <div className="admin-complaints-error-card">

          <div className="admin-complaints-error-icon">
            ⚠️
          </div>

          <h2>Unable to Load Complaints</h2>

          <p>{error}</p>

          <Link
            to="/admin/dashboard"
            className="admin-back-button"
          >
            ← Back to Admin Dashboard
          </Link>

        </div>
      </div>
    );
  }

  return (
    <div className="admin-complaints-page">

      {/* Header */}
      <header className="admin-complaints-header">

        <div className="admin-complaints-logo">

          <div className="admin-complaints-logo-icon">
            📝
          </div>

          <div>
            <h1>Online Complaint</h1>
            <p>Registration System</p>
          </div>

        </div>

        <div className="admin-complaints-header-actions">

          <Link
            to="/admin/dashboard"
            className="admin-dashboard-link"
          >
            Admin Dashboard
          </Link>

          <Link
            to="/dashboard"
            className="user-dashboard-link"
          >
            User Dashboard
          </Link>

        </div>

      </header>

      {/* Main */}
      <main className="admin-complaints-container">

        {/* Heading */}
        <div className="admin-complaints-heading">

          <div>
            <p className="admin-page-label">
              ADMINISTRATION
            </p>

            <h2>Manage Complaints</h2>

            <p>
              View, search, filter and manage all registered complaints.
            </p>
          </div>

          <div className="complaint-count-badge">
            {filteredComplaints.length} Complaints
          </div>

        </div>

        {/* Filters */}
        <div className="admin-filter-card">

          <div className="filter-search">

            <label>
              Search Complaints
            </label>

            <div className="search-input-wrapper">

              <span>🔍</span>

              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by ID, title, category or location..."
              />

            </div>

          </div>

          <div className="filter-group">

            <label>
              Status
            </label>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="All">All Statuses</option>
              <option value="Submitted">Submitted</option>
              <option value="Under Review">Under Review</option>
              <option value="In Progress">In Progress</option>
              <option value="Resolved">Resolved</option>
              <option value="Closed">Closed</option>
            </select>

          </div>

          <div className="filter-group">

            <label>
              Priority
            </label>

            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
            >
              <option value="All">All Priorities</option>
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
            </select>

          </div>

        </div>

        {/* Complaints */}
        {filteredComplaints.length === 0 ? (

          <div className="admin-empty-state">

            <div className="admin-empty-icon">
              📭
            </div>

            <h3>No Complaints Found</h3>

            <p>
              No complaints match your current search or filters.
            </p>

          </div>

        ) : (

          <div className="admin-complaints-list">

            {filteredComplaints.map((complaint) => (

              <div
                className="admin-complaint-card"
                key={complaint._id}
              >

                {/* Card Header */}
                <div className="admin-complaint-top">

                  <div className="admin-complaint-title">

                    <span className="admin-complaint-id">
                      {complaint.complaintId}
                    </span>

                    <h3>
                      {complaint.title}
                    </h3>

                  </div>

                  <span
                    className={`admin-status-badge ${getStatusClass(
                      complaint.status
                    )}`}
                  >
                    {complaint.status}
                  </span>

                </div>

                {/* Description */}
                <p className="admin-complaint-description">
                  {complaint.description}
                </p>

                {/* Information */}
                <div className="admin-complaint-info">

                  <div>
                    <span>Category</span>
                    <strong>{complaint.category}</strong>
                  </div>

                  <div>
                    <span>Priority</span>

                    <strong
                      className={`admin-priority-${getPriorityClass(
                        complaint.priority
                      )}`}
                    >
                      {complaint.priority}
                    </strong>
                  </div>

                  <div>
                    <span>Location</span>
                    <strong>{complaint.location}</strong>
                  </div>

                  <div>
                    <span>Submitted By</span>

                    <strong>
                      {complaint.complainant?.name ||
                        "Unknown User"}
                    </strong>
                  </div>

                </div>

                {/* Actions */}
                <div className="admin-complaint-actions">

                  <Link
                    to={`/admin/complaints/${complaint._id}`}
                    className="admin-view-button"
                  >
                    👁 View Details
                  </Link>

                  <button
                    onClick={() =>
                      handleDelete(complaint._id)
                    }
                    className="admin-delete-button"
                  >
                    🗑 Delete
                  </button>

                </div>

              </div>

            ))}

          </div>

        )}

        {/* Back */}
        <div className="admin-complaints-back">

          <Link to="/admin/dashboard">
            ← Back to Admin Dashboard
          </Link>

        </div>

      </main>

    </div>
  );
}

export default AdminComplaints;