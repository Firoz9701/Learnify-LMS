import { useEffect, useState } from "react";

function LessonForm({ onSubmit, editingLesson, courses }) {

    const [lesson, setLesson] = useState({
        title: "",
        content: "",
        lessonOrder: "",
        videoUrl: "",
        freePreview: false,
        courseId: ""
    });

    useEffect(() => {

        if (editingLesson) {

            // eslint-disable-next-line react-hooks/set-state-in-effect
            setLesson({
                title: editingLesson.title || "",
                content: editingLesson.content || "",
                lessonOrder: editingLesson.lessonOrder || "",
                videoUrl: editingLesson.videoUrl || "",
                freePreview: editingLesson.freePreview || false,
                courseId: editingLesson.courseId || ""
            });

        }

    }, [editingLesson]);

    const handleChange = (e) => {

        const { name, value, type, checked } = e.target;

        setLesson(prev => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value
        }));

    };

    const handleSubmit = (e) => {

        e.preventDefault();

        onSubmit(lesson);

        setLesson({
            title: "",
            content: "",
            lessonOrder: "",
            videoUrl: "",
            freePreview: false,
            courseId: ""
        });

    };

    return (

        <form
            className="card shadow p-4 mb-4"
            onSubmit={handleSubmit}
        >

            <h4>

                {editingLesson ? "Edit Lesson" : "Create Lesson"}

            </h4>

            <input
                className="form-control mb-3"
                name="title"
                placeholder="Lesson Title"
                value={lesson.title}
                onChange={handleChange}
                required
            />

            <textarea
                className="form-control mb-3"
                name="content"
                placeholder="Lesson Content"
                value={lesson.content}
                onChange={handleChange}
                required
            />

            <input
                className="form-control mb-3"
                name="lessonOrder"
                type="number"
                placeholder="Lesson Order"
                value={lesson.lessonOrder}
                onChange={handleChange}
                required
            />

            <input
                className="form-control mb-3"
                name="videoUrl"
                placeholder="Video URL"
                value={lesson.videoUrl}
                onChange={handleChange}
            />

            <select
                className="form-select mb-3"
                name="courseId"
                value={lesson.courseId}
                onChange={handleChange}
                required
            >

                <option value="">
                    Select Course
                </option>

                {courses.map(course => (

                    <option
                        key={course.id}
                        value={course.id}
                    >
                        {course.title}
                    </option>

                ))}

            </select>

            <div className="form-check mb-3">

                <input
                    className="form-check-input"
                    type="checkbox"
                    name="freePreview"
                    checked={lesson.freePreview}
                    onChange={handleChange}
                />

                <label className="form-check-label">

                    Free Preview

                </label>

            </div>

            <button className="btn btn-success">

                {editingLesson ? "Update Lesson" : "Create Lesson"}

            </button>

        </form>

    );

}

export default LessonForm;