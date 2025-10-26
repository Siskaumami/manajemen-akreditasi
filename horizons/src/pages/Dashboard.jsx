import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { FileText, CheckCircle, Clock, AlertCircle } from 'lucide-react';
import Layout from '@/components/Layout';
import StatsCard from '@/components/dashboard/StatsCard';
import StandardCard from '@/components/dashboard/StandardCard';

const Dashboard = () => {
  const [stats, setStats] = useState({
    total: 0,
    approved: 0,
    pending: 0,
    reviewing: 0
  });

  const standards = [
    { id: 'fed', name: 'Formulir Evaluasi Diri (FED)', color: 'bg-purple-500' },
    { id: 'std1', name: 'Standar 1: Kompetensi Lulusan', color: 'bg-blue-500' },
    { id: 'std2', name: 'Standar 2: Proses Pembelajaran', color: 'bg-green-500' },
    { id: 'std3', name: 'Standar 3: Penilaian Pembelajaran', color: 'bg-yellow-500' },
    { id: 'std4', name: 'Standar 4: Pengelolaan', color: 'bg-red-500' },
    { id: 'std5', name: 'Standar 5: Isi', color: 'bg-indigo-500' },
    { id: 'std6', name: 'Standar 6: Dosen dan Tenaga Kependidikan', color: 'bg-pink-500' },
    { id: 'std7', name: 'Standar 7: Sarana dan Prasarana', color: 'bg-teal-500' },
    { id: 'std8', name: 'Standar 8: Biaya', color: 'bg-orange-500' },
    { id: 'std9', name: 'Standar 9: Penelitian', color: 'bg-cyan-500' },
    { id: 'std10', name: 'Standar 10: Pengabdian pada Masyarakat', color: 'bg-lime-500' },
    { id: 'std11', name: 'Standar 11: Penjaminan Mutu', color: 'bg-amber-500' }
  ];

  useEffect(() => {
    const documents = JSON.parse(localStorage.getItem('documents') || '[]');
    setStats({
      total: documents.length,
      approved: documents.filter(d => d.status === 'approved').length,
      pending: documents.filter(d => d.status === 'pending').length,
      reviewing: documents.filter(d => d.status === 'reviewing').length
    });
  }, []);

  return (
    <Layout>
      <Helmet>
        <title>Dashboard - Sistem Informasi Administrasi Publik(Si-APIK)</title>
        <meta name="description" content="Dashboard sistem manajemen akreditasi dengan statistik dokumen" />
      </Helmet>

      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-2">Selamat datang di Sistem Informasi Administrasi Publik(Si-APIK)</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatsCard
            title="Total Dokumen"
            value={stats.total}
            icon={FileText}
            color="bg-blue-500"
          />
          <StatsCard
            title="Disetujui"
            value={stats.approved}
            icon={CheckCircle}
            color="bg-green-500"
          />
          <StatsCard
            title="Sedang Diperiksa"
            value={stats.reviewing}
            icon={Clock}
            color="bg-yellow-500"
          />
          <StatsCard
            title="Belum Diperiksa"
            value={stats.pending}
            icon={AlertCircle}
            color="bg-red-500"
          />
        </div>

        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Status Dokumen per Standar</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {standards.map((standard, index) => (
              <motion.div
                key={standard.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <StandardCard standard={standard} />
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;