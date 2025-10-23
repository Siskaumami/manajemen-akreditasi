import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { Upload, Search, Filter } from 'lucide-react';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import DocumentTable from '@/components/documents/DocumentTable';
import UploadDialog from '@/components/documents/UploadDialog';
import FilterDialog from '@/components/documents/FilterDialog';

const Documents = () => {
  const [documents, setDocuments] = useState([]);
  const [filteredDocuments, setFilteredDocuments] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [uploadOpen, setUploadOpen] = useState(false);
  const [filterOpen, setFilterOpen] = useState(false);
  const [filters, setFilters] = useState({
    category: 'all',
    status: 'all'
  });

  useEffect(() => {
    loadDocuments();
  }, []);

  useEffect(() => {
    filterDocuments();
  }, [documents, searchQuery, filters]);

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

    if (filters.category !== 'all') {
      filtered = filtered.filter(doc => doc.category === filters.category);
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
            <p className="text-gray-600 mt-2">Kelola semua dokumen akreditasi</p>
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