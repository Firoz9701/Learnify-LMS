import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import AuthContext from "../../context/AuthContext";
import { changeTemporaryPassword } from "../../services/authService";
import PasswordField from "../../components/common/PasswordField";
import { isStrongPassword } from "../../utils/authValidation";

function ForceChangePassword() {
    const navigate = useNavigate();
    const { user, updateUser, logoutUser } = useContext(AuthContext);
    const [formData, setFormData] = useState({
        newPassword: "",
        confirmPassword: ""
    });
    const [error, setError] = useState("");
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setMessage("");

        if (!isStrongPassword(formData.newPassword)) {
            setError("Password must include uppercase, lowercase, number, special character, and be 8-50 characters long.");
            return;
        }

        if (formData.newPassword !== formData.confirmPassword) {
            setError("Passwords do not match.");
            return;
        }

        setLoading(true);

        try {
            const response = await changeTemporaryPassword(formData.newPassword);
            const updatedUser = { ...user, forcePasswordChange: false };
            updateUser(updatedUser);
            setMessage(response.data.message);

            const role = updatedUser?.role;
            setTimeout(() => {
                if (role === "ROLE_ADMIN") navigate("/admin");
                else if (role === "ROLE_INSTRUCTOR") navigate("/instructor");
                else navigate("/student");
            }, 1000);
        } catch (err) {
            if (err.response?.status === 401) {
                logoutUser();
                navigate("/login");
                return;
            }
            setError(err.response?.data?.message || "Unable to change password.");
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
                                <p className="text-primary fw-semibold mb-2">Security update</p>
                                <h2 className="fw-bold">Change Your Temporary Password</h2>
                                <p className="text-muted mb-0">
                                    An admin issued a temporary password for your account. Set a new one to continue.
                                </p>
                            </div>

                            <form onSubmit={handleSubmit}>
                                <PasswordField
                                    label="New Password"
                                    name="newPassword"
                                    value={formData.newPassword}
                                    onChange={handleChange}
                                    show={showNewPassword}
                                    onToggle={() => setShowNewPassword(!showNewPassword)}
                                    required
                                    className="form-control form-control-lg"
                                    helpText="Use 8-50 chars with uppercase, lowercase, number, and special character."
                                    autoComplete="new-password"
                                />

                                <PasswordField
                                    label="Confirm Password"
                                    name="confirmPassword"
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                    show={showConfirmPassword}
                                    onToggle={() => setShowConfirmPassword(!showConfirmPassword)}
                                    required
                                    className="form-control form-control-lg"
                                    autoComplete="new-password"
                                />

                                {error && <div className="alert alert-danger py-2">{error}</div>}
                                {message && <div className="alert alert-success py-2">{message}</div>}

                                <button className="btn btn-primary w-100 rounded-pill btn-lg mt-2" type="submit" disabled={loading}>
                                    {loading ? "Updating..." : "Update Password"}
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ForceChangePassword;
