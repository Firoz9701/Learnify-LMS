import { Link } from "react-router-dom";

function Hero() {
    return (
        <section className="hero-section">
            <div className="container">

                <div className="row align-items-center gy-5">

                    <div className="col-lg-6">

                        <span className="badge hero-badge rounded-pill mb-3">
                            🚀 Learn Without Limits
                        </span>

                        <h1 className="display-4 fw-bold mb-4">
                            Master Modern Tech Skills
                            <span className="text-primary"> with Learnify</span>
                        </h1>

                        <p className="lead text-muted mb-4">
                            Build real-world projects in Java, Spring Boot,
                            React, Python, Docker, AWS and much more.
                            Learn from industry-focused courses designed to
                            make you job-ready.
                        </p>

                        <div className="d-flex flex-wrap gap-3">

                            <Link
                                to="/courses"
                                className="btn btn-primary btn-lg rounded-pill hero-btn"
                            >
                                Explore Courses
                            </Link>

                            <Link
                                to="/register"
                                className="btn btn-outline-primary btn-lg rounded-pill hero-btn"
                            >
                                Get Started
                            </Link>

                        </div>

                        <div className="row mt-5">

                            <div className="col-4 text-center">

                                <h3 className="fw-bold text-primary">
                                    12+
                                </h3>

                                <small className="text-muted">
                                    Courses
                                </small>

                            </div>

                            <div className="col-4 text-center">

                                <h3 className="fw-bold text-primary">
                                    1200+
                                </h3>

                                <small className="text-muted">
                                    Students
                                </small>

                            </div>

                            <div className="col-4 text-center">

                                <h3 className="fw-bold text-primary">
                                    4.9★
                                </h3>

                                <small className="text-muted">
                                    Rating
                                </small>

                            </div>

                        </div>

                    </div>

                    <div className="col-lg-6">

                        <div className="hero-card">

                            <div className="hero-card-content">

                                <div className="d-flex align-items-center mb-4">

                                    <div className="hero-icon">
                                        🎓
                                    </div>

                                    <div className="ms-3">

                                        <h5 className="mb-1">
                                            Learn Smarter
                                        </h5>

                                        <small className="text-muted">
                                            Industry-ready learning platform
                                        </small>

                                    </div>

                                </div>

                                <div className="row g-3">

                                    <div className="col-6">
                                        <div className="card border-0 shadow-sm p-3 text-center">
                                            <h3 className="text-primary fw-bold">
                                                12+
                                            </h3>
                                            <small>Premium Courses</small>
                                        </div>
                                    </div>

                                    <div className="col-6">
                                        <div className="card border-0 shadow-sm p-3 text-center">
                                            <h3 className="text-success fw-bold">
                                                25+
                                            </h3>
                                            <small>Lessons</small>
                                        </div>
                                    </div>

                                    <div className="col-6">
                                        <div className="card border-0 shadow-sm p-3 text-center">
                                            <h3 className="text-warning fw-bold">
                                                95%
                                            </h3>
                                            <small>Completion Rate</small>
                                        </div>
                                    </div>

                                    <div className="col-6">
                                        <div className="card border-0 shadow-sm p-3 text-center">
                                            <h3 className="text-danger fw-bold">
                                                ∞
                                            </h3>
                                            <small>Lifetime Access</small>
                                        </div>
                                    </div>

                                </div>

                            </div>

                        </div>

                    </div>

                </div>

            </div>
        </section>
    );
}

export default Hero;