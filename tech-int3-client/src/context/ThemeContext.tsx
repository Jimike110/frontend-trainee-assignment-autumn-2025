import { createContext, useContext } from 'react';

export interface ThemeContentType {
    mode: 'light' | 'dark';
    toggleTheme: () => void;
}

export const ThemeContext = createContext<ThemeContentType>({
    mode: 'light',
    toggleTheme: () => {},
});

export const useTheme = () => useContext(ThemeContext);