import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FileText, CheckCircle, Clock, AlertCircle } from 'lucide-react';

const StandardCard = ({ standard }) => {
  const [stats, setStats] = useState({ total: 0, approved: 0, pending: 0, reviewing: 0 });

  useEffect(() => {
    const documents = JSON.parse(localStorage.getItem('documents') || '[]');
    const filtered = documents.filter(doc => doc.category === standard.id);
    setStats({
      total: filtered.length,
      approved: filtered.filter(d => d.status === 'approved').length,
      pending: filtered.filter(d => d.status === 'pending').length,
      reviewing: filtered.filter(d => d.status === 'reviewing').length
    });
  }, [standard.id]);

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
    >
      <div className="flex items-center gap-3 mb-4">
        <div className={`${standard.color} p-2 rounded-lg`}>
          <FileText className="w-5 h-5 text-white" />
        </div>
        <h3 className="font-semibold text-gray-900 text-sm">{standard.name}</h3>
      </div>
      
      <div className="grid grid-cols-2 gap-3">
        <div className="flex items-center gap-2">
          <FileText className="w-4 h-4 text-gray-400" />
          <div>
            <p className="text-xs text-gray-500">Total</p>
            <p className="text-lg font-bold text-gray-900">{stats.total}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <CheckCircle className="w-4 h-4 text-green-500" />
          <div>
            <p className="text-xs text-gray-500">Disetujui</p>
            <p className="text-lg font-bold text-green-600">{stats.approved}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-yellow-500" />
          <div>
            <p className="text-xs text-gray-500">Diperiksa</p>
            <p className="text-lg font-bold text-yellow-600">{stats.reviewing}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-red-500" />
          <div>
            <p className="text-xs text-gray-500">Pending</p>
            <p className="text-lg font-bold text-red-600">{stats.pending}</p>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default StandardCard;