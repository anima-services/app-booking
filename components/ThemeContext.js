import React, { createContext, useState, useContext, useEffect, useMemo } from 'react';
import { useSelector, useDispatch } from "react-redux";
import { setState } from "./data/DataSlice";

// Базовые темы
const baseThemes = {
  light: {
    dark: "#FFFFFF",
    light: "#2F2F2F",
    free: "#71EB8C",
    busy: "#FF6567",
    container: "#F6F6F6",
    lightContainer: "#FFFFFF",
    lightGray: "#808080",
    // Добавьте другие цвета по необходимости
  },
  dark: {
    dark: "#181818",
    light: "#FFFFFF",
    free: "#71EB8C",
    busy: "#FF6567",
    container: "#2F2F2F",
    lightContainer: "#4F4F4F",
    lightGray: "#808080",
    // Добавьте другие цвета по необходимости
  },
};

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const data = useSelector(state => state.data);
  const dispatch = useDispatch();
  
  // Состояния
  const [themeName, setThemeName] = useState(data.themeName ?? 'dark');
  const [customColors, setCustomColors] = useState(data.customColors ?? {});

  // Переключение темы
  const toggleTheme = () => {
    setThemeName(prev => prev === 'light' ? 'dark' : 'light');
  };

  // Установка кастомного цвета
  const setColor = (colorKey, colorValue) => {
    setCustomColors(prev => ({
      ...prev,
      [colorKey]: colorValue
    }));
  };

  // Сброс цвета к значению темы
  const resetColor = (colorKey) => {
    setCustomColors(prev => {
      const newColors = { ...prev };
      delete newColors[colorKey];
      return newColors;
    });
  };

  // Сброс всех кастомных цветов
  const resetAllColors = () => {
    setCustomColors({});
  };

  // Формирование текущей темы с учетом кастомных цветов
  const theme = useMemo(() => {
    const baseTheme = baseThemes[themeName];
    
    return {
      ...baseTheme,
      ...customColors,
      
      // Методы для удобства
      isLight: themeName === 'light',
      isDark: themeName === 'dark',
    };
  }, [themeName, customColors]);

  // Сохранение в Redux
  useEffect(() => {
    dispatch(setState({ 
      themeName,
      customColors 
    }));
  }, [themeName, customColors]);

  // Экспортируемые значения
  const contextValue = {
    theme,
    themeName,
    customColors,
    toggleTheme,
    setColor,
    resetColor,
    resetAllColors,
    availableColors: Object.keys(baseThemes.light) // Все возможные цвета
  };

  return (
    <ThemeContext.Provider value={contextValue}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);