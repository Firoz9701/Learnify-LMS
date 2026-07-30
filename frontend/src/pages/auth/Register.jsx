import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { register } from "../../services/authService";

function Register() {
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        phoneNumber: "",
        password: "",
        confirmPassword: ""
    });
    const [acceptTerms, setAcceptTerms] = useState(false);
    const [fieldErrors, setFieldErrors] = useState({});
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const navigate = useNavigate();

    const nameRegex = /^[A-Za-z][A-Za-z\s'\-]{1,99}$/;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^\d{10,15}$/;
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d]).{8,50}$/;
    const commonWeakPasswords = new Set([
        "password",
        "password123",
        "12345678",
        "qwerty123",
        "admin123",
        "letmein123"
    ]);

    const validateForm = (payload) => {
        const nextErrors = {};

        if (!payload.firstName || !nameRegex.test(payload.firstName)) {
            nextErrors.firstName = "First name must be at least 2 characters and contain only letters, spaces, apostrophe, or hyphen.";
        }

        if (!payload.lastName || !nameRegex.test(payload.lastName)) {
            nextErrors.lastName = "Last name must be at least 2 characters and contain only letters, spaces, apostrophe, or hyphen.";
        }

        if (!emailRegex.test(payload.email)) {
            nextErrors.email = "Please enter a valid email address.";
        }

        if (payload.phoneNumber && !phoneRegex.test(payload.phoneNumber)) {
            nextErrors.phoneNumber = "Phone number must be 10 to 15 digits.";
        }

        if (!passwordRegex.test(payload.password)) {
            nextErrors.password = "Password must include uppercase, lowercase, number, special character, and be 8-50 characters long.";
        }

        if (commonWeakPasswords.has(payload.password.toLowerCase())) {
            nextErrors.password = "Choose a stronger password. This one is too common.";
        }

        if (payload.password !== payload.confirmPassword) {
            nextErrors.confirmPassword = "Passwords do not match.";
        }

        if (!acceptTerms) {
            nextErrors.acceptTerms = "You must accept the terms and privacy policy to continue.";
        }

        return nextErrors;
    };

    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData({ ...formData, [name]: value });
        setFieldErrors((prev) => ({ ...prev, [name]: "" }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setMessage("");
        setFieldErrors({});

        const normalizedPayload = {
            firstName: formData.firstName.trim(),
            lastName: formData.lastName.trim(),
            email: formData.email.trim().toLowerCase(),
            phoneNumber: formData.phoneNumber.trim(),
            password: formData.password,
            confirmPassword: formData.confirmPassword
        };

        const nextErrors = validateForm(normalizedPayload);

        if (Object.keys(nextErrors).length > 0) {
            setFieldErrors(nextErrors);
            setError("Please correct highlighted fields.");
            return;
        }

        setLoading(true);

        try {
            await register({
                firstName: normalizedPayload.firstName,
                lastName: normalizedPayload.lastName,
                email: normalizedPayload.email,
                phoneNumber: normalizedPayload.phoneNumber || null,
                password: normalizedPayload.password
            });

            setMessage("Registration successful. You can now log in.");
            setTimeout(() => navigate("/login"), 1000);
        } catch (err) {
            const responseData = err.response?.data;

            if (responseData && typeof responseData === "object" && !Array.isArray(responseData)) {
                const knownFieldErrors = {};

                ["firstName", "lastName", "email", "phoneNumber", "password"].forEach((field) => {
                    if (responseData[field]) {
                        knownFieldErrors[field] = String(responseData[field]);
                    }
                });

                if (Object.keys(knownFieldErrors).length > 0) {
                    setFieldErrors((prev) => ({ ...prev, ...knownFieldErrors }));
                    setError("Please correct highlighted fields.");
                    return;
                }
            }

            setError(responseData?.message || "Registration failed. Please try again.");
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
                                        <input type="text" className={`form-control ${fieldErrors.firstName ? "is-invalid" : ""}`} name="firstName" value={formData.firstName} onChange={handleChange} maxLength={100} required />
                                        {fieldErrors.firstName && <div className="invalid-feedback">{fieldErrors.firstName}</div>}
                                    </div>
                                    <div className="col-md-6">
                                        <label className="form-label">Last name <span className="text-danger">*</span></label>
                                        <input type="text" className={`form-control ${fieldErrors.lastName ? "is-invalid" : ""}`} name="lastName" value={formData.lastName} onChange={handleChange} maxLength={100} required />
                                        {fieldErrors.lastName && <div className="invalid-feedback">{fieldErrors.lastName}</div>}
                                    </div>
                                </div>

                                <div className="mt-3">
                                    <label className="form-label">Email <span className="text-danger">*</span></label>
                                    <input type="email" className={`form-control ${fieldErrors.email ? "is-invalid" : ""}`} name="email" value={formData.email} onChange={handleChange} required />
                                    {fieldErrors.email && <div className="invalid-feedback">{fieldErrors.email}</div>}
                                </div>

                                <div className="mt-3">
                                    <label className="form-label">Phone number</label>
                                    <input type="tel" className={`form-control ${fieldErrors.phoneNumber ? "is-invalid" : ""}`} name="phoneNumber" value={formData.phoneNumber} onChange={handleChange} placeholder="10 to 15 digits" maxLength={15} />
                                    {fieldErrors.phoneNumber && <div className="invalid-feedback">{fieldErrors.phoneNumber}</div>}
                                </div>

                                <div className="mt-3">
                                    <label className="form-label">Password <span className="text-danger">*</span></label>
                                    <div className="input-group">
                                        <input type={showPassword ? "text" : "password"} className={`form-control ${fieldErrors.password ? "is-invalid" : ""}`} name="password" value={formData.password} onChange={handleChange} required />
                                        <button type="button" className="btn btn-outline-secondary" onClick={() => setShowPassword(!showPassword)}>
                                            {showPassword ? "Hide" : "Show"}
                                        </button>
                                    </div>
                                    {fieldErrors.password && <div className="invalid-feedback d-block">{fieldErrors.password}</div>}
                                    <small className="text-muted d-block mt-2">
                                        Use 8-50 chars with uppercase, lowercase, number, and special character.
                                    </small>
                                </div>

                                <div className="mt-3">
                                    <label className="form-label">Confirm password <span className="text-danger">*</span></label>
                                    <div className="input-group">
                                        <input type={showConfirmPassword ? "text" : "password"} className={`form-control ${fieldErrors.confirmPassword ? "is-invalid" : ""}`} name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} required />
                                        <button type="button" className="btn btn-outline-secondary" onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
                                            {showConfirmPassword ? "Hide" : "Show"}
                                        </button>
                                    </div>
                                    {fieldErrors.confirmPassword && <div className="invalid-feedback d-block">{fieldErrors.confirmPassword}</div>}
                                </div>

                                <div className="form-check mt-3">
                                    <input
                                        className={`form-check-input ${fieldErrors.acceptTerms ? "is-invalid" : ""}`}
                                        type="checkbox"
                                        id="acceptTerms"
                                        checked={acceptTerms}
                                        onChange={(e) => {
                                            setAcceptTerms(e.target.checked);
                                            setFieldErrors((prev) => ({ ...prev, acceptTerms: "" }));
                                        }}
                                    />
                                    <label className="form-check-label" htmlFor="acceptTerms">
                                        I agree to the Terms and Privacy Policy.
                                    </label>
                                    {fieldErrors.acceptTerms && <div className="invalid-feedback d-block">{fieldErrors.acceptTerms}</div>}
                                </div>

                                <div className="alert alert-light border mt-3 py-2 mb-0">
                                    <small className="text-muted">New public registrations are created as student accounts. Only admins can create instructor or admin users.</small>
                                </div>

                                {error && <div className="alert alert-danger mt-3 py-2">{error}</div>}
                                {message && <div className="alert alert-success mt-3 py-2">{message}</div>}

                                <button className="btn btn-primary w-100 rounded-pill mt-4" type="submit" disabled={loading || !acceptTerms}>
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