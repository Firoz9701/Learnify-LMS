import api from "./api";

export const getAllCourses = async () => {

    const response = await api.get("/courses");

    return response.data.content;
};

export const getCourseById = async (id) => {

    const response = await api.get(`/courses/${id}`);

    return response.data;
};