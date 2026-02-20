import { fetchClient } from './client';

export const createPost = async (formData) => {
    return fetchClient('/api/post', {
        method: 'POST',
        body: formData,
    });
};

export const getMyPosts = async (page) => {
    return fetchClient(`/api/post/me/${page}`, {
        method: 'GET',
    });
};

export const updatePost = async (postId, content) => {
    return fetchClient(`/api/Post/${postId}`, {
        method: 'PUT',
        body: JSON.stringify({ content }),
    });
};

export const deletePost = async (postId) => {
    return fetchClient(`/api/Post/${postId}`, {
        method: 'DELETE',
    });
};

export const toggleArchivePost = async (postId, isArchive) => {
    return fetchClient(`/api/Post/${postId}/archive`, {
        method: 'PUT',
        body: JSON.stringify({ isArchive }),
    });
};

export const getArchivedPosts = async (page) => {
    return fetchClient(`/api/post/archived/${page}`, {
        method: 'GET',
    });
};

export const reactToPost = async (postId, reactionType) => {
    return fetchClient(`/api/posts/${postId}/reactions`, {
        method: 'POST',
        body: JSON.stringify({ reactionType }),
    });
};
