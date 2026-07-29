import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getCourseById, getCourseImage } from "../services/courseService";
import Quiz from "../components/course/Quiz";
import { enrollStudent } from "../services/enrollmentService";

function CourseDetails() {

    const { id } = useParams();

    const [course, setCourse] = useState(null);

    useEffect(() => {

        const fetchCourse = async () => {

            try {

                const data = await getCourseById(id);

                setCourse(data);

            } catch (error) {

                console.log(error);

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

                            <Quiz courseId={course.id} courseTitle={course.title} />

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