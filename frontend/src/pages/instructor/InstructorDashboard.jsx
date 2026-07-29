import { Link } from "react-router-dom";

function InstructorDashboard() {

    return (

        <div className="container mt-4">

            <div className="p-5 bg-success text-white rounded shadow">

                <h2>👨‍🏫 Instructor Dashboard</h2>

                <p>
                    Manage your courses and lessons from one place.
                </p>

            </div>

            <div className="row mt-4">

                <div className="col-md-6">

                    <div className="card shadow">

                        <div className="card-body text-center">

                            <h1>📚</h1>

                            <h4>Manage Courses</h4>

                            <p>
                                Create, edit and delete courses.
                            </p>

                            <Link
                                to="/instructor/courses"
                                className="btn btn-success"
                            >
                                Open
                            </Link>

                        </div>

                    </div>

                </div>

                <div className="col-md-6">

                    <div className="card shadow">

                        <div className="card-body text-center">

                            <h1>🎥</h1>

                            <h4>Manage Lessons</h4>

                            <p>
                                Create and update lessons.
                            </p>

                            <Link
                                to="/instructor/lessons"
                                className="btn btn-success"
                            >
                                Open
                            </Link>

                        </div>

                    </div>

                </div>

            </div>

        </div>

    );

}

export default InstructorDashboard;