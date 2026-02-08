import React, { useEffect, useMemo } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  LayoutDashboard,
  FileText,
  Activity,
  HelpCircle,
  LogOut,
  Menu,
  X,
  BookOpen,
  ClipboardList,
  ClipboardCheck,
  Settings,
  Layers,
  Users,
  Building2,
  Wallet,
  FlaskConical,
  HeartHandshake,
  BadgeCheck,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/components/ui/use-toast';

const Layout = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout, loading } = useAuth();
  const { toast } = useToast();
  const [sidebarOpen, setSidebarOpen] = React.useState(false);

  useEffect(() => {
    setSidebarOpen(false);
  }, [location.pathname]);

  // Redirect kalau sudah selesai loading tapi user tidak ada
  useEffect(() => {
    if (loading === false && !user) {
      navigate('/login', { replace: true });
    }
  }, [loading, user, navigate]);

  const menuItems = useMemo(() => [{ icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' }], []);
  const standardItems = useMemo(
    () => [
      { icon: FileText, title: 'FED:', subtitle: 'Formulir Evaluasi Diri', path: '/documents/fed' },
      { icon: BookOpen, title: 'Standar 1:', subtitle: 'Kompetensi Lulusan', path: '/documents/std1' },
      { icon: ClipboardList, title: 'Standar 2:', subtitle: 'Proses Pembelajaran', path: '/documents/std2' },
      { icon: ClipboardCheck, title: 'Standar 3:', subtitle: 'Penilaian Pembelajaran', path: '/documents/std3' },
      { icon: Settings, title: 'Standar 4:', subtitle: 'Pengelolaan', path: '/documents/std4' },
      { icon: Layers, title: 'Standar 5:', subtitle: 'Isi', path: '/documents/std5' },
      { icon: Users, title: 'Standar 6:', subtitle: 'Dosen dan Tenaga Kependidikan', path: '/documents/std6' },
      { icon: Building2, title: 'Standar 7:', subtitle: 'Sarana dan Prasarana', path: '/documents/std7' },
      { icon: Wallet, title: 'Standar 8:', subtitle: 'Biaya', path: '/documents/std8' },
      { icon: FlaskConical, title: 'Standar 9:', subtitle: 'Penelitian', path: '/documents/std9' },
      { icon: HeartHandshake, title: 'Standar 10:', subtitle: 'Pengabdian pada Masyarakat', path: '/documents/std10' },
      { icon: BadgeCheck, title: 'Standar 11:', subtitle: 'Penjaminan Mutu', path: '/documents/std11' },
    ],
    []
  );

  const bottomItems = useMemo(
    () => [
      { icon: Activity, label: 'Log Aktivitas', path: '/activity-log' },
      { icon: HelpCircle, label: 'Bantuan', path: '/help' },
    ],
    []
  );

  const allItems = useMemo(() => [...menuItems, ...standardItems, ...bottomItems], [menuItems, standardItems, bottomItems]);

  const handleLogout = () => {
    logout();
    toast({ title: 'Logout Berhasil', description: 'Sampai jumpa lagi!' });
    navigate('/login', { replace: true });
  };

  // Render loading screen saat auth masih load
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-600">
        Memuat...
      </div>
    );
  }

  // Kalau tidak ada user, Layout tidak render (redirect akan jalan)
  if (!user) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white">
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-40 shadow-[0_6px_18px_rgba(59,130,246,0.12)]">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <button
                onClick={() => setSidebarOpen((v) => !v)}
                className="lg:hidden p-2 rounded-md text-gray-600 hover:bg-gray-100"
                aria-label="Toggle sidebar"
              >
                {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
              <span className="ml-2 text-xl font-bold text-blue-600">
                Sistem Informasi Administrasi Publik (Si-APIK)
              </span>
            </div>

            <div className="flex items-center gap-4">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-medium text-gray-900">{user?.name || '-'}</p>
                <p className="text-xs text-gray-500 capitalize">{user?.role || 'user'}</p>
              </div>

              <Button variant="outline" size="sm" onClick={handleLogout} className="gap-2">
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:inline">Logout</span>
              </Button>
            </div>
          </div>
        </div>
      </nav>

      <div className="flex">
        <aside
          className={`${
            sidebarOpen ? 'translate-x-0' : '-translate-x-full'
          } lg:translate-x-0 fixed lg:static inset-y-0 left-0 z-30 w-64 bg-white border-r border-gray-200 shadow-[0_6px_18px_rgba(59,130,246,0.12)] transition-transform duration-300 ease-in-out mt-16 lg:mt-0`}
        >
          <nav className="p-4 space-y-2">
            {allItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;

              return (
                <motion.button
                  key={item.path}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => navigate(item.path)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors text-left ${
                    isActive ? 'bg-blue-50 text-blue-600 font-medium' : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <Icon className="w-5 h-5 shrink-0" />
                  {item.subtitle ? (
                    <span className="flex flex-col leading-tight min-w-0">
                      <span className="text-sm font-semibold">{item.title}</span>
                      <span className="text-sm truncate">{item.subtitle}</span>
                    </span>
                  ) : (
                    <span className="text-sm font-semibold">{item.label}</span>
                  )}
                </motion.button>
              );
            })}
          </nav>
        </aside>

        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          <div className="max-w-7xl mx-auto">{children}</div>
        </main>
      </div>

      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
};

export default Layout;
