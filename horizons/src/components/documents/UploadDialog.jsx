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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/components/ui/use-toast';

const UploadDialog = ({ open, onOpenChange, onUpload }) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [category, setCategory] = useState('');
  const [file, setFile] = useState(null);

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
    { value: 'std11', label: 'Standar 11: Penjaminan Mutu' }
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!file || !category) {
      toast({
        title: "Error",
        description: "Mohon lengkapi semua field",
        variant: "destructive"
      });
      return;
    }

    const allowedTypes = ['.pdf', '.docx', '.xlsx', '.zip'];
    const fileExt = '.' + file.name.split('.').pop().toLowerCase();
    
    if (!allowedTypes.includes(fileExt)) {
      toast({
        title: "Format File Tidak Didukung",
        description: "Hanya file PDF, DOCX, XLSX, dan ZIP yang diperbolehkan",
        variant: "destructive"
      });
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      toast({
        title: "File Terlalu Besar",
        description: "Ukuran file maksimal 10MB",
        variant: "destructive"
      });
      return;
    }

    const newDoc = {
      id: Date.now().toString(),
      fileName: file.name,
      fileType: fileExt.toUpperCase().replace('.', ''),
      category,
      uploader: user.name,
      uploadDate: new Date().toISOString(),
      status: 'pending',
      driveId: 'mock-drive-id-' + Date.now()
    };

    onUpload(newDoc);
    
    toast({
      title: "Upload Berhasil!",
      description: `File "${file.name}" berhasil diunggah`,
    });

    setCategory('');
    setFile(null);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Upload Dokumen</DialogTitle>
          <DialogDescription>
            Upload dokumen akreditasi dengan format PDF, DOCX, XLSX, atau ZIP (max 10MB)
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
                  PDF, DOCX, XLSX, ZIP (max 10MB)
                </p>
              </label>
            </div>
          </div>

          <div className="flex gap-3">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} className="flex-1">
              Batal
            </Button>
            <Button type="submit" className="flex-1">
              Upload
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default UploadDialog;