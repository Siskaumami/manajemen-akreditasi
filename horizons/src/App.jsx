import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import Login from '@/pages/Login';
import Register from '@/pages/Register';
import Dashboard from '@/pages/Dashboard';
import Documents from '@/pages/Documents';
import ActivityLog from '@/pages/ActivityLog';
import Help from '@/pages/Help';
import { Toaster } from '@/components/ui/toaster';
import { useAuth } from '@/contexts/AuthContext';

// 🔒 Komponen untuk melindungi route (hanya bisa diakses jika user login)
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();

  // ✅ saat auth masih loading, jangan redirect dulu
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-600">
        Memuat...
      </div>
    );
  }

  return user ? children : <Navigate to="/login" replace />;
};

// 🌍 App utama
function App() {
  return (
    <>
      <Helmet>
        <title>Sistem Manajemen Akreditasi - Program Studi Administrasi Publik</title>
        <meta
          name="description"
          content="Sistem manajemen data akreditasi untuk mengelola dokumen FED dan 11 Standar Akreditasi Program Studi Administrasi Publik"
        />
      </Helmet>

      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* ✅ Semua halaman berikut hanya bisa diakses setelah login */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/documents"
          element={
            <ProtectedRoute>
              <Documents />
            </ProtectedRoute>
          }
        />
        <Route
          path="/documents/:category"
          element={
            <ProtectedRoute>
              <Documents />
            </ProtectedRoute>
          }
        />
        <Route
          path="/activity-log"
          element={
            <ProtectedRoute>
              <ActivityLog />
            </ProtectedRoute>
          }
        />
        <Route
          path="/help"
          element={
            <ProtectedRoute>
              <Help />
            </ProtectedRoute>
          }
        />

        {/* 🔁 Default */}
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>

      <Toaster />
    </>
  );
}

export default App;
