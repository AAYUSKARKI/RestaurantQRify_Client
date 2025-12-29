import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from '@/pages/Home';
import { useAppDispatch } from './store/hooks';
import { getMe } from './store/slices/authSlice';
import { useEffect } from 'react';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
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
import HealthDashboard from './components/health/health';
import AddStaffPage from './components/auth/Register';
import ManageStaff from './components/staff/Staff';
import Unauthorized from './pages/Unauthorized';
import LandingPage from './pages/Landingpage';
import { ModeToggle } from './components/mode-toggle';
import NotFound from './pages/NotFound';

function App() {
  const dispatch = useAppDispatch();

  // useEffect(() => {
  //     dispatch(getMe());
  // }, [dispatch]);

  return (
    <Router>
      {/* <ModeToggle /> */}
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/unauthorized" element={<Unauthorized />} />
        <Route path="/" element={<LandingPage />} />
        {/* <Route path="/" element={
          <ProtectedRoute>
            <Home />
          </ProtectedRoute>
        } /> */}
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
        <Route path="/addstaff" element={
          <ProtectedRoute>
            <AddStaffPage />
          </ProtectedRoute>
        } />
        <Route path="/managestaff" element={
          <ProtectedRoute>
            <ManageStaff />
          </ProtectedRoute>
        } />
        <Route path="/health" element={
          <ProtectedRoute>
            <HealthDashboard />
          </ProtectedRoute>
        } />
        <Route path="/settings" element={
          <ProtectedRoute>
            <SettingsPage />
          </ProtectedRoute>
        } />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  )
}

export default App