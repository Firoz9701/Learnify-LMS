import { useEffect, useState } from "react";

import {
    getAllCourses,
    createCourse,
    updateCourse,
    deleteCourse
} from "../../services/courseService";

import CourseForm from "../../components/instructor/CourseForm";

function ManageCourses() {

    const [courses, setCourses] = useState([]);

    const [editingCourse, setEditingCourse] = useState(null);

    useEffect(() => {

        loadCourses();

    }, []);

    const loadCourses = async () => {

        try {

            const data = await getAllCourses();

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

        <div className="container mt-4">

            <CourseForm
                onSubmit={handleSubmit}
                editingCourse={editingCourse}
            />

            <div className="card shadow">

                <div className="card-header">

                    <h4>All Courses</h4>

                </div>

                <div className="card-body">

                    <table className="table table-bordered">

                        <thead>

                        <tr>

                            <th>ID</th>

                            <th>Title</th>

                            <th>Price</th>

                            <th width="220">Actions</th>

                        </tr>

                        </thead>

                        <tbody>

                        {courses.map(course => (

                            <tr key={course.id}>

                                <td>{course.id}</td>

                                <td>{course.title}</td>

                                <td>₹ {course.price}</td>

                                <td>

                                    <button
                                        className="btn btn-warning btn-sm me-2"
                                        onClick={() => setEditingCourse(course)}
                                    >
                                        Edit
                                    </button>

                                    <button
                                        className="btn btn-danger btn-sm"
                                        onClick={() => handleDelete(course.id)}
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

export default ManageCourses;