import { Routes, Route } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";

import Home from "../pages/Home";
import ForgotPassword from "../pages/auth/ForgotPassword";
import ForceChangePassword from "../pages/auth/ForceChangePassword";
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
import ManageCourses from "../pages/instructor/ManageCourses";
import ManageLessons from "../pages/instructor/ManageLessons";


function AppRoutes() {
    return (
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route
                path="/force-change-password"
                element={
                    <ProtectedRoute>
                        <ForceChangePassword />
                    </ProtectedRoute>
                }
            />
            <Route path="/register" element={<Register />} />
            <Route path="/courses" element={<Courses />} />
            <Route path="/courses/:id" element={<CourseDetails />} />
            <Route
                path="/student/my-courses"
                element={
                    <ProtectedRoute allowedRoles={["ROLE_STUDENT", "ROLE_ADMIN"]}>
                        <MyCourses />
                    </ProtectedRoute>
                }
            />

            <Route
                path="/student/course/:courseId/lessons"
                element={
                    <ProtectedRoute allowedRoles={["ROLE_STUDENT", "ROLE_ADMIN"]}>
                        <Lessons />
                    </ProtectedRoute>
                }
            />

            <Route
                path="/student/lesson/:lessonId"
                element={
                    <ProtectedRoute allowedRoles={["ROLE_STUDENT", "ROLE_ADMIN"]}>
                        <LessonDetails />
                    </ProtectedRoute>
                }
            />

            <Route
                path="/student"
                element={
                    <ProtectedRoute allowedRoles={["ROLE_STUDENT", "ROLE_ADMIN"]}>
                        <StudentDashboard />
                    </ProtectedRoute>
                }
            />
            <Route
                path="/instructor"
                element={
                    <ProtectedRoute allowedRoles={["ROLE_INSTRUCTOR", "ROLE_ADMIN"]}>
                        <InstructorDashboard />
                    </ProtectedRoute>
                }
            />

            <Route
                path="/instructor/courses"
                element={
                    <ProtectedRoute allowedRoles={["ROLE_INSTRUCTOR", "ROLE_ADMIN"]}>
                        <ManageCourses />
                    </ProtectedRoute>
                }
            />

            <Route
                path="/instructor/lessons"
                element={
                    <ProtectedRoute allowedRoles={["ROLE_INSTRUCTOR", "ROLE_ADMIN"]}>
                        <ManageLessons />
                    </ProtectedRoute>
                }
            />
            <Route
                path="/admin"
                element={
                    <ProtectedRoute allowedRoles={["ROLE_ADMIN"]}>
                        <AdminDashboard />
                    </ProtectedRoute>
                }
            />
        </Routes>
    );
}

export default AppRoutes;