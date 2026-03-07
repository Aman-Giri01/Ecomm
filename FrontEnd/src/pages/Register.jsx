import { useState } from "react";
import { UseAuth } from "../context/AuthContext";
import '../register.css';

const Register = () => {
  const { register } = UseAuth();

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    contactNumber: ""
  });

  const [success, setSuccess] = useState(null);
  const [error, setError] = useState(null);  

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // console.log("Form data being sent:", formData);  // ✅ Debug log

    const result = await register(formData);

    if (result.success) {
      setSuccess("Registration successful 🎉");
      setError(null);
      setFormData({ username: "", email: "", password: "", contactNumber: "" });
    } else {
      setSuccess(null);
      setError(result.error);  // ✅ Show error
      // console.log("Registration error:", result.error);  // ✅ Debug log
    }
  };

  return (
    <div className="register-container">
      <h2>Register</h2>

      <form onSubmit={handleSubmit}>
        <div>
          <label>Username</label>
          <input
            type="text"
            name="username"
            value={formData.username}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label>Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label>Password</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label>Contact Number</label>
          <input
            type="text"
            name="contactNumber"
            value={formData.contactNumber}
            onChange={handleChange}
            required
          />
        </div>

        <button type="submit">Register</button>
      </form>

      {success && <p style={{ color: "green" }}>{success}</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}  {/* ✅ Show error */}
    </div>
  );
};

export default Register;
