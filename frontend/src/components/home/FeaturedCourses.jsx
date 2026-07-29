import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getAllCourses, getCourseImage } from "../../services/courseService";

function FeaturedCourses() {
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCourses = async () => {
            try {
                const data = await getAllCourses(0, 6);
                setCourses(data.slice(0, 6));
            } catch (error) {
                console.error("Failed to load featured courses", error);
                setCourses([]);
            } finally {
                setLoading(false);
            }
        };

        fetchCourses();
    }, []);

    return (
        <section id="courses" className="py-5 bg-white">
            <div className="container">
                <div className="d-flex justify-content-between align-items-center flex-wrap gap-3 mb-4">
                    <div>
                        <p className="text-primary fw-semibold mb-1">Featured courses</p>
                        <h2 className="h3 fw-bold">Trending learning paths for today’s builders</h2>
                    </div>
                    <Link to="/courses" className="text-decoration-none fw-semibold">
                        View all courses
                    </Link>
                </div>

                {loading ? (
                    <p className="text-muted">Loading featured courses...</p>
                ) : courses.length === 0 ? (
                    <p className="text-muted">No courses are available right now.</p>
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
                                        <span className="badge rounded-pill bg-light text-primary mb-3">{course.category || "Featured"}</span>
                                        <h3 className="h5 fw-bold">{course.title}</h3>
                                        <p className="text-muted mt-2">{course.description}</p>
                                    </div>
                                    <div className="card-footer bg-transparent border-0 px-4 pb-4 pt-0 d-flex justify-content-between align-items-center text-muted small">
                                        <span className="fw-semibold text-dark">₹ {course.price}</span>
                                        <Link to={`/courses/${course.id}`} className="text-decoration-none fw-semibold text-primary">
                                            View details
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </section>
    );
}

export default FeaturedCourses;