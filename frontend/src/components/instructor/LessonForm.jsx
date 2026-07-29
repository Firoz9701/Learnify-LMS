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
            className="card shadow p-4 mb-4 instructor-form"
            onSubmit={handleSubmit}
        >

            <div className="d-flex justify-content-between align-items-start flex-wrap gap-3 mb-4">
                <div>
                    <p className="instructor-kicker mb-2">Lesson Editor</p>
                    <h4 className="fw-bold mb-1">
                        {editingLesson ? "Edit Lesson" : "Create Lesson"}
                    </h4>
                    <p className="text-muted mb-0">
                        Build lesson content and assign it to the right course sequence.
                    </p>
                </div>

                <span className={`badge ${editingLesson ? "text-bg-warning" : "text-bg-primary"}`}>
                    {editingLesson ? "Editing Mode" : "New Lesson"}
                </span>
            </div>

            <div className="row g-3">
                <div className="col-md-8">
                    <label className="form-label fw-semibold">Lesson Title</label>
                    <input
                        className="form-control"
                        name="title"
                        placeholder="e.g. Introduction to React Components"
                        value={lesson.title}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="col-md-4">
                    <label className="form-label fw-semibold">Lesson Order</label>
                    <input
                        className="form-control"
                        name="lessonOrder"
                        type="number"
                        placeholder="1"
                        value={lesson.lessonOrder}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="col-md-6">
                    <label className="form-label fw-semibold">Course</label>
                    <select
                        className="form-select"
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
                </div>

                <div className="col-md-6">
                    <label className="form-label fw-semibold">Video URL</label>
                    <input
                        className="form-control"
                        name="videoUrl"
                        placeholder="https://example.com/video"
                        value={lesson.videoUrl}
                        onChange={handleChange}
                    />
                </div>

                <div className="col-12">
                    <label className="form-label fw-semibold">Lesson Content</label>
                    <textarea
                        className="form-control"
                        name="content"
                        rows="4"
                        placeholder="Write lesson notes, outline, or explanation."
                        value={lesson.content}
                        onChange={handleChange}
                        required
                    />
                </div>
            </div>

            <div className="form-check mt-4 mb-4">

                <input
                    className="form-check-input"
                    type="checkbox"
                    name="freePreview"
                    checked={lesson.freePreview}
                    onChange={handleChange}
                    id="lessonFreePreview"
                />

                <label className="form-check-label fw-semibold" htmlFor="lessonFreePreview">

                    Mark as Free Preview

                </label>

            </div>

            <button className="btn btn-primary">

                {editingLesson ? "Update Lesson" : "Create Lesson"}

            </button>

        </form>

    );

}

export default LessonForm;