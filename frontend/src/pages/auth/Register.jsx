import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { register } from "../../services/authService";

function Register() {
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        confirmPassword: ""
    });
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setMessage("");

        if (!formData.firstName.trim() || !formData.lastName.trim()) {
            setError("Please enter your first and last name.");
            return;
        }

        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            setError("Please enter a valid email address.");
            return;
        }

        if (formData.password.length < 6) {
            setError("Password must be at least 6 characters long.");
            return;
        }

        if (formData.password !== formData.confirmPassword) {
            setError("Passwords do not match.");
            return;
        }

        setLoading(true);

        try {
            await register({
                firstName: formData.firstName.trim(),
                lastName: formData.lastName.trim(),
                email: formData.email.trim(),
                password: formData.password
            });

            setMessage("Registration successful. You can now log in.");
            setTimeout(() => navigate("/login"), 1000);
        } catch (err) {
            setError(err.response?.data?.message || "Registration failed. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container py-5">
            <div className="row justify-content-center">
                <div className="col-lg-6 col-xl-5">
                    <div className="card border-0 shadow-lg rounded-4 overflow-hidden">
                        <div className="card-body p-4 p-lg-5">
                            <div className="text-center mb-4">
                                <p className="text-primary fw-semibold mb-2">Create account</p>
                                <h2 className="fw-bold">Join Learnify today</h2>
                                <p className="text-muted mb-0">Start your learning journey with modern courses and clear progress tracking.</p>
                            </div>

                            <form onSubmit={handleSubmit}>
                                <div className="row g-3">
                                    <div className="col-md-6">
                                        <label className="form-label">First name <span className="text-danger">*</span></label>
                                        <input type="text" className="form-control" name="firstName" value={formData.firstName} onChange={handleChange} required />
                                    </div>
                                    <div className="col-md-6">
                                        <label className="form-label">Last name <span className="text-danger">*</span></label>
                                        <input type="text" className="form-control" name="lastName" value={formData.lastName} onChange={handleChange} required />
                                    </div>
                                </div>

                                <div className="mt-3">
                                    <label className="form-label">Email <span className="text-danger">*</span></label>
                                    <input type="email" className="form-control" name="email" value={formData.email} onChange={handleChange} required />
                                </div>

                                <div className="mt-3">
                                    <label className="form-label">Password <span className="text-danger">*</span></label>
                                    <div className="input-group">
                                        <input type={showPassword ? "text" : "password"} className="form-control" name="password" value={formData.password} onChange={handleChange} required />
                                        <button type="button" className="btn btn-outline-secondary" onClick={() => setShowPassword(!showPassword)}>
                                            {showPassword ? "Hide" : "Show"}
                                        </button>
                                    </div>
                                    <small className="text-muted d-block mt-2">
                                        Strength: {formData.password.length >= 8 ? "Strong" : formData.password.length >= 6 ? "Fair" : "Weak"}
                                    </small>
                                </div>

                                <div className="mt-3">
                                    <label className="form-label">Confirm password <span className="text-danger">*</span></label>
                                    <div className="input-group">
                                        <input type={showConfirmPassword ? "text" : "password"} className="form-control" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} required />
                                        <button type="button" className="btn btn-outline-secondary" onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
                                            {showConfirmPassword ? "Hide" : "Show"}
                                        </button>
                                    </div>
                                </div>

                                <div className="alert alert-light border mt-3 py-2 mb-0">
                                    <small className="text-muted">New public registrations are created as student accounts. Only admins can create instructor or admin users.</small>
                                </div>

                                {error && <div className="alert alert-danger mt-3 py-2">{error}</div>}
                                {message && <div className="alert alert-success mt-3 py-2">{message}</div>}

                                <button className="btn btn-primary w-100 rounded-pill mt-4" type="submit" disabled={loading}>
                                    {loading ? "Creating account..." : "Create account"}
                                </button>
                            </form>

                            <div className="text-center mt-3">
                                <span className="text-muted">Already have an account?</span>{" "}
                                <Link to="/login" className="text-primary fw-semibold">Login</Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Register;