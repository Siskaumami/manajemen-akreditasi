import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { LogIn, Mail, Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/components/ui/use-toast';

// ✅ Import gambar dari src/assets
import SiApikImage from '@/assets/si_apik.png'; // Pastikan path dan nama file sesuai

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    const result = login(formData.email, formData.password);

    if (result.success) {
      toast({
        title: "Login Berhasil!",
        description: "Selamat datang di Sistem Manajemen Akreditasi",
      });
      navigate('/dashboard');
    } else {
      toast({
        title: "Login Gagal",
        description: result.error,
        variant: "destructive"
      });
    }
  };

  return (
    <>
      <Helmet>
        <title>Login - Sistem Manajemen Akreditasi</title>
        <meta
          name="description"
          content="Login ke sistem manajemen akreditasi Program Studi Administrasi Publik"
        />
      </Helmet>

      <div className="min-h-screen flex items-center justify-center p-4 bg-gray-100">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md"
        >
          <div className="bg-white rounded-2xl shadow-xl p-8 border border-blue-100">
            <div className="text-center mb-8">

              {/* ✅ Gambar Si-APIK dengan tampilan kotak elegan */}
              <div className="flex justify-center mb-4">
                <motion.img
                  src={SiApikImage}
                  alt="Logo Si-APIK"
                  className="w-32 h-32 object-contain rounded-lg shadow-md border border-blue-200"
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.5 }}
                />
              </div>

              {/* Ikon login kecil di bawah gambar */}
              <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
                <LogIn className="w-8 h-8 text-blue-600" />
              </div>

              <h1 className="text-2xl font-bold text-gray-900">Selamat Datang</h1>
              <p className="text-gray-600 mt-2">
                Sistem Informasi Administrasi Publik (Si-APIK)
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="nama@email.com"
                    className="pl-10"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    className="pl-10"
                    value={formData.password}
                    onChange={(e) =>
                      setFormData({ ...formData, password: e.target.value })
                    }
                    required
                  />
                </div>
              </div>

              <Button type="submit" className="w-full">
                Masuk
              </Button>
            </form>

            <p className="text-center mt-6 text-sm text-gray-600">
              Belum punya akun?{' '}
              <Link
                to="/register"
                className="text-blue-600 hover:text-blue-700 font-medium"
              >
                Daftar di sini
              </Link>
            </p>
          </div>
        </motion.div>
      </div>
    </>
  );
};

export default Login;
