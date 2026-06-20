// src/utils/mockData.js

export const suggestedUsers = [
    {
        id: 1,
        name: "Jafar Mustafayev",
        username: "jafarmustafayev",
        avatar: "",
        isFollowing: false
    },
    {
        id: 2,
        name: "Leyla Guliyeva",
        username: "leyla_g",
        avatar: "",
        isFollowing: false
    },
    {
        id: 3,
        name: "Tural Hasanov",
        username: "tural_h",
        avatar: "",
        isFollowing: false
    },
    {
        id: 4,
        name: "Anar Aliyev",
        username: "anar_a",
        avatar: "",
        isFollowing: false
    }
];

export const upcomingBirthdays = [
    {
        id: 1,
        name: "Elvin Mammadov",
        username: "elvin_m",
        avatar: "",
        // Adding a birthday that might trigger depending on current date.
        // I will use some generic format and handle the "next 7 days" logic dynamically.
        // For testing, I'll put some dates around the current month.
        birthday: "2000-06-10" // Current month is June
    },
    {
        id: 2,
        name: "Leyla Guliyeva",
        username: "leyla_g",
        avatar: "",
        birthday: "1995-06-12"
    },
    {
        id: 3,
        name: "Tural Hasanov",
        username: "tural_h",
        avatar: "",
        birthday: "1998-06-15"
    }
];

export const mockFollowingList = {
    'bulentsakarya': [
        { id: 11, name: 'Ersin 🐘', username: 'ersin_ele', avatar: '', isFollowing: true, followsYou: true },
        { id: 13, name: 'Tural Hasanov', username: 'tural_h', avatar: '', isFollowing: true, followsYou: false },
        { id: 15, name: 'Mert Cento 🎥', username: 'mertcento', avatar: '', isFollowing: true, followsYou: false }
    ],
    'jafarmustafayev': [
        { id: 12, name: 'Leyla Guliyeva', username: 'leyla_g', avatar: '', isFollowing: true, followsYou: true },
        { id: 13, name: 'Tural Hasanov', username: 'tural_h', avatar: '', isFollowing: true, followsYou: false },
        { id: 14, name: 'Bülent Sakarya', username: 'bulentsakarya', avatar: '', isFollowing: true, followsYou: true }
    ]
};

export const mockFollowersList = {
    'bulentsakarya': [
        { id: 10, name: 'Jafar Mustafayev', username: 'jafarmustafayev', avatar: '', isFollowing: true, followsYou: false },
        { id: 11, name: 'Ersin 🐘', username: 'ersin_ele', avatar: '', isFollowing: true, followsYou: true },
        { id: 12, name: 'Leyla Guliyeva', username: 'leyla_g', avatar: '', isFollowing: false, followsYou: true },
        { id: 13, name: 'Tural Hasanov', username: 'tural_h', avatar: '', isFollowing: true, followsYou: false }
    ],
    'jafarmustafayev': [
        { id: 11, name: 'Ersin 🐘', username: 'ersin_ele', avatar: '', isFollowing: false, followsYou: true },
        { id: 12, name: 'Leyla Guliyeva', username: 'leyla_g', avatar: '', isFollowing: true, followsYou: true },
        { id: 14, name: 'Bülent Sakarya', username: 'bulentsakarya', avatar: '', isFollowing: true, followsYou: true }
    ]
};


export const mockProfiles = {
    'bulentsakarya': {
        name: 'Bülent Sakarya',
        username: 'bulentsakarya',
        bio: 'Building SaaS projects.',
        website: 'https://herkobi.com',
        joinedDate: 'Joined June 2026',
        followingCount: 156,
        followersCount: 52,
        postsCount: 49,
        followsYou: true,
        isFollowing: true,
        profilePhoto: null,
        coverPhoto: null
    },
    'jafarmustafayev': {
        name: 'Jafar Mustafayev',
        username: 'jafarmustafayev',
        bio: 'testing',
        website: '',
        joinedDate: 'Joined June 2026',
        followingCount: 3,
        followersCount: 4,
        postsCount: 4,
        followsYou: false,
        isFollowing: false,
        profilePhoto: null,
        coverPhoto: null
    }
};

export const mockUserPosts = {
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

export const mockPosts = [
        {
            Id: 5,
            ByUserName: 'Media Tester',
            Content: 'Here is a post demonstrating multi-image and video uploads! Click on any image or video to view it in full screen, zoom in/out, play the video, or download it.',
            UserProfileImageUrl: null,
            CreatedAt: new Date(Date.now() - 10 * 60 * 1000).toISOString(),
            Media: [
                { url: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800', type: 'image/jpeg' },
                { url: 'https://images.unsplash.com/photo-1734900236808-8868ce0990c2?w=800', type: 'image/jpeg' },
                { url: 'https://images.unsplash.com/photo-1734900236808-8868ce0990c2?w=800', type: 'image/jpeg' },
                { url: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=800', type: 'image/jpeg' },
                { url: 'https://images.unsplash.com/photo-1769031185750-17e50e35eb73?w=800', type: 'image/jpeg' },
                { url: 'https://images.unsplash.com/photo-1781824093311-803b9f9b7c5c?w=800', type: 'image/jpeg' }
            ]
        },
        {
            Id: 3,
            ByUserName: 'Jafar Mustafayev',
            Content: '',
            UserProfileImageUrl: null,
            CreatedAt: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
            RepostedPost: {
                Id: 4,
                ByUserName: 'Jafar Mustafayev',
                Content: 'mene mesaj yaza bilersiniz ? qarsi terefden mesaj gelende nece gorunur, hansi butonlar olur onu yoxlamaq isteyirem )',
                UserProfileImageUrl: null,
                CreatedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
                Media: [
                    { url: 'https://images.unsplash.com/photo-1781824093311-803b9f9b7c5c?w=800', type: 'image/jpeg' },
                ]
            }
        },
        {
            Id: 1,
            ByUserName: 'Jafar Mustafayev',
            Content: 'Welcome to Hukaa V2! Everything is built with Tailwind CSS.\n\nHere is some inline code: `const x = 5;` and a block of code:\n\n```javascript\nfunction greet(name) {\n  console.log("Hello, " + name);\n}\ngreet("Hukaa");\n```\n\nHope you like the new markdown and code sharing features!',
            UserProfileImageUrl: null,
            CreatedAt: '2026-06-10T00:00:00.000Z',
            RepostedPost: {
                id: 3,
                ByUserName: 'Jafar Mustafayev',
                Content: 'mene mesaj yaza bilersiniz ? qarsi terefden mesaj gelende nece gorunur, hansi butonlar olur onu yoxlamaq isteyirem )',
                UserProfileImageUrl: null,
                CreatedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
                Media: [
                    { url: 'https://images.unsplash.com/photo-1781824093311-803b9f9b7c5c?w=800', type: 'image/jpeg' },
                ],
                Content:"Ly8gc3JjL3BhZ2VzL0hvbWUuanN4CmltcG9ydCBSZWFjdCwgeyB1c2VTdGF0ZSwgdXNlRWZmZWN0IH0gZnJvbSAncmVhY3QnOwppbXBvcnQgQ3JlYXRlUG9zdCBmcm9tICcuLi9jb21wb25lbnRzL2ZlZWQvQ3JlYXRlUG9zdCc7CmltcG9ydCBQb3N0Q2FyZCBmcm9tICcuLi9jb21wb25lbnRzL2ZlZWQvUG9zdENhcmQnOwppbXBvcnQgeyBQb3N0U2tlbGV0b24gfSBmcm9tICcuLi9jb21wb25lbnRzL3NrZWxldG9ucy9pbmRleC5qcyc7CmltcG9ydCBUYWJzIGZyb20gJy4uL2NvbXBvbmVudHMvdWkvVGFicy5qc3gnOwoKY29uc3QgSG9tZSA9ICgpID0"
            }
        },
        {
            Id: 2,
            ByUserName: 'Admin',
            Content: 'This is a mock post to test the feed layout.',
            UserProfileImageUrl: null,
            CreatedAt: '2022-01-02T00:00:00.000Z',
        }
    ];
