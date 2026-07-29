import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../services/api";

function StudentDashboard() {

    const [user, setUser] = useState(null);

    const [stats, setStats] = useState({

        totalCourses: 0,

        completedLessons: 0

    });

    const [continueCourse, setContinueCourse] = useState(null);

    useEffect(() => {

        loadDashboard();

    }, []);

    async function loadDashboard() {

        const currentUser =
            JSON.parse(localStorage.getItem("user"));

        setUser(currentUser);

        try {

            const response =
                await api.get(
                    `/enrollments/student/${currentUser.id}`
                );

            setStats({

                totalCourses: response.data.length,

                completedLessons:
                    response.data.reduce(
                        (sum, c) => sum + c.completedLessons,
                        0
                    )

            });

            if (response.data.length > 0) {

                setContinueCourse(response.data[0]);

            }

        }

        catch (error) {

            console.error(error);

        }

    };

    return (

        <div className="container py-5">

            <div className="hero-card mb-5">

                <h2 className="fw-bold">

                    👋 Welcome back,

                    {" "}

                    {user?.firstName}

                </h2>

                <p className="text-muted mb-0">

                    Continue learning where you left off.

                </p>

            </div>

            <div className="row g-4 mb-5">

                <div className="col-md-6">

                    <div className="card stats-panel">

                        <div className="card-body text-center">

                            <h5>My Courses</h5>

                            <h1 className="fw-bold">

                                {stats.totalCourses}

                            </h1>

                        </div>

                    </div>

                </div>

                <div className="col-md-6">

                    <div className="card stats-panel">

                        <div className="card-body text-center">

                            <h5>Lessons Completed</h5>

                            <h1 className="fw-bold">

                                {stats.completedLessons}

                            </h1>

                        </div>

                    </div>

                </div>

            </div>

            {continueCourse && (

                <div className="card shadow-sm border-0 mb-5">

                    <img
                        src={`/images/${continueCourse.courseThumbnail}`}
                        className="course-banner"
                        alt=""
                    />

                    <div className="card-body">

                        <h4>

                            {continueCourse.courseTitle}

                        </h4>

                        <div className="progress my-3">

                            <div
                                className="progress-bar"
                                style={{
                                    width:
                                        `${continueCourse.progress}%`
                                }}
                            >

                                {Math.round(
                                    continueCourse.progress
                                )}

                                %

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

            <h3 className="mb-4">

                Quick Actions

            </h3>

            <div className="row g-4">

                <div className="col-md-4">

                    <Link
                        to="/courses"
                        className="text-decoration-none"
                    >

                        <div className="card h-100 shadow-sm">

                            <div className="card-body text-center">

                                <h4>📚</h4>

                                <h5>

                                    Browse Courses

                                </h5>

                            </div>

                        </div>

                    </Link>

                </div>

                <div className="col-md-4">

                    <Link
                        to="/student/my-courses"
                        className="text-decoration-none"
                    >

                        <div className="card h-100 shadow-sm">

                            <div className="card-body text-center">

                                <h4>🎓</h4>

                                <h5>

                                    My Courses

                                </h5>

                            </div>

                        </div>

                    </Link>

                </div>

                <div className="col-md-4">

                    <div className="card h-100 shadow-sm">

                        <div className="card-body text-center">

                            <h4>👤</h4>

                            <h5>

                                Profile

                            </h5>

                            <small className="text-muted">

                                Coming Soon

                            </small>

                        </div>

                    </div>

                </div>

            </div>

        </div>

    );

}

export default StudentDashboard;