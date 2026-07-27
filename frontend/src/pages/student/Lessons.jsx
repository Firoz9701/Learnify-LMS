import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { getLessonsByCourse } from "../../services/lessonService";

function Lessons() {

    const { courseId } = useParams();

    const [lessons, setLessons] = useState([]);

    useEffect(() => {

        const loadLessons = async () => {

            try {

                const data = await getLessonsByCourse(courseId);

                setLessons(data);

            } catch (error) {

                console.log(error);

            }

        };

        loadLessons();

    }, [courseId]);

    return (

        <div className="container mt-5">

            <h2 className="mb-4">Course Lessons</h2>

            {lessons.length === 0 ? (

                <p>No lessons available.</p>

            ) : (

                <div className="list-group">

                    {lessons.map((lesson) => (

                        <Link
                            key={lesson.id}
                            to={`/student/lesson/${lesson.id}`}
                            className="list-group-item list-group-item-action"
                        >

                            <strong>
                                Lesson {lesson.lessonOrder}
                            </strong>

                            <br />

                            {lesson.title}

                        </Link>

                    ))}

                </div>

            )}

        </div>

    );
}

export default Lessons;