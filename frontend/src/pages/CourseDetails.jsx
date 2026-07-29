import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getCourseById, getCourseImage } from "../services/courseService";
import Quiz from "../components/course/Quiz";
import { enrollStudent, getStudentEnrollments } from "../services/enrollmentService";

function CourseDetails() {

    const { id } = useParams();

    const [course, setCourse] = useState(null);
    const [isEnrolled, setIsEnrolled] = useState(false);
    const [checkingEnrollment, setCheckingEnrollment] = useState(true);

    useEffect(() => {

        const fetchCourse = async () => {

            const user = JSON.parse(localStorage.getItem("user"));

            try {

                const data = await getCourseById(id);

                setCourse(data);

                if (user && user.role === "ROLE_STUDENT") {
                    const enrollments = await getStudentEnrollments(user.id);
                    const enrolled = enrollments.some((item) => String(item.courseId) === String(id));
                    setIsEnrolled(enrolled);
                } else {
                    setIsEnrolled(false);
                }

            } catch (error) {

                console.log(error);

            } finally {

                setCheckingEnrollment(false);

            }

        };

        fetchCourse();

    }, [id]);

    const handleEnroll = async () => {

        const user = JSON.parse(localStorage.getItem("user"));

        if (!user) {

            alert("Please login first.");

            return;

        }

        try {

            await enrollStudent(user.id, course.id);

            setIsEnrolled(true);

            alert("Enrollment Successful!");

        } catch (error) {

            console.log(error);

            alert(
                error.response?.data?.message ||
                "Something went wrong."
            );

        }

    };

    if (!course) {
        return <h3 className="text-center mt-5">Loading...</h3>;
    }

    return (

        <div className="container mt-5">

            <div className="row">

                {/* Left Side */}
                <div className="col-lg-8">

                    <div className="card shadow-sm">

                        <div className="card-body">

                            <h2 className="fw-bold">
                                {course.title}
                            </h2>

                            <hr />

                            <p className="text-muted">
                                {course.description}
                            </p>

                            <div className="mt-4">

                                <h5>What you'll learn</h5>

                                <ul>

                                    <li>Complete understanding of this course.</li>

                                    <li>Hands-on practical examples.</li>

                                    <li>Real-world project implementation.</li>

                                    <li>Certificate after completion.</li>

                                </ul>

                            </div>

                            {checkingEnrollment ? (
                                <div className="alert alert-light mt-4 mb-0">Checking quiz access...</div>
                            ) : isEnrolled ? (
                                <Quiz courseId={course.id} courseTitle={course.title} />
                            ) : (
                                <div className="alert alert-warning mt-4 mb-0">
                                    Enroll in this course as a student to unlock the quiz.
                                </div>
                            )}

                        </div>

                    </div>

                </div>

                {/* Right Side */}

                <div className="col-lg-4">

                    <div className="card shadow">

                        <div className="card-body text-center">

                            <div className="course-image-wrapper mb-3">
                                <img
                                    src={getCourseImage(course)}
                                    className="course-banner"
                                    alt={course.title}
                                    onError={(e) => { e.target.onerror = null; e.target.src = "/images/reactjs.png" }}
                                />
                            </div>

                            <h3 className="text-success">

                                ₹ {course.price}

                            </h3>

                            <button
                                className="btn btn-success w-100 mt-3"
                                onClick={handleEnroll}
                            >

                                Enroll Now

                            </button>

                            <hr />

                            <p>

                                📚 Lifetime Access

                            </p>

                            <p>

                                🎥 Video Lessons

                            </p>

                            <p>

                                📝 Practice Exercises

                            </p>

                            <p>

                                🏆 Completion Certificate

                            </p>

                        </div>

                    </div>

                </div>

            </div>

        </div>

    );

}

export default CourseDetails;