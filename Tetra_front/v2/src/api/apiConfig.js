// src/api/apiConfig.js

export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// Assets

import lightLogo from '../assets/images/icon_light.svg';
import darkLogo from '../assets/images/icon.svg';

export const getLogo = (theme) =>
    theme === 'dark' ? darkLogo : lightLogo;

