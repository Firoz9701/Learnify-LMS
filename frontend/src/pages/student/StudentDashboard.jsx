import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../services/api";

function StudentDashboard() {
    const [user, setUser] = useState(() => JSON.parse(localStorage.getItem("user")));
    const [stats, setStats] = useState({
        totalCourses: 0,
        completedLessons: 0
    });
    const [continueCourse, setContinueCourse] = useState(null);
    const [isEditingProfile, setIsEditingProfile] = useState(false);
    const [profileForm, setProfileForm] = useState({
        firstName: "",
        lastName: "",
        email: "",
        phoneNumber: ""
    });

    useEffect(() => {
        setProfileForm({
            firstName: user?.firstName || "",
            lastName: user?.lastName || "",
            email: user?.email || "",
            phoneNumber: user?.phoneNumber || ""
        });
    }, [user]);

    useEffect(() => {
        const loadDashboard = async () => {
            if (!user?.id) {
                return;
            }

            try {
                const response = await api.get(`/enrollments/student/${user.id}`);

                setStats({
                    totalCourses: response.data.length,
                    completedLessons: response.data.reduce(
                        (sum, course) => sum + (course.completedLessons || 0),
                        0
                    )
                });

                if (response.data.length > 0) {
                    setContinueCourse(response.data[0]);
                } else {
                    setContinueCourse(null);
                }
            } catch (error) {
                console.error(error);
            }
        };

        loadDashboard();
    }, [user?.id]);

    const handleProfileChange = (e) => {
        setProfileForm({
            ...profileForm,
            [e.target.name]: e.target.value
        });
    };

    const handleProfileSave = (e) => {
        e.preventDefault();

        const updatedUser = {
            ...user,
            firstName: profileForm.firstName.trim(),
            lastName: profileForm.lastName.trim(),
            email: profileForm.email.trim(),
            phoneNumber: profileForm.phoneNumber.trim()
        };

        localStorage.setItem("user", JSON.stringify(updatedUser));
        setUser(updatedUser);
        setIsEditingProfile(false);
    };

    return (
        <div className="container py-5">
            <div className="hero-card mb-5">
                <h2 className="fw-bold mb-2">
                    👋 Welcome back, {user?.firstName}
                </h2>

                <p className="text-muted">
                    Keep learning every day. You're making great progress.
                </p>

                <p className="text-muted mb-0">
                    Continue learning where you left off.
                </p>
            </div>

            <div className="row g-4 mb-5">
                <div className="col-md-6">
                    <div className="card stats-panel">
                        <div className="card-body text-center">
                            <h5>My Courses</h5>
                            <h1 className="fw-bold">{stats.totalCourses}</h1>
                        </div>
                    </div>
                </div>

                <div className="col-md-6">
                    <div className="card stats-panel">
                        <div className="card-body text-center">
                            <h5>Lessons Completed</h5>
                            <h1 className="fw-bold">{stats.completedLessons}</h1>
                        </div>
                    </div>
                </div>
            </div>

            {continueCourse && (
                <div className="card shadow-sm border-0 mb-5">
                    <img
                        src={`/images/${continueCourse.courseThumbnail}`}
                        className="course-banner"
                        alt={continueCourse.courseTitle}
                    />

                    <div className="card-body">
                        <h4>{continueCourse.courseTitle}</h4>

                        <div className="progress my-3">
                            <div
                                className="progress-bar"
                                style={{ width: `${continueCourse.progress}%` }}
                            >
                                {Math.round(continueCourse.progress)}%
                            </div>
                        </div>

                        <Link
                            to={`/student/course/${continueCourse.courseId}/lessons`}
                            className="btn btn-primary"
                        >
                            Continue Learning
                        </Link>
                    </div>
                </div>
            )}

            <div className="card shadow-sm border-0 mb-5">
                <div className="card-body p-4">
                    <div className="d-flex justify-content-between align-items-center flex-wrap gap-3 mb-4">
                        <div>
                            <h3 className="fw-bold mb-1">Profile</h3>
                            <p className="text-muted mb-0">
                                Keep your learner information up to date.
                            </p>
                        </div>

                        <button
                            className={`btn ${isEditingProfile ? "btn-outline-secondary" : "btn-primary"}`}
                            onClick={() => setIsEditingProfile(!isEditingProfile)}
                            type="button"
                        >
                            {isEditingProfile ? "Cancel" : "Edit Profile"}
                        </button>
                    </div>

                    {isEditingProfile ? (
                        <form onSubmit={handleProfileSave}>
                            <div className="row g-3">
                                <div className="col-md-6">
                                    <label className="form-label fw-semibold">First Name</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        name="firstName"
                                        value={profileForm.firstName}
                                        onChange={handleProfileChange}
                                        required
                                    />
                                </div>

                                <div className="col-md-6">
                                    <label className="form-label fw-semibold">Last Name</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        name="lastName"
                                        value={profileForm.lastName}
                                        onChange={handleProfileChange}
                                        required
                                    />
                                </div>

                                <div className="col-md-6">
                                    <label className="form-label fw-semibold">Email</label>
                                    <input
                                        type="email"
                                        className="form-control"
                                        name="email"
                                        value={profileForm.email}
                                        onChange={handleProfileChange}
                                        required
                                    />
                                </div>

                                <div className="col-md-6">
                                    <label className="form-label fw-semibold">Phone Number</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        name="phoneNumber"
                                        value={profileForm.phoneNumber}
                                        onChange={handleProfileChange}
                                    />
                                </div>
                            </div>

                            <button className="btn btn-primary mt-4" type="submit">
                                Save Changes
                            </button>
                        </form>
                    ) : (
                        <div className="row g-4">
                            <div className="col-md-6 col-lg-3">
                                <div className="border rounded-4 p-3 h-100 bg-light-subtle">
                                    <small className="text-muted d-block mb-1">First Name</small>
                                    <div className="fw-semibold">{user?.firstName || "Not set"}</div>
                                </div>
                            </div>

                            <div className="col-md-6 col-lg-3">
                                <div className="border rounded-4 p-3 h-100 bg-light-subtle">
                                    <small className="text-muted d-block mb-1">Last Name</small>
                                    <div className="fw-semibold">{user?.lastName || "Not set"}</div>
                                </div>
                            </div>

                            <div className="col-md-6 col-lg-3">
                                <div className="border rounded-4 p-3 h-100 bg-light-subtle">
                                    <small className="text-muted d-block mb-1">Email</small>
                                    <div className="fw-semibold">{user?.email || "Not set"}</div>
                                </div>
                            </div>

                            <div className="col-md-6 col-lg-3">
                                <div className="border rounded-4 p-3 h-100 bg-light-subtle">
                                    <small className="text-muted d-block mb-1">Phone Number</small>
                                    <div className="fw-semibold">{user?.phoneNumber || "Not set"}</div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            <h3 className="card quick-action-card h-100 shadow-sm">Quick Actions</h3>

            <div className="row g-4">
                <div className="col-md-4">
                    <Link to="/courses" className="text-decoration-none">
                        <div className="card h-100 shadow-sm">
                            <div className="card-body text-center">
                                <h4>📚</h4>
                                <h5>Browse Courses</h5>
                            </div>
                        </div>
                    </Link>
                </div>

                <div className="col-md-4">
                    <Link to="/student/my-courses" className="text-decoration-none">
                        <div className="card h-100 shadow-sm">
                            <div className="card-body text-center">
                                <h4>🎓</h4>
                                <h5>My Courses</h5>
                            </div>
                        </div>
                    </Link>
                </div>

                <div className="col-md-4">
                    <div className="card h-100 shadow-sm border-primary-subtle">
                        <div className="card-body text-center">
                            <h4>👤</h4>
                            <h5>Profile</h5>
                            <small className="text-muted">View and edit your info above</small>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default StudentDashboard;
