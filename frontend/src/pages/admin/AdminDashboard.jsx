import { useEffect, useState } from "react";
import api from "../../services/api";
import PasswordField from "../../components/common/PasswordField";
import {
    isValidEmail,
    isStrongPassword,
    normalizeEmail,
    normalizePhone
} from "../../utils/authValidation";

function AdminDashboard() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [roleFilter, setRoleFilter] = useState("");
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        phoneNumber: "",
        password: "",
        role: "ROLE_INSTRUCTOR"
    });
    const [formError, setFormError] = useState("");
    const [formSuccess, setFormSuccess] = useState("");
    const [submitting, setSubmitting] = useState(false);
    const [actionMessage, setActionMessage] = useState("");
    const [resetRequests, setResetRequests] = useState([]);
    const [resetPasswords, setResetPasswords] = useState({});
    const [showAdminPassword, setShowAdminPassword] = useState(false);
    const [showResetPasswords, setShowResetPasswords] = useState({});

    const loadUsers = async () => {
        setLoading(true);
        setError("");

        try {
            const response = await api.get("/admin/users", {
                params: roleFilter ? { role: roleFilter } : {}
            });

            setUsers(response.data);
        } catch (err) {
            setError(err.response?.data?.message || "Unable to load users.");
        } finally {
            setLoading(false);
        }
    };

    const loadResetRequests = async () => {
        try {
            const response = await api.get("/admin/password-reset-requests");
            setResetRequests(response.data);
        } catch (err) {
            setError(err.response?.data?.message || "Unable to load password reset requests.");
        }
    };

    useEffect(() => {
        loadUsers();
        loadResetRequests();
    }, [roleFilter]);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleCreateUser = async (e) => {
        e.preventDefault();
        setFormError("");
        setFormSuccess("");

        if (!formData.firstName.trim() || !formData.lastName.trim()) {
            setFormError("First name and last name are required.");
            return;
        }

        if (!isValidEmail(formData.email)) {
            setFormError("Please enter a valid email address.");
            return;
        }

        if (!isStrongPassword(formData.password)) {
            setFormError("Password must include uppercase, lowercase, number, special character, and be 8-50 characters long.");
            return;
        }

        setSubmitting(true);

        try {
            await api.post("/admin/users", {
                firstName: formData.firstName.trim(),
                lastName: formData.lastName.trim(),
                email: normalizeEmail(formData.email),
                phoneNumber: normalizePhone(formData.phoneNumber),
                password: formData.password,
                role: formData.role
            });

            setFormSuccess("User created successfully.");
            setFormData({
                firstName: "",
                lastName: "",
                email: "",
                phoneNumber: "",
                password: "",
                role: "ROLE_INSTRUCTOR"
            });

            await loadUsers();
        } catch (err) {
            setFormError(err.response?.data?.message || "Unable to create user.");
        } finally {
            setSubmitting(false);
        }
    };

    const handleRoleUpdate = async (userId, role) => {
        setActionMessage("");
        try {
            await api.put(`/admin/users/${userId}/role`, { role });
            setActionMessage("User role updated successfully.");
            await loadUsers();
        } catch (err) {
            setError(err.response?.data?.message || "Unable to update role.");
        }
    };

    const handleStatusToggle = async (userId, enabled) => {
        setActionMessage("");
        try {
            await api.put(`/admin/users/${userId}/status`, { enabled: !enabled });
            setActionMessage(`User ${enabled ? "disabled" : "enabled"} successfully.`);
            await loadUsers();
        } catch (err) {
            setError(err.response?.data?.message || "Unable to update status.");
        }
    };

    const handleResetPasswordInput = (requestId, value) => {
        setResetPasswords({
            ...resetPasswords,
            [requestId]: value
        });
    };

    const toggleResetPasswordVisibility = (requestId) => {
        setShowResetPasswords((prev) => ({
            ...prev,
            [requestId]: !prev[requestId]
        }));
    };

    const handleResolveResetRequest = async (requestId) => {
        const temporaryPassword = resetPasswords[requestId] || "";

        if (!isStrongPassword(temporaryPassword)) {
            setError("Temporary password must include uppercase, lowercase, number, special character, and be 8-50 characters long.");
            return;
        }

        try {
            await api.put(`/admin/password-reset-requests/${requestId}/resolve`, { temporaryPassword });
            setActionMessage("Password reset request resolved successfully.");
            setResetPasswords({
                ...resetPasswords,
                [requestId]: ""
            });
            await loadResetRequests();
        } catch (err) {
            setError(err.response?.data?.message || "Unable to resolve password reset request.");
        }
    };

    return (
        <div className="container py-5">
            <div className="hero-card admin-hero mb-5">
                <h2 className="fw-bold mb-2">Admin User Management</h2>
                <p className="text-muted mb-0">
                    View all registered users, filter them by role, and create instructor or admin accounts.
                </p>
            </div>

            <div className="card shadow-sm border-0 admin-panel mb-4">
                <div className="card-body p-4">
                    <h4 className="fw-bold mb-3">Create User</h4>

                    <form onSubmit={handleCreateUser}>
                        <div className="row g-3">
                            <div className="col-md-6">
                                <label className="form-label fw-semibold">First Name</label>
                                <input className="form-control" name="firstName" value={formData.firstName} onChange={handleChange} required />
                            </div>

                            <div className="col-md-6">
                                <label className="form-label fw-semibold">Last Name</label>
                                <input className="form-control" name="lastName" value={formData.lastName} onChange={handleChange} required />
                            </div>

                            <div className="col-md-6">
                                <label className="form-label fw-semibold">Email</label>
                                <input type="email" className="form-control" name="email" value={formData.email} onChange={handleChange} required />
                            </div>

                            <div className="col-md-6">
                                <label className="form-label fw-semibold">Phone Number</label>
                                <input className="form-control" name="phoneNumber" value={formData.phoneNumber} onChange={handleChange} placeholder="Optional" />
                            </div>

                            <div className="col-md-6">
                                <PasswordField
                                    label="Password"
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    show={showAdminPassword}
                                    onToggle={() => setShowAdminPassword(!showAdminPassword)}
                                    required
                                    className="form-control"
                                    autoComplete="new-password"
                                />
                            </div>

                            <div className="col-md-6">
                                <label className="form-label fw-semibold">Role</label>
                                <select className="form-select" name="role" value={formData.role} onChange={handleChange}>
                                    <option value="ROLE_INSTRUCTOR">Instructor</option>
                                    <option value="ROLE_ADMIN">Admin</option>
                                    <option value="ROLE_STUDENT">Student</option>
                                </select>
                            </div>
                        </div>

                        {formError && <div className="alert alert-danger py-2 mt-3">{formError}</div>}
                        {formSuccess && <div className="alert alert-success py-2 mt-3">{formSuccess}</div>}

                        <button className="btn btn-primary mt-4" type="submit" disabled={submitting}>
                            {submitting ? "Creating..." : "Create User"}
                        </button>
                    </form>
                </div>
            </div>

            <div className="card shadow-sm border-0 admin-panel mb-4">
                <div className="card-body p-4">
                    <div className="d-flex justify-content-between align-items-center flex-wrap gap-3 mb-4">
                        <div>
                            <h4 className="fw-bold mb-1">Password Reset Requests</h4>
                            <p className="text-muted mb-0">Issue a temporary password to users who request help.</p>
                        </div>
                    </div>

                    {resetRequests.length === 0 ? (
                        <p className="text-muted mb-0">No pending reset requests.</p>
                    ) : (
                        <div className="table-responsive">
                            <table className="table align-middle admin-table">
                                <thead>
                                    <tr>
                                        <th>User</th>
                                        <th>Email</th>
                                        <th>Role</th>
                                        <th>Requested</th>
                                        <th>Temporary Password</th>
                                        <th>Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {resetRequests.map((request) => (
                                        <tr key={request.id}>
                                            <td>{request.firstName} {request.lastName}</td>
                                            <td>{request.email}</td>
                                            <td>
                                                <span className="badge bg-light text-dark border">
                                                    {request.role.replace("ROLE_", "")}
                                                </span>
                                            </td>
                                            <td>{request.createdAt ? new Date(request.createdAt).toLocaleString() : "-"}</td>
                                            <td>
                                                <PasswordField
                                                    name={`temporaryPassword-${request.id}`}
                                                    value={resetPasswords[request.id] || ""}
                                                    onChange={(e) => handleResetPasswordInput(request.id, e.target.value)}
                                                    show={!!showResetPasswords[request.id]}
                                                    onToggle={() => toggleResetPasswordVisibility(request.id)}
                                                    required
                                                    className="form-control form-control-sm"
                                                    placeholder="Min 8 characters"
                                                    autoComplete="new-password"
                                                />
                                            </td>
                                            <td>
                                                <button
                                                    type="button"
                                                    className="btn btn-sm btn-primary"
                                                    onClick={() => handleResolveResetRequest(request.id)}
                                                >
                                                    Resolve
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>

            <div className="card shadow-sm border-0 admin-panel">
                <div className="card-body p-4">
                    <div className="d-flex justify-content-between align-items-center flex-wrap gap-3 mb-4">
                        <div>
                            <h4 className="fw-bold mb-1">Users</h4>
                            <p className="text-muted mb-0">Use the role filter to inspect registered accounts.</p>
                        </div>

                        <div style={{ minWidth: "220px" }}>
                            <label className="form-label fw-semibold">Filter by Role</label>
                            <select
                                className="form-select"
                                value={roleFilter}
                                onChange={(e) => setRoleFilter(e.target.value)}
                            >
                                <option value="">All Roles</option>
                                <option value="ROLE_ADMIN">Admin</option>
                                <option value="ROLE_INSTRUCTOR">Instructor</option>
                                <option value="ROLE_STUDENT">Student</option>
                            </select>
                        </div>
                    </div>

                    {error && <div className="alert alert-danger py-2">{error}</div>}
                    {actionMessage && <div className="alert alert-success py-2">{actionMessage}</div>}

                    {loading ? (
                        <p className="text-muted mb-0">Loading users...</p>
                    ) : users.length === 0 ? (
                        <p className="text-muted mb-0">No users found for the selected filter.</p>
                    ) : (
                        <div className="table-responsive">
                            <table className="table align-middle admin-table">
                                <thead>
                                    <tr>
                                        <th>ID</th>
                                        <th>Name</th>
                                        <th>Email</th>
                                        <th>Phone</th>
                                        <th>Role</th>
                                        <th>Status</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {users.map((user) => (
                                        <tr key={user.id}>
                                            <td>{user.id}</td>
                                            <td>{user.firstName} {user.lastName}</td>
                                            <td>{user.email}</td>
                                            <td>{user.phoneNumber || "-"}</td>
                                            <td>
                                                <span className="badge bg-light text-dark border">
                                                    {user.role.replace("ROLE_", "")}
                                                </span>
                                            </td>
                                            <td>
                                                <span className={`badge ${user.enabled ? "text-bg-success" : "text-bg-secondary"}`}>
                                                    {user.enabled ? "Active" : "Disabled"}
                                                </span>
                                            </td>
                                            <td>
                                                <div className="d-flex flex-wrap gap-2">
                                                    <select
                                                        className="form-select form-select-sm admin-role-select"
                                                        value={user.role}
                                                        onChange={(e) => handleRoleUpdate(user.id, e.target.value)}
                                                    >
                                                        <option value="ROLE_ADMIN">Admin</option>
                                                        <option value="ROLE_INSTRUCTOR">Instructor</option>
                                                        <option value="ROLE_STUDENT">Student</option>
                                                    </select>
                                                    <button
                                                        className={`btn btn-sm ${user.enabled ? "btn-outline-danger" : "btn-outline-success"}`}
                                                        type="button"
                                                        onClick={() => handleStatusToggle(user.id, user.enabled)}
                                                    >
                                                        {user.enabled ? "Disable" : "Enable"}
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default AdminDashboard;