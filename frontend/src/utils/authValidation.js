export const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
export const NAME_REGEX = /^[A-Za-z][A-Za-z\s'\-]{1,99}$/;
export const PHONE_REGEX = /^\d{10,15}$/;
export const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d]).{8,50}$/;

export const COMMON_WEAK_PASSWORDS = new Set([
    "password",
    "password123",
    "12345678",
    "qwerty123",
    "admin123",
    "letmein123"
]);

export const isValidEmail = (value) => EMAIL_REGEX.test(String(value || "").trim());

export const normalizeEmail = (value) => String(value || "").trim().toLowerCase();

export const normalizePhone = (value) => String(value || "").trim();

export const isStrongPassword = (value) => {
    const password = String(value || "");

    return PASSWORD_REGEX.test(password) && !COMMON_WEAK_PASSWORDS.has(password.toLowerCase());
};
