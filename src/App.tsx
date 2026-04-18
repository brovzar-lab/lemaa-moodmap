import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { SignInPage } from './pages/SignInPage'
import { LogPage } from './pages/LogPage'
import { DashboardPage } from './pages/DashboardPage'
import { CorrelationsPage } from './pages/CorrelationsPage'
import { ProtectedRoute } from './components/ProtectedRoute'
import { Layout } from './components/Layout'

const queryClient = new QueryClient()

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<SignInPage />} />
      <Route
        path="/log"
        element={
          <ProtectedRoute>
            <Layout>
              <LogPage />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Layout>
              <DashboardPage />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/correlations"
        element={
          <ProtectedRoute>
            <Layout>
              <CorrelationsPage />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </QueryClientProvider>
  )
}
