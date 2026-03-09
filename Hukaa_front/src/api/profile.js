import { fetchClient } from './client';

export const getExperiences = async () => {
    return fetchClient('/api/profile/experience', {
        method: 'GET',
    });
};

export const getMe = async () => {
    return fetchClient('/api/Profile/Me', {
        method: 'GET',
    });
};

export const getMyProfile = async () => {
    return fetchClient('/api/Profile/myprofile', {
        method: 'GET',
    });
};

export const addExperience = async (experienceData) => {
    return fetchClient('/api/profile/experience', {
        method: 'POST',
        body: JSON.stringify(experienceData),
    });
};

export const updateExperience = async (id, experienceData) => {
    return fetchClient(`/api/profile/Experience/${id}`, {
        method: 'PUT',
        body: JSON.stringify(experienceData),
    });
};

export const deleteExperience = async (id) => {
    return fetchClient(`/api/profile/Experience/${id}`, {
        method: 'DELETE',
    });
};

export const updateCoverPhoto = async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    return fetchClient('/api/Profile/cover-photo', {
        method: 'PUT',
        body: formData,
    });
};

export const updateProfilePhoto = async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    return fetchClient('/api/Profile/profile-photo', {
        method: 'PUT',
        body: formData,
    });
};

export const getProfileSettings = async () => {
    return fetchClient('/api/Profile/settings/profile-information', {
        method: 'GET',
    });
};

export const updateProfileInformation = async (data) => {
    return fetchClient('/api/Profile/profile-information', {
        method: 'PUT',
        body: JSON.stringify(data),
    });
};

export const getPrivacyInformation = async () => {
    return fetchClient('/api/Profile/settings/privacy-information', {
        method: 'GET',
    });
};

export const updatePrivacySetting = async () => {
    return fetchClient('/api/Profile/privacy', {
        method: 'PUT',
    });
};

export const searchProfiles = async (query) => {
    return fetchClient(`/api/Profile/search?query=${encodeURIComponent(query)}`, {
        method: 'GET',
    });
};

export const getUserProfile = async (userId) => {
    return fetchClient(`/api/Profile/${userId}`, {
        method: 'GET',
    });
};

export const getSuggestedPeople = async () => {
    return fetchClient('/api/Profile/suggested-people', {
        method: 'GET',
    });
};
