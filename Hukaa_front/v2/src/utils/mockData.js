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
