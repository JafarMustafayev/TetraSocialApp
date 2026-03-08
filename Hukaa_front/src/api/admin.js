import { fetchClient } from './client';

// ─── Users ───────────────────────────────────────────────────────────────────
export const getAdminUsers = async (page = 1, search = '') => {
    const q = search ? `&search=${encodeURIComponent(search)}` : '';
    return await fetchClient(`/api/admin/users?page=${page}${q}`, { method: 'GET' });
};

export const banUser = async (userId) => {
    return await fetchClient(`/api/Admin/users/${userId}/ban`, { method: 'PUT' });
};

export const unbanUser = async (userId) => {
    return await fetchClient(`/api/Admin/users/${userId}/unban`, { method: 'PUT' });
};

// ─── Posts ────────────────────────────────────────────────────────────────────
export const getAdminPosts = async (page = 1, search = '') => {
    const q = search ? `&search=${encodeURIComponent(search)}` : '';
    return await fetchClient(`/api/Admin/posts?page=${page}${q}`, { method: 'GET' });
};

export const getAdminUserPosts = async (userId) => {
    return await fetchClient(`/api/Admin/users/${userId}/posts`, { method: 'GET' });
};

export const adminDeletePost = async (postId) => {
    return await fetchClient(`/api/Admin/posts/${postId}`, { method: 'DELETE' });
};

// ─── Stats ────────────────────────────────────────────────────────────────────
export const getAdminStats = async () => {
    return await fetchClient('/api/admin/stats', { method: 'GET' });
};
