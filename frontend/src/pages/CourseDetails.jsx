import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getCourseById } from "../services/courseService";
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

        try {

            const user = JSON.parse(localStorage.getItem("user"));

            await enrollStudent(user.id, course.id);

            alert("Enrollment Successful!");

        } catch (error) {

            console.log(error);

            alert(error.response.data.message);

        }

    };

    if (!course) {
        return <h3 className="text-center mt-5">Loading...</h3>;
    }

    return (

        <div className="container mt-5">

            <div className="card">

                <div className="card-body">

                    <h2>{course.title}</h2>

                    <hr />

                    <p>
                        <strong>Description:</strong><br />
                        {course.description}
                    </p>

                    <h5>Price: ₹ {course.price}</h5>

                    <p>Course ID: {course.id}</p>

                    <button className="btn btn-success mt-3" onClick={handleEnroll}>
                        Enroll Now
                    </button>

                </div>

            </div>

        </div>

    );

}

export default CourseDetails;