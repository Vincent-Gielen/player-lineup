import { useContext } from 'react';
import { ThemeContext } from './Theme.context';

export const themes = {
  dark: 'dark',
  light: 'light',
};

export const useTheme = () => useContext(ThemeContext);

export const useThemeColors = () => {
  const { theme, textTheme } = useContext(ThemeContext);
  return { theme, textTheme };
};
