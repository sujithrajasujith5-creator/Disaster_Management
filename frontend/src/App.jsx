import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { useAuth } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import LoadingSpinner from './components/LoadingSpinner';

import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import Dashboard from './pages/Dashboard';
import CreateReport from './pages/CreateReport';
import MyReports from './pages/MyReports';
import ReportDetail from './pages/ReportDetail';
import AdminPage from './pages/AdminPage';
import AdminReports from './pages/AdminReports';
import AdminResolve from './pages/AdminResolve';
import AdminAnalytics from './pages/AdminAnalytics';
import EmergencyAlerts from './pages/EmergencyAlerts';
import EditReport from './pages/EditReport';
import Notifications from './pages/Notifications';

const PageWrapper = ({ children }) => (
  <motion.div
    initial={{ opacity: 0, y: 18, filter: 'blur(8px)' }}
    animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
    exit={{ opacity: 0, y: -10, filter: 'blur(6px)' }}
    transition={{ duration: 0.32, ease: 'easeOut' }}
    className="min-h-screen"
  >
    {children}
  </motion.div>
);

const App = () => {
  const { user, loading } = useAuth();
  const location = useLocation();

  const getRedirectPath = () => {
    if (!user) return '/dashboard';
    if (user.role === 'admin') return '/admin';
    return '/dashboard';
  };

  if (loading) return <LoadingSpinner fullScreen />;

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/login" element={user ? <Navigate to={getRedirectPath()} /> : <PageWrapper><Login /></PageWrapper>} />
        <Route path="/register" element={user ? <Navigate to={getRedirectPath()} /> : <PageWrapper><Register /></PageWrapper>} />
        <Route path="/forgot-password" element={<PageWrapper><ForgotPassword /></PageWrapper>} />
        <Route path="/reset-password/:token" element={<PageWrapper><ResetPassword /></PageWrapper>} />

        <Route path="/dashboard" element={<ProtectedRoute roles={['user']}><PageWrapper><Dashboard /></PageWrapper></ProtectedRoute>} />
        <Route path="/reports/new" element={<ProtectedRoute roles={['user']}><PageWrapper><CreateReport /></PageWrapper></ProtectedRoute>} />
        <Route path="/reports" element={<ProtectedRoute roles={['user']}><PageWrapper><MyReports /></PageWrapper></ProtectedRoute>} />
        <Route path="/reports/:id/edit" element={<ProtectedRoute roles={['user']}><PageWrapper><EditReport /></PageWrapper></ProtectedRoute>} />
        <Route path="/reports/:id" element={<ProtectedRoute roles={['user']}><PageWrapper><ReportDetail /></PageWrapper></ProtectedRoute>} />

        <Route path="/admin" element={<ProtectedRoute roles={['admin']}><PageWrapper><AdminPage /></PageWrapper></ProtectedRoute>} />
        <Route path="/admin/reports" element={<ProtectedRoute roles={['admin']}><PageWrapper><AdminReports /></PageWrapper></ProtectedRoute>} />
        <Route path="/admin/reports/:id" element={<ProtectedRoute roles={['admin']}><PageWrapper><AdminResolve /></PageWrapper></ProtectedRoute>} />
        <Route path="/admin/analytics" element={<ProtectedRoute roles={['admin']}><PageWrapper><AdminAnalytics /></PageWrapper></ProtectedRoute>} />
        <Route path="/admin/alerts" element={<ProtectedRoute roles={['admin']}><PageWrapper><EmergencyAlerts /></PageWrapper></ProtectedRoute>} />

        <Route path="/notifications" element={<ProtectedRoute><PageWrapper><Notifications /></PageWrapper></ProtectedRoute>} />

        <Route path="/" element={<Navigate to={getRedirectPath()} replace />} />
        <Route path="*" element={<Navigate to={getRedirectPath()} replace />} />
      </Routes>
    </AnimatePresence>
  );
};

export default App;
