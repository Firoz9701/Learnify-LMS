import { useState, useEffect } from "react";

function CourseForm({ onSubmit, editingCourse }) {

    const [course, setCourse] = useState({
        title: "",
        description: "",
        thumbnail: "",
        price: "",
        published: false
    });

    useEffect(() => {

        if (editingCourse) {

            // eslint-disable-next-line react-hooks/set-state-in-effect
            setCourse({
                title: editingCourse.title || "",
                description: editingCourse.description || "",
                thumbnail: editingCourse.thumbnail || "",
                price: editingCourse.price || "",
                published: editingCourse.published ?? false
            });

        }

    }, [editingCourse]);

    const handleChange = (e) => {

        const { name, value, type, checked } = e.target;

        setCourse(prev => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value
        }));

    };

    const handleSubmit = (e) => {

        e.preventDefault();

        onSubmit(course);

        setCourse({
            title: "",
            description: "",
            thumbnail: "",
            price: "",
            published: false
        });

    };

    return (

        <form
            onSubmit={handleSubmit}
            className="card shadow p-4 mb-4 instructor-form"
        >

            <div className="d-flex justify-content-between align-items-start flex-wrap gap-3 mb-4">
                <div>
                    <p className="instructor-kicker mb-2">Course Editor</p>
                    <h4 className="fw-bold mb-1">
                        {editingCourse ? "Edit Course" : "Create Course"}
                    </h4>
                    <p className="text-muted mb-0">
                        Add course details, pricing, and publication status.
                    </p>
                </div>

                <span className={`badge ${editingCourse ? "text-bg-warning" : "text-bg-primary"}`}>
                    {editingCourse ? "Editing Mode" : "New Course"}
                </span>
            </div>

            <div className="row g-3">
                <div className="col-12">
                    <label className="form-label fw-semibold">Course Title</label>
                    <input
                        className="form-control"
                        name="title"
                        placeholder="e.g. Full Stack Web Development"
                        value={course.title}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="col-12">
                    <label className="form-label fw-semibold">Description</label>
                    <textarea
                        className="form-control"
                        name="description"
                        rows="4"
                        placeholder="Write a short summary of what students will learn."
                        value={course.description}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="col-md-8">
                    <label className="form-label fw-semibold">Thumbnail URL</label>
                    <input
                        className="form-control"
                        name="thumbnail"
                        placeholder="https://example.com/course-image.jpg"
                        value={course.thumbnail}
                        onChange={handleChange}
                    />
                    <small className="text-muted">Optional: add an image URL for the course card.</small>
                </div>

                <div className="col-md-4">
                    <label className="form-label fw-semibold">Price</label>
                    <input
                        className="form-control"
                        name="price"
                        type="number"
                        step="0.01"
                        placeholder="0.00"
                        value={course.price}
                        onChange={handleChange}
                        required
                    />
                </div>
            </div>

            <div className="form-check mt-4 mb-4">

                <input
                    type="checkbox"
                    className="form-check-input"
                    name="published"
                    checked={course.published}
                    onChange={handleChange}
                    id="coursePublished"
                />

                <label className="form-check-label fw-semibold" htmlFor="coursePublished">
                    Publish this course
                </label>

            </div>

            <button className="btn btn-primary">

                {editingCourse ? "Update Course" : "Create Course"}

            </button>

        </form>

    );

}

export default CourseForm;