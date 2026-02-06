import { HashRouter, Navigate, Route, Routes } from 'react-router-dom'
import { LaunchPadPage } from '@/pages/LaunchPadPage'
import { ChatPage } from '@/pages/ChatPage'
import { SettingsPage } from '@/pages/SettingsPage'

export default function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<ChatPage />} />
        <Route path="/chat" element={<ChatPage />} />
        <Route path="/launch" element={<LaunchPadPage />} />
        <Route path="/settings" element={<SettingsPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </HashRouter>
  )
}
