import { Link } from "react-router-dom";

function InstructorDashboard() {

    const quickStats = [
        {
            label: "Course Studio",
            value: "Create",
            hint: "Design and launch new course pages"
        },
        {
            label: "Lesson Pipeline",
            value: "Manage",
            hint: "Organize lessons and update sequencing"
        },
        {
            label: "Publishing",
            value: "Control",
            hint: "Review course readiness before release"
        }
    ];

    return (

        <div className="container py-5 instructor-page">

            <div className="hero-card instructor-hero mb-4">

                <h2 className="fw-bold mb-2">Instructor Dashboard</h2>

                <p className="text-muted mb-0">
                    Manage your teaching workspace from one place, from course setup to lesson updates.
                </p>

            </div>

            <div className="row g-4 mb-4">

                {quickStats.map((item) => (

                    <div className="col-md-4" key={item.label}>

                        <div className="card stats-panel h-100 border-0 instructor-stat-card">

                            <div className="card-body">

                                <small className="text-muted d-block mb-2">{item.label}</small>

                                <h4 className="fw-bold mb-1">{item.value}</h4>

                                <p className="text-muted mb-0 small">{item.hint}</p>

                            </div>

                        </div>

                    </div>

                ))}

            </div>

            <div className="row g-4">

                <div className="col-md-6">

                    <div className="card border-0 shadow-sm h-100 instructor-action-card">

                        <div className="card-body p-4 d-flex flex-column">

                            <p className="instructor-kicker mb-2">Workspace</p>

                            <h4 className="fw-bold">Manage Courses</h4>

                            <p className="text-muted flex-grow-1">
                                Create, edit, and control publish visibility for your course catalog.
                            </p>

                            <Link
                                to="/instructor/courses"
                                className="btn btn-primary align-self-start"
                            >
                                Open Course Manager
                            </Link>

                        </div>

                    </div>

                </div>

                <div className="col-md-6">

                    <div className="card border-0 shadow-sm h-100 instructor-action-card">

                        <div className="card-body p-4 d-flex flex-column">

                            <p className="instructor-kicker mb-2">Workspace</p>

                            <h4 className="fw-bold">Manage Lessons</h4>

                            <p className="text-muted flex-grow-1">
                                Build lesson content, update sequence order, and maintain your learning flow.
                            </p>

                            <Link
                                to="/instructor/lessons"
                                className="btn btn-primary align-self-start"
                            >
                                Open Lesson Manager
                            </Link>

                        </div>

                    </div>

                </div>

            </div>

        </div>

    );

}

export default InstructorDashboard;