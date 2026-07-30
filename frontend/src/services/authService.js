import api from "./api";

export const login = (credentials) => {
    return api.post("/auth/login", credentials);
};

export const register = (userData) => {
    return api.post("/auth/register", userData);
};

export const requestPasswordReset = (email) => {
    return api.post("/auth/forgot-password-request", { email });
};

export const checkPasswordResetStatus = (email) => {
    return api.get("/auth/password-reset-status", {
        params: { email }
    });
};

export const changeTemporaryPassword = (newPassword) => {
    return api.post("/auth/change-temporary-password", { newPassword });
};