import api from './api';

export const submitAttempt = (courseId, score) => {
    return api.post(`/quizzes/${courseId}/attempts`, { score });
};

export const getMyAttempts = () => {
    return api.get('/quizzes/me/attempts');
};
