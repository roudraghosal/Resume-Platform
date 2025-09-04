import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import DashboardPage from './pages/DashboardPage';
import ResumeBuilderPage from './pages/ResumeBuilderPage';
import ResumePreviewPage from './pages/ResumePreviewPage';
import ErrorBoundary from './components/ErrorBoundary';

function ProtectedRoute({ children }) {
    const isAuthenticated = !!localStorage.getItem('token');
    return isAuthenticated ? children : <Navigate to="/" />;
}

function App() {
    const isAuthenticated = !!localStorage.getItem('token');

    return (
        <ErrorBoundary>
            <div className="min-h-screen bg-gray-50">
                <Routes>
                    <Route
                        path="/"
                        element={isAuthenticated ? <Navigate to="/dashboard" /> : <LoginPage />}
                    />
                    <Route
                        path="/signup"
                        element={isAuthenticated ? <Navigate to="/dashboard" /> : <SignupPage />}
                    />
                    <Route
                        path="/dashboard"
                        element={<ProtectedRoute><DashboardPage /></ProtectedRoute>}
                    />
                    <Route
                        path="/resume/new"
                        element={<ProtectedRoute><ResumeBuilderPage /></ProtectedRoute>}
                    />
                    <Route
                        path="/resume/:id/edit"
                        element={<ProtectedRoute><ResumeBuilderPage /></ProtectedRoute>}
                    />
                    <Route
                        path="/resume/:id/preview"
                        element={<ProtectedRoute><ResumePreviewPage /></ProtectedRoute>}
                    />
                    <Route
                        path="*"
                        element={
                            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                                <div className="text-center">
                                    <div className="text-6xl mb-4">404</div>
                                    <h1 className="text-2xl font-bold text-gray-900 mb-2">Page not found</h1>
                                    <p className="text-gray-600 mb-6">The page you're looking for doesn't exist.</p>
                                    <a
                                        href="/"
                                        className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                                    >
                                        Go Home
                                    </a>
                                </div>
                            </div>
                        }
                    />
                </Routes>
            </div>
        </ErrorBoundary>
    );
}

export default App;
