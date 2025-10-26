import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import Login from '@/pages/Login';
import Register from '@/pages/Register';
import Dashboard from '@/pages/Dashboard';
import Documents from '@/pages/Documents';
import ActivityLog from '@/pages/ActivityLog';
import Help from '@/pages/Help';
import { Toaster } from '@/components/ui/toaster';
import { AuthProvider, useAuth } from '@/contexts/AuthContext';

// 🔒 Komponen untuk melindungi route (hanya bisa diakses jika user login)
const ProtectedRoute = ({ children }) => {
  const { user } = useAuth();
  return user ? children : <Navigate to="/login" replace />;
};

// 🌍 App utama
function App() {
  return (
    <AuthProvider>
      <Helmet>
        <title>Sistem Manajemen Akreditasi - Program Studi Administrasi Publik</title>
        <meta
          name="description"
          content="Sistem manajemen data akreditasi untuk mengelola dokumen FED dan 11 Standar Akreditasi Program Studi Administrasi Publik"
        />
      </Helmet>

      {/* 🧭 Router otomatis sesuaikan BASE_URL untuk lokal & GitHub Pages */}
      <Router basename={import.meta.env.BASE_URL}>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* ✅ Semua halaman berikut hanya bisa diakses setelah login */}
          <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/documents" element={<ProtectedRoute><Documents /></ProtectedRoute>} />
          <Route path="/activity-log" element={<ProtectedRoute><ActivityLog /></ProtectedRoute>} />
          <Route path="/help" element={<ProtectedRoute><Help /></ProtectedRoute>} />

          {/* 🔁 Default: arahkan ke dashboard */}
          <Route path="/" element={<Navigate to="/dashboard" replace />} />

          {/* ⚠️ Fallback: jika route tidak cocok, redirect ke dashboard */}
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </Router>

      {/* 🔔 Komponen toaster (notifikasi popup) */}
      <Toaster />
    </AuthProvider>
  );
}

export default App;
