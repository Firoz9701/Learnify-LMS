import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../services/api";
import { getCourseImage } from "../../services/courseService";
import {
    getCurrentUserProfile,
    updateCurrentUserProfile
} from "../../services/authService";

function StudentDashboard() {
    const [user, setUser] = useState(() => JSON.parse(localStorage.getItem("user")));
    const [stats, setStats] = useState({
        totalCourses: 0,
        completedLessons: 0,
        completedCourses: 0
    });
    const [continueCourse, setContinueCourse] = useState(null);
    const [activeCourses, setActiveCourses] = useState([]);
    const [completedCoursesList, setCompletedCoursesList] = useState([]);
    const [isEditingProfile, setIsEditingProfile] = useState(false);
    const [profileForm, setProfileForm] = useState({
        firstName: "",
        lastName: "",
        email: "",
        phoneNumber: ""
    });
    const [profileLoading, setProfileLoading] = useState(true);
    const [profileSaving, setProfileSaving] = useState(false);
    const [profileError, setProfileError] = useState("");
    const [profileSuccess, setProfileSuccess] = useState("");
    const [spotlightImageError, setSpotlightImageError] = useState(false);

    useEffect(() => {
        const loadProfile = async () => {
            try {
                const response = await getCurrentUserProfile();
                const profile = response.data;

                setUser(profile);
                localStorage.setItem("user", JSON.stringify(profile));
                setProfileForm({
                    firstName: profile?.firstName || "",
                    lastName: profile?.lastName || "",
                    email: profile?.email || "",
                    phoneNumber: profile?.phoneNumber || ""
                });
            } catch (error) {
                console.error(error);
                setProfileForm({
                    firstName: user?.firstName || "",
                    lastName: user?.lastName || "",
                    email: user?.email || "",
                    phoneNumber: user?.phoneNumber || ""
                });
            } finally {
                setProfileLoading(false);
            }
        };

        loadProfile();
    }, []);

    useEffect(() => {
        const loadDashboard = async () => {
            if (!user?.id) {
                return;
            }

            try {
                const response = await api.get("/enrollments/my-courses");

                const allCourses = response.data || [];
                const completedCourses = allCourses.filter(
                    (course) => Number(course.progress || 0) >= 100
                );
                const inProgressCourses = allCourses.filter(
                    (course) => Number(course.progress || 0) < 100
                );

                setActiveCourses(inProgressCourses);
                setCompletedCoursesList(completedCourses);

                setStats({
                    totalCourses: inProgressCourses.length,
                    completedLessons: allCourses.reduce(
                        (sum, course) => sum + (course.completedLessons || 0),
                        0
                    ),
                    completedCourses: completedCourses.length
                });

                if (inProgressCourses.length > 0) {
                    setContinueCourse(inProgressCourses[0]);
                } else {
                    setContinueCourse(null);
                }
            } catch (error) {
                console.error(error);
            }
        };

        loadDashboard();
    }, [user?.id]);

    useEffect(() => {
        setSpotlightImageError(false);
    }, [continueCourse?.courseId]);

    const handleProfileChange = (e) => {
        setProfileForm({
            ...profileForm,
            [e.target.name]: e.target.value
        });
    };

    const handleProfileSave = async (e) => {
        e.preventDefault();
        setProfileError("");
        setProfileSuccess("");

        if (!profileForm.firstName.trim() || !profileForm.lastName.trim()) {
            setProfileError("First name and last name are required.");
            return;
        }

        setProfileSaving(true);

        try {
            const response = await updateCurrentUserProfile({
                firstName: profileForm.firstName.trim(),
                lastName: profileForm.lastName.trim(),
                phoneNumber: profileForm.phoneNumber.trim()
            });

            const updatedUser = response.data;
            localStorage.setItem("user", JSON.stringify(updatedUser));
            setUser(updatedUser);
            setProfileForm({
                firstName: updatedUser?.firstName || "",
                lastName: updatedUser?.lastName || "",
                email: updatedUser?.email || "",
                phoneNumber: updatedUser?.phoneNumber || ""
            });
            setProfileSuccess("Profile updated successfully.");
            setIsEditingProfile(false);
        } catch (error) {
            setProfileError(error.response?.data?.message || "Unable to save profile.");
        } finally {
            setProfileSaving(false);
        }
    };


    return (
        <div className="container py-5">
            <div className="hero-card mb-5">
                <h2 className="fw-bold mb-2">
                    👋 Welcome, {user?.firstName}
                </h2>

                <p className="text-muted">
                    Keep learning every day. You're making great progress.
                </p>

                <p className="text-muted mb-0">
                    Continue learning where you left off.
                </p>
            </div>

            <div className="row g-4 mb-5">
                <div className="col-md-4">
                    <Link to="/student/my-courses" className="text-decoration-none d-block">
                        <div className="card stats-panel dashboard-stat-card interactive-surface stagger-item" style={{ "--stagger": 1 }}>
                            <div className="card-body text-center">
                                <h5>Active Courses</h5>
                                <h1 className="fw-bold">{stats.totalCourses}</h1>
                                <small className="text-muted">Click to manage active learning</small>
                                <div className="dashboard-card-arrow">→</div>
                            </div>
                        </div>
                    </Link>
                </div>

                <div className="col-md-4">
                    <a href="#active-learning" className="text-decoration-none d-block">
                        <div className="card stats-panel dashboard-stat-card interactive-surface stagger-item" style={{ "--stagger": 2 }}>
                            <div className="card-body text-center">
                                <h5>Lessons Completed</h5>
                                <h1 className="fw-bold">{stats.completedLessons}</h1>
                                <small className="text-muted">Click to continue your current track</small>
                                <div className="dashboard-card-arrow">→</div>
                            </div>
                        </div>
                    </a>
                </div>

                <div className="col-md-4">
                    <a href="#completed-courses" className="text-decoration-none d-block">
                        <div className="card stats-panel completed-stat-card interactive-surface stagger-item" style={{ "--stagger": 3 }}>
                            <div className="card-body text-center">
                                <h5>Completed Courses</h5>
                                <h1 className="fw-bold">{stats.completedCourses}</h1>
                                <small className="text-muted">Click to view completed courses</small>
                                <div className="dashboard-card-arrow">→</div>
                            </div>
                        </div>
                    </a>
                </div>
            </div>

            {continueCourse && (
                <div className="card shadow-sm border-0 mb-5 dashboard-spotlight-card stagger-item" id="active-learning" style={{ "--stagger": 4 }}>
                    <div className="card-body">
                        <div className="d-flex align-items-center gap-3 mb-2">
                            {!spotlightImageError ? (
                                <img
                                    src={getCourseImage({
                                        title: continueCourse.courseTitle,
                                        thumbnail: continueCourse.courseThumbnail
                                    })}
                                    className="dashboard-course-icon"
                                    alt={continueCourse.courseTitle}
                                    onError={() => setSpotlightImageError(true)}
                                />
                            ) : (
                                <div className="dashboard-course-icon-fallback" aria-hidden="true">📘</div>
                            )}

                            <div>
                                <h4 className="fw-bold mb-1">📘 {continueCourse.courseTitle}</h4>
                                <p className="text-muted mb-0">Active Learning Spotlight</p>
                            </div>
                        </div>

                        <p className="text-muted mb-2">Continue where you left off.</p>

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

            {!continueCourse && (
                <div className="card shadow-sm border-0 mb-5 dashboard-spotlight-card stagger-item" id="active-learning" style={{ "--stagger": 4 }}>
                    <div className="card-body p-4">
                        <h4 className="fw-bold mb-2">📘 No Active Course Right Now</h4>
                        <p className="text-muted mb-3">All enrolled courses are completed or not started yet. Pick a course to continue learning.</p>
                        <Link to="/courses" className="btn btn-primary">Browse Courses</Link>
                    </div>
                </div>
            )}

            <div className="card shadow-sm border-0 mb-5" id="completed-courses">
                <div className="card-body p-4">
                    <div className="d-flex justify-content-between align-items-center flex-wrap gap-2 mb-3">
                        <div>
                            <h4 className="fw-bold mb-1">✅ Completed Courses</h4>
                            <p className="text-muted mb-0">Finished courses are moved here from active learning.</p>
                        </div>
                        <span className="badge text-bg-success">{completedCoursesList.length} Completed</span>
                    </div>

                    {completedCoursesList.length === 0 ? (
                        <div className="border rounded-4 p-3 bg-light-subtle">
                            <p className="text-muted mb-0">No completed courses yet. Finish lessons to move courses here.</p>
                        </div>
                    ) : (
                        <div className="row g-3">
                            {completedCoursesList.map((course) => (
                                <div className="col-md-6 col-lg-4" key={course.id}>
                                    <Link
                                        to={`/student/course/${course.courseId}/lessons`}
                                        className="text-decoration-none d-block"
                                    >
                                        <div className="card h-100 shadow-sm completed-course-card interactive-surface stagger-item" style={{ "--stagger": 5 }}>
                                            <div className="card-body">
                                                <h6 className="fw-bold mb-2 text-dark">{course.courseTitle}</h6>
                                                <p className="text-muted mb-2 small">Progress: {Math.round(course.progress || 0)}%</p>
                                                <span className="badge text-bg-success">Completed</span>
                                                <div className="dashboard-card-arrow">→</div>
                                            </div>
                                        </div>
                                    </Link>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            <div className="card shadow-sm border-0 mb-3 dashboard-tools-card">
                <div className="card-body py-3 px-4">
                    <h4 className="fw-bold mb-1">⚡ Quick Actions</h4>
                    <p className="text-muted mb-0">Every card below is clickable for fast navigation.</p>
                </div>
            </div>

            <div className="card shadow-sm border-0 mb-5" id="profile-section">
                <div className="card-body p-4">
                    <div className="d-flex justify-content-between align-items-center flex-wrap gap-3 mb-4">
                        <div>
                            <h3 className="fw-bold mb-1">👤 Profile</h3>
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

                    {profileLoading ? (
                        <div className="border rounded-4 p-4 bg-light-subtle">
                            <p className="text-muted mb-0">Loading profile...</p>
                        </div>
                    ) : isEditingProfile ? (
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
                                        readOnly
                                        disabled
                                    />
                                    <small className="text-muted">Email is kept from your account login.</small>
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

                            {profileError && <div className="alert alert-danger py-2 mt-3">{profileError}</div>}
                            {profileSuccess && <div className="alert alert-success py-2 mt-3">{profileSuccess}</div>}

                            <button className="btn btn-primary mt-4" type="submit" disabled={profileSaving}>
                                {profileSaving ? "Saving..." : "Save Changes"}
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

            <div className="row g-4">
                <div className="col-md-4">
                    <Link to="/courses" className="text-decoration-none">
                        <div className="card h-100 shadow-sm quick-action-card interactive-surface stagger-item" style={{ "--stagger": 6 }}>
                            <div className="card-body text-center">
                                <h4>📚</h4>
                                <h5>Browse Courses</h5>
                                <div className="dashboard-card-arrow">→</div>
                            </div>
                        </div>
                    </Link>
                </div>

                <div className="col-md-4">
                    <Link to="/student/my-courses" className="text-decoration-none">
                        <div className="card h-100 shadow-sm quick-action-card interactive-surface stagger-item" style={{ "--stagger": 7 }}>
                            <div className="card-body text-center">
                                <h4>🎓</h4>
                                <h5>My Courses</h5>
                                <div className="dashboard-card-arrow">→</div>
                            </div>
                        </div>
                    </Link>
                </div>

                <div className="col-md-4">
                    <a href="#profile-section" className="text-decoration-none d-block">
                        <div className="card h-100 shadow-sm border-primary-subtle quick-action-card interactive-surface stagger-item" style={{ "--stagger": 8 }}>
                            <div className="card-body text-center">
                                <h4>👤</h4>
                                <h5>Profile</h5>
                                <small className="text-muted">View and edit your info above</small>
                                <div className="dashboard-card-arrow">→</div>
                            </div>
                        </div>
                    </a>
                </div>
            </div>
        </div>
    );
}

export default StudentDashboard;
