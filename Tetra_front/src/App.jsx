// src/App.jsx
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import ForgotPassword from './pages/auth/ForgotPassword';
import ResetPassword from './pages/auth/ResetPassword';
import EmailConfirmation from './pages/auth/EmailConfirmation';
import TwoFactorVerification from './pages/auth/TwoFactorVerification';
import Home from './pages/Home';
import Settings from './pages/Settings';
import Messages from './pages/Messages';
import Profile from './pages/Profile';
import Follow from './pages/follow';
import ApiTester from './pages/ApiTester';
import WebSocketTester from './pages/WebsocketTester';
import PostDetail from './pages/PostDetail';
import Search from './pages/Search';
import Notifications from './pages/Notifications';
import Bookmarks from './pages/Bookmarks';
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
          <Toaster
            position="bottom-right"
            reverseOrder={false}
            toastOptions={{
              className: 'custom-toast',
              success: {
                iconTheme: {
                  primary: '#10b981',
                  secondary: 'var(--toast-bg)',
                },
              },
              error: {
                iconTheme: {
                  primary: '#ef4444',
                  secondary: 'var(--toast-bg)',
                },
              },
            }}
          />
          <Routes>
            {/* Protected Routes */}
            <Route element={<MainLayout />}>
              <Route path="/feed" element={<Home />} />
              <Route path="/search" element={<Search />} />
              <Route path="/notifications" element={<Notifications />} />
              <Route path="/bookmarks" element={<Bookmarks />} />
              <Route path="/messages" element={<Messages />} />
              <Route path="/settings/*" element={<Settings />} />
              <Route path="/ApiTester/*" element={<ApiTester />} />
              <Route path="/WebSocketTester/*" element={<WebSocketTester />} />
              <Route path="/:username/followers" element={<Follow tab="followers" />} />
              <Route path="/:username/following" element={<Follow tab="following" />} />
              <Route path="/:username" element={<Profile />} />
              <Route path="/post/:id" element={<PostDetail />} />
            </Route>

            {/* Guest Routes (Redirect to /home if logged in) */}
            <Route element={<AuthLayout />}>
              <Route path="/auth/login" element={<Login />} />
              <Route path="/auth/register" element={<Register />} />
              <Route path="/auth/forgot-password" element={<ForgotPassword />} />
              <Route path="/auth/reset-password" element={<ResetPassword />} />
              <Route path="/auth/confirm-email" element={<EmailConfirmation />} />
              <Route path="/auth/2fa" element={<TwoFactorVerification />} />
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
