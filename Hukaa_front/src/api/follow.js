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

export const cancelFollowRequest = async (followingId) => {
    return fetchClient(`/api/Follow/${followingId}/cancel-request`, {
        method: 'POST',
    });
};
