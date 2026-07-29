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

        <div className="container mt-4">

            <LessonForm
                onSubmit={handleSubmit}
                editingLesson={editingLesson}
                courses={courses}
            />

            <div className="card shadow">

                <div className="card-header">

                    <h4>Manage Lessons</h4>

                </div>

                <div className="card-body">

                    <select
                        className="form-select mb-4"
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

                    <table className="table table-bordered">

                        <thead>

                        <tr>

                            <th>ID</th>

                            <th>Title</th>

                            <th>Order</th>

                            <th width="220">
                                Actions
                            </th>

                        </tr>

                        </thead>

                        <tbody>

                        {lessons.map(lesson => (

                            <tr key={lesson.id}>

                                <td>{lesson.id}</td>

                                <td>{lesson.title}</td>

                                <td>{lesson.lessonOrder}</td>

                                <td>

                                    <button
                                        className="btn btn-warning btn-sm me-2"
                                        onClick={() =>
                                            setEditingLesson(lesson)
                                        }
                                    >
                                        Edit
                                    </button>

                                    <button
                                        className="btn btn-danger btn-sm"
                                        onClick={() =>
                                            handleDelete(lesson.id)
                                        }
                                    >
                                        Delete
                                    </button>

                                </td>

                            </tr>

                        ))}

                        </tbody>

                    </table>

                </div>

            </div>

        </div>

    );

}

export default ManageLessons;