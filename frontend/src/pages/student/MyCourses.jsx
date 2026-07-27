import { useEffect, useState } from "react";
import { getStudentEnrollments } from "../../services/enrollmentService";

import { Link } from "react-router-dom";

function MyCourses() {

    const [enrollments, setEnrollments] = useState([]);

    useEffect(() => {

        const loadEnrollments = async () => {

            try {

                const user = JSON.parse(localStorage.getItem("user"));

                const data = await getStudentEnrollments(user.id);

                setEnrollments(data);

            } catch (error) {

                console.log(error);

            }

        };

        loadEnrollments();

    }, []);

    return (

        <div className="container mt-5">

            <h2 className="mb-4">My Courses</h2>

            {enrollments.length === 0 ? (

                <p>You haven't enrolled in any courses yet.</p>

            ) : (

                <div className="row">

                    {enrollments.map((enrollment) => (

                        <div
                            className="col-md-4 mb-4"
                            key={enrollment.id}
                        >

                            <div className="card h-100 shadow-sm">

                                <div className="card-body">

                                    <Link
                                        to={`/student/course/${enrollment.courseId}/lessons`}
                                        className="text-decoration-none"
                                    >
                                        <h5 className="card-title">
                                            {enrollment.courseTitle}
                                        </h5>
                                    </Link>

                                    <p className="mb-2">
                                        <strong>Progress:</strong> {enrollment.progress.toFixed(0)}%
                                    </p>

                                    <div className="progress">
                                        <div
                                            className="progress-bar bg-success"
                                            role="progressbar"
                                            style={{ width: `${enrollment.progress}%` }}
                                            aria-valuenow={enrollment.progress}
                                            aria-valuemin="0"
                                            aria-valuemax="100"
                                        >
                                            {enrollment.progress.toFixed(0)}%
                                        </div>
                                    </div>

                                    <p>

                                        <strong>Enrolled On:</strong><br />

                                        {new Date(
                                            enrollment.enrolledAt
                                        ).toLocaleDateString()}

                                    </p>

                                </div>

                            </div>

                        </div>

                    ))}

                </div>

            )}

        </div>

    );

}

export default MyCourses;