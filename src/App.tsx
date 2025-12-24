import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from '@/pages/Home';
import { useAppDispatch, useAppSelector } from './store/hooks';
import type { RootState } from './store';
import { getMe } from './store/slices/authSlice';
import { useEffect } from 'react';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { LoadingOverlay } from '@/components/ui/LoadingOverlay';

function App() {
  const dispatch = useAppDispatch();
  const { user, loading } = useAppSelector((state: RootState) => state.auth);

  if (loading) {
    return <LoadingOverlay />
  }
  useEffect(() => {
    if (user) {
      dispatch(getMe());
    }
  }, [dispatch]);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/dashboard" element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        } />
      </Routes>
    </Router>
  )
}

export default App