import api from "./api";

export const getLessonsByCourse = async (courseId) => {

    const response = await api.get(`/lessons/course/${courseId}`);

    return response.data;
};

export const getLessonById = async (id) => {

    const response = await api.get(`/lessons/${id}`);

    return response.data;
};

export const createLesson = async (lesson) => {

    const response = await api.post("/lessons", lesson);

    return response.data;
};

export const updateLesson = async (id, lesson) => {

    const response = await api.put(`/lessons/${id}`, lesson);

    return response.data;
};

export const deleteLesson = async (id) => {

    await api.delete(`/lessons/${id}`);

};