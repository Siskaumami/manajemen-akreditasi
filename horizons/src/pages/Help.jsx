import React from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { HelpCircle, Mail, Phone, MessageCircle, Book } from 'lucide-react';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';

const Help = () => {
  const { toast } = useToast();

  const handleContact = () => {
    toast({
      title: "🚧 Fitur Kontak",
      description: "Fitur ini belum diimplementasikan—tapi jangan khawatir! Anda bisa memintanya di prompt berikutnya! 🚀"
    });
  };

  const faqs = [
    {
      question: 'Bagaimana cara mengunggah dokumen?',
      answer: 'Klik pada menu sesuai dengan dokumen yang akan di unggah, klik upload dokumen, lalu pilih file yang akan diunggah.'
    },
    {
      question: 'Format file apa saja yang didukung?',
      answer: 'Sistem mendukung format PDF, DOCX, XLSX, dan ZIP dengan ukuran maksimal 10MB per file.'
    },
    {
      question: 'Bagaimana cara mengubah status dokumen?',
      answer: 'Admin dapat mengubah status dokumen melalui menu aksi di tabel dokumen dengan memilih status yang diinginkan.'
    },
    {
      question: 'Apakah dokumen tersimpan di Google Drive?',
      answer: 'Ya, semua dokumen yang diunggah akan otomatis tersimpan di Google Drive yang terorganisir berdasarkan kategori standar.'
    }
  ];

  return (
    <Layout>
      <Helmet>
        <title>Bantuan - Sistem Manajemen Akreditasi</title>
        <meta name="description" content="Panduan dan bantuan untuk menggunakan sistem manajemen akreditasi" />
      </Helmet>

      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Bantuan & Kontak</h1>
          <p className="text-gray-600 mt-2">Temukan jawaban atau hubungi kami</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl border border-gray-200 p-6 shadow-[0_6px_18px_rgba(59,130,246,0.12)] hover:shadow-[0_8px_22px_rgba(59,130,246,0.18)] transition-shadow"
          >
            <Mail className="w-10 h-10 text-blue-600 mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Email</h3>
            <p className="text-gray-600 text-sm mb-4">akreditasi@universitasxyz.ac.id</p>
            <Button onClick={handleContact} variant="outline" className="w-full">
              Kirim Email
            </Button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-xl border border-gray-200 p-6 shadow-[0_6px_18px_rgba(59,130,246,0.12)] hover:shadow-[0_8px_22px_rgba(59,130,246,0.18)] transition-shadow"
          >
            <Phone className="w-10 h-10 text-green-600 mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Telepon</h3>
            <p className="text-gray-600 text-sm mb-4">+62 21 1234 5678</p>
            <Button onClick={handleContact} variant="outline" className="w-full">
              Hubungi Kami
            </Button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-xl border border-gray-200 p-6 shadow-[0_6px_18px_rgba(59,130,246,0.12)] hover:shadow-[0_8px_22px_rgba(59,130,246,0.18)] transition-shadow"
          >
            <MessageCircle className="w-10 h-10 text-purple-600 mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Live Chat</h3>
            <p className="text-gray-600 text-sm mb-4">Senin - Jumat, 08:00 - 17:00</p>
            <Button onClick={handleContact} variant="outline" className="w-full">
              Mulai Chat
            </Button>
          </motion.div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-[0_6px_18px_rgba(59,130,246,0.12)]">
          <div className="flex items-center gap-3 mb-6">
            <Book className="w-6 h-6 text-blue-600" />
            <h2 className="text-2xl font-bold text-gray-900">Pertanyaan Umum (FAQ)</h2>
          </div>
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="border-b border-gray-200 last:border-0 pb-4 last:pb-0"
              >
                <h3 className="font-semibold text-gray-900 mb-2 flex items-start gap-2">
                  <HelpCircle className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                  {faq.question}
                </h3>
                <p className="text-gray-600 text-sm ml-7">{faq.answer}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Help;
