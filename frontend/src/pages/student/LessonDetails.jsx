import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import api from "../../services/api";

function LessonDetails() {

    const { lessonId } = useParams();

    const [lesson, setLesson] = useState(null);

    const [loading, setLoading] = useState(true);

    const [completed, setCompleted] = useState(false);

    const navigate = useNavigate();

    const user = JSON.parse(localStorage.getItem("user"));

    async function loadLesson() {

        try {

            const response =
                await api.get(`/lessons/${lessonId}`);

            setLesson(response.data);

        }

        catch (error) {

            console.error(error);

        }

        finally {

            setLoading(false);

        }

    }

    useEffect(() => {

        loadLesson();

    }, []);

    async function markComplete() {

        try {

            await api.post(

                `/progress/student/${user.id}`,

                {

                    lessonId: Number(lessonId)

                }

            );

            setCompleted(true);

            alert("Lesson completed successfully!");

        }

        catch (error) {

            console.error(error);

            alert(error.response?.data?.message || "Unable to complete lesson.");

        }

    }

    if (loading) {

        return (
            <div className="container py-5">
                Loading lesson...
            </div>
        );

    }

    if (!lesson) {

        return (
            <div className="container py-5">
                Lesson not found.
            </div>
        );

    }

    return (

        <div className="container py-5">

            <h2 className="fw-bold">

                {lesson.title}

            </h2>

            <p className="text-muted">

                Lesson {lesson.lessonOrder}

            </p>

            <div className="ratio ratio-16x9 rounded-4 overflow-hidden shadow my-4">

                <iframe
                    src={lesson.videoUrl.replace("watch?v=", "embed/")}
                    title={lesson.title}
                    allowFullScreen
                />

            </div>

            <div className="card shadow-sm border-0 rounded-4">

                <div className="card-body">

                    <h4 className="mb-3">

                        Lesson Notes

                    </h4>

                    <p>

                        {lesson.content}

                    </p>

                </div>

            </div>

            <div className="d-flex justify-content-between mt-4">

                <Link
                    to={`/student/course/${lesson.courseId}/lessons`}
                    className="btn btn-outline-secondary"
                >

                    Back

                </Link>

                <button
                    className="btn btn-success"
                    onClick={markComplete}
                    disabled={completed}
                >

                    {completed ? "✓ Completed" : "Mark Complete"}

                </button>

            </div>

        </div>

    );

}

export default LessonDetails;