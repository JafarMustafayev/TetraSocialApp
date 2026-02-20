import { fetchClient } from './client';

export const createComment = async (postId, content) => {
    return fetchClient('/api/comment', {
        method: 'POST',
        body: JSON.stringify({ postId, content }),
    });
};

export const deleteComment = async (commentId) => {
    return fetchClient(`/api/comment/${commentId}`, {
        method: 'DELETE',
    });
};

export const getPostComments = async (postId) => {
    return fetchClient(`/api/comment/post/${postId}`, {
        method: 'GET',
    });
};

export const updateComment = async (commentId, content) => {
    return fetchClient(`/api/comment/${commentId}`, {
        method: 'PUT',
        body: JSON.stringify({ content }),
    });
};
