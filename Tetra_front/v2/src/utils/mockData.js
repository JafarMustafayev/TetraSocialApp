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
    },
    {
        id: 5,
        name: "Elvin Mammadov",
        username: "elvin_m",
        avatar: "",
        isFollowing: false
    },
    {
        id: 6,
        name: "Bülent Sakarya",
        username: "bulentsakarya",
        avatar: "",
        isFollowing: false
    },
    {
        id: 7,
        name: "Ersin 🐘",
        username: "ersin_ele",
        avatar: "",
        isFollowing: false
    },
    {
        id: 8,
        name: "Mert Cento 🎥",
        username: "mertcento",
        avatar: "",
        isFollowing: false
    },
    {
        id: 9,
        name: "Nigar Huseynova",
        username: "nigar_h",
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
            Content: 'Tetra layout is absolutely stunning! Proud of this work.',
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
            UserProfileImageUrl: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800",
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
            Content: 'Welcome to Tetra V2! Everything is built with Tailwind CSS.\n\nHere is some inline code: `const x = 5;` and a block of code:\n\n```javascript\nfunction greet(name) {\n  console.log("Hello, " + name);\n}\ngreet("Tetra");\n```\n\nHope you like the new markdown and code sharing features!',
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
                ]
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

export const mockSearchUsers = [
    { id: 1001, name: "Ahmet Yılmaz", username: "ahmet_y", isFollowing: false, followsYou: true },
    { id: 1002, name: "Elvin Mammadov", username: "elvin_m", isFollowing: true, followsYou: false },
    { id: 1003, name: "Leyla Guliyeva", username: "leyla_g", isFollowing: true, followsYou: true },
    { id: 1004, name: "Tural Hasanov", username: "tural_h", isFollowing: false, followsYou: false },
    { id: 1005, name: "Anar Aliyev", username: "anar_a", isFollowing: false, followsYou: true },
    { id: 1006, name: "Zaur Bagirov", username: "zaur_b", isFollowing: false, followsYou: false },
    { id: 1007, name: "Gunel Mammadova", username: "gunel_m", isFollowing: true, followsYou: true },
    { id: 1008, name: "Bülent Sakarya", username: "bulentsakarya", isFollowing: true, followsYou: true },
    { id: 1009, name: "Fidan Aliyeva", username: "fidan_a", isFollowing: false, followsYou: false },
    { id: 1010, name: "Nigar Huseynova", username: "nigar_h", isFollowing: false, followsYou: true },
    { id: 1011, name: "Rashad Sadigov", username: "rashad_s", isFollowing: true, followsYou: false },
    { id: 1012, name: "Orkhan Ismayilov", username: "orkhan_i", isFollowing: false, followsYou: false },
    { id: 1013, name: "Samira Rzayeva", username: "samira_r", isFollowing: false, followsYou: true },
    { id: 1014, name: "Vugar Karimov", username: "vugar_k", isFollowing: true, followsYou: false },
    { id: 1015, name: "Aysel Taghiyeva", username: "aysel_t", isFollowing: false, followsYou: false },
    { id: 1016, name: "Emin Huseynov", username: "emin_h", isFollowing: false, followsYou: true },
    { id: 1017, name: "Sabina Aliyeva", username: "sabina_a", isFollowing: true, followsYou: true },
    { id: 1018, name: "Farid Guliyev", username: "farid_g", isFollowing: false, followsYou: false },
    { id: 1019, name: "Gunay Hasanova", username: "gunay_h", isFollowing: false, followsYou: true },
    { id: 1020, name: "Murad Ibrahimov", username: "murad_i", isFollowing: true, followsYou: false }
];

export const mockSearchPosts = [
    {
        Id: 2001,
        ByUserName: "Tural Hasanov",
        Content: "Tetra V2 search module is coming along nicely! Really love the design system.",
        UserProfileImageUrl: null,
        CreatedAt: new Date(Date.now() - 5 * 60 * 1000).toISOString()
    },
    {
        Id: 2002,
        ByUserName: "Leyla Guliyeva",
        Content: "Just finished building the new layout. Dark mode looks absolutely gorgeous in React + Tailwind!",
        UserProfileImageUrl: null,
        CreatedAt: new Date(Date.now() - 30 * 60 * 1000).toISOString()
    },
    {
        Id: 2003,
        ByUserName: "Bülent Sakarya",
        Content: "Is anyone else testing the WebSocket real-time messaging? Let me know if you hit any bugs.",
        UserProfileImageUrl: null,
        CreatedAt: new Date(Date.now() - 2 * 3600 * 1000).toISOString()
    },
    {
        Id: 2004,
        ByUserName: "Ahmet Yılmaz",
        Content: "Working on the backend API today. Designing a standardized JSON response wrapper.",
        UserProfileImageUrl: null,
        CreatedAt: new Date(Date.now() - 4 * 3600 * 1000).toISOString()
    },
    {
        Id: 2005,
        ByUserName: "Jafar Mustafayev",
        Content: "We need to ensure the app is 100% responsive on all screen sizes.",
        UserProfileImageUrl: null,
        CreatedAt: new Date(Date.now() - 6 * 3600 * 1000).toISOString()
    },
    {
        Id: 2006,
        ByUserName: "Gunel Mammadova",
        Content: "Having fun with React hooks. useState and useEffect make state sync so much simpler.",
        UserProfileImageUrl: null,
        CreatedAt: new Date(Date.now() - 12 * 3600 * 1000).toISOString()
    },
    {
        Id: 2007,
        ByUserName: "Anar Aliyev",
        Content: "Just posted a new update! Check out the details page on my profile.",
        UserProfileImageUrl: null,
        CreatedAt: new Date(Date.now() - 24 * 3600 * 1000).toISOString()
    },
    {
        Id: 2008,
        ByUserName: "Samira Rzayeva",
        Content: "Beautiful morning! Ready to commit some clean code today. #BuildInPublic",
        UserProfileImageUrl: null,
        CreatedAt: new Date(Date.now() - 30 * 3600 * 1000).toISOString()
    },
    {
        Id: 2009,
        ByUserName: "Admin",
        Content: "System maintenance completed. Performance optimizations are now live.",
        UserProfileImageUrl: null,
        CreatedAt: new Date(Date.now() - 2 * 24 * 3600 * 1000).toISOString()
    },
    {
        Id: 2010,
        ByUserName: "Rashad Sadigov",
        Content: "A quick tip: Always specify min-w-0 on flex children to prevent text overflow bugs in CSS Flexbox.",
        UserProfileImageUrl: null,
        CreatedAt: new Date(Date.now() - 3 * 24 * 3600 * 1000).toISOString()
    },
    {
        Id: 2011,
        ByUserName: "Nigar Huseynova",
        Content: "Just wrote some unit tests for our authentication validation logic. Green all across!",
        UserProfileImageUrl: null,
        CreatedAt: new Date(Date.now() - 4 * 24 * 3600 * 1000).toISOString()
    },
    {
        Id: 2012,
        ByUserName: "Orkhan Ismayilov",
        Content: "Does anyone want to test the multi-image viewer modal? Click to zoom works nicely.",
        UserProfileImageUrl: null,
        CreatedAt: new Date(Date.now() - 5 * 24 * 3600 * 1000).toISOString()
    },
    {
        Id: 2013,
        ByUserName: "Aysel Taghiyeva",
        Content: "Tailwind CSS styling is so rapid. I cannot imagine returning to raw vanilla CSS styles.",
        UserProfileImageUrl: null,
        CreatedAt: new Date(Date.now() - 6 * 24 * 3600 * 1000).toISOString()
    },
    {
        Id: 2014,
        ByUserName: "Vugar Karimov",
        Content: "Exploring React Router layout routing and nested routes. It makes page architecture so clean.",
        UserProfileImageUrl: null,
        CreatedAt: new Date(Date.now() - 7 * 24 * 3600 * 1000).toISOString()
    },
    {
        Id: 2015,
        ByUserName: "Sabina Aliyeva",
        Content: "Base64 string wrapping bugs are the worst. Glad we found the overflow-wrap fix!",
        UserProfileImageUrl: null,
        CreatedAt: new Date(Date.now() - 8 * 24 * 3600 * 1000).toISOString()
    },
    {
        Id: 2016,
        ByUserName: "Emin Huseynov",
        Content: "Keep your state close to where it is used. Avoid global state where possible.",
        UserProfileImageUrl: null,
        CreatedAt: new Date(Date.now() - 9 * 24 * 3600 * 1000).toISOString()
    },
    {
        Id: 2017,
        ByUserName: "Farid Guliyev",
        Content: "Creating mock data for testing. Real-world scenarios are the best to mock.",
        UserProfileImageUrl: null,
        CreatedAt: new Date(Date.now() - 10 * 24 * 3600 * 1000).toISOString()
    },
    {
        Id: 2018,
        ByUserName: "Gunay Hasanova",
        Content: "Working on settings forms with react-hook-form. Validation is smooth and clean.",
        UserProfileImageUrl: null,
        CreatedAt: new Date(Date.now() - 11 * 24 * 3600 * 1000).toISOString()
    },
    {
        Id: 2019,
        ByUserName: "Murad Ibrahimov",
        Content: "Vite build speed is incredibly fast compared to old Webpack setups.",
        UserProfileImageUrl: null,
        CreatedAt: new Date(Date.now() - 12 * 24 * 3600 * 1000).toISOString()
    },
    {
        Id: 2020,
        ByUserName: "Jafar Mustafayev",
        Content: "Ready to merge search feature branch! Everything looks clean.",
        UserProfileImageUrl: null,
        CreatedAt: new Date(Date.now() - 13 * 24 * 3600 * 1000).toISOString()
    }
];

export const mockNotifications = [
    {
        id: 1,
        type: 'follow',
        createdAt: new Date(Date.now() - 10 * 60 * 1000).toISOString(), // 10m ago
        actor: { name: 'Leyla Guliyeva', username: 'leyla_g' },
        read: false
    },
    {
        id: 2,
        type: 'like',
        createdAt: new Date(Date.now() - 25 * 60 * 1000).toISOString(), // 25m ago
        actor: { name: 'Tural Hasanov', username: 'tural_h' },
        post: { id: 1, content: 'Welcome to Tetra V2! Everything is built with Tailwind CSS.' },
        read: false
    },
    {
        id: 3,
        type: 'mention',
        createdAt: new Date(Date.now() - 2 * 3600 * 1000).toISOString(), // 2h ago
        actor: { name: 'Bülent Sakarya', username: 'bulentsakarya' },
        post: { id: 5, content: 'Here is a post demonstrating @jafarmustafayev mentions!' },
        read: true
    },
    {
        id: 4,
        type: 'comment',
        createdAt: new Date(Date.now() - 4 * 3600 * 1000).toISOString(), // 4h ago
        actor: { name: 'Anar Aliyev', username: 'anar_a' },
        post: { id: 1, content: 'Welcome to Tetra V2! Everything is built with Tailwind CSS.' },
        comment: { content: 'This looks amazing! Keep up the great work.' },
        read: true
    },
    {
        id: 5,
        type: 'system',
        createdAt: new Date(Date.now() - 1 * 24 * 3600 * 1000).toISOString(), // 1d ago
        text: 'Your email has been successfully verified. Security options are now available.',
        read: true
    },
    {
        id: 6,
        type: 'follow',
        createdAt: new Date(Date.now() - 1.5 * 24 * 3600 * 1000).toISOString(),
        actor: { name: 'Zaur Bagirov', username: 'zaur_b' },
        read: true
    },
    {
        id: 7,
        type: 'like',
        createdAt: new Date(Date.now() - 2 * 24 * 3600 * 1000).toISOString(),
        actor: { name: 'Leyla Guliyeva', username: 'leyla_g' },
        post: { id: 1, content: 'Welcome to Tetra V2! Everything is built with Tailwind CSS.' },
        read: true
    },
    {
        id: 8,
        type: 'comment',
        createdAt: new Date(Date.now() - 3 * 24 * 3600 * 1000).toISOString(),
        actor: { name: 'Tural Hasanov', username: 'tural_h' },
        post: { id: 2, content: 'This is a mock post to test the feed layout.' },
        comment: { content: 'Agreed, this layout test is passing nicely.' },
        read: true
    },
    {
        id: 9,
        type: 'mention',
        createdAt: new Date(Date.now() - 4 * 24 * 3600 * 1000).toISOString(),
        actor: { name: 'Ahmet Yılmaz', username: 'ahmet_y' },
        post: { id: 2004, content: 'Let us check standard layout with @jafarmustafayev.' },
        read: true
    },
    {
        id: 10,
        type: 'system',
        createdAt: new Date(Date.now() - 5 * 24 * 3600 * 1000).toISOString(),
        text: 'Welcome to Tetra Frontend V2! Enjoy the new high-performance feed experience.',
        read: true
    },
    {
        id: 11,
        type: 'follow',
        createdAt: new Date(Date.now() - 6 * 24 * 3600 * 1000).toISOString(),
        actor: { name: 'Gunel Mammadova', username: 'gunel_m' },
        read: true
    },
    {
        id: 12,
        type: 'like',
        createdAt: new Date(Date.now() - 7 * 24 * 3600 * 1000).toISOString(),
        actor: { name: 'Anar Aliyev', username: 'anar_a' },
        post: { id: 1, content: 'Welcome to Tetra V2! Everything is built with Tailwind CSS.' },
        read: true
    },
    {
        id: 13,
        type: 'comment',
        createdAt: new Date(Date.now() - 8 * 24 * 3600 * 1000).toISOString(),
        actor: { name: 'Leyla Guliyeva', username: 'leyla_g' },
        post: { id: 1, content: 'Welcome to Tetra V2! Everything is built with Tailwind CSS.' },
        comment: { content: 'Is dark mode fully active now?' },
        read: true
    },
    {
        id: 14,
        type: 'mention',
        createdAt: new Date(Date.now() - 9 * 24 * 3600 * 1000).toISOString(),
        actor: { name: 'Tural Hasanov', username: 'tural_h' },
        post: { id: 2001, content: 'Design changes are amazing. Kudos to @jafarmustafayev!' },
        read: true
    },
    {
        id: 15,
        type: 'follow',
        createdAt: new Date(Date.now() - 10 * 24 * 3600 * 1000).toISOString(),
        actor: { name: 'Fidan Aliyeva', username: 'fidan_a' },
        read: true
    },
    {
        id: 16,
        type: 'like',
        createdAt: new Date(Date.now() - 11 * 24 * 3600 * 1000).toISOString(),
        actor: { name: 'Samira Rzayeva', username: 'samira_r' },
        post: { id: 1, content: 'Welcome to Tetra V2! Everything is built with Tailwind CSS.' },
        read: true
    },
    {
        id: 17,
        type: 'comment',
        createdAt: new Date(Date.now() - 12 * 24 * 3600 * 1000).toISOString(),
        actor: { name: 'Bülent Sakarya', username: 'bulentsakarya' },
        post: { id: 1, content: 'Welcome to Tetra V2! Everything is built with Tailwind CSS.' },
        comment: { content: 'Yes, looking forward to the settings screen.' },
        read: true
    },
    {
        id: 18,
        type: 'system',
        createdAt: new Date(Date.now() - 13 * 24 * 3600 * 1000).toISOString(),
        text: 'A login was detected from a new browser or device. If this was not you, change your password.',
        read: true
    },
    {
        id: 19,
        type: 'follow',
        createdAt: new Date(Date.now() - 14 * 24 * 3600 * 1000).toISOString(),
        actor: { name: 'Nigar Huseynova', username: 'nigar_h' },
        read: true
    },
    {
        id: 20,
        type: 'like',
        createdAt: new Date(Date.now() - 15 * 24 * 3600 * 1000).toISOString(),
        actor: { name: 'Rashad Sadigov', username: 'rashad_s' },
        post: { id: 1, content: 'Welcome to Tetra V2! Everything is built with Tailwind CSS.' },
        read: true
    }
];

export const mockFolders = [
    { id: 101, name: "Development 💻", postIds: [1, 2001] },
    { id: 102, name: "Media & Insp 🎨", postIds: [5, 2002] }
];

export const mockBookmarks = [
    {
        Id: 1,
        ByUserName: 'Jafar Mustafayev',
        Content: 'Welcome to Tetra V2! Everything is built with Tailwind CSS.\n\nHere is some inline code: `const x = 5;` and a block of code:\n\n```javascript\nfunction greet(name) {\n  console.log("Hello, " + name);\n}\ngreet("Tetra");\n```\n\nHope you like the new markdown and code sharing features!',
        UserProfileImageUrl: null,
        CreatedAt: '2026-06-10T00:00:00.000Z'
    },
    {
        Id: 5,
        ByUserName: 'Media Tester',
        Content: 'Here is a post demonstrating multi-image and video uploads! Click on any image or video to view it in full screen, zoom in/out, play the video, or download it.',
        UserProfileImageUrl: null,
        CreatedAt: new Date(Date.now() - 10 * 60 * 1000).toISOString(),
        Media: [
            { url: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800', type: 'image/jpeg' },
            { url: 'https://images.unsplash.com/photo-1734900236808-8868ce0990c2?w=800', type: 'image/jpeg' }
        ]
    },
    {
        Id: 2001,
        ByUserName: "Tural Hasanov",
        Content: "Tetra V2 search module is coming along nicely! Really love the design system.",
        UserProfileImageUrl: null,
        CreatedAt: new Date(Date.now() - 5 * 60 * 1000).toISOString()
    },
    {
        Id: 2002,
        ByUserName: "Leyla Guliyeva",
        Content: "Just finished building the new layout. Dark mode looks absolutely gorgeous in React + Tailwind!",
        UserProfileImageUrl: null,
        CreatedAt: new Date(Date.now() - 30 * 60 * 1000).toISOString()
    }
];

export const mockLikedPosts = [
    {
        Id: 2,
        ByUserName: 'Admin',
        Content: 'This is a mock post to test the feed layout.',
        UserProfileImageUrl: null,
        CreatedAt: '2022-01-02T00:00:00.000Z'
    },
    {
        Id: 3,
        ByUserName: 'Jafar Mustafayev',
        Content: 'Working on Tetra V2 bookmarks screen!',
        UserProfileImageUrl: null,
        CreatedAt: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString()
    }
];

export const mockArchivedPosts = [
    {
        Id: 901,
        ByUserName: 'Jafar Mustafayev',
        Content: 'Bu post arxiv edilmişdir. Sadece siz bu postu görebilirsiniz.',
        UserProfileImageUrl: null,
        CreatedAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString()
    },
    {
        Id: 902,
        ByUserName: 'Jafar Mustafayev',
        Content: 'Köhnə layihənin dizayn qaralamaları #Tetra #Archive',
        UserProfileImageUrl: null,
        CreatedAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
        Media: [
            { url: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=800', type: 'image/jpeg' }
        ]
    }
];
