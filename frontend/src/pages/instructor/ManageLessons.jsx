/* eslint-disable react-hooks/immutability */
import { useEffect, useState } from "react";

import {
    getAllCourses
} from "../../services/courseService";

import {
    getLessonsByCourse,
    createLesson,
    updateLesson,
    deleteLesson
} from "../../services/lessonService";

import LessonForm from "../../components/instructor/LessonForm";

function ManageLessons() {

    const [courses, setCourses] = useState([]);

    const [selectedCourse, setSelectedCourse] = useState("");

    const [lessons, setLessons] = useState([]);

    const [editingLesson, setEditingLesson] = useState(null);

    const selectedCourseName = courses.find(
        (course) => String(course.id) === String(selectedCourse)
    )?.title;

    useEffect(() => {

        loadCourses();

    }, []);

    useEffect(() => {

        if (selectedCourse) {

            loadLessons(selectedCourse);

        }

    }, [selectedCourse]);

    const loadCourses = async () => {

        try {

            const data = await getAllCourses();

            setCourses(data);

        } catch (error) {

            console.log(error);

        }

    };

    const loadLessons = async (courseId) => {

        try {

            const data = await getLessonsByCourse(courseId);

            setLessons(data);

        } catch (error) {

            console.log(error);

        }

    };

    const handleSubmit = async (lesson) => {

        try {

            if (editingLesson) {

                await updateLesson(editingLesson.id, lesson);

                alert("Lesson updated successfully.");

            } else {

                await createLesson(lesson);

                alert("Lesson created successfully.");

            }

            setEditingLesson(null);

            loadLessons(lesson.courseId);

        } catch (error) {

            console.log(error);

        }

    };

    const handleDelete = async (id) => {

        if (!window.confirm("Delete this lesson?")) return;

        try {

            await deleteLesson(id);

            alert("Lesson deleted successfully.");

            loadLessons(selectedCourse);

        } catch (error) {

            console.log(error);

        }

    };

    return (

        <div className="container py-5 instructor-page">

            <div className="hero-card instructor-hero mb-4">
                <h2 className="fw-bold mb-2">Lesson Manager</h2>
                <p className="text-muted mb-0">
                    Create and organize course lessons with clean sequencing and quick edits.
                </p>
            </div>

            <div className="row g-4 mb-4">
                <div className="col-md-6 col-lg-4">
                    <div className="card stats-panel border-0 h-100 instructor-stat-card">
                        <div className="card-body">
                            <small className="text-muted d-block mb-2">Courses Available</small>
                            <h3 className="fw-bold mb-0">{courses.length}</h3>
                        </div>
                    </div>
                </div>

                <div className="col-md-6 col-lg-4">
                    <div className="card stats-panel border-0 h-100 instructor-stat-card">
                        <div className="card-body">
                            <small className="text-muted d-block mb-2">Lessons in View</small>
                            <h3 className="fw-bold mb-0">{lessons.length}</h3>
                        </div>
                    </div>
                </div>

                <div className="col-md-12 col-lg-4">
                    <div className="card border-0 h-100 instructor-note-card">
                        <div className="card-body">
                            <small className="text-muted d-block mb-2">Selected Course</small>
                            <p className="mb-0 text-muted">
                                {selectedCourseName || "Choose a course below to view and manage its lessons."}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <LessonForm
                onSubmit={handleSubmit}
                editingLesson={editingLesson}
                courses={courses}
            />

            <div className="card shadow-sm border-0 instructor-panel">

                <div className="card-body p-4">

                    <div className="d-flex justify-content-between align-items-center flex-wrap gap-3 mb-3">
                        <div>
                            <h4 className="fw-bold mb-1">Manage Lessons</h4>
                            <p className="text-muted mb-0">Filter by course and maintain your lesson list.</p>
                        </div>
                    </div>

                    <select
                        className="form-select mb-4 instructor-course-filter"
                        value={selectedCourse}
                        onChange={(e) =>
                            setSelectedCourse(e.target.value)
                        }
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

                    {!selectedCourse ? (
                        <div className="border rounded-4 p-4 text-center bg-light-subtle">
                            <h6 className="fw-semibold mb-2">Select a course to continue</h6>
                            <p className="text-muted mb-0">Choose a course from the dropdown to load lesson records.</p>
                        </div>
                    ) : lessons.length === 0 ? (
                        <div className="border rounded-4 p-4 text-center bg-light-subtle">
                            <h6 className="fw-semibold mb-2">No lessons in this course</h6>
                            <p className="text-muted mb-0">Create a new lesson using the form above.</p>
                        </div>
                    ) : (
                        <div className="table-responsive">
                            <table className="table align-middle admin-table">

                                <thead>

                                <tr>

                                    <th>ID</th>

                                    <th>Title</th>

                                    <th>Order</th>

                                    <th>Preview</th>

                                    <th width="240">Actions</th>

                                </tr>

                                </thead>

                                <tbody>

                                {lessons.map(lesson => (

                                    <tr key={lesson.id}>

                                        <td>{lesson.id}</td>

                                        <td className="fw-semibold">{lesson.title}</td>

                                        <td>{lesson.lessonOrder}</td>

                                        <td>
                                            <span className={`badge ${lesson.freePreview ? "text-bg-success" : "text-bg-secondary"}`}>
                                                {lesson.freePreview ? "Free" : "Locked"}
                                            </span>
                                        </td>

                                        <td>

                                            <div className="d-flex flex-wrap gap-2">
                                                <button
                                                    className="btn btn-outline-primary btn-sm"
                                                    onClick={() =>
                                                        setEditingLesson(lesson)
                                                    }
                                                >
                                                    Edit
                                                </button>

                                                <button
                                                    className="btn btn-outline-danger btn-sm"
                                                    onClick={() =>
                                                        handleDelete(lesson.id)
                                                    }
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

export default ManageLessons;