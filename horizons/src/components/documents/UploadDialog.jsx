import React, { useState } from 'react';
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/components/ui/use-toast';

const UploadDialog = ({ open, onOpenChange, onUpload }) => {
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

  // 🚀 Upload langsung ke server (Google Drive API)
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!file || !category) {
      toast({
        title: 'Error',
        description: 'Mohon lengkapi semua field sebelum upload.',
        variant: 'destructive',
      });
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    try {
      setLoading(true);
      const res = await fetch('http://localhost:5000/api/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      setLoading(false);

      if (data.success) {
        const newDoc = {
          id: Date.now().toString(),
          fileName: data.name || file.name,
          fileType: file.name.split('.').pop().toUpperCase(),
          category,
          uploader: user?.name || 'Anonim',
          uploadDate: new Date().toISOString(),
          status: 'pending',
          driveId: data.fileId,
          driveViewLink: data.viewLink,
        };

        onUpload(newDoc);
        toast({
          title: 'Upload Berhasil 🎉',
          description: `File "${data.name}" berhasil diunggah ke Google Drive.`,
        });
        setFile(null);
        setCategory('');
        onOpenChange(false);
      } else {
        toast({
          title: 'Gagal Upload 😢',
          description: data.error || 'Terjadi kesalahan saat upload file.',
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error('Error upload:', error);
      setLoading(false);
      toast({
        title: 'Kesalahan Server ⚠️',
        description:
          'Tidak dapat terhubung ke server. Pastikan backend berjalan di port 5000.',
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
            Upload dokumen akreditasi (PDF, DOCX, XLSX, ZIP) langsung ke Google
            Drive.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="category">Kategori Standar</Label>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger>
                <SelectValue placeholder="Pilih kategori" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((cat) => (
                  <SelectItem key={cat.value} value={cat.value}>
                    {cat.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="file">File</Label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-500 transition-colors">
              <input
                id="file"
                type="file"
                accept=".pdf,.docx,.xlsx,.zip"
                onChange={(e) => setFile(e.target.files[0])}
                className="hidden"
              />
              <label htmlFor="file" className="cursor-pointer">
                <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                <p className="text-sm text-gray-600">
                  {file ? file.name : 'Klik untuk memilih file'}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  PDF, DOCX, XLSX, ZIP (tanpa batas ukuran)
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
            <Button
              type="submit"
              className="flex-1"
              disabled={loading}
            >
              {loading ? 'Mengunggah...' : 'Upload ke Google Drive 🚀'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default UploadDialog;
