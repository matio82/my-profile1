import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import './index.css';
import App from './App.jsx';
import { ThemeProvider } from './hooks/useTheme.jsx';
import { LanguageProvider } from './hooks/useLanguage.jsx';
import ErrorBoundary from './components/common/ErrorBoundary.jsx';

// BrowserRouter بیرون از LanguageProvider قرار می‌گیره چون زبان از روی مسیر URL تشخیص داده می‌شه
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ErrorBoundary>
      <BrowserRouter>
        <LanguageProvider>
          <ThemeProvider>
            <App />
          </ThemeProvider>
        </LanguageProvider>
      </BrowserRouter>
    </ErrorBoundary>
  </StrictMode>,
);
