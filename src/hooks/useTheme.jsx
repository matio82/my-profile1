import { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(() => {
    const savedTheme = localStorage.getItem('theme');
    console.log('🎨 Initial theme from localStorage:', savedTheme);
    return savedTheme || 'light';
  });

  useEffect(() => {
    console.log('💾 Saving theme to localStorage:', theme);
    localStorage.setItem('theme', theme);
    
    if (theme === 'dark') {
      console.log('🌙 Adding dark class');
      document.documentElement.classList.add('dark');
    } else {
      console.log('☀️ Removing dark class');
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  const toggleTheme = () => {
    console.log('🔄 Toggle theme called. Current:', theme);
    setTheme(prevTheme => {
      const newTheme = prevTheme === 'dark' ? 'light' : 'dark';
      console.log('➡️ New theme:', newTheme);
      return newTheme;
    });
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
};
