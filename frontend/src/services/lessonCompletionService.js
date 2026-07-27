import api from "./api";

export const completeLesson = async (studentId, lessonId) => {

    const response = await api.post(
        `/lesson-completions/student/${studentId}/lesson/${lessonId}`
    );

    return response.data;
};