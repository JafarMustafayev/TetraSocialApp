// src/context/ThemeContext.jsx
import {
    createContext,
    useContext,
    useEffect,
    useState
} from 'react';

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
    const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');
    const [isDark, setIsDark] = useState(() => {
        const savedTheme = localStorage.getItem('theme') || 'light';
        const lower = savedTheme.toLowerCase();
        if (lower === 'dark') return true;
        if (lower === 'system') {
            return window.matchMedia('(prefers-color-scheme: dark)').matches;
        }
        return false;
    });

    useEffect(() => {
        const root = window.document.documentElement;
        const lowerTheme = theme?.toLowerCase();

        const updateThemeClass = (dark) => {
            setIsDark(dark);
            if (dark) {
                root.classList.add('dark');
            } else {
                root.classList.remove('dark');
            }
        };

        if (lowerTheme === 'dark') {
            updateThemeClass(true);
        } else if (lowerTheme === 'light') {
            updateThemeClass(false);
        } else if (lowerTheme === 'system') {
            const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
            updateThemeClass(mediaQuery.matches);

            const handleChange = (e) => {
                updateThemeClass(e.matches);
            };

            if (mediaQuery.addEventListener) {
                mediaQuery.addEventListener('change', handleChange);
            } else if (mediaQuery.addListener) {
                mediaQuery.addListener(handleChange);
            }

            return () => {
                if (mediaQuery.removeEventListener) {
                    mediaQuery.removeEventListener('change', handleChange);
                } else if (mediaQuery.removeListener) {
                    mediaQuery.removeListener(handleChange);
                }
            };
        } else {
            updateThemeClass(false);
        }

        localStorage.setItem('theme', theme);
    }, [theme]);

    const toggleTheme = () => {
        setTheme(prev => {
            const lower = prev?.toLowerCase();
            if (lower === 'system') {
                const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
                return systemPrefersDark ? 'light' : 'dark';
            }
            return lower === 'light' ? 'dark' : 'light';
        });
    };

    return (
        <ThemeContext.Provider value={{ theme, toggleTheme, setTheme, isDark }}>
            {children}
        </ThemeContext.Provider>
    );
};

export const useTheme = () => useContext(ThemeContext);
