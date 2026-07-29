import api from "./api";

export const getStudentDashboard = async (studentId) => {

    const response = await api.get(
        `/dashboard/student/${studentId}`
    );

    return response.data;
};

export const getMyCourses = async (studentId) => {

    const response = await api.get(
        `/enrollments/student/${studentId}`
    );

    return response.data;
};