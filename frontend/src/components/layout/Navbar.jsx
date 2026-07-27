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

        <nav className="navbar navbar-expand-lg navbar-dark bg-dark">

            <div className="container">

                <Link className="navbar-brand" to="/">
                    Learnify LMS
                </Link>

                <div className="navbar-nav ms-auto">

                    {!user ? (

                        <>

                            <Link className="nav-link" to="/">
                                Home
                            </Link>

                            <Link className="nav-link" to="/courses">
                                Courses
                            </Link>

                            <Link className="nav-link" to="/login">
                                Login
                            </Link>

                            <Link className="nav-link" to="/register">
                                Register
                            </Link>

                        </>

                    ) : (

                        <>

                            <Link className="nav-link" to="/courses">
                                Courses
                            </Link>

                            <Link className="nav-link" to="/student/my-courses">
                                My Courses
                            </Link>

                            <button
                                className="btn btn-danger ms-3"
                                onClick={handleLogout}
                            >
                                Logout
                            </button>

                        </>

                    )}

                </div>

            </div>

        </nav>

    );

}

export default Navbar;