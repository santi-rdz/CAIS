import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import AppLayout from './ui/AppLayout'
import Dashboard from './pages/Dashboard'
import Auth from './pages/Auth'
import LoginForm from '@features/authenticaction/LoginForm'
import RegisterPage from './pages/RegisterPage'
import Users from './pages/Users'
import ProtectedRoute from '@ui/ProtectedRoute'
import Emergencies from './pages/Emergencies'
import EmergencyDetail from './pages/EmergencyDetail'
import Patients from './pages/Patients'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          element={
            <ProtectedRoute>
              <AppLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="dashboard" />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="pacientes" element={<Patients />} />
          <Route path="usuarios" element={<Users />} />
          <Route path="emergencias" element={<Emergencies />} />
          <Route path="emergencias/:id" element={<EmergencyDetail />} />
        </Route>
        <Route element={<Auth />}>
          <Route path="login" element={<LoginForm />} />

          <Route path="registro" element={<RegisterPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
export default App
