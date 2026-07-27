import api from "./api";

export const enrollStudent = async (studentId, courseId) => {

    const response = await api.post(

        `/enrollments/student/${studentId}`,

        {
            courseId
        }

    );

    return response.data;
};

export const getStudentEnrollments = async (studentId) => {

    const response = await api.get(

        `/enrollments/student/${studentId}`

    );

    return response.data;
};