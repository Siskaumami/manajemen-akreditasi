import React from 'react';
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

const FilterDialog = ({ open, onOpenChange, filters, onFiltersChange }) => {
  const categories = [
    { value: 'all', label: 'Semua Kategori' },
    { value: 'fed', label: 'FED' },
    { value: 'std1', label: 'Standar 1' },
    { value: 'std2', label: 'Standar 2' },
    { value: 'std3', label: 'Standar 3' },
    { value: 'std4', label: 'Standar 4' },
    { value: 'std5', label: 'Standar 5' },
    { value: 'std6', label: 'Standar 6' },
    { value: 'std7', label: 'Standar 7' },
    { value: 'std8', label: 'Standar 8' },
    { value: 'std9', label: 'Standar 9' },
    { value: 'std10', label: 'Standar 10' },
    { value: 'std11', label: 'Standar 11' }
  ];

  const statuses = [
    { value: 'all', label: 'Semua Status' },
    { value: 'pending', label: 'Belum Diperiksa' },
    { value: 'reviewing', label: 'Sedang Diperiksa' },
    { value: 'approved', label: 'Disetujui' }
  ];

  const handleReset = () => {
    onFiltersChange({ category: 'all', status: 'all' });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Filter Dokumen</DialogTitle>
          <DialogDescription>
            Filter dokumen berdasarkan kategori dan status
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Kategori</Label>
            <Select
              value={filters.category}
              onValueChange={(value) => onFiltersChange({ ...filters, category: value })}
            >
              <SelectTrigger>
                <SelectValue />
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
            <Label>Status</Label>
            <Select
              value={filters.status}
              onValueChange={(value) => onFiltersChange({ ...filters, status: value })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {statuses.map((status) => (
                  <SelectItem key={status.value} value={status.value}>
                    {status.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex gap-3">
            <Button variant="outline" onClick={handleReset} className="flex-1">
              Reset
            </Button>
            <Button onClick={() => onOpenChange(false)} className="flex-1">
              Terapkan
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default FilterDialog;