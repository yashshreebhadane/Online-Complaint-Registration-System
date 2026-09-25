import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "./NewComplaint.css";

function NewComplaint() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    priority: "Medium",
    location: ""
  });

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setMessage("");
    setError("");
    setLoading(true);

    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/login");
      return;
    }

    try {
      const response = await fetch(
        "http://localhost:5000/api/complaints",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify(formData)
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setError(
          data.message || "Failed to register complaint"
        );
        setLoading(false);
        return;
      }

      setMessage(
        `Complaint registered successfully! Complaint ID: ${data.complaint.complaintId}`
      );

      setFormData({
        title: "",
        description: "",
        category: "",
        priority: "Medium",
        location: ""
      });

      setTimeout(() => {
        navigate("/complaints");
      }, 2000);

    } catch (err) {
      setError("Unable to connect to server");
    }

    setLoading(false);
  };

  return (
    <div className="new-complaint-page">

      {/* Header */}
      <header className="complaint-header">

        <div className="complaint-logo">
          <div className="complaint-logo-icon">
            📝
          </div>

          <div>
            <h1>Online Complaint</h1>
            <p>Registration System</p>
          </div>
        </div>

        <Link
          to="/dashboard"
          className="header-dashboard-link"
        >
          Dashboard
        </Link>

      </header>

      {/* Main Content */}
      <main className="new-complaint-container">

        <div className="complaint-page-heading">
          <h2>Register New Complaint</h2>
          <p>
            Please provide the details of your complaint below.
          </p>
        </div>

        <div className="complaint-form-card">

          <form onSubmit={handleSubmit}>

            {/* Title */}
            <div className="complaint-form-group">
              <label>Complaint Title</label>

              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="Enter complaint title"
                required
              />
            </div>

            {/* Description */}
            <div className="complaint-form-group">
              <label>Description</label>

              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Describe your complaint in detail"
                rows="6"
                required
              />
            </div>

            {/* Category */}
<div className="complaint-form-group">
  <label htmlFor="category">Category</label>

  <select
    id="category"
    name="category"
    value={formData.category}
    onChange={handleChange}
    required
  >
    <option value="">Select Category</option>

    <option value="Academic">Academic</option>
    <option value="Examination">Examination</option>
    <option value="Faculty & Teaching">Faculty & Teaching</option>
    <option value="Infrastructure">Infrastructure</option>
    <option value="Classroom">Classroom</option>
    <option value="Laboratory">Laboratory</option>
    <option value="Library">Library</option>
    <option value="Hostel">Hostel</option>
    <option value="Mess & Food">Mess & Food</option>
    <option value="Cleanliness & Sanitation">
      Cleanliness & Sanitation
    </option>
    <option value="Electricity">Electricity</option>
    <option value="Water Supply">Water Supply</option>
    <option value="Internet & Wi-Fi">Internet & Wi-Fi</option>
    <option value="Computer & IT Services">
      Computer & IT Services
    </option>
    <option value="Transport & Parking">
      Transport & Parking
    </option>
    <option value="Security">Security</option>
    <option value="Fees & Accounts">Fees & Accounts</option>
    <option value="Scholarship">Scholarship</option>
    <option value="Administration">Administration</option>
    <option value="Student Services">Student Services</option>
    <option value="Events & Activities">
      Events & Activities
    </option>
    <option value="Sports">Sports</option>
    <option value="Medical & Health">
      Medical & Health
    </option>
    <option value="Harassment & Misconduct">
      Harassment & Misconduct
    </option>
    <option value="Lost & Found">Lost & Found</option>
    <option value="Other">Other</option>
  </select>
</div>

            {/* Priority */}
            <div className="complaint-form-group">
              <label>Priority</label>

              <select
                name="priority"
                value={formData.priority}
                onChange={handleChange}
              >
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
              </select>
            </div>

            {/* Location */}
            <div className="complaint-form-group">
              <label>Location</label>

              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                placeholder="Enter complaint location"
                required
              />
            </div>

            {/* Buttons */}
            <div className="complaint-form-actions">

              <Link
                to="/dashboard"
                className="cancel-button"
              >
                Cancel
              </Link>

              <button
                type="submit"
                className="submit-complaint-button"
                disabled={loading}
              >
                {loading
                  ? "Submitting..."
                  : "Submit Complaint"}
              </button>

            </div>

          </form>

          {/* Success Message */}
          {message && (
            <div className="complaint-success">
              <span>✅</span>
              <p>{message}</p>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="complaint-error">
              <span>⚠️</span>
              <p>{error}</p>
            </div>
          )}

        </div>

        <div className="back-dashboard">
          <Link to="/dashboard">
            ← Back to Dashboard
          </Link>
        </div>

      </main>

    </div>
  );
}

export default NewComplaint;