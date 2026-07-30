import { useCallback, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getCourseById, getCourseImage } from "../services/courseService";
import { enroll, getMyEnrollments } from "../services/enrollmentService";

function CourseDetails() {

    const { id } = useParams();

    const [course, setCourse] = useState(null);
    const [isEnrolled, setIsEnrolled] = useState(false);
    const [checkingEnrollment, setCheckingEnrollment] = useState(true);

    const refreshEnrollmentStatus = useCallback(async () => {

        const user = JSON.parse(localStorage.getItem("user"));

        if (!user || user.role !== "ROLE_STUDENT") {
            setIsEnrolled(false);
            return;
        }

        try {
            const enrollments = await getMyEnrollments();
            const enrolled = enrollments.some(
                (item) => String(item.courseId) === String(id)
            );
            setIsEnrolled(enrolled);
        } catch (error) {
            console.log(error);
            setIsEnrolled(false);
        }
    }, [id]);

    useEffect(() => {

        const fetchCourse = async () => {

            const user = JSON.parse(localStorage.getItem("user"));

            try {

                const data = await getCourseById(id);

                setCourse(data);

                if (user && user.role === "ROLE_STUDENT") {
                    await refreshEnrollmentStatus();
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

    }, [id, refreshEnrollmentStatus]);

    const handleEnroll = async () => {

        const user = JSON.parse(localStorage.getItem("user"));

        if (!user) {

            alert("Please login first.");

            return;

        }

        if (user.role !== "ROLE_STUDENT") {
            alert("Only student accounts can enroll in courses.");
            return;
        }

        try {

            await enroll(course.id);

            await refreshEnrollmentStatus();

            alert("Enrollment Successful!");

        }

        catch (error) {

            console.log(error);

            alert(
                error.response?.data?.message ||
                "Something went wrong."
            );

            if ((error.response?.data?.message || "").toLowerCase().includes("already enrolled")) {
                setIsEnrolled(true);
            }

        }

    };

    if (!course) {
        return (
            <div className="container py-5">
                <div className="hero-card course-details-hero text-center">
                    <h3 className="fw-bold mb-2">Loading course details...</h3>
                    <p className="text-muted mb-0">Please wait while we fetch course information.</p>
                </div>
            </div>
        );
    }

    return (

        <div className="container py-5">

            <div className="hero-card course-details-hero mb-4">
                <div className="d-flex justify-content-between align-items-start flex-wrap gap-3">
                    <div>
                        <p className="instructor-kicker mb-2">Course Overview</p>
                        <h2 className="fw-bold mb-2">{course.title}</h2>
                        <p className="text-muted mb-0">
                            Learn with structured lessons, guided practice, and a quiz after enrollment.
                        </p>
                    </div>
                    <span className={`badge ${course.published ? "text-bg-success" : "text-bg-secondary"}`}>
                        {course.published ? "Published" : "Draft"}
                    </span>
                </div>
            </div>

            <div className="row g-4">

                {/* Left Side */}
                <div className="col-lg-8">

                    <div className="card shadow-sm border-0 course-details-main">

                        <div className="card-body p-4 p-lg-5">

                            <h4 className="fw-bold mb-3">About This Course</h4>

                            <p className="text-muted mb-4">
                                {course.description}
                            </p>

                            <div className="course-learn-box mb-4">

                                <h5 className="fw-bold mb-3">What you will learn</h5>

                                <ul className="course-learn-list mb-0">

                                    <li>Complete understanding of this course.</li>

                                    <li>Hands-on practical examples.</li>

                                    <li>Real-world project implementation.</li>

                                    <li>Certificate after completion.</li>

                                </ul>

                            </div>

                            <div className="course-quiz-panel">
                                <h5 className="fw-bold mb-2">Assessment & Practice</h5>
                                <p className="text-muted mb-0">
                                    Quiz and practice exercises are available inside the learning page after enrollment.
                                </p>
                            </div>

                            {checkingEnrollment ? (
                                <div className="alert alert-light mt-4 mb-0">Checking enrollment status...</div>
                            ) : isEnrolled ? (
                                <div className="alert alert-success mt-4 mb-0">
                                    You are enrolled. Open this course from My Courses to access lessons, quiz, and practice exercises.
                                </div>
                            ) : (
                                <div className="alert alert-warning mt-4 mb-0">
                                    Enroll in this course as a student to unlock lessons, quiz, and practice exercises in My Courses.
                                </div>
                            )}

                        </div>

                    </div>

                </div>

                {/* Right Side */}

                <div className="col-lg-4">

                    <div className="card shadow-sm border-0 course-details-side">

                        <div className="card-body p-4">

                            <div className="course-image-wrapper mb-3">
                                <img
                                    src={getCourseImage(course)}
                                    className="course-banner"
                                    alt={course.title}
                                    onError={(e) => { e.target.onerror = null; e.target.src = "/images/reactjs.png" }}
                                />
                            </div>

                            <div className="d-flex align-items-center justify-content-between mb-3">
                                <span className="text-muted">Price</span>
                                <h3 className="text-success fw-bold mb-0">

                                    ₹ {course.price}

                                </h3>
                            </div>

                            <button
                                className="btn btn-primary w-100"
                                onClick={handleEnroll}
                                disabled={isEnrolled}
                            >

                                {isEnrolled ? "Enrolled" : "Enroll Now"}

                            </button>

                            <div className="course-perks mt-4">
                                <div className="course-perk-item">📚 Lifetime Access</div>
                                <div className="course-perk-item">🎥 Video Lessons</div>
                                <div className="course-perk-item">📝 Practice Exercises</div>
                                <div className="course-perk-item">🏆 Completion Certificate</div>
                            </div>

                        </div>

                    </div>

                </div>

            </div>

        </div>

    );

}

export default CourseDetails;