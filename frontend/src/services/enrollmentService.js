import api from "./api";

/*
 * Enroll the currently logged-in student.
 * Student is identified from the JWT.
 */
export const enroll = async (courseId) => {

    const response = await api.post(

        `/enrollments/course/${courseId}`

    );

    return response.data;

};

/*
 * Get courses of the currently logged-in student.
 */
export const getMyEnrollments = async () => {

    const response = await api.get(

        `/enrollments/my-courses`

    );

    return response.data;

};