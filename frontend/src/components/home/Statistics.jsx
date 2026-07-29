const stats = [
    { value: "98%", label: "Course completion rate" },
    { value: "24/7", label: "Access to lessons" },
    { value: "1.2k", label: "New enrollments monthly" }
];

function Statistics() {
    return (
        <section className="py-5">
            <div className="container">
                <div className="stats-panel p-4 p-lg-5 rounded-4">
                    <div className="row g-4 text-center">
                        {stats.map((stat) => (
                            <div className="col-md-4" key={stat.label}>
                                <div className="py-3">
                                    <div className="display-6 fw-bold text-dark">{stat.value}</div>
                                    <div className="text-muted mt-2">{stat.label}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}

export default Statistics;