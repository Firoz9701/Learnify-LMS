import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../../services/api";

function Lessons() {

    const { courseId } = useParams();

    const [lessons, setLessons] = useState([]);
    const [completedLessons, setCompletedLessons] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {

        loadLessons();

    }, [courseId]);

    const loadLessons = async () => {

        try {

            const response =
                await api.get(`/lessons/course/${courseId}`);

            setLessons(response.data);

            const progressResponse =
                await api.get("/progress");

            setCompletedLessons(
                progressResponse.data.map(progress => progress.lessonId)
            );

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

                {lessons.map((lesson, index) => {

                    const completed =
                        completedLessons.includes(lesson.id);

                    const unlocked =
                        index === 0 ||
                        completedLessons.includes(lessons[index - 1].id);

                    return (

                        <Link
                            key={lesson.id}
                            to={unlocked ? `/student/lesson/${lesson.id}` : "#"}
                            onClick={(e) => {
                                if (!unlocked) {
                                    e.preventDefault();
                                    alert("Complete the previous lesson first.");
                                }
                            }}
                            className={`list-group-item list-group-item-action d-flex justify-content-between align-items-center py-4 ${!unlocked ? "disabled" : ""}`}
                        >

                            <div>

                                <h5 className="mb-1">
                                    Lesson {lesson.lessonOrder}
                                </h5>

                                <p className="mb-0 text-muted">
                                    {lesson.title}
                                </p>

                            </div>

                            <span
                                className={`btn ${completed
                                    ? "btn-success"
                                    : unlocked
                                        ? "btn-outline-primary"
                                        : "btn-secondary"
                                    }`}
                            >
                                {completed
                                    ? "Completed ✓"
                                    : unlocked
                                        ? "Watch →"
                                        : "Locked 🔒"}
                            </span>

                        </Link>

                    );

                })}

            </div>

        </div>

    );

}

export default Lessons;