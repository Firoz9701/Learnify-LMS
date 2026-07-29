const highlights = [
    {
        title: "Structured learning",
        description: "Follow guided lessons and milestones that keep your progress clear and motivating."
    },
    {
        title: "Flexible pace",
        description: "Learn whenever it fits your schedule with content designed for real life."
    },
    {
        title: "Skill-focused outcomes",
        description: "Build practical knowledge that translates into career-ready confidence."
    }
];

function WhyLearnify() {
    return (
        <section id="why-learnify" className="py-5 section-soft">
            <div className="container">
                <div className="row align-items-center g-5">
                    <div className="col-lg-5">
                        <p className="text-primary fw-semibold mb-2">Why Learnify</p>
                        <h2 className="h3 fw-bold">A learning experience designed to help you stay consistent</h2>
                        <p className="text-muted mt-3">
                            From first lesson to final certification, Learnify keeps the experience simple, engaging, and focused on momentum.
                        </p>
                    </div>
                    <div className="col-lg-7">
                        <div className="row g-4">
                            {highlights.map((item) => (
                                <div className="col-md-6" key={item.title}>
                                    <div className="p-4 rounded-4 bg-white shadow-sm h-100">
                                        <div className="feature-icon">✦</div>
                                        <h3 className="h6 fw-bold mt-3">{item.title}</h3>
                                        <p className="text-muted mb-0">{item.description}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

export default WhyLearnify;