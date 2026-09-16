import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider, useApp } from './contexts/AppContext';
import { Layout } from './components/Layout';
import { LoginPage } from './pages/LoginPage';
import { DashboardPage } from './pages/DashboardPage';
import { ChapterPage } from './pages/ChapterPage';
import { ExpertQueuePage, ExpertReviewPage } from './pages/ExpertPages';
import { AdminUsersPage, AdminAnalyticsPage, AdminContentPage } from './pages/AdminPages';

function ProtectedRoute({ children, allowedRoles }: { children: React.ReactNode; allowedRoles?: string[] }) {
  const { currentUser } = useApp();
  if (!currentUser) return <Navigate to="/login" replace />;
  if (allowedRoles && !allowedRoles.includes(currentUser.role)) return <Navigate to="/login" replace />;
  return <>{children}</>;
}

function AppRoutes() {
  const { currentUser } = useApp();

  return (
    <Routes>
      <Route path="/login" element={currentUser ? <Navigate to="/dashboard" replace /> : <LoginPage />} />
      
      <Route path="/*" element={
        <ProtectedRoute>
          <Layout>
            <Routes>
              {/* Listener routes */}
              <Route path="/dashboard" element={
                <ProtectedRoute allowedRoles={['LISTENER']}>
                  <DashboardPage />
                </ProtectedRoute>
              } />
              <Route path="/chapter/:id" element={
                <ProtectedRoute allowedRoles={['LISTENER']}>
                  <ChapterPage />
                </ProtectedRoute>
              } />

              {/* Expert routes */}
              <Route path="/expert/queue" element={
                <ProtectedRoute allowedRoles={['EXPERT']}>
                  <ExpertQueuePage />
                </ProtectedRoute>
              } />
              <Route path="/expert/review/:submissionId" element={
                <ProtectedRoute allowedRoles={['EXPERT']}>
                  <ExpertReviewPage />
                </ProtectedRoute>
              } />

              {/* Admin routes */}
              <Route path="/admin/users" element={
                <ProtectedRoute allowedRoles={['ADMIN']}>
                  <AdminUsersPage />
                </ProtectedRoute>
              } />
              <Route path="/admin/analytics" element={
                <ProtectedRoute allowedRoles={['ADMIN']}>
                  <AdminAnalyticsPage />
                </ProtectedRoute>
              } />
              <Route path="/admin/content" element={
                <ProtectedRoute allowedRoles={['ADMIN']}>
                  <AdminContentPage />
                </ProtectedRoute>
              } />

              {/* Fallback */}
              <Route path="*" element={
                currentUser?.role === 'LISTENER' ? <Navigate to="/dashboard" replace /> :
                currentUser?.role === 'EXPERT' ? <Navigate to="/expert/queue" replace /> :
                <Navigate to="/admin/users" replace />
              } />
            </Routes>
          </Layout>
        </ProtectedRoute>
      } />
    </Routes>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppProvider>
        <AppRoutes />
      </AppProvider>
    </BrowserRouter>
  );
}
