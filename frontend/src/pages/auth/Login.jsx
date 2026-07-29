import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useContext } from "react";
import AuthContext from "../../context/AuthContext";
import { login } from "../../services/authService";

function Login() {
    const [formData, setFormData] = useState({
        email: "",
        password: "",
        role: "ROLE_STUDENT"
    });
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const navigate = useNavigate();
    const { loginUser } = useContext(AuthContext);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        if (!formData.email.trim()) {
            setError("Please enter your email.");
            return;
        }

        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            setError("Please enter a valid email address.");
            return;
        }

        if (!formData.password) {
            setError("Please enter your password.");
            return;
        }

        setLoading(true);

        try {
            const response = await login(formData);
            loginUser(response.data.user, response.data.token);

            if (response?.data?.user?.forcePasswordChange) {
                navigate("/force-change-password");
                return;
            }

            const role = response?.data?.user?.role || formData.role;
            if (role === "ROLE_ADMIN") navigate("/admin");
            else if (role === "ROLE_INSTRUCTOR") navigate("/instructor");
            else navigate("/student");
        } catch (err) {
            setError(err.response?.data?.message || "Invalid email or password. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container py-5">
            <div className="row justify-content-center align-items-center min-vh-70">
                <div className="col-lg-5 col-md-7">
                    <div className="card border-0 shadow-lg rounded-4 overflow-hidden auth-card">
                        <div className="card-body p-4 p-lg-5">
                            <div className="text-center mb-4">
                                <p className="text-primary fw-semibold mb-2">Welcome back</p>
                                <h2 className="fw-bold">Sign in to Learnify</h2>
                                <p className="text-muted mb-0">Continue your learning journey with a clean, focused experience.</p>
                            </div>

                            <form onSubmit={handleSubmit}>
                                <div className="mb-3">
                                    <label className="form-label fw-semibold">
                                        Email <span className="text-danger">*</span>
                                    </label>
                                    <input
                                        type="email"
                                        name="email"
                                        className="form-control form-control-lg"
                                        placeholder="you@example.com"
                                        value={formData.email}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>

                                <div className="mb-3">
                                    <label className="form-label fw-semibold">
                                        Password <span className="text-danger">*</span>
                                    </label>
                                    <div className="input-group">
                                        <input
                                            type={showPassword ? "text" : "password"}
                                            name="password"
                                            className="form-control form-control-lg"
                                            placeholder="Enter your password"
                                            value={formData.password}
                                            onChange={handleChange}
                                            required
                                        />
                                        <button
                                            type="button"
                                            className="btn btn-outline-secondary"
                                            onClick={() => setShowPassword(!showPassword)}
                                        >
                                            {showPassword ? "Hide" : "Show"}
                                        </button>
                                    </div>
                                    <div className="text-end mt-2">
                                        <Link to="/forgot-password" className="small text-decoration-none fw-semibold">
                                            Forgot Password?
                                        </Link>
                                    </div>
                                </div>

                                <div className="mb-3">
                                    <label className="form-label fw-semibold">Login as <span className="text-danger">*</span></label>
                                    <select
                                        name="role"
                                        className="form-select form-select-lg"
                                        value={formData.role}
                                        onChange={handleChange}
                                    >
                                        <option value="ROLE_STUDENT">Student</option>
                                        <option value="ROLE_INSTRUCTOR">Instructor</option>
                                        <option value="ROLE_ADMIN">Admin</option>
                                    </select>
                                </div>

                                {error && <div className="alert alert-danger py-2">{error}</div>}

                                <div className="alert alert-light border py-2 mb-3">
                                    <small className="text-muted">Tip: choose the role that matches the account you want to access, and you will be taken to the right dashboard after login.</small>
                                </div>

                                <button className="btn btn-primary w-100 rounded-pill btn-lg mt-2" type="submit" disabled={loading}>
                                    {loading ? "Signing in..." : "Sign In"}
                                </button>
                            </form>

                            <div className="text-center mt-3">
                                <span className="text-muted">New here?</span>{" "}
                                <Link to="/register" className="text-primary fw-semibold">Create an account</Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Login;