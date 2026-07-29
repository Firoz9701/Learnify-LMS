function Hero() {
    return (
        <section className="hero-section">
            <div className="container py-5">
                <div className="row align-items-center g-5">
                    <div className="col-lg-7">
                        <span className="badge rounded-pill hero-badge">New • AI-Powered Learning</span>
                        <h1 className="display-4 fw-bold text-dark mt-3">
                            Learn faster with a modern LMS built for growth.
                        </h1>
                        <p className="lead text-muted mt-3">
                            Discover expert-led courses, track your progress, and turn knowledge into real-world results with a beautifully simple learning experience.
                        </p>

                        <div className="d-flex flex-wrap gap-3 mt-4">
                            <a href="#courses" className="btn btn-primary btn-lg px-4 rounded-pill hero-btn">
                                Explore Courses
                            </a>
                            <a href="#why-learnify" className="btn btn-outline-secondary btn-lg px-4 rounded-pill hero-btn">
                                Why Learnify
                            </a>
                        </div>

                        <div className="d-flex flex-wrap gap-4 mt-4 text-muted">
                            <div>
                                <strong className="text-dark">10k+</strong>
                                <div className="small">Active learners</div>
                            </div>
                            <div>
                                <strong className="text-dark">250+</strong>
                                <div className="small">Expert-led lessons</div>
                            </div>
                            <div>
                                <strong className="text-dark">4.9/5</strong>
                                <div className="small">Student rating</div>
                            </div>
                        </div>
                    </div>

                    <div className="col-lg-5">
                        <div className="hero-card">
                            <div className="hero-card-content">
                                <div className="hero-icon">📚</div>
                                <h3 className="h5 fw-bold mt-3">Your personalized learning hub</h3>
                                <p className="text-muted mb-3">
                                    Join structured courses, complete lessons, and build skills at your own pace.
                                </p>
                                <ul className="list-unstyled small text-muted">
                                    <li>✓ Live progress dashboard</li>
                                    <li>✓ Career-focused learning paths</li>
                                    <li>✓ Certificates on completion</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

export default Hero;