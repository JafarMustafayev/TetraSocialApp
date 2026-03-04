import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import AuthLayout from './layouts/AuthLayout';
import Home from './pages/Home';
import Messages from './pages/Messages';
import Notifications from './pages/Notifications';
import Profile from './pages/Profile';
import Settings from './pages/Settings';
import UserProfile from './pages/UserProfile';
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import EmailConfirmation from './pages/EmailConfirmation';
import { AuthProvider } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';
import { NotificationProvider } from './context/NotificationContext';
import ProtectedRoute from './components/ProtectedRoute';
import PublicRoute from './components/PublicRoute';
import SecondaryLayout from './layouts/SecondaryLayout';
import MyActivities from './pages/MyActivities';
import SignalRTest from './pages/SignalRTest';
import PostPage from './pages/PostPage';
import { ThemeProvider } from './context/ThemeContext';
import { ChatProvider } from './context/ChatContext';

function App() {
    return (
        <ThemeProvider>
            <ToastProvider>
                <AuthProvider>
                    <ChatProvider>
                        <NotificationProvider>
                            <BrowserRouter>
                                <Routes>
                                    {/* Main Layout Routes */}
                                    <Route path="/" element={
                                        <ProtectedRoute>
                                            <MainLayout />
                                        </ProtectedRoute>
                                    }>
                                        <Route index element={<Home />} />
                                        <Route path="messages" element={<Messages />} />
                                        <Route path="notifications" element={<Notifications />} />
                                        <Route path="profile" element={<Profile />} />
                                        <Route path="profile/:userId" element={<UserProfile />} />
                                        <Route path="posts/:postId" element={<PostPage />} />
                                        <Route path="signalr-test" element={<SignalRTest />} />
                                    </Route>

                                    {/* Secondary Layout Routes (Dual Sidebar) */}
                                    <Route element={
                                        <ProtectedRoute>
                                            <SecondaryLayout />
                                        </ProtectedRoute>
                                    }>
                                        <Route path="/settings" element={<Settings />} />
                                        <Route path="/my-activities" element={<MyActivities />} />
                                    </Route>

                                    <Route element={<PublicRoute />}>
                                        <Route element={<AuthLayout />}>
                                            <Route path="/login" element={<Login />} />
                                            <Route path="/register" element={<Register />} />
                                            <Route path="/forgot-password" element={<ForgotPassword />} />
                                        </Route>
                                    </Route>
                                    <Route element={<AuthLayout />}>
                                        <Route path="/reset-password" element={<ResetPassword />} />
                                        <Route path="/email-confirmation" element={<EmailConfirmation />} />
                                    </Route>
                                </Routes>
                            </BrowserRouter>
                        </NotificationProvider>
                    </ChatProvider>
                </AuthProvider>
            </ToastProvider>
        </ThemeProvider>
    );
}

export default App;
