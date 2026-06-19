// src/api/post.api.js

// Simulated delay helper
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const mockPosts = {
    'bulentsakarya': [
        {
            Id: 101,
            ByUserName: 'Bülent Sakarya',
            Content: 'Claude haftalık limiti sıfırlamış yine. İyi oldu. Daha 4 gün vardı. Dolmak üzereydi.',
            UserProfileImageUrl: null,
            TimeAgo: '3sa'
        },
        {
            Id: 102,
            ByUserName: 'Bülent Sakarya',
            Content: 'cift.click domaini ailemize hayırlı olsun :)',
            UserProfileImageUrl: null,
            TimeAgo: '1g'
        },
        {
            Id: 103,
            ByUserName: 'Bülent Sakarya',
            Content: 'SaaS projelerimde yeni bir milat. Harika özellikler yolda! #SaaS #BuildInPublic',
            UserProfileImageUrl: null,
            TimeAgo: '2g'
        }
    ],
    'jafarmustafayev': [
        {
            Id: 201,
            ByUserName: 'Jafar Mustafayev',
            Content: 'mene mesaj yaza bilersiniz ? qarsi terefden mesaj gelende nece gorunur, hansi butonlar olur onu yoxlamaq isteyirem )',
            UserProfileImageUrl: null,
            TimeAgo: '1h'
        },
        {
            Id: 202,
            ByUserName: 'Jafar Mustafayev',
            Content: 'Mən mövcud React layihəmdə Home / Feed səhifəsinin UI dizaynını yeniləmək istəyirəm.\n\nMən sənə 2 şəkil göndərmişəm:\n1. Birinci şəkil — istədiyim yeni dizayn nümunəsidir.',
            UserProfileImageUrl: null,
            TimeAgo: '1h'
        },
        {
            Id: 203,
            ByUserName: 'Jafar Mustafayev',
            Content: 'mene mesaj yaza bilersiniz ? qarsi terefden mesaj gelende nece gorunur, hansi butonlar olur onu yoxlamaq isteyirem )',
            UserProfileImageUrl: null,
            TimeAgo: '1h'
        },
        {
            Id: 204,
            ByUserName: 'Jafar Mustafayev',
            Content: 'mene mesaj yaza bilersiniz ? qarsi terefden mesaj gelende nece gorunur, hansi butonlar olur onu yoxlamaq isteyirem )',
            UserProfileImageUrl: null,
            TimeAgo: '1h'
        }
    ],
    'default': [
        {
            Id: 301,
            ByUserName: 'Leyla Guliyeva',
            Content: 'Hukaa layout is absolutely stunning! Proud of this work.',
            UserProfileImageUrl: null,
            TimeAgo: '3h'
        }
    ]
};

/**
 * Retrieves the posts written by a specific user.
 * @param {string} username 
 * @returns {Promise<object>} Resolved standard response with posts data.
 */
export const getUserPosts = async (username) => {
    await delay(700); // Simulate network latency
    const normalizedUsername = username?.toLowerCase().replace(/[@\s]/g, '') || 'jafarmustafayev';
    const posts = mockPosts[normalizedUsername] || mockPosts['default'];
    return {
        Success: true,
        StatusCode: 200,
        Message: 'Success',
        Data: posts,
        Errors: []
    };
};
