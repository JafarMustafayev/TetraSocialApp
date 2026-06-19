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