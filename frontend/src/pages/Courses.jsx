import { useEffect, useState } from "react";
import { getAllCourses } from "../services/courseService";
import { Link } from "react-router-dom";

function Courses() {

    const [courses, setCourses] = useState([]);

    useEffect(() => {

        const fetchCourses = async () => {

            try {

                const data = await getAllCourses();

                setCourses(data);

            } catch (error) {

                console.log(error);

            }

        };

        fetchCourses();

    }, []);

    return (

        <div className="container mt-5">

            <h2 className="mb-4">All Courses</h2>

            <div className="row">

                {courses.map(course => (

                    <div
                        className="col-md-4 mb-4"
                        key={course.id}>

                        <div className="card h-100">

                            <div className="card-body">

                                <h5>{course.title}</h5>

                                <p>{course.description}</p>

                                <h6>₹ {course.price}</h6>

                                <Link
                                    to={`/courses/${course.id}`}
                                    className="btn btn-primary"
                                >
                                    View Details
                                </Link>

                            </div>

                        </div>

                    </div>

                ))}

            </div>

        </div>

    );
}

export default Courses;