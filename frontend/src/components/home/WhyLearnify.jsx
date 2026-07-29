function WhyLearnify() {

    const features = [

        {
            icon: "📚",
            title: "Industry Ready Courses",
            description:
                "Learn Java, Spring Boot, React, Docker, AWS and more with practical projects."
        },

        {
            icon: "👨‍🏫",
            title: "Expert Instructors",
            description:
                "Courses are designed to help you become job-ready with real-world knowledge."
        },

        {
            icon: "🏆",
            title: "Certificates",
            description:
                "Receive a certificate after successfully completing each course."
        },

        {
            icon: "⏰",
            title: "Learn Anytime",
            description:
                "Study anywhere, anytime with lifetime access to your enrolled courses."
        }

    ];

    return (

        <section className="py-5 section-soft">

            <div className="container">

                <div className="text-center mb-5">

                    <span className="badge bg-primary-subtle text-primary rounded-pill px-3 py-2">
                        Why Learnify?
                    </span>

                    <h2 className="fw-bold mt-3">
                        Everything You Need To Learn Better
                    </h2>

                    <p className="text-muted">
                        Learn modern technologies through structured, practical,
                        and industry-focused courses.
                    </p>

                </div>

                <div className="row g-4">

                    {features.map((feature, index) => (

                        <div className="col-md-6 col-lg-3" key={index}>

                            <div className="card border-0 shadow-sm h-100 feature-card">

                                <div className="card-body text-center p-4">

                                    <div className="feature-icon mx-auto mb-3">

                                        {feature.icon}

                                    </div>

                                    <h5 className="fw-bold">

                                        {feature.title}

                                    </h5>

                                    <p className="text-muted mb-0">

                                        {feature.description}

                                    </p>

                                </div>

                            </div>

                        </div>

                    ))}

                </div>

            </div>

        </section>

    );

}

export default WhyLearnify;