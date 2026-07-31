import { useEffect, useState } from "react";

import {
    getAllCoursesAllPages,
    createCourse,
    updateCourse,
    deleteCourse
} from "../../services/courseService";

import CourseForm from "../../components/instructor/CourseForm";

function ManageCourses() {

    const [courses, setCourses] = useState([]);

    const [editingCourse, setEditingCourse] = useState(null);

    const publishedCourses = courses.filter((course) => course.published).length;

    useEffect(() => {

        loadCourses();

    }, []);

    const loadCourses = async () => {

        try {

            const data = await getAllCoursesAllPages("latest", {
                published: "all"
            });

            setCourses(data);

        } catch (error) {

            console.log(error);

        }

    };

    const handleSubmit = async (course) => {

        try {

            if (editingCourse) {

                await updateCourse(editingCourse.id, course);

                alert("Course updated successfully.");

            } else {

                await createCourse(course);

                alert("Course created successfully.");

            }

            setEditingCourse(null);

            loadCourses();

        } catch (error) {

            console.log(error);

        }

    };

    const handleDelete = async (id) => {

        if (!window.confirm("Delete this course?")) return;

        try {

            await deleteCourse(id);

            alert("Course deleted.");

            loadCourses();

        } catch (error) {

            console.log(error);

        }

    };

    return (

        <div className="container py-5 instructor-page">

            <div className="hero-card instructor-hero mb-4">
                <h2 className="fw-bold mb-2">Course Manager</h2>
                <p className="text-muted mb-0">
                    Create new courses and maintain your catalog with clear publishing control.
                </p>
            </div>

            <div className="row g-4 mb-4">
                <div className="col-md-6 col-lg-4">
                    <div className="card stats-panel border-0 h-100 instructor-stat-card">
                        <div className="card-body">
                            <small className="text-muted d-block mb-2">Total Courses</small>
                            <h3 className="fw-bold mb-0">{courses.length}</h3>
                        </div>
                    </div>
                </div>

                <div className="col-md-6 col-lg-4">
                    <div className="card stats-panel border-0 h-100 instructor-stat-card">
                        <div className="card-body">
                            <small className="text-muted d-block mb-2">Published</small>
                            <h3 className="fw-bold mb-0">{publishedCourses}</h3>
                        </div>
                    </div>
                </div>

                <div className="col-md-12 col-lg-4">
                    <div className="card border-0 h-100 instructor-note-card">
                        <div className="card-body">
                            <small className="text-muted d-block mb-2">Tip</small>
                            <p className="mb-0 text-muted">
                                Use edit mode to quickly revise title, price, thumbnail, and publish status.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <CourseForm
                onSubmit={handleSubmit}
                editingCourse={editingCourse}
            />

            <div className="card shadow-sm border-0 instructor-panel">

                <div className="card-body p-4">

                    <div className="d-flex justify-content-between align-items-center flex-wrap gap-3 mb-3">
                        <div>
                            <h4 className="fw-bold mb-1">All Courses</h4>
                            <p className="text-muted mb-0">Review and maintain existing course records.</p>
                        </div>
                    </div>

                    {courses.length === 0 ? (
                        <div className="border rounded-4 p-4 text-center bg-light-subtle">
                            <h6 className="fw-semibold mb-2">No courses found</h6>
                            <p className="text-muted mb-0">Create your first course using the form above.</p>
                        </div>
                    ) : (
                        <div className="table-responsive">
                            <table className="table align-middle admin-table">

                                <thead>

                                <tr>

                                    <th>ID</th>

                                    <th>Title</th>

                                    <th>Price</th>

                                    <th>Status</th>

                                    <th width="240">Actions</th>

                                </tr>

                                </thead>

                                <tbody>

                                {courses.map(course => (

                                    <tr key={course.id}>

                                        <td>{course.id}</td>

                                        <td className="fw-semibold">{course.title}</td>

                                        <td>Rs. {course.price}</td>

                                        <td>
                                            <span className={`badge ${course.published ? "text-bg-success" : "text-bg-secondary"}`}>
                                                {course.published ? "Published" : "Draft"}
                                            </span>
                                        </td>

                                        <td>

                                            <div className="d-flex flex-wrap gap-2">
                                                <button
                                                    className="btn btn-outline-primary btn-sm"
                                                    onClick={() => setEditingCourse(course)}
                                                >
                                                    Edit
                                                </button>

                                                <button
                                                    className="btn btn-outline-danger btn-sm"
                                                    onClick={() => handleDelete(course.id)}
                                                >
                                                    Delete
                                                </button>
                                            </div>

                                        </td>

                                    </tr>

                                ))}

                                </tbody>

                            </table>
                        </div>
                    )}

                </div>

            </div>

        </div>

    );

}

export default ManageCourses;