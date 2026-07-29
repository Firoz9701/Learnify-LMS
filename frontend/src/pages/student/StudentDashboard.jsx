import { useEffect, useState, useContext } from "react";
import { getStudentDashboard, getMyCourses } from "../../services/dashboardService";
import { Link } from "react-router-dom";
import AuthContext from "../../context/AuthContext";
import { getMyAttempts } from "../../services/quizService";

function StudentDashboard() {

    const [dashboard, setDashboard] = useState(null);

    const [courses, setCourses] = useState([]);

    useEffect(() => {

        const loadDashboard = async () => {

            try {

                const user = JSON.parse(localStorage.getItem("user"));

                const data = await getStudentDashboard(user.id);

                setDashboard(data);

                const enrolledCourses = await getMyCourses(user.id);

                setCourses(enrolledCourses);

            } catch (error) {

                console.log(error);

            }

        };

        loadDashboard();

    }, []);

    if (!dashboard) {

        return <h3 className="text-center mt-5">Loading...</h3>;

    }

    const user = JSON.parse(localStorage.getItem("user"));

    return (

        <div className="container mt-4">

            {/* Welcome Banner */}

            <div className="p-5 mb-4 bg-primary text-white rounded shadow">

                <h2>👋 Welcome Back, {user.firstName}!</h2>

                <p className="mb-3">
                    Keep learning every day and track your progress.
                </p>

                <a
                    href="/courses"
                    className="btn btn-light"
                >
                    Browse Courses
                </a>

            </div>

            {/* Statistics */}

            <div className="row g-4">

                <div className="col-md-4">

                    <div className="card border-0 shadow h-100">

                        <div className="card-body text-center">

                            <h1>📚</h1>

                            <h5>Enrolled Courses</h5>

                            <h2>{dashboard.enrolledCourses}</h2>

                        </div>

                    </div>

                </div>

                <div className="col-md-4">

                    <div className="card border-0 shadow h-100">

                        <div className="card-body text-center">

                            <h1>🎯</h1>

                            <h5>Completed Lessons</h5>

                            <h2>{dashboard.completedLessons}</h2>

                        </div>

                    </div>

                </div>

                <div className="col-md-4">

                    <div className="card border-0 shadow h-100">

                        <div className="card-body text-center">

                            <h1>📈</h1>

                            <h5>Overall Progress</h5>

                            <h2>{dashboard.overallProgress.toFixed(0)}%</h2>

                        </div>

                    </div>

                </div>

            </div>

            {/* Progress */}

            <div className="card shadow mt-5">

                <div className="card-body">

                    <h4>Overall Progress</h4>

                    <div
                        className="progress mt-3"
                        style={{ height: "30px" }}
                    >

                        <div
                            className="progress-bar bg-success progress-bar-striped progress-bar-animated"
                            style={{
                                width: `${dashboard.overallProgress}%`
                            }}
                        >
                            {dashboard.overallProgress.toFixed(0)}%

                        </div>

                    </div>

                </div>

            </div>

            {/* Enrolled Courses */}

            <div className="mt-5">

                <h3 className="mb-4">

                    Continue Learning

                </h3>

                <div className="row">

                    {courses.map((course) => (

                        <div
                            className="col-md-4"
                            key={course.id}
                        >

                            <div className="card shadow">

                                <div className="card-body">

                                    <h5>

                                        {course.courseTitle}

                                    </h5>

                                    <p>

                                        Progress {course.progress}%

                                    </p>

                                    <div className="progress mb-3">

                                        <div
                                            className="progress-bar"
                                            style={{
                                                width: `${course.progress}%`
                                            }}
                                        >

                                            {course.progress}%

                                        </div>

                                    </div>

                                    <Link
                                        to={`/courses/${course.courseId}`}
                                        className="btn btn-primary"
                                    >
                                        Continue Learning
                                    </Link>

                                </div>

                            </div>

                        </div>

                    ))}

                </div>

            </div>

            {/* Recent Quizzes */}
            <div className="mt-5">
                <h3 className="mb-4">Recent Quizzes</h3>

                <div className="row">
                    <div className="col-md-6">
                        <div className="card shadow p-3">
                            <div className="card-body">
                                <h5 className="card-title">Saved Quiz Results</h5>
                                <QuizResults />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

        </div>

    );

}

export default StudentDashboard;

function QuizResults() {
    const [results, setResults] = useState([]);
    const { user } = useContext(AuthContext);

    useEffect(() => {
        const load = async () => {
            if (user && user.email) {
                try {
                    const res = await getMyAttempts();
                    const data = res.data;
                    if (Array.isArray(data) && data.length) {
                        const mapped = data.map((d) => ({ courseId: d.courseId, score: d.score, timestamp: new Date(d.attemptedAt).getTime() }));
                        setResults(mapped.slice(0, 10));
                        return;
                    }
                } catch (e) {
                    console.log('Failed to load server quiz attempts', e);
                }
            }

            // Fallback to localStorage
            const items = [];
            for (const key in localStorage) {
                if (Object.prototype.hasOwnProperty.call(localStorage, key) && key.startsWith('quizResult_')) {
                    try {
                        const val = JSON.parse(localStorage.getItem(key));
                        const courseId = key.replace('quizResult_', '');
                        items.push({ courseId, score: val.score, timestamp: val.timestamp });
                    } catch (e) { }
                }
            }

            items.sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0));
            setResults(items.slice(0, 10));
        };

        load();
    }, [user]);

    if (results.length === 0) return <div className="text-muted">No quiz attempts saved yet.</div>;

    return (
        <div>
            <ul className="list-group list-group-flush">
                {results.map((r) => (
                    <li className="list-group-item d-flex justify-content-between align-items-center" key={r.courseId}>
                        <div>Course #{r.courseId}</div>
                        <div><strong>{r.score}%</strong></div>
                    </li>
                ))}
            </ul>
        </div>
    );
}