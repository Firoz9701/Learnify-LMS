import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../../services/api";
import { getCourseById } from "../../services/courseService";
import Quiz from "../../components/course/Quiz";

function Lessons() {

    const { courseId } = useParams();

    const [lessons, setLessons] = useState([]);
    const [completedLessons, setCompletedLessons] = useState([]);
    const [loading, setLoading] = useState(true);
    const [courseTitle, setCourseTitle] = useState("");
    const [exerciseChecksByCourse, setExerciseChecksByCourse] = useState(() => {
        try {
            const saved = localStorage.getItem("practiceExerciseMap");
            return saved ? JSON.parse(saved) : {};
        } catch (error) {
            console.log("Failed to parse practice exercise storage", error);
            return {};
        }
    });

    const exerciseChecks = exerciseChecksByCourse[courseId] || {};

    const getPracticeExercises = (title) => {

        const key = (title || "").toLowerCase();

        if (key.includes("react")) {
            return [
                "Build a reusable card component with props for title and description.",
                "Create a small form with validation for required fields.",
                "Use useEffect to fetch and display a list from a public API."
            ];
        }

        if (key.includes("java") || key.includes("spring")) {
            return [
                "Design a REST endpoint with request validation and proper status codes.",
                "Create a service method and unit-test at least one success scenario.",
                "Map DTOs to entities and persist a sample record using repository methods."
            ];
        }

        if (key.includes("python")) {
            return [
                "Write a function with input validation and docstring.",
                "Parse a small JSON payload and transform it to a new structure.",
                "Create a script that reads data and prints a summary report."
            ];
        }

        return [
            "Summarize one key concept from this course in your own words.",
            "Build one mini-task that applies the chapter you just studied.",
            "Review your result and note one improvement for the next attempt."
        ];
    };

    useEffect(() => {

        loadLessons();

    }, [courseId]);

    const loadLessons = async () => {

        try {

            const [lessonsResponse, progressResponse, courseResponse] = await Promise.all([
                api.get(`/lessons/course/${courseId}`),
                api.get("/progress"),
                getCourseById(courseId)
            ]);

            setLessons(lessonsResponse.data);
            setCourseTitle(courseResponse?.title || "");

            setCompletedLessons(
                progressResponse.data.map(progress => progress.lessonId)
            );

        } catch (error) {

            console.error(error);

        } finally {

            setLoading(false);

        }

    };

    const handleExerciseToggle = (index) => {
        const updatedForCourse = {
            ...exerciseChecks,
            [index]: !exerciseChecks[index]
        };

        const updatedMap = {
            ...exerciseChecksByCourse,
            [courseId]: updatedForCourse
        };

        setExerciseChecksByCourse(updatedMap);
        localStorage.setItem("practiceExerciseMap", JSON.stringify(updatedMap));
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

                {courseTitle && (
                    <p className="text-muted mb-0 small">Course: {courseTitle}</p>
                )}

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

            <div className="course-practice-panel mt-4">
                <h5 className="fw-bold mb-2">Practice Exercises</h5>
                <p className="text-muted mb-3">
                    Complete these exercises while learning lessons for better retention.
                </p>

                <div className="d-grid gap-2">
                    {getPracticeExercises(courseTitle).map((exercise, index) => (
                        <label key={exercise} className="course-practice-item">
                            <input
                                type="checkbox"
                                className="form-check-input me-2"
                                checked={!!exerciseChecks[index]}
                                onChange={() => handleExerciseToggle(index)}
                            />
                            <span>{exercise}</span>
                        </label>
                    ))}
                </div>
            </div>

            <Quiz
                courseId={Number(courseId)}
                courseTitle={courseTitle || "Course Quiz"}
            />

        </div>

    );

}

export default Lessons;