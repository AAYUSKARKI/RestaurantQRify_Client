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
import TablesPage from './components/tables/tables';
import MenuPage from './components/menu/menu';
import POSPage from './components/pos/pos';
import KitchenPage from './components/kitchen/kitchen';
import BillsPage from './components/bills/bills';
import ReservationsPage from './components/reservations/reservations';
import SettingsPage from './components/settings/settings';
import AuditLogPage from './components/auditlogs/auditlogs';
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
        <Route path="/tables" element={
          <ProtectedRoute>
            <TablesPage />
          </ProtectedRoute>
        } />
        <Route path="/menu" element={
          <ProtectedRoute>
            <MenuPage />
          </ProtectedRoute>
        } />
        <Route path="/pos" element={
          <ProtectedRoute>
            <POSPage />
          </ProtectedRoute>
        } />
        <Route path="/kitchen" element={
          <ProtectedRoute>
            <KitchenPage />
          </ProtectedRoute> 
        } />
        <Route path="/bills" element={
          <ProtectedRoute>
            <BillsPage />
          </ProtectedRoute>
        } />
        <Route path="/reservations" element={
          <ProtectedRoute>
            <ReservationsPage />
          </ProtectedRoute>
        } />
        <Route path="/auditlog" element={
          <ProtectedRoute>
            <AuditLogPage />
          </ProtectedRoute>
        } />
        <Route path="/settings" element={
          <ProtectedRoute>
            <SettingsPage />
          </ProtectedRoute>
        } />
      </Routes>
    </Router>
  )
}

export default App