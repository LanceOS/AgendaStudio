import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '../../library/styles/theme.css'
import '../../library/styles/library.css'
import './index.css'
import App from './App.tsx'
import { applyThemePreference, getStoredThemePreference } from '../../library/utilities/themeEngine'

// Initialize the premium theme engine
applyThemePreference(getStoredThemePreference())

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
