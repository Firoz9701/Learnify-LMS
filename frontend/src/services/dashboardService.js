import api from "./api";

export const getStudentDashboard = async (studentId) => {

    const response = await api.get(
        `/dashboard/student/${studentId}`
    );

    return response.data;
};

export const getMyCourses = async () => {

    const response = await api.get(
        "/enrollments/my-courses"
    );

    return response.data;
};