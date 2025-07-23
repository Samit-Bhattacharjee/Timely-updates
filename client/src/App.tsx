import { AuthProvider, useAuth } from "./contexts/auth-contexts"
import LandingPage from "./components/landing-page"
import { Dashboard } from "./components/dashboard"
import { Toaster } from "sonner"
import { BrowserRouter } from "react-router-dom"

function AppContent() {
  const { isAuthenticated } = useAuth()
  return isAuthenticated ? <Dashboard /> : <LandingPage />
}

export default function Page() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppContent />
        <Toaster />
      </AuthProvider>
    </BrowserRouter>
  )
}
