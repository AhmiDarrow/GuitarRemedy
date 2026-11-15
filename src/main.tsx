import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App'
import { localeForFirstPaint } from './i18n/boot'
import { initI18n } from './i18n/runtime'
import { useAppStore } from './store/appStore'
import './index.css'

async function boot() {
  try {
    if (!useAppStore.persist.hasHydrated()) {
      await useAppStore.persist.rehydrate()
    }
  } catch {
    /* render with defaults */
  }
  let saved: string | null = null
  try {
    saved = localStorage.getItem('guitar-remedy-v1')
  } catch {
    saved = null
  }
  const locale = localeForFirstPaint(saved)
  if (useAppStore.getState().locale !== locale) {
    useAppStore.setState({ locale })
  }
  await initI18n(locale)
  createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </StrictMode>,
  )
}

void boot()
