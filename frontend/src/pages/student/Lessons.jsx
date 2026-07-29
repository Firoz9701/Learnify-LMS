import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../../services/api";

function Lessons() {

    const { courseId } = useParams();

    const [lessons, setLessons] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadLessons();
    }, []);

    const loadLessons = async () => {

        try {

            const response =
                await api.get(`/lessons/course/${courseId}`);

            setLessons(response.data);

        } catch (error) {

            console.error(error);

        } finally {

            setLoading(false);

        }

    };

    if (loading) {

        return (
            <div className="container py-5">
                Loading lessons...
            </div>
        );

    }

    return (

        <div className="container py-5">

            <div className="mb-5">

                <h2 className="fw-bold">
                    Course Lessons
                </h2>

                <p className="text-muted">
                    Complete lessons in order.
                </p>

            </div>

            <div className="list-group shadow-sm rounded-4">

                {lessons.map((lesson) => (

                    <Link
                        key={lesson.id}
                        to={`/student/lesson/${lesson.id}`}
                        className="list-group-item list-group-item-action d-flex justify-content-between align-items-center py-4"
                    >

                        <div>

                            <h5 className="mb-1">

                                Lesson {lesson.lessonOrder}

                            </h5>

                            <p className="mb-0 text-muted">

                                {lesson.title}

                            </p>

                        </div>

                        <span className="btn btn-outline-primary">

                            Watch →

                        </span>

                    </Link>

                ))}

            </div>

        </div>

    );

}

export default Lessons;