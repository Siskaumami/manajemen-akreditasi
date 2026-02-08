import React from 'react';
import { Download, Edit, Trash2, MoreVertical } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/contexts/AuthContext';

const API_BASE = 'http://localhost:5000';

const DocumentTable = ({ documents = [], onDelete, onStatusChange }) => {
  const { toast } = useToast();
  const { user } = useAuth();

  const handleDownload = (doc) => {
    // ✅ download dari backend (nama file rapi)
    window.open(`${API_BASE}/api/documents/${doc.id}/download`, '_blank');
  };

  const handleEdit = () => {
    toast({
      title: '🚧 Fitur Edit',
      description: 'Fitur edit metadata belum dibuat. Kalau mau, aku bikinin endpoint + UI editnya.',
    });
  };

  const confirmDelete = (doc) => {
    const ok = window.confirm(`Hapus dokumen "${doc.fileName}"? File & data akan hilang.`);
    if (!ok) return;
    onDelete?.(doc.id);
  };

  const getStatusBadge = (status) => {
    const styles = {
      pending: 'bg-red-100 text-red-700',
      reviewing: 'bg-yellow-100 text-yellow-700',
      approved: 'bg-green-100 text-green-700',
    };
    const labels = {
      pending: 'Belum Diperiksa',
      reviewing: 'Sedang Diperiksa',
      approved: 'Disetujui',
    };

    const cls = styles[status] || 'bg-gray-100 text-gray-700';
    const label = labels[status] || status || '-';

    return (
      <span className={`px-3 py-1 rounded-full text-xs font-medium ${cls}`}>
        {label}
      </span>
    );
  };

  const getCategoryName = (category) => {
    const categories = {
      fed: 'FED',
      std1: 'Standar 1',
      std2: 'Standar 2',
      std3: 'Standar 3',
      std4: 'Standar 4',
      std5: 'Standar 5',
      std6: 'Standar 6',
      std7: 'Standar 7',
      std8: 'Standar 8',
      std9: 'Standar 9',
      std10: 'Standar 10',
      std11: 'Standar 11',
    };
    return categories[category] || category || '-';
  };

  const formatDate = (iso) => {
    if (!iso) return '-';
    const d = new Date(iso);
    if (Number.isNaN(d.getTime())) return '-';
    return d.toLocaleDateString('id-ID');
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-[0_6px_18px_rgba(59,130,246,0.12)]">
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
                Tanggal Upload
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Aksi
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-200">
            {documents.length === 0 ? (
              <tr>
                <td colSpan="6" className="px-6 py-8 text-center text-gray-500">
                  Belum ada dokumen
                </td>
              </tr>
            ) : (
              documents.map((doc) => (
                <tr key={doc.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {doc.fileName || '-'}
                    </div>
                    <div className="text-xs text-gray-500">{doc.fileType || ''}</div>
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {getCategoryName(doc.category)}
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {doc.uploader || '-'}
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatDate(doc.uploadDate)}
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap">
                    {getStatusBadge(doc.status)}
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="sm" onClick={() => handleDownload(doc)}>
                        <Download className="w-4 h-4" />
                      </Button>

                      {user?.role === 'admin' && (
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreVertical className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>

                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handleEdit(doc)}>
                              <Edit className="w-4 h-4 mr-2" />
                              Edit
                            </DropdownMenuItem>

                            <DropdownMenuItem onClick={() => onStatusChange?.(doc.id, 'pending')}>
                              Belum Diperiksa
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => onStatusChange?.(doc.id, 'reviewing')}>
                              Sedang Diperiksa
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => onStatusChange?.(doc.id, 'approved')}>
                              Disetujui
                            </DropdownMenuItem>

                            <DropdownMenuItem
                              onClick={() => confirmDelete(doc)}
                              className="text-red-600"
                            >
                              <Trash2 className="w-4 h-4 mr-2" />
                              Hapus
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DocumentTable;
