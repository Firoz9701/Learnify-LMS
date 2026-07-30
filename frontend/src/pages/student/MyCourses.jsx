import { useEffect, useState } from "react";
import api from "../../services/api";
import { getMyEnrollments } from "../../services/enrollmentService";
import { getCourseImage } from "../../services/courseService";
import { Link } from "react-router-dom";

function MyCourses() {

    const [courses, setCourses] = useState([]);
    const [activeCourses, setActiveCourses] = useState([]);
    const [completedCourses, setCompletedCourses] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {

        loadCourses();

    }, []);

    const loadCourses = async () => {

        try {

            const data = await getMyEnrollments();

            setCourses(data);

            const done = data.filter(
                (course) => Number(course.progress || 0) >= 100
            );

            const active = data.filter(
                (course) => Number(course.progress || 0) < 100
            );

            setCompletedCourses(done);
            setActiveCourses(active);

        }

        catch (error) {

            console.error(error);

        }

        finally {

            setLoading(false);

        }

    };
    const downloadCertificate = async (courseId) => {

        try {

            const user =
                JSON.parse(localStorage.getItem("user"));

            const response =
                await api.get(
                    `/certificates/student/${user.id}/course/${courseId}`,
                    {
                        responseType: "blob"
                    }
                );

            const url =
                window.URL.createObjectURL(
                    new Blob([response.data])
                );

            const link =
                document.createElement("a");

            link.href = url;

            link.download =
                "Learnify-Certificate.pdf";

            document.body.appendChild(link);

            link.click();

            link.remove();

            window.URL.revokeObjectURL(url);

        }

        catch (error) {

            console.error(error);

            alert(
                error.response?.data?.message ||
                "Unable to download certificate."
            );

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

            <div className="hero-card mb-4">

                <h2 className="fw-bold mb-2">
                    My Learning
                </h2>

                <p className="text-muted mb-0">
                    Continue active courses and revisit completed courses with certificates.
                </p>

            </div>

            <div className="row g-4 mb-5">
                <div className="col-md-4">
                    <div className="card stats-panel h-100">
                        <div className="card-body text-center">
                            <h6 className="text-muted mb-2">All Enrollments</h6>
                            <h2 className="fw-bold mb-0">{courses.length}</h2>
                        </div>
                    </div>
                </div>

                <div className="col-md-4">
                    <div className="card stats-panel h-100">
                        <div className="card-body text-center">
                            <h6 className="text-muted mb-2">Active Courses</h6>
                            <h2 className="fw-bold mb-0">{activeCourses.length}</h2>
                        </div>
                    </div>
                </div>

                <div className="col-md-4">
                    <div className="card stats-panel h-100">
                        <div className="card-body text-center">
                            <h6 className="text-muted mb-2">Completed Courses</h6>
                            <h2 className="fw-bold mb-0">{completedCourses.length}</h2>
                        </div>
                    </div>
                </div>
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
                <>
                    <div className="d-flex justify-content-between align-items-center mb-3 flex-wrap gap-2">
                        <div>
                            <h4 className="fw-bold mb-1">Active Courses</h4>
                            <p className="text-muted mb-0">In-progress courses remain here until completed.</p>
                        </div>
                        <span className="badge text-bg-primary">{activeCourses.length} Active</span>
                    </div>

                    {activeCourses.length === 0 ? (
                        <div className="border rounded-4 p-4 bg-light-subtle mb-5">
                            <p className="text-muted mb-0">No active courses right now. Start a new course from the catalog.</p>
                        </div>
                    ) : (
                        <div className="row g-4 mb-5">

                            {activeCourses.map(course => (

                                <div
                                    className="col-lg-4"
                                    key={course.id}
                                >

                                    <div className="card h-100 shadow-sm course-card">

                                        <img
                                            src={getCourseImage({
                                                thumbnail: course.courseThumbnail
                                            })}
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

                    <div className="d-flex justify-content-between align-items-center mb-3 flex-wrap gap-2">
                        <div>
                            <h4 className="fw-bold mb-1">Completed Courses</h4>
                            <p className="text-muted mb-0">Completed courses are moved here automatically.</p>
                        </div>
                        <span className="badge text-bg-success">{completedCourses.length} Completed</span>
                    </div>

                    {completedCourses.length === 0 ? (
                        <div className="border rounded-4 p-4 bg-light-subtle">
                            <p className="text-muted mb-0">Finish any active course to see it here.</p>
                        </div>
                    ) : (
                        <div className="row g-4">

                            {completedCourses.map(course => (

                                <div
                                    className="col-lg-4"
                                    key={`completed-${course.id}`}
                                >

                                    <div className="card h-100 shadow-sm completed-course-card">

                                        <img
                                            src={getCourseImage({
                                                thumbnail: course.courseThumbnail
                                            })}
                                            className="course-banner"
                                            alt=""
                                        />

                                        <div className="card-body d-flex flex-column">

                                            <h5 className="fw-bold text-dark">
                                                {course.courseTitle}
                                            </h5>

                                            <p className="text-muted small mb-2">Progress: {Math.round(course.progress || 0)}%</p>

                                            <span className="badge text-bg-success align-self-start mb-3">Completed</span>

                                            <div className="mt-auto d-grid gap-2">
                                                <Link
                                                    to={`/student/course/${course.courseId}/lessons`}
                                                    className="btn btn-outline-primary"
                                                >
                                                    View Lessons
                                                </Link>

                                                <button
                                                    className="btn btn-success"
                                                    onClick={() =>
                                                        downloadCertificate(course.courseId)
                                                    }
                                                >
                                                    Download Certificate
                                                </button>
                                            </div>

                                        </div>

                                    </div>

                                </div>

                            ))}

                        </div>
                    )}
                </>
            )}

        </div>

    );

}

export default MyCourses;