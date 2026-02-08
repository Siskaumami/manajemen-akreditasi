import React, { useState, useEffect } from 'react';
import { Upload } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/components/ui/use-toast';

const API_BASE = 'http://localhost:5000';

const UploadDialog = ({ open, onOpenChange, onUpload, fixedCategory = null }) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [category, setCategory] = useState('');
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const categories = [
    { value: 'fed', label: 'Formulir Evaluasi Diri (FED)' },
    { value: 'std1', label: 'Standar 1: Kompetensi Lulusan' },
    { value: 'std2', label: 'Standar 2: Proses Pembelajaran' },
    { value: 'std3', label: 'Standar 3: Penilaian Pembelajaran' },
    { value: 'std4', label: 'Standar 4: Pengelolaan' },
    { value: 'std5', label: 'Standar 5: Isi' },
    { value: 'std6', label: 'Standar 6: Dosen dan Tenaga Kependidikan' },
    { value: 'std7', label: 'Standar 7: Sarana dan Prasarana' },
    { value: 'std8', label: 'Standar 8: Biaya' },
    { value: 'std9', label: 'Standar 9: Penelitian' },
    { value: 'std10', label: 'Standar 10: Pengabdian pada Masyarakat' },
    { value: 'std11', label: 'Standar 11: Penjaminan Mutu' },
  ];

  useEffect(() => {
    if (fixedCategory) setCategory(fixedCategory);
    // reset file seeverytime dialog opened
    if (open) setFile(null);
  }, [fixedCategory, open]);

  const selectedCategory = fixedCategory || category;
  const selectedCategoryLabel =
    categories.find((cat) => cat.value === selectedCategory)?.label || '';

  // ✅ Upload ke backend lokal + simpan ke DB (bukan Google Drive)
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!file || !selectedCategory) {
      toast({
        title: 'Error',
        description: 'Mohon lengkapi semua field sebelum upload.',
        variant: 'destructive',
      });
      return;
    }

    const formData = new FormData();
    formData.append('file', file);
    formData.append('category', selectedCategory);
    formData.append('uploader', user?.name || 'Anonim');

    try {
      setLoading(true);

      const res = await fetch(`${API_BASE}/api/documents`, {
        method: 'POST',
        body: formData,
      });

      const result = await res.json();
      setLoading(false);

      if (!res.ok || !result?.success) {
        toast({
          title: 'Gagal Upload 😢',
          description: result?.error || result?.message || 'Terjadi kesalahan saat upload file.',
          variant: 'destructive',
        });
        return;
      }

      // backend mengembalikan data dokumen tersimpan (id dari DB, filePath, dst)
      const saved = result.data;

      // pastikan bentuk data sesuai table kamu
      const newDoc = {
        id: saved.id,
        fileName: saved.fileName,
        fileType: saved.fileType,
        category: saved.category,
        uploader: saved.uploader,
        uploadDate: saved.uploadDate,
        status: saved.status,
        filePath: saved.filePath, // path lokal: /uploads/xxxx.ext
        fileUrl: `${API_BASE}${saved.filePath}`, // url untuk akses file
      };

      onUpload(newDoc);

      toast({
        title: 'Upload Berhasil 🎉',
        description: `File "${saved.fileName}" berhasil tersimpan di server.`,
      });

      setFile(null);
      setCategory(fixedCategory || '');
      onOpenChange(false);
    } catch (error) {
      console.error('Error upload:', error);
      setLoading(false);
      toast({
        title: 'Kesalahan Server ⚠️',
        description: 'Tidak dapat terhubung ke server. Pastikan backend berjalan di port 5000.',
        variant: 'destructive',
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Upload Dokumen</DialogTitle>
          <DialogDescription>
            Upload dokumen akreditasi (PDF, DOCX, XLSX, ZIP) dan simpan ke server.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="category">Kategori Standar</Label>
            <select
              id="category"
              value={selectedCategory}
              onChange={(e) => setCategory(e.target.value)}
              disabled={Boolean(fixedCategory)}
              className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <option value="" disabled>
                Pilih kategori
              </option>
              {fixedCategory ? (
                <option value={selectedCategory}>{selectedCategoryLabel}</option>
              ) : (
                categories.map((cat) => (
                  <option key={cat.value} value={cat.value}>
                    {cat.label}
                  </option>
                ))
              )}
            </select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="file">File</Label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-500 transition-colors">
              <input
                id="file"
                type="file"
                accept=".pdf,.docx,.xlsx,.zip"
                onChange={(e) => setFile(e.target.files?.[0] || null)}
                className="hidden"
              />
              <label htmlFor="file" className="cursor-pointer">
                <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                <p className="text-sm text-gray-600">
                  {file ? file.name : 'Klik untuk memilih file'}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  PDF, DOCX, XLSX, ZIP
                </p>
              </label>
            </div>
          </div>

          <div className="flex gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="flex-1"
            >
              Batal
            </Button>
            <Button type="submit" className="flex-1" disabled={loading}>
              {loading ? 'Mengunggah...' : 'Upload 🚀'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default UploadDialog;
