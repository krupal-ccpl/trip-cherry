import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { BrowserRouter } from 'react-router-dom'
import { ThemeProvider as MTThemeProvider } from "@material-tailwind/react";
import { ThemeProvider } from './contexts/ThemeContext';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter basename="/trip-cherry">
      <MTThemeProvider>
        <ThemeProvider>
          <App />
        </ThemeProvider>
      </MTThemeProvider>
    </BrowserRouter>
  </StrictMode>,
)
