import { fetchClient } from './client';

// ─── Users ───────────────────────────────────────────────────────────────────
export const getAdminUsers = async (page = 1, search = '') => {
    const q = search ? `&search=${encodeURIComponent(search)}` : '';
    return fetchClient(`/api/Admin/users?page=${page}${q}`, { method: 'GET' });
};

export const banUser = async (userId) => {
    return fetchClient(`/api/Admin/users/${userId}/ban`, { method: 'PUT' });
};

export const unbanUser = async (userId) => {
    return fetchClient(`/api/Admin/users/${userId}/unban`, { method: 'PUT' });
};

// ─── Posts ────────────────────────────────────────────────────────────────────
export const getAdminPosts = async (page = 1, search = '') => {
    const q = search ? `&search=${encodeURIComponent(search)}` : '';
    return fetchClient(`/api/Admin/posts?page=${page}${q}`, { method: 'GET' });
};

export const adminDeletePost = async (postId) => {
    return fetchClient(`/api/Admin/posts/${postId}`, { method: 'DELETE' });
};

// ─── Stats ────────────────────────────────────────────────────────────────────
export const getAdminStats = async () => {
    return fetchClient('/api/Admin/stats', { method: 'GET' });
};
