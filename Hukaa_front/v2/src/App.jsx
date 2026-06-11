import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import ForgotPassword from './pages/auth/ForgotPassword';
import ResetPassword from './pages/auth/ResetPassword';
import EmailConfirmation from './pages/auth/EmailConfirmation';
import Home from './pages/Home';
import Settings from './pages/Settings';
import Messages from './pages/Messages';
import MainLayout from './layouts/MainLayout';
import AuthLayout from './layouts/AuthLayout';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';
import { useEffect } from 'react';

function App() {
  useEffect(() => {
    const savedHue = localStorage.getItem('accentHue');
    if (savedHue) {
      document.documentElement.style.setProperty('--accent-hue', savedHue);
      document.documentElement.style.setProperty('--color-main', `hsl(${savedHue} 89% var(--accent-l))`);
      document.documentElement.style.setProperty('--color-main-hover', `hsl(${savedHue} 89% var(--accent-l) / 80%)`);
      document.documentElement.style.setProperty('--color-optional', `hsl(${savedHue} 89% var(--accent-l) / 70%)`);
    }
  }, []);

  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <Toaster position="top-right" reverseOrder={false} />
          <Routes>
          {/* Protected Routes */}
          <Route element={<MainLayout />}>
            <Route path="/feed" element={<Home />} />
            <Route path="/messages" element={<Messages />} />
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
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
