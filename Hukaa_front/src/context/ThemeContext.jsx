import React, { createContext, useContext, useEffect, useState } from 'react';

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
    const [theme, setTheme] = useState(() => {
        return localStorage.getItem('theme') || 'auto';
    });

    useEffect(() => {
        const root = window.document.documentElement;

        const applyTheme = (currentTheme) => {
            root.classList.remove('light', 'dark');

            if (currentTheme === 'auto') {
                const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
                root.classList.add(systemDark ? 'dark' : 'light');
            } else {
                root.classList.add(currentTheme);
            }
        };

        applyTheme(theme);
        localStorage.setItem('theme', theme);

        // Listen for system preference changes if in auto mode
        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        const handleChange = () => {
            if (theme === 'auto') {
                applyTheme('auto');
            }
        };

        mediaQuery.addEventListener('change', handleChange);
        return () => mediaQuery.removeEventListener('change', handleChange);
    }, [theme]);

    return (
        <ThemeContext.Provider value={{ theme, setTheme }}>
            {children}
        </ThemeContext.Provider>
    );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useTheme = () => useContext(ThemeContext);
