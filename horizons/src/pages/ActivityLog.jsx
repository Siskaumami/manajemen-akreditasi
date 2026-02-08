import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { Activity, Upload, Download, Edit, Trash2, CheckCircle } from 'lucide-react';
import Layout from '@/components/Layout';

const ActivityLog = () => {
  const [activities, setActivities] = useState([]);

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem('activities') || '[]');
    setActivities(stored);
  }, []);

  const getActivityIcon = (action) => {
    switch (action) {
      case 'upload': return <Upload className="w-5 h-5 text-blue-600" />;
      case 'download': return <Download className="w-5 h-5 text-green-600" />;
      case 'edit': return <Edit className="w-5 h-5 text-yellow-600" />;
      case 'delete': return <Trash2 className="w-5 h-5 text-red-600" />;
      case 'status': return <CheckCircle className="w-5 h-5 text-purple-600" />;
      default: return <Activity className="w-5 h-5 text-gray-600" />;
    }
  };

  const getActivityText = (activity) => {
    switch (activity.action) {
      case 'upload': return `mengunggah dokumen "${activity.fileName}"`;
      case 'download': return `mengunduh dokumen "${activity.fileName}"`;
      case 'edit': return `mengedit dokumen "${activity.fileName}"`;
      case 'delete': return `menghapus dokumen "${activity.fileName}"`;
      case 'status': return `mengubah status dokumen "${activity.fileName}"`;
      default: return 'melakukan aktivitas';
    }
  };

  return (
    <Layout>
      <Helmet>
        <title>Log Aktivitas - Sistem Manajemen Akreditasi</title>
        <meta name="description" content="Pantau semua aktivitas dalam sistem manajemen akreditasi" />
      </Helmet>

      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Log Aktivitas</h1>
          <p className="text-gray-600 mt-2">Pantau semua aktivitas sistem</p>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-[0_6px_18px_rgba(59,130,246,0.12)]">
          <div className="divide-y divide-gray-200">
            {activities.length === 0 ? (
              <div className="p-8 text-center text-gray-500">
                Belum ada aktivitas
              </div>
            ) : (
              activities.map((activity, index) => (
                <motion.div
                  key={activity.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="p-4 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-start gap-4">
                    <div className="mt-1">
                      {getActivityIcon(activity.action)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-gray-900">
                        <span className="font-medium">{activity.user}</span>{' '}
                        {getActivityText(activity)}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        {new Date(activity.timestamp).toLocaleString('id-ID')}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ActivityLog;
