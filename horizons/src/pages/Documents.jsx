import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { useParams } from 'react-router-dom';
import { Upload, Search, Filter } from 'lucide-react';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import DocumentTable from '@/components/documents/DocumentTable';
import UploadDialog from '@/components/documents/UploadDialog';
import FilterDialog from '@/components/documents/FilterDialog';

const Documents = () => {
  const { category: categoryParam } = useParams();
  const categories = [
    'fed',
    'std1',
    'std2',
    'std3',
    'std4',
    'std5',
    'std6',
    'std7',
    'std8',
    'std9',
    'std10',
    'std11',
  ];
  const lockedCategory = categories.includes(categoryParam) ? categoryParam : null;
  const [documents, setDocuments] = useState([]);
  const [filteredDocuments, setFilteredDocuments] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [uploadOpen, setUploadOpen] = useState(false);
  const [filterOpen, setFilterOpen] = useState(false);
  const [filters, setFilters] = useState({
    status: 'all',
  });

  useEffect(() => {
    loadDocuments();
  }, []);

  useEffect(() => {
    filterDocuments();
  }, [documents, searchQuery, filters, lockedCategory]);

  const loadDocuments = () => {
    const stored = JSON.parse(localStorage.getItem('documents') || '[]');
    setDocuments(stored);
  };

  const filterDocuments = () => {
    let filtered = [...documents];

    if (searchQuery) {
      filtered = filtered.filter(doc =>
        doc.fileName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        doc.uploader.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (lockedCategory) {
      filtered = filtered.filter(doc => doc.category === lockedCategory);
    }

    if (filters.status !== 'all') {
      filtered = filtered.filter(doc => doc.status === filters.status);
    }

    setFilteredDocuments(filtered);
  };

  const handleUpload = (newDoc) => {
    const updatedDocs = [...documents, newDoc];
    localStorage.setItem('documents', JSON.stringify(updatedDocs));
    setDocuments(updatedDocs);
    
    const activity = {
      id: Date.now().toString(),
      action: 'upload',
      fileName: newDoc.fileName,
      user: newDoc.uploader,
      timestamp: new Date().toISOString()
    };
    const activities = JSON.parse(localStorage.getItem('activities') || '[]');
    localStorage.setItem('activities', JSON.stringify([activity, ...activities]));
  };

  const handleDelete = (id) => {
    const updatedDocs = documents.filter(doc => doc.id !== id);
    localStorage.setItem('documents', JSON.stringify(updatedDocs));
    setDocuments(updatedDocs);
  };

  const handleStatusChange = (id, newStatus) => {
    const updatedDocs = documents.map(doc =>
      doc.id === id ? { ...doc, status: newStatus } : doc
    );
    localStorage.setItem('documents', JSON.stringify(updatedDocs));
    setDocuments(updatedDocs);
  };

  const pageDescriptions = {
    fed: 'Kelola Dokumen Formulir Evaluasi Diri',
    std1: 'Kelola Dokumen Kompetensi Lulusan',
    std2: 'Kelola Dokumen Proses Pembelajaran',
    std3: 'Kelola Dokumen Penilaian Pembelajaran',
    std4: 'Kelola Dokumen Pengelolaan',
    std5: 'Kelola Dokumen Isi',
    std6: 'Kelola Dokumen Dosen dan Tenaga Kependidikan',
    std7: 'Kelola Dokumen Sarana dan Prasarana',
    std8: 'Kelola Dokumen Biaya',
    std9: 'Kelola Dokumen Penelitian',
    std10: 'Kelola Dokumen Pengabdian pada Masyarakat',
    std11: 'Kelola Dokumen Penjaminan Mutu',
  };
  const pageDescription = lockedCategory
    ? pageDescriptions[lockedCategory]
    : 'Kelola semua dokumen akreditasi';

  return (
    <Layout>
      <Helmet>
        <title>Manajemen Dokumen - Sistem Manajemen Akreditasi</title>
        <meta name="description" content="Kelola dokumen akreditasi dengan fitur upload, download, dan status tracking" />
      </Helmet>

      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Manajemen Dokumen</h1>
            <p className="text-gray-600 mt-2">{pageDescription}</p>
          </div>
          <Button onClick={() => setUploadOpen(true)} className="gap-2">
            <Upload className="w-4 h-4" />
            Upload Dokumen
          </Button>
        </div>

        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
            <Input
              placeholder="Cari dokumen..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Button variant="outline" onClick={() => setFilterOpen(true)} className="gap-2">
            <Filter className="w-4 h-4" />
            Filter
          </Button>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <DocumentTable
            documents={filteredDocuments}
            onDelete={handleDelete}
            onStatusChange={handleStatusChange}
          />
        </motion.div>
      </div>

      <UploadDialog
        open={uploadOpen}
        onOpenChange={setUploadOpen}
        onUpload={handleUpload}
        fixedCategory={lockedCategory}
      />

      <FilterDialog
        open={filterOpen}
        onOpenChange={setFilterOpen}
        filters={filters}
        onFiltersChange={setFilters}
      />
    </Layout>
  );
};

export default Documents;
