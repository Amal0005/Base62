import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import Register from './Register';
import Login from './Login';
import VerifyOtp from './VerifyOtp';
import Dashboard from './Dashboard';
import { ProtectedRoute, PublicRoute } from './components/RouteGuards';
import AnimatedBackground from './components/AnimatedBackground';

function App() {
  const location = useLocation();
  
  return (
    <>
      <AnimatedBackground />
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route element={<PublicRoute />}>
            <Route path="/" element={<Register />} />
            <Route path="/login" element={<Login />} />
            <Route path="/verify-otp" element={<VerifyOtp />} />
          </Route>
          
          <Route element={<ProtectedRoute />}>
            <Route path="/dashboard" element={<Dashboard />} />
          </Route>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AnimatePresence>
    </>
  );
}

export default App;
