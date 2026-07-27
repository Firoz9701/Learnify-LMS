import { useEffect, useState } from "react";
import { getStudentEnrollments } from "../../services/enrollmentService";

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

                                    <h5 className="card-title">

                                        {enrollment.courseTitle}

                                    </h5>

                                    <p>

                                        <strong>Progress:</strong>{" "}
                                        {enrollment.progress}%

                                    </p>

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