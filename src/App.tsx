import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from '@/pages/Home';
import { useAppDispatch, useAppSelector } from './store/hooks';
import type { RootState } from './store';
import { getMe } from './store/slices/authSlice';
import { useEffect } from 'react';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { LoadingOverlay } from '@/components/ui/LoadingOverlay';
import { Login } from './components/auth/Login';
import Register from './components/auth/Register';
import DashboardPage from './components/dashboard/Dashboard';

function App() {
  const dispatch = useAppDispatch();
  const { user, loading } = useAppSelector((state: RootState) => state.auth);

  useEffect(() => {
    if (user) {
      dispatch(getMe());
    }
  }, [dispatch]);

  if (loading) {
    return <LoadingOverlay />
  }

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/" element={
          <ProtectedRoute>
            <Home />
          </ProtectedRoute>
        } />
        <Route path="/dashboard" element={
          <ProtectedRoute>
            <DashboardPage />
          </ProtectedRoute>
        } />
      </Routes>
    </Router>
  )
}

export default App