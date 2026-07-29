import { useEffect, useState } from "react";
import api from "../../services/api";
import { Link } from "react-router-dom";

function MyCourses() {

    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {

        loadCourses();

    }, []);

    const loadCourses = async () => {

        try {

            const user =
                JSON.parse(localStorage.getItem("user"));

            const response =
                await api.get(
                    `/enrollments/student/${user.id}`
                );

            setCourses(response.data);

        } catch (error) {

            console.error(error);

        } finally {

            setLoading(false);

        }

    };

    if (loading) {

        return (
            <div className="container py-5">
                Loading...
            </div>
        );

    }

    return (

        <div className="container py-5">

            <div className="mb-5">

                <h2 className="fw-bold">
                    My Learning
                </h2>

                <p className="text-muted">
                    Continue where you left off.
                </p>

            </div>

            {courses.length === 0 ? (

                <div className="text-center py-5">

                    <h4>No enrolled courses</h4>

                    <Link
                        to="/courses"
                        className="btn btn-primary mt-3"
                    >
                        Browse Courses
                    </Link>

                </div>

            ) : (

                <div className="row g-4">

                    {courses.map(course => (

                        <div
                            className="col-lg-4"
                            key={course.id}
                        >

                            <div className="card h-100 shadow-sm course-card">

                                <img
                                    src={`/images/${course.courseThumbnail}`}
                                    className="course-banner"
                                    alt=""
                                />

                                <div className="card-body">

                                    <h5 className="fw-bold">

                                        {course.courseTitle}

                                    </h5>

                                    <div className="progress my-3">

                                        <div
                                            className="progress-bar"
                                            style={{
                                                width:
                                                    `${course.progress}%`
                                            }}
                                        >
                                            {Math.round(course.progress)}%
                                        </div>

                                    </div>

                                    <p className="text-muted">

                                        {course.completedLessons}
                                        {" / "}
                                        {course.totalLessons}
                                        {" Lessons Completed"}

                                    </p>

                                    <Link
                                        to={`/student/course/${course.courseId}/lessons`}
                                        className="btn btn-primary w-100"
                                    >
                                        Continue Learning
                                    </Link>

                                </div>

                            </div>

                        </div>

                    ))}

                </div>

            )}

        </div>

    );

}

export default MyCourses;