import { Link, useNavigate } from "react-router-dom";
import { useContext } from "react";
import AuthContext from "../../context/AuthContext";

function Navbar() {

    const navigate = useNavigate();

    const { user, logoutUser } = useContext(AuthContext);

    const handleLogout = () => {

        logoutUser();

        navigate("/login");

    };

    return (
        <nav className="navbar navbar-expand-lg navbar-modern shadow-sm">
            <div className="container">
                <Link className="navbar-brand d-flex align-items-center fw-bold fs-4" to="/">
                    <img
                        src="/logo-icon.png"
                        alt="Learnify"
                        width="42"
                        height="42"
                        className="me-2"
                    />
                    <span className="fw-bold fs-4 text-dark">Learnify</span>
                </Link>

                <button
                    className="navbar-toggler"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#navbarNav"
                >
                    <span className="navbar-toggler-icon"></span>
                </button>

                <div className="collapse navbar-collapse" id="navbarNav">
                    <div className="navbar-nav ms-auto align-items-center gap-2">
                        {!user ? (
                            <>
                                <Link className="nav-link nav-link-modern" to="/">
                                    Home
                                </Link>
                                <Link className="nav-link nav-link-modern" to="/courses">
                                    Courses
                                </Link>
                                <Link className="nav-link nav-link-modern" to="/login">
                                    Login
                                </Link>
                                <Link className="btn btn-primary rounded-pill px-3 ms-2 nav-btn" to="/register">
                                    Register
                                </Link>
                            </>
                        ) : (
                            <>
                                <Link className="nav-link nav-link-modern" to="/courses">
                                    Courses
                                </Link>

                                {user.role === "ROLE_STUDENT" && (
                                    <>
                                        <Link className="nav-link nav-link-modern" to="/student">
                                            Dashboard
                                        </Link>
                                        <Link className="nav-link nav-link-modern" to="/student/my-courses">
                                            My Courses
                                        </Link>
                                    </>
                                )}

                                {user.role === "ROLE_INSTRUCTOR" && (
                                    <>
                                        <Link className="nav-link nav-link-modern" to="/instructor">
                                            Dashboard
                                        </Link>
                                        <Link className="nav-link nav-link-modern" to="/instructor/courses">
                                            Manage Courses
                                        </Link>
                                        <Link className="nav-link nav-link-modern" to="/instructor/lessons">
                                            Manage Lessons
                                        </Link>
                                    </>
                                )}

                                {user.role === "ROLE_ADMIN" && (
                                    <Link className="nav-link nav-link-modern" to="/admin">
                                        Dashboard
                                    </Link>
                                )}

                                <span className="navbar-user ms-2">
                                    Welcome, <strong>{user.firstName}</strong>
                                </span>

                                <button className="btn btn-outline-danger rounded-pill" onClick={handleLogout}>
                                    Logout
                                </button>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );

}

export default Navbar;