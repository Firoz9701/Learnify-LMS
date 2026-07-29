import { useState } from "react";
import { Link } from "react-router-dom";
import { requestPasswordReset } from "../../services/authService";

function ForgotPassword() {
    const [email, setEmail] = useState("");
    const [error, setError] = useState("");
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setMessage("");

        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            setError("Please enter a valid email address.");
            return;
        }

        setLoading(true);

        try {
            const response = await requestPasswordReset(email.trim());
            setMessage(response.data.message);
            setEmail("");
        } catch (err) {
            setError(err.response?.data?.message || "Unable to submit reset request.");
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
                                <p className="text-primary fw-semibold mb-2">Password help</p>
                                <h2 className="fw-bold">Request a password reset</h2>
                                <p className="text-muted mb-0">
                                    Submit your registered email and an admin can issue a temporary password.
                                </p>
                            </div>

                            <form onSubmit={handleSubmit}>
                                <div className="mb-3">
                                    <label className="form-label fw-semibold">Email <span className="text-danger">*</span></label>
                                    <input
                                        type="email"
                                        className="form-control form-control-lg"
                                        placeholder="you@example.com"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                    />
                                </div>

                                {error && <div className="alert alert-danger py-2">{error}</div>}
                                {message && <div className="alert alert-success py-2">{message}</div>}

                                <button className="btn btn-primary w-100 rounded-pill btn-lg mt-2" type="submit" disabled={loading}>
                                    {loading ? "Submitting..." : "Submit Request"}
                                </button>
                            </form>

                            <div className="text-center mt-3">
                                <Link to="/login" className="text-primary fw-semibold">Back to login</Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ForgotPassword;
