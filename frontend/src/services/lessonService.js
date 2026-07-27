import api from "./api";

export const getLessonsByCourse = async (courseId) => {

    const response = await api.get(`/lessons/course/${courseId}`);

    return response.data;
};

export const getLessonById = async (lessonId) => {

    const response = await api.get(`/lessons/${lessonId}`);

    return response.data;
};