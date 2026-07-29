import { useEffect, useState } from "react";
import { getAllCourses, getCourseImage } from "../services/courseService";
import { Link } from "react-router-dom";

function Courses() {
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCourses = async () => {
            try {
                const data = await getAllCourses(0, 12);
                setCourses(data);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };

        fetchCourses();
    }, []);

    return (
        <div className="container py-5">
            <div className="d-flex justify-content-between align-items-center flex-wrap gap-3 mb-4">
                <div>
                    <p className="text-primary fw-semibold mb-1">Explore courses</p>
                    <h2 className="mb-0">All Courses</h2>
                    <p className="text-muted mt-2 mb-0">Browse the full library of Learnify courses with richer visuals and modern cards.</p>
                </div>
                <Link to="/" className="btn btn-outline-secondary rounded-pill">
                    Back to home
                </Link>
            </div>

            {loading ? (
                <p className="text-muted">Loading courses...</p>
            ) : courses.length === 0 ? (
                <p className="text-muted">No courses available yet.</p>
            ) : (
                <div className="row g-4">
                    {courses.map((course) => (
                        <div className="col-md-6 col-lg-4" key={course.id}>
                            <div className="card h-100 border-0 shadow-sm course-card">
                                <div className="course-image-wrapper">
                                    <img
                                        src={getCourseImage(course)}
                                        alt={course.title}
                                        className="card-img-top course-banner"
                                        onError={(e) => {
                                            e.target.onerror = null;
                                            e.target.src = "/images/reactjs.png";
                                        }}
                                    />
                                </div>
                                <div className="card-body p-4">
                                    <span className="badge rounded-pill bg-light text-primary mb-3">{course.category || "Learning"}</span>
                                    <h5 className="fw-bold">{course.title}</h5>
                                    <p className="text-muted mt-2">{course.description}</p>
                                </div>
                                <div className="card-footer bg-transparent border-0 px-4 pb-4 pt-0 d-flex justify-content-between align-items-center">
                                    <span className="fw-semibold text-dark">₹ {course.price}</span>
                                    <Link to={`/courses/${course.id}`} className="btn btn-primary btn-sm rounded-pill">
                                        View Details
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

export default Courses;