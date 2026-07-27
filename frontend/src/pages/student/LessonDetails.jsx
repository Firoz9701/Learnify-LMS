import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getLessonById } from "../../services/lessonService";
import { completeLesson } from "../../services/lessonCompletionService";
import { getStudentEnrollments } from "../../services/enrollmentService";

function LessonDetails() {

    const { lessonId } = useParams();

    const [lesson, setLesson] = useState(null);

    const [progress, setProgress] = useState(0);

    useEffect(() => {

        const loadLesson = async () => {

            try {

                const data = await getLessonById(lessonId);

                setLesson(data);

                const user = JSON.parse(localStorage.getItem("user"));

                const enrollments = await getStudentEnrollments(user.id);

                const enrollment = enrollments.find(
                    (e) => e.courseId === data.courseId
                );

                if (enrollment) {
                    setProgress(enrollment.progress);
                }

            } catch (error) {

                console.log(error);

            }

        };

        loadLesson();

    }, [lessonId]);

    if (!lesson) {

        return <h3 className="text-center mt-5">Loading...</h3>;

    }

    const handleCompleteLesson = async () => {

        try {

            const user = JSON.parse(localStorage.getItem("user"));

            await completeLesson(user.id, lesson.id);

            const enrollments = await getStudentEnrollments(user.id);

            const enrollment = enrollments.find(
                (e) => e.courseId === lesson.courseId
            );

            if (enrollment) {
                setProgress(enrollment.progress);
            }

            alert("Lesson completed successfully!");

        } catch (error) {

            if (error.response?.status === 409) {

                alert("You have already completed this lesson.");

            } else {

                console.log(error);

                alert("Unable to complete lesson.");

            }

        }

    };

    return (

        <div className="container mt-5">

            <div className="card shadow">

                <div className="card-body">

                    <h2>{lesson.title}</h2>

                    <hr />

                    <p>{lesson.description}</p>

                    <h5 className="mt-4">Video URL</h5>

                    <div className="ratio ratio-16x9 mt-4">

                        <iframe
                            src={lesson.videoUrl.replace("watch?v=", "embed/")}
                            title={lesson.title}
                            allowFullScreen
                        ></iframe>

                    </div>

                    <button
                        className="btn btn-success"
                        onClick={handleCompleteLesson}
                    >
                        Mark as Completed
                    </button>

                    <div className="mt-4">

                        <h5>Course Progress</h5>

                        <div className="progress">

                            <div
                                className="progress-bar bg-success"
                                role="progressbar"
                                style={{ width: `${progress}%` }}
                            >
                                {progress.toFixed(0)}%
                            </div>

                        </div>

                    </div>

                </div>

            </div>

        </div>

    );

}

export default LessonDetails;