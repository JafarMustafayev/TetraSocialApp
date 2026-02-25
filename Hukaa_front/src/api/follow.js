import { fetchClient } from './client';

export const followUser = async (followingId) => {
    return fetchClient(`/api/Follow/${followingId}/follow`, {
        method: 'POST',
    });
};

export const unfollowUser = async (followingId) => {
    return fetchClient(`/api/Follow/${followingId}/unfollow`, {
        method: 'POST',
    });
};

export const cancelFollowRequest = async (followingId) => {
    return fetchClient(`/api/Follow/${followingId}/cancel-request`, {
        method: 'POST',
    });
};

export const getMyConnections = async () => {
    return fetchClient(`/api/Follow/my-connections`);
};

export const getUserConnections = async (userId) => {
    return fetchClient(`/api/Follow/${userId}/connections`);
};

export const removeFollower = async (userId) => {
    return fetchClient(`/api/Follow/${userId}/remove`, {
        method: 'POST',
    });
};

export const getPendingFollowRequests = async () => {
    return fetchClient(`/api/Follow/pending-requests`, {
        method: 'GET',
    });
};

export const acceptFollowRequest = async (requesterId) => {
    return fetchClient(`/api/Follow/${requesterId}/accept-request`, {
        method: 'POST',
    });
};

export const rejectFollowRequest = async (requesterId) => {
    return fetchClient(`/api/Follow/${requesterId}/reject-request`, {
        method: 'POST',
    });
};
