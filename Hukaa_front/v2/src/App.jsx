import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import ForgotPassword from './pages/auth/ForgotPassword';
import ResetPassword from './pages/auth/ResetPassword';
import EmailConfirmation from './pages/auth/EmailConfirmation';
import Home from './pages/Home';
import Settings from './pages/Settings';
import MainLayout from './layouts/MainLayout';
import AuthLayout from './layouts/AuthLayout';
import { ThemeProvider } from './context/ThemeContext';

function App() {
  return (
    <ThemeProvider>
      <Router>
        <Toaster position="top-right" reverseOrder={false} />
        <Routes>
          {/* Protected Routes */}
          <Route element={<MainLayout />}>
            <Route path="/feed" element={<Home />} />
            <Route path="/settings/*" element={<Settings />} />
          </Route>

          {/* Guest Routes (Redirect to /home if logged in) */}
          <Route element={<AuthLayout />}>
            <Route path="/auth/login" element={<Login />} />
            <Route path="/auth/register" element={<Register />} />
            <Route path="/auth/forgot-password" element={<ForgotPassword />} />
            <Route path="/auth/reset-password" element={<ResetPassword />} />
            <Route path="/auth/confirm-email" element={<EmailConfirmation />} />
          </Route>

          {/* Default Redirect */}
          <Route path="/" element={<Navigate to="/feed" replace />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
