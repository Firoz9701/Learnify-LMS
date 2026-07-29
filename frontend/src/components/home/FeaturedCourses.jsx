import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getAllCourses, getCourseImage } from "../../services/courseService";

function FeaturedCourses() {

    const [courses, setCourses] = useState([]);

    useEffect(() => {

        const loadCourses = async () => {

            try {

                const data = await getAllCourses(0, 4);

                setCourses(data);

            } catch (error) {

                console.error(error);

            }

        };

        loadCourses();

    }, []);

    return (

        <section className="py-5">

            <div className="container">

                <div className="text-center mb-5">

                    <span className="badge bg-primary-subtle text-primary rounded-pill px-3 py-2">
                        Featured Courses
                    </span>

                    <h2 className="fw-bold mt-3">
                        Learn From Our Most Popular Courses
                    </h2>

                    <p className="text-muted">
                        Start learning with our most loved industry-ready courses.
                    </p>

                </div>

                <div className="row g-4">

                    {courses.map((course) => (

                        <div className="col-md-6 col-lg-3" key={course.id}>

                            <div className="card border-0 shadow-sm course-card h-100">

                                <div className="course-image-wrapper">

                                    <img
                                        src={getCourseImage(course)}
                                        alt={course.title}
                                        className="course-banner"
                                        onError={(e) => {
                                            e.target.onerror = null;
                                            e.target.src = "/images/react.jpg";
                                        }}
                                    />

                                </div>

                                <div className="card-body d-flex flex-column">

                                    <div className="d-flex justify-content-between mb-2">

                                        <span className="badge bg-warning text-dark">
                                            ⭐ 4.9
                                        </span>

                                        <span className="badge bg-light text-dark">
                                            Beginner
                                        </span>

                                    </div>

                                    <h5 className="fw-bold">
                                        {course.title}
                                    </h5>

                                    <p className="text-muted flex-grow-1 featured-description">
                                        {course.description}
                                    </p>

                                    <div className="d-flex justify-content-between align-items-center">

                                        <h5 className="text-primary fw-bold mb-0">
                                            ₹ {course.price}
                                        </h5>

                                        <Link
                                            to={`/courses/${course.id}`}
                                            className="btn btn-primary rounded-pill"
                                        >
                                            View
                                        </Link>

                                    </div>

                                </div>

                            </div>

                        </div>

                    ))}

                </div>

                <div className="text-center mt-5">

                    <Link
                        to="/courses"
                        className="btn btn-outline-primary btn-lg rounded-pill"
                    >
                        View All Courses
                    </Link>

                </div>

            </div>

        </section>

    );

}

export default FeaturedCourses;