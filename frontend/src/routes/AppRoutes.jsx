import { Routes, Route } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";

import Home from "../pages/Home";
import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";
import Courses from "../pages/Courses";
import CourseDetails from "../pages/CourseDetails";
import StudentDashboard from "../pages/student/StudentDashboard";
import InstructorDashboard from "../pages/instructor/InstructorDashboard";
import AdminDashboard from "../pages/admin/AdminDashboard";
import MyCourses from "../pages/student/MyCourses";
import Lessons from "../pages/student/Lessons";
import LessonDetails from "../pages/student/LessonDetails";


function AppRoutes() {
    return (
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route
                path="/courses"
                element={
                    <ProtectedRoute>
                        <Courses />
                    </ProtectedRoute>
                }
            />
            <Route
                path="/courses/:id"
                element={
                    <ProtectedRoute>
                        <CourseDetails />
                    </ProtectedRoute>
                }
            />
            <Route
                path="/student/my-courses"
                element={
                    <ProtectedRoute>
                        <MyCourses />
                    </ProtectedRoute>
                }
            />
            <Route
                path="/student/course/:courseId/lessons"
                element={
                    <ProtectedRoute>
                        <Lessons />
                    </ProtectedRoute>
                }
            />
            <Route
                path="/student/lesson/:lessonId"
                element={
                    <ProtectedRoute>
                        <LessonDetails />
                    </ProtectedRoute>
                }
            />
            <Route
                path="/student"
                element={
                    <ProtectedRoute>
                        <StudentDashboard />
                    </ProtectedRoute>
                }
            />
            <Route
                path="/instructor"
                element={
                    <ProtectedRoute>
                        <InstructorDashboard />
                    </ProtectedRoute>
                }
            />
            <Route
                path="/admin"
                element={
                    <ProtectedRoute>
                        <AdminDashboard />
                    </ProtectedRoute>
                }
            />
        </Routes>
    );
}

export default AppRoutes;