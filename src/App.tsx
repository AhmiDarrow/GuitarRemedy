import { useEffect } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import { AppShell } from './components/AppShell'
import { HomePage } from './pages/HomePage'
import { LearnPage } from './pages/LearnPage'
import { LibraryPage } from './pages/LibraryPage'
import { PracticePage } from './pages/PracticePage'
import { UploadPage } from './pages/UploadPage'
import { ProfilePage } from './pages/ProfilePage'
import { AboutPage } from './pages/AboutPage'
import { WikiPage } from './pages/WikiPage'
import { Onboarding } from './components/Onboarding'
import { useAppStore } from './store/appStore'
import { setPlaybackA4 } from './lib/audio'

export default function App() {
  const onboarded = useAppStore((s) => s.onboarded)
  const a4 = useAppStore((s) => s.a4)

  // Keep Tone playback concert pitch in sync with Profile A4 (incl. rehydrate).
  useEffect(() => {
    setPlaybackA4(a4)
  }, [a4])

  return (
    <>
      {!onboarded && <Onboarding />}
      <Routes>
        <Route element={<AppShell />}>
          <Route index element={<HomePage />} />
          <Route path="learn" element={<LearnPage />} />
          <Route path="learn/:day" element={<LearnPage />} />
          <Route path="library" element={<LibraryPage />} />
          <Route path="practice" element={<PracticePage />} />
          <Route path="upload" element={<UploadPage />} />
          <Route path="wiki" element={<WikiPage />} />
          <Route path="wiki/:slug" element={<WikiPage />} />
          <Route path="profile" element={<ProfilePage />} />
          <Route path="about" element={<AboutPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </>
  )
}
