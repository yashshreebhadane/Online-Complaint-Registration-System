import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import "./EditComplaint.css";

function EditComplaint() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    priority: "Medium",
    location: ""
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

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

      const complaint = data.complaint;

      setFormData({
        title: complaint.title || "",
        description: complaint.description || "",
        category: complaint.category || "",
        priority: complaint.priority || "Medium",
        location: complaint.location || ""
      });

    } catch (err) {
      setError("Unable to connect to server");
    }

    setLoading(false);
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/login");
      return;
    }

    setSaving(true);
    setError("");
    setSuccess("");

    try {
      const response = await fetch(
        `http://localhost:5000/api/complaints/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify(formData)
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Failed to update complaint");
        setSaving(false);
        return;
      }

      setSuccess("Complaint updated successfully!");

      setTimeout(() => {
        navigate(`/complaints/${id}`);
      }, 1500);

    } catch (err) {
      setError("Unable to connect to server");
    }

    setSaving(false);
  };

  /* Loading */
  if (loading) {
    return (
      <div className="edit-loading">
        <div className="edit-spinner"></div>
        <p>Loading complaint...</p>
      </div>
    );
  }

  /* Error while loading */
  if (error && !formData.title) {
    return (
      <div className="edit-error-page">
        <div className="edit-error-card">

          <div className="edit-error-icon">
            ⚠️
          </div>

          <h2>Unable to Load Complaint</h2>

          <p>{error}</p>

          <Link
            to="/complaints"
            className="edit-back-button"
          >
            ← Back to My Complaints
          </Link>

        </div>
      </div>
    );
  }

  return (
    <div className="edit-complaint-page">

      {/* Header */}
      <header className="edit-header">

        <div className="edit-logo">

          <div className="edit-logo-icon">
            📝
          </div>

          <div>
            <h1>Online Complaint</h1>
            <p>Registration System</p>
          </div>

        </div>

        <Link
          to="/dashboard"
          className="edit-dashboard-link"
        >
          Dashboard
        </Link>

      </header>

      {/* Main Content */}
      <main className="edit-container">

        <div className="edit-heading">

          <h2>Edit Complaint</h2>

          <p>
            Update the information of your complaint below.
          </p>

        </div>

        <div className="edit-card">

          {/* Card Header */}
          <div className="edit-card-title">

            <span className="edit-title-icon">
              ✏️
            </span>

            <div>
              <h3>Complaint Information</h3>

              <p>
                Make the required changes and save your complaint.
              </p>
            </div>

          </div>

          <form onSubmit={handleSubmit}>

            {/* Complaint Title */}
            <div className="edit-form-group">

              <label htmlFor="title">
                Complaint Title
              </label>

              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="Enter complaint title"
                required
              />

            </div>

            {/* Description */}
            <div className="edit-form-group">

              <label htmlFor="description">
                Description
              </label>

              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Describe your complaint"
                rows="6"
                required
              ></textarea>

            </div>

            {/* Category and Priority */}
            <div className="edit-form-row">

              {/* Category */}
              <div className="edit-form-group">

                <label htmlFor="category">
                  Category
                </label>

                <select
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  required
                >

                  <option value="">
                    Select Category
                  </option>

                  <option value="Academic">
                    Academic
                  </option>

                  <option value="Examination">
                    Examination
                  </option>

                  <option value="Faculty & Teaching">
                    Faculty & Teaching
                  </option>

                  <option value="Infrastructure">
                    Infrastructure
                  </option>

                  <option value="Classroom">
                    Classroom
                  </option>

                  <option value="Laboratory">
                    Laboratory
                  </option>

                  <option value="Library">
                    Library
                  </option>

                  <option value="Hostel">
                    Hostel
                  </option>

                  <option value="Mess & Food">
                    Mess & Food
                  </option>

                  <option value="Cleanliness & Sanitation">
                    Cleanliness & Sanitation
                  </option>

                  <option value="Electricity">
                    Electricity
                  </option>

                  <option value="Water Supply">
                    Water Supply
                  </option>

                  <option value="Internet & Wi-Fi">
                    Internet & Wi-Fi
                  </option>

                  <option value="Computer & IT Services">
                    Computer & IT Services
                  </option>

                  <option value="Transport & Parking">
                    Transport & Parking
                  </option>

                  <option value="Security">
                    Security
                  </option>

                  <option value="Fees & Accounts">
                    Fees & Accounts
                  </option>

                  <option value="Scholarship">
                    Scholarship
                  </option>

                  <option value="Administration">
                    Administration
                  </option>

                  <option value="Student Services">
                    Student Services
                  </option>

                  <option value="Events & Activities">
                    Events & Activities
                  </option>

                  <option value="Sports">
                    Sports
                  </option>

                  <option value="Medical & Health">
                    Medical & Health
                  </option>

                  <option value="Harassment & Misconduct">
                    Harassment & Misconduct
                  </option>

                  <option value="Lost & Found">
                    Lost & Found
                  </option>

                  <option value="Other">
                    Other
                  </option>

                </select>

              </div>

              {/* Priority */}
              <div className="edit-form-group">

                <label htmlFor="priority">
                  Priority
                </label>

                <select
                  id="priority"
                  name="priority"
                  value={formData.priority}
                  onChange={handleChange}
                  required
                >

                  <option value="Low">
                    Low
                  </option>

                  <option value="Medium">
                    Medium
                  </option>

                  <option value="High">
                    High
                  </option>

                </select>

              </div>

            </div>

            {/* Location */}
            <div className="edit-form-group">

              <label htmlFor="location">
                Location
              </label>

              <input
                type="text"
                id="location"
                name="location"
                value={formData.location}
                onChange={handleChange}
                placeholder="Enter complaint location"
                required
              />

            </div>

            {/* Success Message */}
            {success && (
              <div className="edit-success-message">
                ✓ {success}
              </div>
            )}

            {/* Error Message */}
            {error && (
              <div className="edit-error-message">
                ⚠️ {error}
              </div>
            )}

            {/* Buttons */}
            <div className="edit-actions">

              <Link
                to={`/complaints/${id}`}
                className="edit-cancel-button"
              >
                Cancel
              </Link>

              <button
                type="submit"
                className="edit-save-button"
                disabled={saving}
              >
                {saving
                  ? "Saving Changes..."
                  : "✓ Save Changes"}
              </button>

            </div>

          </form>

        </div>

        {/* Back Link */}
        <div className="edit-back-link">

          <Link to={`/complaints/${id}`}>
            ← Back to Complaint Details
          </Link>

        </div>

      </main>

    </div>
  );
}

export default EditComplaint;