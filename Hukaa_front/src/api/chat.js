import { fetchClient } from './client';

export const getConversations = async (page, pageSize = 25) => {
    return await fetchClient(`/api/conversation/${page}?pageSize=${pageSize}`);
};

// Fixed to use correct path format: /page/pageSize
export const getMessages = async (conversationId, page, pageSize = 50) => {
    return await fetchClient(`/api/conversation/${conversationId}/messages/${page}?pageSize=${pageSize}`);
};

export const deleteConversation = async (conversationId) => {
    return await fetchClient(`/api/conversation/${conversationId}`, {
        method: 'DELETE'
    });
};
