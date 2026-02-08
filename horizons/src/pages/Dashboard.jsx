import React, { useEffect, useMemo, useState } from 'react';
import { Helmet } from 'react-helmet';
import { FileText, CheckCircle, Clock, AlertCircle } from 'lucide-react';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';

// helper aman
const safeJsonParse = (value, fallback) => {
  try {
    if (!value) return fallback;
    return JSON.parse(value);
  } catch {
    return fallback;
  }
};

const statusLabel = (status) => {
  const map = {
    pending: 'Belum Diperiksa',
    reviewing: 'Sedang Diperiksa',
    approved: 'Disetujui',
  };
  return map[status] || status || '-';
};

const statusBadgeClass = (status) => {
  const map = {
    pending: 'bg-red-100 text-red-700',
    reviewing: 'bg-yellow-100 text-yellow-700',
    approved: 'bg-green-100 text-green-700',
  };
  return map[status] || 'bg-gray-100 text-gray-700';
};

const formatDate = (iso) => {
  if (!iso) return '-';
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return '-';
  return d.toLocaleDateString('id-ID');
};

const Dashboard = () => {
  const [documents, setDocuments] = useState([]);
  const [activeFilter, setActiveFilter] = useState('total'); // total | approved | reviewing | pending

  useEffect(() => {
    const stored = safeJsonParse(localStorage.getItem('documents'), []);
    setDocuments(Array.isArray(stored) ? stored : []);
  }, []);

  const stats = useMemo(() => {
    return {
      total: documents.length,
      approved: documents.filter((d) => d?.status === 'approved').length,
      pending: documents.filter((d) => d?.status === 'pending').length,
      reviewing: documents.filter((d) => d?.status === 'reviewing').length,
    };
  }, [documents]);

  const filteredDocs = useMemo(() => {
    if (activeFilter === 'total') return documents;
    return documents.filter((d) => d?.status === activeFilter);
  }, [documents, activeFilter]);

  const activeTitle = useMemo(() => {
    const map = {
      total: 'Total Dokumen',
      approved: 'Dokumen Disetujui',
      reviewing: 'Dokumen Sedang Diperiksa',
      pending: 'Dokumen Belum Diperiksa',
    };
    return map[activeFilter] || 'Dokumen';
  }, [activeFilter]);

  const statCards = [
    {
      key: 'total',
      title: 'Total Dokumen',
      value: stats.total,
      icon: FileText,
      iconBg: 'bg-blue-500',
      iconColor: 'text-white',
    },
    {
      key: 'approved',
      title: 'Disetujui',
      value: stats.approved,
      icon: CheckCircle,
      iconBg: 'bg-green-500',
      iconColor: 'text-white',
    },
    {
      key: 'reviewing',
      title: 'Sedang Diperiksa',
      value: stats.reviewing,
      icon: Clock,
      iconBg: 'bg-yellow-500',
      iconColor: 'text-white',
    },
    {
      key: 'pending',
      title: 'Belum Diperiksa',
      value: stats.pending,
      icon: AlertCircle,
      iconBg: 'bg-red-500',
      iconColor: 'text-white',
    },
  ];

  return (
    <Layout>
      <Helmet>
        <title>Dashboard - Sistem Informasi Administrasi Publik (Si-APIK)</title>
        <meta
          name="description"
          content="Dashboard sistem manajemen akreditasi dengan statistik dokumen"
        />
      </Helmet>

      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-2">
            Selamat datang di Sistem Informasi Administrasi Publik (Si-APIK)
          </p>
        </div>

        {/* KARTU STAT (KLIK UNTUK FILTER) */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          {statCards.map((card) => {
            const Icon = card.icon;
            const isActive = activeFilter === card.key;

            return (
              <button
                type="button"
                key={card.key}
                onClick={() => setActiveFilter(card.key)}
                className={`text-left bg-white rounded-xl border shadow-[0_6px_18px_rgba(59,130,246,0.12)] px-6 py-5 flex items-center justify-between transition
                  ${isActive ? 'border-blue-400 ring-2 ring-blue-200' : 'border-blue-100/60 hover:border-blue-300'}
                `}
              >
                <div>
                  <p className="text-sm text-gray-600 mb-1">{card.title}</p>
                  <p className="text-3xl font-bold text-gray-900">{card.value}</p>
                  <p className="text-xs text-gray-500 mt-2">
                    Klik untuk lihat daftar
                  </p>
                </div>
                <div className={`${card.iconBg} p-3 rounded-lg shadow-[0_4px_10px_rgba(59,130,246,0.2)]`}>
                  <Icon className={`w-6 h-6 ${card.iconColor}`} />
                </div>
              </button>
            );
          })}
        </div>

        {/* LIST DOKUMEN SESUAI FILTER */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-[0_6px_18px_rgba(59,130,246,0.12)] overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">{activeTitle}</h2>
              <p className="text-sm text-gray-600">
                Menampilkan {filteredDocs.length} dokumen
              </p>
            </div>

            <div className="flex gap-2">
              <Button
                variant={activeFilter === 'total' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setActiveFilter('total')}
              >
                Semua
              </Button>
              <Button
                variant={activeFilter === 'approved' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setActiveFilter('approved')}
              >
                Disetujui
              </Button>
              <Button
                variant={activeFilter === 'reviewing' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setActiveFilter('reviewing')}
              >
                Diperiksa
              </Button>
              <Button
                variant={activeFilter === 'pending' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setActiveFilter('pending')}
              >
                Pending
              </Button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Nama File
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Kategori
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Uploader
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tanggal
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-200">
                {filteredDocs.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="px-6 py-8 text-center text-gray-500">
                      Tidak ada dokumen untuk kategori ini
                    </td>
                  </tr>
                ) : (
                  filteredDocs.map((doc) => (
                    <tr key={doc.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {doc.fileName || '-'}
                        </div>
                        <div className="text-xs text-gray-500">
                          {doc.fileType || ''}
                        </div>
                      </td>

                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {doc.category || '-'}
                      </td>

                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {doc.uploader || '-'}
                      </td>

                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatDate(doc.uploadDate)}
                      </td>

                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium ${statusBadgeClass(
                            doc.status
                          )}`}
                        >
                          {statusLabel(doc.status)}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;
