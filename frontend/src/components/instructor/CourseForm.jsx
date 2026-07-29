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
            className="card shadow p-4 mb-4"
        >

            <h4>
                {editingCourse ? "Edit Course" : "Create Course"}
            </h4>

            <input
                className="form-control mb-3"
                name="title"
                placeholder="Course Title"
                value={course.title}
                onChange={handleChange}
                required
            />

            <textarea
                className="form-control mb-3"
                name="description"
                placeholder="Description"
                value={course.description}
                onChange={handleChange}
                required
            />

            <input
                className="form-control mb-3"
                name="thumbnail"
                placeholder="Thumbnail URL"
                value={course.thumbnail}
                onChange={handleChange}
            />

            <input
                className="form-control mb-3"
                name="price"
                type="number"
                step="0.01"
                placeholder="Price"
                value={course.price}
                onChange={handleChange}
                required
            />

            <div className="form-check mb-3">

                <input
                    type="checkbox"
                    className="form-check-input"
                    name="published"
                    checked={course.published}
                    onChange={handleChange}
                />

                <label className="form-check-label">
                    Published
                </label>

            </div>

            <button className="btn btn-success">

                {editingCourse ? "Update Course" : "Create Course"}

            </button>

        </form>

    );

}

export default CourseForm;