// src/utily/validation.js

/**
 * Validates an email address using a standard regex pattern.
 * @param {string} email 
 * @returns {boolean}
 */
export const validateEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
};

/**
 * Calculates age from a Date object.
 * @param {Date} birthDate 
 * @returns {number}
 */
export const calculateAge = (birthDate) => {
    if (!birthDate) return 0;
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
        age--;
    }
    return age;
};

/**
 * Checks if a user is at least 16 years old.
 * @param {Date} birthDate 
 * @returns {boolean}
 */
export const isAtLeast16 = (birthDate) => {
    return calculateAge(birthDate) >= 16;
};
